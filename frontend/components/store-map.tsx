"use client"

import { YMaps, Map, Placemark, ZoomControl } from "react-yandex-maps"

/** Координаты магазина [долгота, широта] */
const STORE_COORDINATES: [number, number] = [ 55.768093, 37.629265]

const mapState = {
  center: STORE_COORDINATES,
  zoom: 20,
}

const placemarkOptions = {
  preset: "islands#redCircleIcon",
}

export function StoreMap() {
  const apikey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

  if (!apikey) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[240px] rounded-lg border border-border/50 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        <p>Для отображения карты задайте переменную окружения <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_YANDEX_MAPS_API_KEY</code>.</p>
        <p className="text-xs">Ключ можно получить в <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Кабинете разработчика Яндекса</a> (JavaScript API и HTTP Геокодер).</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full min-h-[240px] rounded-lg overflow-hidden">
      <YMaps query={{ apikey, lang: "ru_RU" }}>
        <Map
          state={mapState}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          options={{ suppressMapOpenBlock: true }}
        >
          <Placemark
            geometry={STORE_COORDINATES}
            options={placemarkOptions}
            properties={{
              balloonContent: "Цветочек в Горшочек",
              hintContent: "Магазин цветов",
            }}
          />
          <ZoomControl options={{ position: { right: 10, top: 10 } }} />
        </Map>
      </YMaps>
    </div>
  )
}
