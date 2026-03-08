import iphoneImg from "@/assets/iphone-15-pro.jpg";
import macbookImg from "@/assets/macbook-pro.jpg";
import ipadImg from "@/assets/ipad-pro.jpg";
import watchImg from "@/assets/apple-watch.jpg";
import airpodsImg from "@/assets/airpods-pro.jpg";
import accessoriesImg from "@/assets/accessories.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  specs: string[];
  inStock: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export const categories: Category[] = [
  { id: "iphone", name: "iPhone", image: iphoneImg, subcategories: ["iPhone 15 Pro", "iPhone 15", "iPhone SE"] },
  { id: "mac", name: "Mac", image: macbookImg, subcategories: ["MacBook Pro", "MacBook Air", "iMac", "Mac Mini"] },
  { id: "ipad", name: "iPad", image: ipadImg, subcategories: ["iPad Pro", "iPad Air", "iPad Mini"] },
  { id: "watch", name: "Apple Watch", image: watchImg, subcategories: ["Watch Ultra", "Watch Series 9", "Watch SE"] },
  { id: "airpods", name: "AirPods", image: airpodsImg, subcategories: ["AirPods Pro", "AirPods 3", "AirPods Max"] },
  { id: "accessories", name: "Аксессуары", image: accessoriesImg, subcategories: ["Чехлы", "Зарядные устройства", "Кабели"] },
];

export const products: Product[] = [
  {
    id: "ip15pro-256",
    name: "iPhone 15 Pro 256GB",
    category: "iphone",
    subcategory: "iPhone 15 Pro",
    price: 129990,
    image: iphoneImg,
    description: "Титановый корпус. Чип A17 Pro. Продвинутая система камер.",
    specs: ["Чип A17 Pro", "Титановый корпус", "48 МП камера", "USB-C", "Dynamic Island"],
    inStock: 25,
  },
  {
    id: "ip15pro-512",
    name: "iPhone 15 Pro 512GB",
    category: "iphone",
    subcategory: "iPhone 15 Pro",
    price: 154990,
    image: iphoneImg,
    description: "Максимальная производительность и хранилище.",
    specs: ["Чип A17 Pro", "512GB память", "48 МП камера", "USB-C", "Dynamic Island"],
    inStock: 15,
  },
  {
    id: "ip15-128",
    name: "iPhone 15 128GB",
    category: "iphone",
    subcategory: "iPhone 15",
    price: 89990,
    image: iphoneImg,
    description: "Dynamic Island. 48 МП камера. USB-C.",
    specs: ["Чип A16 Bionic", "Dynamic Island", "48 МП камера", "USB-C"],
    inStock: 40,
  },
  {
    id: "mbp14-m3",
    name: "MacBook Pro 14\" M3",
    category: "mac",
    subcategory: "MacBook Pro",
    price: 199990,
    image: macbookImg,
    description: "Чип M3. Liquid Retina XDR. До 22 часов работы.",
    specs: ["Чип Apple M3", "18GB RAM", "512GB SSD", "Liquid Retina XDR", "До 22 ч батареи"],
    inStock: 10,
  },
  {
    id: "mbp16-m3pro",
    name: "MacBook Pro 16\" M3 Pro",
    category: "mac",
    subcategory: "MacBook Pro",
    price: 299990,
    image: macbookImg,
    description: "Чип M3 Pro. Для профессиональных задач.",
    specs: ["Чип Apple M3 Pro", "36GB RAM", "512GB SSD", "Liquid Retina XDR 16\""],
    inStock: 8,
  },
  {
    id: "mba15-m3",
    name: "MacBook Air 15\" M3",
    category: "mac",
    subcategory: "MacBook Air",
    price: 159990,
    image: macbookImg,
    description: "Невероятно тонкий. Невероятно мощный.",
    specs: ["Чип Apple M3", "8GB RAM", "256GB SSD", "15.3\" Liquid Retina", "До 18 ч батареи"],
    inStock: 20,
  },
  {
    id: "ipadpro-11-m4",
    name: "iPad Pro 11\" M4",
    category: "ipad",
    subcategory: "iPad Pro",
    price: 109990,
    image: ipadImg,
    description: "Ультра тонкий. Ультра мощный. Чип M4.",
    specs: ["Чип Apple M4", "Ultra Retina XDR", "ProMotion 120Hz", "Face ID", "Apple Pencil Pro"],
    inStock: 18,
  },
  {
    id: "ipadair-13-m2",
    name: "iPad Air 13\" M2",
    category: "ipad",
    subcategory: "iPad Air",
    price: 89990,
    image: ipadImg,
    description: "Большой экран. Впечатляющая мощность.",
    specs: ["Чип Apple M2", "Liquid Retina 13\"", "Touch ID", "USB-C"],
    inStock: 22,
  },
  {
    id: "watchultra2",
    name: "Apple Watch Ultra 2",
    category: "watch",
    subcategory: "Watch Ultra",
    price: 79990,
    image: watchImg,
    description: "Самые функциональные Apple Watch.",
    specs: ["Чип S9 SiP", "Титановый корпус 49мм", "GPS + Cellular", "До 36 ч батареи"],
    inStock: 12,
  },
  {
    id: "watchs9-45",
    name: "Apple Watch Series 9 45mm",
    category: "watch",
    subcategory: "Watch Series 9",
    price: 44990,
    image: watchImg,
    description: "Умнее. Ярче. Мощнее.",
    specs: ["Чип S9 SiP", "Always-On дисплей", "GPS", "Двойной тап"],
    inStock: 30,
  },
  {
    id: "airpodspro2",
    name: "AirPods Pro 2 USB-C",
    category: "airpods",
    subcategory: "AirPods Pro",
    price: 24990,
    image: airpodsImg,
    description: "Адаптивное шумоподавление. Персонализированный звук.",
    specs: ["Чип H2", "Активное шумоподавление", "USB-C зарядка", "До 6 ч воспроизведения"],
    inStock: 50,
  },
  {
    id: "airpodsmax",
    name: "AirPods Max",
    category: "airpods",
    subcategory: "AirPods Max",
    price: 59990,
    image: airpodsImg,
    description: "Непревзойдённое качество звука.",
    specs: ["Чип H1", "Активное шумоподавление", "Пространственный звук", "20 ч батареи"],
    inStock: 10,
  },
  {
    id: "case-ip15pro",
    name: "Чехол MagSafe для iPhone 15 Pro",
    category: "accessories",
    subcategory: "Чехлы",
    price: 5990,
    image: accessoriesImg,
    description: "Оригинальный чехол Apple с поддержкой MagSafe.",
    specs: ["MagSafe совместимость", "Силикон", "Встроенные магниты"],
    inStock: 100,
  },
  {
    id: "charger-magsafe",
    name: "Зарядное устройство MagSafe",
    category: "accessories",
    subcategory: "Зарядные устройства",
    price: 4490,
    image: accessoriesImg,
    description: "Беспроводная зарядка до 15 Вт.",
    specs: ["15W зарядка", "MagSafe магниты", "USB-C кабель"],
    inStock: 60,
  },
];

export const getProductsByCategory = (categoryId: string) =>
  products.filter((p) => p.category === categoryId);

export const getProductsBySubcategory = (categoryId: string, subcategory: string) =>
  products.filter((p) => p.category === categoryId && p.subcategory === subcategory);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);
