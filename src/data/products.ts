import iphoneProImg from "@/assets/iphone-15-pro.jpg";
import iphone15Img from "@/assets/iphone-15.jpg";
import iphoneSeImg from "@/assets/iphone-se.jpg";
import macbookProImg from "@/assets/macbook-pro.jpg";
import macbookAirImg from "@/assets/macbook-air.jpg";
import imacImg from "@/assets/imac.jpg";
import macMiniImg from "@/assets/mac-mini.jpg";
import ipadProImg from "@/assets/ipad-pro.jpg";
import ipadAirImg from "@/assets/ipad-air.jpg";
import ipadMiniImg from "@/assets/ipad-mini.jpg";
import watchImg from "@/assets/apple-watch.jpg";
import watchUltraImg from "@/assets/watch-ultra.jpg";
import watchSeries9Img from "@/assets/watch-series9.jpg";
import watchSeImg from "@/assets/watch-se.jpg";
import airpodsProImg from "@/assets/airpods-pro.jpg";
import airpods3Img from "@/assets/airpods-3.jpg";
import airpodsMaxImg from "@/assets/airpods-max.jpg";
import accessoriesImg from "@/assets/accessories.jpg";
import chargerImg from "@/assets/apple-charger.jpg";
import casesImg from "@/assets/apple-cases.jpg";
import pencilImg from "@/assets/apple-pencil.jpg";

export const imageMap: Record<string, string> = {
  iphone: iphoneProImg,
  "iphone-pro": iphoneProImg,
  "iphone-15": iphone15Img,
  "iphone-se": iphoneSeImg,
  macbook: macbookProImg,
  "macbook-pro": macbookProImg,
  "macbook-air": macbookAirImg,
  imac: imacImg,
  "mac-mini": macMiniImg,
  ipad: ipadProImg,
  "ipad-pro": ipadProImg,
  "ipad-air": ipadAirImg,
  "ipad-mini": ipadMiniImg,
  watch: watchImg,
  "watch-ultra": watchUltraImg,
  "watch-series9": watchSeries9Img,
  "watch-se": watchSeImg,
  airpods: airpodsProImg,
  "airpods-pro": airpodsProImg,
  "airpods-3": airpods3Img,
  "airpods-max": airpodsMaxImg,
  accessories: accessoriesImg,
  charger: chargerImg,
  cases: casesImg,
  pencil: pencilImg,
};

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export const categories: Category[] = [
  { id: "iphone", name: "iPhone", image: iphoneProImg, subcategories: ["iPhone 15 Pro", "iPhone 15", "iPhone SE"] },
  { id: "mac", name: "Mac", image: macbookProImg, subcategories: ["MacBook Pro", "MacBook Air", "iMac", "Mac Mini"] },
  { id: "ipad", name: "iPad", image: ipadProImg, subcategories: ["iPad Pro", "iPad Air", "iPad Mini"] },
  { id: "watch", name: "Apple Watch", image: watchUltraImg, subcategories: ["Watch Ultra", "Watch Series 9", "Watch SE"] },
  { id: "airpods", name: "AirPods", image: airpodsProImg, subcategories: ["AirPods Pro", "AirPods 3", "AirPods Max"] },
  { id: "accessories", name: "Аксессуары", image: accessoriesImg, subcategories: ["Чехлы", "Зарядные устройства", "Кабели"] },
];

export const getImageForProduct = (imageKey: string): string => {
  return imageMap[imageKey] || accessoriesImg;
};
