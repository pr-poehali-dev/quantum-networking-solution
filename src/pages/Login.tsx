import { useState } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/e2acb2fb-458b-4dc7-b565-f40a9b8b0f40";

interface LoginProps {
  onLogin: (user: { id: number; username: string; display_name: string; avatar_color: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    const body: Record<string, string> = { action: mode, username, password };
    if (mode === "register") body.display_name = displayName;

    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    localStorage.setItem("gochat_token", data.token);
    localStorage.setItem("gochat_user", JSON.stringify(data.user));
    onLogin(data.user);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">💬</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">GoChat</h1>
          <p className="text-neutral-400 mt-2 text-sm">Мессенджер нового поколения</p>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          <div className="flex mb-6 bg-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "login" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "register" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}
            >
              Регистрация
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wide mb-2 block">Ваше имя</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-neutral-400 text-xs uppercase tracking-wide mb-2 block">Имя пользователя</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 text-sm"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-xs uppercase tracking-wide mb-2 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 text-sm"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : null}
              {mode === "login" ? "Войти в GoChat" : "Создать аккаунт"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
