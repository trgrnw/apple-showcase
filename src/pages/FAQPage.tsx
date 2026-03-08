import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "Вся техника оригинальная?", a: "Да, мы являемся официальным реселлером Apple. Вся техника сертифицирована и имеет официальную гарантию." },
  { q: "Какие способы оплаты доступны?", a: "Мы принимаем банковские карты Visa, Mastercard, МИР, а также оплату при получении и рассрочку от банков-партнёров." },
  { q: "Сколько стоит доставка?", a: "Доставка бесплатна по всей России при заказе от 10 000 ₽. Для остальных заказов — 500 ₽." },
  { q: "Как отследить заказ?", a: "Вы можете отследить заказ в личном кабинете в разделе \"Мои заказы\", указав номер телефона и код отслеживания." },
  { q: "Какая гарантия на товары?", a: "На всю технику Apple распространяется официальная гарантия Apple 1 год. Дополнительно мы предоставляем расширенную гарантию Debry:Store на 6 месяцев." },
  { q: "Можно ли вернуть товар?", a: "Да, возврат или обмен в течение 14 дней с момента покупки при сохранении товарного вида и упаковки." },
  { q: "Как связаться с поддержкой?", a: "Напишите нам на info@debrystore.ru или позвоните по номеру +7 (800) 555-35-35. Мы работаем Пн-Пт с 10:00 до 20:00." },
  { q: "Есть ли рассрочка?", a: "Да, мы предоставляем рассрочку 0% на 6, 12 и 24 месяца через банки-партнёры. Оформление занимает 5 минут." },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Частые вопросы</h1>
        <p className="text-muted-foreground mb-8">Ответы на самые популярные вопросы о Debry:Store</p>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="glass-card rounded-xl px-4 border-0">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
