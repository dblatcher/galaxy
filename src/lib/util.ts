export function findById<T extends { id: number }>(id: number | undefined, list: T[]): (T | undefined) {
    if (typeof id === 'undefined') { return undefined }
    return list.find(_ => _.id === id)
}

export function mapOnId<T extends { id: number }>(list: T[]): Record<string, T | undefined> {
    const map: Record<string, T> = {}
    list.forEach(item => {
        map[item.id] = item
    })
    return map
}

export function lookUpName<T extends { id: number, name: string }>(id: number | undefined, list: T[], fallback = '??'): string {
    return findById(id, list)?.name ?? fallback
}

export const isSet = (id?: number): id is number => typeof id !== 'undefined'

export const nextId = (list: { id: number }[]): number => {
    return Math.max(...list.map(item => item.id)) + 1
}

export function splitArray<T>(list: T[], predicate: { (item: T, index: number): boolean }): [T[], T[]] {
    return [
        list.filter(predicate),
        list.filter((t, i) => !predicate(t, i))
    ]
}

export function filterInPlace<T>(list: T[], predicate: { (item: T, index: number): boolean }) {
    const [matches] = splitArray(list, predicate);
    list.splice(0, list.length, ...matches)
}

export function removeDuplicates(list: number[]): number[] {
    return list.reduce<number[]>((acc, next) => (acc.includes(next)) ? acc : [...acc, next], [])
}

export const diceRoll = (max: number): number => Math.floor(Math.random() * max) + 1

export function shuffleArray<T>(array: T[]): T[] {
  const holdingPile = array.splice(0, array.length);
  let index;
  while (holdingPile.length > 0) {
    index = Math.floor(Math.random() * holdingPile.length);
    array.push(...holdingPile.splice(index, 1));
  }
  return array;
}
