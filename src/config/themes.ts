export type ThemeItem = {
  id: string;
  name: string;
  package: string;
  category: string;
  description: string;
  image: string;
  link: string;
  badge?: string;
  price: number; 
  rating: number; 
};

export const availableThemes: ThemeItem[] = [
  {
    id: "jawa-modern",
    name: "Jawa Modern",
    package: "Premium",
    category: "Jawa",
    description: "Sentuhan tradisi klasik dengan gaya elegan masa kini. Dilengkapi ornamen batik dan animasi yang memukau.",
    image: "/jawa_modern/Jawa-modern.png",
    link: "/aka-katarina",
    badge: "Best Seller",
    price: 75,
    rating: 5,
  },
];

