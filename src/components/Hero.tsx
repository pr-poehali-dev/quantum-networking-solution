import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSHint(true); return; }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    } else {
      window.open("/app", "_self");
    }
  };

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <img
          src="/images/mountain-landscape.jpg"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <div className="relative z-10 text-center text-white px-6">
        <p className="uppercase tracking-widest text-sm mb-4 opacity-70">Мессенджер нового поколения</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none">
          ОБЩАЙСЯ.<br />ЗВОНИ.<br />БУДЬ РЯДОМ.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8">
          Быстрые чаты, кристально чистые звонки и надёжная защита данных — всё в одном приложении.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Кнопка установки */}
          {installed ? (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 px-8 py-3 rounded-full text-sm font-semibold">
              <Icon name="CheckCircle" size={18} />
              Приложение установлено!
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-neutral-100 transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <Icon name="Download" size={18} />
              Установить GoChat
            </button>
          )}

          <a
            href="/app"
            className="flex items-center gap-2 border border-white/60 text-white px-8 py-3 rounded-full uppercase tracking-wide text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            <Icon name="MessageCircle" size={16} />
            Открыть в браузере
          </a>
        </div>

        {/* iOS подсказка */}
        {showIOSHint && (
          <div className="mt-6 bg-black/70 backdrop-blur border border-white/20 rounded-2xl p-5 max-w-xs mx-auto text-left">
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-sm">Установка на iPhone:</p>
              <button onClick={() => setShowIOSHint(false)} className="text-white/50 hover:text-white">
                <Icon name="X" size={16} />
              </button>
            </div>
            <ol className="flex flex-col gap-2 text-sm text-white/70">
              <li className="flex gap-2"><span className="text-white font-bold">1.</span> Открой в <strong className="text-white">Safari</strong></li>
              <li className="flex gap-2"><span className="text-white font-bold">2.</span> Нажми <strong className="text-white">«Поделиться»</strong> внизу</li>
              <li className="flex gap-2"><span className="text-white font-bold">3.</span> Выбери <strong className="text-white">«На экран Домой»</strong></li>
            </ol>
          </div>
        )}

        {/* Подпись */}
        <p className="mt-6 text-white/40 text-xs">
          Работает на Android · iPhone · Windows · macOS
        </p>
      </div>
    </div>
  );
}
