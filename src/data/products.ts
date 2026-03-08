import iphoneImg from "@/assets/iphone-15-pro.jpg";
import macbookImg from "@/assets/macbook-pro.jpg";
import ipadImg from "@/assets/ipad-pro.jpg";
import watchImg from "@/assets/apple-watch.jpg";
import airpodsImg from "@/assets/airpods-pro.jpg";
import accessoriesImg from "@/assets/accessories.jpg";

export const imageMap: Record<string, string> = {
  iphone: iphoneImg,
  macbook: macbookImg,
  ipad: ipadImg,
  watch: watchImg,
  airpods: airpodsImg,
  accessories: accessoriesImg,
};

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

export const getImageForProduct = (imageKey: string): string => {
  return imageMap[imageKey] || accessoriesImg;
};
