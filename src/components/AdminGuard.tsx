import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-sm">
          <h2 className="text-xl font-bold">Доступ запрещён</h2>
          <p className="text-muted-foreground text-sm">У вас нет прав администратора.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
