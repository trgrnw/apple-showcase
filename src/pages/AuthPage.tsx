import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/profile");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Заполните все поля"); return; }
    if (!isLogin && !name) { toast.error("Введите имя"); return; }
    setLoading(true);
    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password, name);
      if (error) { toast.error(error.message); return; }
      toast.success(isLogin ? "Вы вошли в аккаунт" : "Аккаунт создан!");
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {isLogin ? "Вход" : "Регистрация"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? "Войдите в свой аккаунт" : "Создайте аккаунт в Debry:Store"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full bg-gradient-premium hover:opacity-90" disabled={loading}>
              {loading ? "Загрузка..." : isLogin ? "Войти" : "Создать аккаунт"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
