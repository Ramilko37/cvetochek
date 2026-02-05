/**
 * Словарь человекочитаемых заголовков для slug-ов каталога.
 * Используется в /catalog/[slug], breadcrumbs, карте сайта.
 * Позже можно расширить под витрины: new, sale, коллекции.
 */
export const CATALOG_SLUG_TITLES: Record<string, string> = {
  mono: "Монобукеты",
  bouquets: "Букеты",
  compositions: "Композиции",
  baskets: "Корзины",
  "new-year": "Новый год",
  // Будущие витрины (раскомментировать при появлении данных):
  // new: "Новинки",
  // sale: "Акции",
}

export function getCategoryTitle(slug: string): string | undefined {
  return CATALOG_SLUG_TITLES[slug]
}

/** Проверка, что slug — разрешённая категория/витрина. */
export function isAllowedCatalogSlug(slug: string): boolean {
  return slug in CATALOG_SLUG_TITLES
}
