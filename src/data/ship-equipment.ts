import type { TechId } from "./tech-list";

export type ShipEquipment = {
    name: string;
    baseCost: number;
    prerequisite?: TechId;
}

export const ALL_EQUIPMENT = {
    projectileGun: {
        name: 'projectile gun',
        baseCost: 5,
        prerequisite: undefined,
    },
    laserCannon: {
        name: 'laser cannon',
        baseCost: 5,
        prerequisite: 'lasers',
    },
    photoCannon: {
        name: 'photon cannon',
        baseCost: 10,
        prerequisite: 'photonBombardment',
    },
    photonDrive: {
        name: 'photon drive',
        baseCost: 15,
        prerequisite: 'photonBombardment',
    },
} satisfies Record<string, ShipEquipment>;


export type EquipmentId = keyof typeof ALL_EQUIPMENT;
export const equipmentIds = Object.keys(ALL_EQUIPMENT) as EquipmentId[];

