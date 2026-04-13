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
  return (
    <div id="download" className="bg-neutral-950 text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-widest text-sm text-neutral-400 mb-4">Прямое скачивание</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Скачай GoChat<br />на любое устройство
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Бесплатно. Без магазина приложений. Просто скачай и установи.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {platforms.map((p) => (
            <a
              key={p.label}
              href={p.file}
              download
              className="group flex flex-col justify-between bg-neutral-900 border border-neutral-800 hover:border-neutral-500 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${p.accent} flex items-center justify-center mb-6`}>
                  <Icon name={p.icon as "Smartphone"} size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{p.label}</h3>
                <p className="text-neutral-500 text-sm mb-3">{p.sub}</p>
                <p className="text-neutral-400 text-sm">{p.desc}</p>
              </div>
              <div className="flex items-center gap-2 mt-8 text-white group-hover:gap-3 transition-all duration-300">
                <Icon name="Download" size={18} />
                <span className="text-sm uppercase tracking-wide font-semibold">Скачать</span>
              </div>
            </a>
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
