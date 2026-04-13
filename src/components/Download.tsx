import Icon from "@/components/ui/icon";

export default function Download() {
  return (
    <div id="download" className="bg-neutral-950 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="uppercase tracking-widest text-sm text-neutral-400 mb-4">Доступно прямо сейчас</p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Скачай GoChat<br />на свой телефон
        </h2>
        <p className="text-neutral-400 text-lg md:text-xl max-w-xl mx-auto mb-12">
          Бесплатно. Без рекламы. Работает на iOS и Android.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#"
            className="flex items-center gap-4 bg-white text-black px-6 py-4 rounded-xl hover:bg-neutral-200 transition-colors duration-300 w-full sm:w-auto justify-center"
          >
            <Icon name="Apple" size={32} fallback="Smartphone" />
            <div className="text-left">
              <p className="text-xs text-neutral-500 leading-none mb-1">Загрузить в</p>
              <p className="text-lg font-bold leading-none">App Store</p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center gap-4 bg-white text-black px-6 py-4 rounded-xl hover:bg-neutral-200 transition-colors duration-300 w-full sm:w-auto justify-center"
          >
            <Icon name="Smartphone" size={32} />
            <div className="text-left">
              <p className="text-xs text-neutral-500 leading-none mb-1">Доступно в</p>
              <p className="text-lg font-bold leading-none">Google Play</p>
            </div>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-10 text-center border-t border-neutral-800 pt-12">
          <div>
            <p className="text-3xl font-bold mb-1">5M+</p>
            <p className="text-neutral-400 text-sm uppercase tracking-wide">Пользователей</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">4.9 ★</p>
            <p className="text-neutral-400 text-sm uppercase tracking-wide">Рейтинг в сторах</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">190+</p>
            <p className="text-neutral-400 text-sm uppercase tracking-wide">Стран мира</p>
          </div>
        </div>
      </div>
    </div>
  );
}
