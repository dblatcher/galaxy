export function findById<T extends { id: number }>(id: number | undefined, list: T[]): (T | undefined) {
    if (typeof id === 'undefined') { return undefined }
    return list.find(_ => _.id === id)
}

export function lookUpName<T extends { id: number, name: string }>(id: number | undefined, list: T[], fallback = '??'): string {
    return findById(id, list)?.name ?? fallback
}

export const isSet = (id?: number): id is number => typeof id !== 'undefined'

export const nextId = (list: { id: number }[]): number => {
    return Math.max(...list.map(item => item.id)) + 1
}

export function splitArray<T>(list: T[], predicate: { (item: T): boolean }): [T[], T[]] {
    return [
        list.filter(predicate),
        list.filter((t) => !predicate(t))
    ]
}

export function removeDuplicates(list: number[]): number[] {
    return list.reduce<number[]>((acc, next) => (acc.includes(next)) ? acc : [...acc, next], [])
}
