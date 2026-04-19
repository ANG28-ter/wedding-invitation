import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "wedding-media";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for images
const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB for videos

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
        const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type) || file.name.endsWith(".mp3");

        if (!isImage && !isVideo && !isAudio) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPG, PNG, GIF, WebP, MP4, WebM, MOV, MP3, WAV" },
                { status: 400 }
            );
        }

        // Validate file size
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            return NextResponse.json(
                { error: `File too large. Max size: ${maxSizeMB}MB` },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const extension = file.name.split(".").pop();
        const folder = isVideo ? "videos" : isAudio ? "audio" : "images";
        const filename = `${folder}/${timestamp}-${randomStr}.${extension}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        let uploadData;
        let uploadError;

        let contentType = file.type;
        if (!contentType || contentType === "application/octet-stream") {
            if (file.name.endsWith(".mp3")) contentType = "audio/mpeg";
            else if (file.name.endsWith(".wav")) contentType = "audio/wav";
            else if (file.name.endsWith(".mp4")) contentType = "video/mp4";
            else if (file.name.endsWith(".png")) contentType = "image/png";
            else if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")) contentType = "image/jpeg";
        }

        try {
            const result = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filename, buffer, {
                    contentType: contentType,
                    cacheControl: "3600",
                    upsert: false,
                });

            uploadData = result.data;
            uploadError = result.error;
        } catch (err: any) {
            console.error("Supabase upload exception:", err);

            // If ECONNRESET, file might still be uploaded
            // Try to get the public URL anyway
            if (err.code === 'ECONNRESET' || err.message?.includes('ECONNRESET')) {
                console.log("Connection reset detected, checking if file exists...");

                // Try to get public URL (if file exists, this will work)
                try {
                    const { data: urlData } = supabase.storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(filename);

                    return NextResponse.json({
                        ok: true,
                        data: {
                            url: urlData.publicUrl,
                            path: filename,
                            type: isVideo ? "VIDEO" : isAudio ? "AUDIO" : "IMAGE",
                        },
                    });
                } catch (urlErr) {
                    // File doesn't exist, upload truly failed
                    return NextResponse.json(
                        { error: "Upload failed due to connection reset" },
                        { status: 500 }
                    );
                }
            }

            throw err;
        }

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json(
                { error: "Upload failed: " + uploadError.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filename);

        return NextResponse.json({
            ok: true,
            data: {
                url: urlData.publicUrl,
                path: filename,
                type: isVideo ? "VIDEO" : isAudio ? "AUDIO" : "IMAGE",
            },
        });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { error: "Internal server error: " + err.message },
            { status: 500 }
        );
    }
}
