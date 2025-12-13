import type { TechId } from "./tech-list";

export type ShipEquipment = {
    name: string;
    baseCost: number;
    prerequisites: TechId[];
}

export const ALL_EQUIPMENT = {
    projectileGun: {
        name: 'projectile gun',
        baseCost: 5,
        prerequisites: []
    },
    laserCannon: {
        name: 'laser cannon',
        baseCost: 5,
        prerequisites: ['lasers']
    },
} satisfies Record<string, ShipEquipment>;


export type EquipmentId = keyof typeof ALL_EQUIPMENT;
export const equipmentIds = Object.keys(ALL_EQUIPMENT) as EquipmentId[];

