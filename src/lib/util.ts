export function findById<T extends { id: number }>(id: number | undefined, list: T[]): (T | undefined) {
    if (typeof id === 'undefined') { return undefined }
    return list.find(_ => _.id === id)
}

export function lookUpName<T extends { id: number, name: string }>(id: number | undefined, list: T[], fallback = '??'): string {
    return findById(id, list)?.name ?? fallback
}

export const isSet = (id?:number):id is number => typeof id !== 'undefined'