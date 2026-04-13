const features = [
  { icon: "💬", title: "Мгновенные чаты", desc: "Сообщения доставляются за миллисекунды. Текст, фото, файлы, голосовые — всё в одном треде." },
  { icon: "📞", title: "HD-звонки", desc: "Голосовые и видеозвонки в высоком качестве. Один на один или групповые конференции." },
  { icon: "🔒", title: "Сквозное шифрование", desc: "Ваши переписки защищены end-to-end шифрованием. Никто, кроме вас, не читает сообщения." },
];

export default function Featured() {
  return (
    <div id="features" className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2 bg-neutral-950 flex items-center justify-center">
        <div className="text-center text-white p-12">
          <div className="text-8xl mb-6">💬</div>
          <div className="flex gap-4 justify-center text-5xl">
            <span>📞</span><span>🔒</span><span>🌐</span>
          </div>
        </div>
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1">
        <h3 className="uppercase mb-6 text-sm tracking-wide text-neutral-600">Всё, что нужно для общения</h3>
        <p className="text-2xl lg:text-4xl mb-10 text-neutral-900 leading-tight font-light">
          Один мессенджер вместо пяти. Чаты, звонки и файлы — без лишних приложений и без компромиссов по безопасности.
        </p>
        <div className="flex flex-col gap-6 mb-10">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 items-start">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-neutral-900 mb-1">{f.title}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="/app" className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
          Открыть GoChat
        </a>
      </div>
    </div>
  );
}