import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const platforms = [
  {
    icon: "Smartphone",
    label: "Android",
    sub: "APK · версия 1.0.0",
    desc: "Для телефонов на Android 8.0 и выше",
    file: "/downloads/gochat.apk",
    accent: "bg-green-500",
  },
  {
    icon: "Monitor",
    label: "Windows",
    sub: "EXE · версия 1.0.0",
    desc: "Для Windows 10 и выше",
    file: "/downloads/gochat-setup.exe",
    accent: "bg-blue-500",
  },
  {
    icon: "Laptop",
    label: "macOS",
    sub: "DMG · версия 1.0.0",
    desc: "Для macOS 11 и выше",
    file: "/downloads/gochat.dmg",
    accent: "bg-neutral-400",
  },
];

export default function Download() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    const prompt = deferredPrompt as BeforeInstallPromptEvent;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  const showInstallButton = !installed && (deferredPrompt || isIOS);

  return (
    <div id="download" className="bg-neutral-950 text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-widest text-sm text-neutral-400 mb-4">Установи прямо сейчас</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            GoChat у тебя<br />в кармане
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-10">
            Бесплатно. Без магазина приложений. Работает на любом устройстве.
          </p>

          {/* Кнопка установки PWA */}
          {installed ? (
            <div className="inline-flex items-center gap-3 bg-green-500/20 border border-green-500/40 text-green-400 px-8 py-4 rounded-2xl text-base font-semibold">
              <Icon name="CheckCircle" size={22} />
              GoChat установлен!
            </div>
          ) : showInstallButton ? (
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl text-base font-bold hover:bg-neutral-200 transition-all duration-300 hover:scale-105 shadow-lg shadow-white/10"
            >
              <Icon name="Download" size={22} />
              Установить GoChat на телефон
            </button>
          ) : (
            <a
              href="/app"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl text-base font-bold hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
            >
              <Icon name="MessageCircle" size={22} />
              Открыть GoChat в браузере
            </a>
          )}

          {/* iOS инструкция */}
          {showIOSGuide && (
            <div className="mt-6 bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-sm mx-auto text-left">
              <p className="font-semibold mb-3 text-sm">Как установить на iPhone:</p>
              <ol className="flex flex-col gap-2 text-sm text-neutral-400">
                <li className="flex gap-2"><span className="text-white font-bold">1.</span> Нажми кнопку «Поделиться» внизу Safari</li>
                <li className="flex gap-2"><span className="text-white font-bold">2.</span> Выбери «На экран Домой»</li>
                <li className="flex gap-2"><span className="text-white font-bold">3.</span> Нажми «Добавить» — готово!</li>
              </ol>
              <button onClick={() => setShowIOSGuide(false)} className="mt-4 text-xs text-neutral-500 hover:text-white transition-colors">
                Закрыть
              </button>
            </div>
          )}
        </div>

        {/* Шаги */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { step: "1", icon: "Globe", title: "Открой сайт", desc: "Зайди на GoChat.Ru в браузере своего телефона" },
            { step: "2", icon: "Download", title: "Нажми «Установить»", desc: "Браузер предложит добавить приложение на экран" },
            { step: "3", icon: "Zap", title: "Готово!", desc: "GoChat появится на рабочем столе как обычное приложение" },
          ].map((s) => (
            <div key={s.step} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg mb-5">
                {s.step}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name={s.icon as "Globe"} size={18} className="text-neutral-400" />
                <h3 className="font-bold">{s.title}</h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center border-t border-neutral-800 pt-12">
          <p className="text-neutral-500 text-sm mb-2">Нужна помощь с установкой?</p>
          <a href="#contact" className="text-white underline underline-offset-4 hover:text-neutral-300 transition-colors text-sm">
            Напишите нам — поможем разобраться
          </a>
        </div>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
