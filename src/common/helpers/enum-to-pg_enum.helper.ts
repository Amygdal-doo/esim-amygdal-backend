/**
 * Helper function to convert a Typescript enum object to a Postgres enum
 * compatible format.
 *
 * @param myEnum - The enum object to convert
 * @returns An array of string values of the enum object
 */
export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}
