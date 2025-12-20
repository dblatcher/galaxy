import type { TechId } from "./tech-list";

type EquipmentInfo = {
    type: 'beam',
    damage: number[],
    range: number
} | {
    type: 'bomb',
    damage: number[],
} | {
    type: 'colonise'
} | {
    type: 'other'
}

export type ShipEquipment = {
    name: string;
    baseCost: number;
    prerequisite?: TechId;
    info: EquipmentInfo;
    isBig?: boolean;
}

const ALL_EQUIPMENT = {
    projectileGun: {
        name: 'projectile gun',
        baseCost: 5,
        prerequisite: undefined,
        info: {
            type: 'beam',
            damage: [3],
            range: 2,
        }
    },
    explosiveBombs: {
        name: 'explosive bombs',
        baseCost: 15,
        info: {
            type: 'bomb',
            damage: [2, 2],
        }
    },
    laserCannon: {
        name: 'laser cannon',
        baseCost: 5,
        prerequisite: 'lasers',
        info: {
            type: 'beam',
            damage: [2, 2],
            range: 3,
        }
    },
    photoCannon: {
        name: 'photon cannon',
        baseCost: 10,
        prerequisite: 'photonBombardment',
        info: {
            type: 'beam',
            damage: [3, 3],
            range: 3,
        }
    },
    photonDrive: {
        name: 'photon drive',
        baseCost: 15,
        prerequisite: 'photonBombardment',
        info: {
            type: 'other'
        }
    },
    colonyModule: {
        name: 'colony module',
        baseCost: 200,
        info: {
            type: 'colonise'
        },
        isBig: true
    }
} satisfies Record<string, ShipEquipment>;


export type EquipmentId = keyof typeof ALL_EQUIPMENT;
export const equipmentIds = Object.keys(ALL_EQUIPMENT) as EquipmentId[];

export const getMaybeEquipment = (id: EquipmentId | undefined): ShipEquipment | undefined => {
    if (!id) {
        return undefined
    }
    return ALL_EQUIPMENT[id]
}

export const getEquipment = (id: EquipmentId): ShipEquipment  => {
    return ALL_EQUIPMENT[id]
}
