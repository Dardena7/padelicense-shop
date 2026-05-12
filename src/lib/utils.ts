export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const formatDate = (date: string, locale: string): string => {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

export const formatPrice = (cents: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};
