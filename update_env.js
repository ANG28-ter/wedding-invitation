const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');
envContent = envContent.replace(/ADMIN_PASSWORD_HASH=.*/, 'ADMIN_PASSWORD_HASH=$2b$10$lnbaIV7WkBgXAps.OXhp6oZ4h9.vfS226.ZjmL9bJX');
fs.writeFileSync(envPath, envContent);
console.log('Updated .env');
