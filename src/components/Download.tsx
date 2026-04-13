import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PLAY_MARKET_URL = "https://play.google.com/store/search?q=gochat&c=apps";
const APP_STORE_URL = "https://apps.apple.com/search?term=gochat";
const APK_URL = "/downloads/gochat.apk";

export default function Download() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua));
    setIsAndroid(/android/i.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    } else {
      window.open(PLAY_MARKET_URL, "_blank");
    }
  };

  return (
    <div id="download" className="bg-neutral-950 text-white">

      {/* Hero секция скачивания */}
      <div className="py-24 px-6 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">

          {/* Левая часть */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm text-neutral-400 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Бесплатно · Без рекламы · Версия 1.0
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              GoChat<br />на твоём устройстве
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-md mx-auto lg:mx-0">
              Скачай приложение на телефон или компьютер — общайся без ограничений.
            </p>

            {/* Кнопки скачивания */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">

              {/* Google Play / PWA */}
              {installed ? (
                <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl font-semibold">
                  <Icon name="CheckCircle" size={22} />
                  Установлено!
                </div>
              ) : (
                <button
                  onClick={handleAndroidInstall}
                  className="flex items-center gap-4 bg-white text-black px-6 py-4 rounded-2xl font-bold hover:bg-neutral-100 transition-all duration-200 hover:scale-[1.02] shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3.18 23.76c.3.17.64.24.98.2l12.09-12.09L12.64 8.3 3.18 23.76z" fill="#EA4335"/>
                    <path d="M20.64 10.35l-2.94-1.7-3.7 3.7 3.7 3.7 2.97-1.72a1.68 1.68 0 0 0 0-3.98z" fill="#FBBC05"/>
                    <path d="M3.18.24a1.68 1.68 0 0 0-.93 1.5v20.52c0 .63.34 1.18.93 1.5L15.3 12 3.18.24z" fill="#4285F4"/>
                    <path d="M4.16 23.96l-.98-.2L15.3 12 12.64 9.3.18.24.18.24l-.93 11.8 12.09 12.09.98-.2z" fill="#34A853"/>
                    <path d="M3.18.24L15.3 12l3.7-3.7-12.09-6.98A1.9 1.9 0 0 0 3.18.24z" fill="#4285F4"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-neutral-500 leading-none mb-0.5">Скачать в</p>
                    <p className="text-base font-bold leading-none">Google Play</p>
                  </div>
                </button>
              )}

              {/* App Store */}
              <a
                href={isIOS ? APP_STORE_URL : "#"}
                onClick={!isIOS ? (e) => { e.preventDefault(); setShowIOSGuide(true); } : undefined}
                className="flex items-center gap-4 bg-neutral-900 border border-neutral-700 text-white px-6 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-200 hover:scale-[1.02]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs text-neutral-500 leading-none mb-0.5">Загрузить в</p>
                  <p className="text-base font-bold leading-none">App Store</p>
                </div>
              </a>

              {/* Прямой APK */}
              {isAndroid && (
                <a
                  href={APK_URL}
                  download
                  className="flex items-center gap-3 border border-neutral-700 text-neutral-300 px-6 py-4 rounded-2xl text-sm hover:border-neutral-500 hover:text-white transition-all duration-200"
                >
                  <Icon name="Download" size={18} />
                  <span>Прямой APK</span>
                </a>
              )}
            </div>

            {/* iOS инструкция */}
            {showIOSGuide && (
              <div className="mt-6 bg-neutral-900 border border-neutral-700 rounded-2xl p-5 max-w-sm text-left">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-sm">Установка на iPhone / iPad:</p>
                  <button onClick={() => setShowIOSGuide(false)} className="text-neutral-500 hover:text-white">
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <ol className="flex flex-col gap-2.5 text-sm text-neutral-400">
                  <li className="flex gap-3 items-start">
                    <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    Открой GoChat в браузере <strong className="text-white">Safari</strong>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    Нажми кнопку <strong className="text-white">«Поделиться»</strong> внизу экрана
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    Выбери <strong className="text-white">«На экран Домой»</strong> и нажми «Добавить»
                  </li>
                </ol>
                <a href="/app" className="mt-4 block text-center bg-white text-black py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-colors">
                  Открыть GoChat в Safari →
                </a>
              </div>
            )}
          </div>

          {/* Правая часть — мокап */}
          <div className="flex-shrink-0 relative">
            <div className="w-64 h-[500px] bg-neutral-900 rounded-[3rem] border-4 border-neutral-700 shadow-2xl shadow-black overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-700 rounded-b-2xl z-10"></div>
              <div className="h-full flex flex-col bg-neutral-950">
                {/* App header */}
                <div className="flex items-center gap-3 px-4 pt-10 pb-4 border-b border-neutral-800 bg-neutral-900">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">G</div>
                  <div>
                    <p className="text-white text-xs font-bold">GoChat</p>
                    <p className="text-neutral-500 text-[10px]">онлайн</p>
                  </div>
                </div>
                {/* Messages */}
                <div className="flex-1 p-3 flex flex-col gap-2">
                  {[
                    { mine: false, text: "Привет! 👋" },
                    { mine: true, text: "Привет! Как дела?" },
                    { mine: false, text: "Отлично! Ты уже попробовал GoChat?" },
                    { mine: true, text: "Да, это лучший мессенджер! 🚀" },
                    { mine: false, text: "Согласен 😄" },
                  ].map((m, i) => (
                    <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-3 py-1.5 rounded-xl text-[11px] ${m.mine ? "bg-white text-black" : "bg-neutral-800 text-white"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Input */}
                <div className="px-3 py-3 border-t border-neutral-800 flex gap-2">
                  <div className="flex-1 bg-neutral-800 rounded-xl px-3 py-2 text-neutral-500 text-[11px]">Сообщение...</div>
                  <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center">
                    <Icon name="Send" size={12} className="text-black" />
                  </div>
                </div>
              </div>
            </div>
            {/* Декор */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Десктоп версии */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-neutral-500 text-sm uppercase tracking-widest mb-10">Также доступно для компьютера</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "Monitor", label: "Windows", sub: "Windows 10/11", file: "/downloads/gochat-setup.exe", color: "bg-blue-500" },
              { icon: "Laptop", label: "macOS", sub: "macOS 11+", file: "/downloads/gochat.dmg", color: "bg-neutral-500" },
              { icon: "Terminal", label: "Linux", sub: "Ubuntu / Debian", file: "/downloads/gochat.deb", color: "bg-orange-500" },
            ].map((p) => (
              <a
                key={p.label}
                href={p.file}
                download
                className="group flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl px-6 py-5 transition-all duration-200"
              >
                <div className={`w-10 h-10 ${p.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon name={p.icon as "Monitor"} size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{p.label}</p>
                  <p className="text-neutral-500 text-xs">{p.sub}</p>
                </div>
                <Icon name="Download" size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
