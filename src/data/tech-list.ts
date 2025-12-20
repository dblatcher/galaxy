export type Tech = {
    name: string;
    prerequisites: string[];
    cost: number;
}

const ALL_TECHS = {
    lasers: {
        name: 'lasers',
        cost: 10,
        prerequisites: []
    },
    solarSails: {
        name: 'solar sails',
        cost: 20,
        prerequisites: []
    },
    photonDrive: {
        name: 'photon drive',
        cost: 20,
        prerequisites: ['solarSails']
    },
    photonBombardment: {
        name: 'photon bombardment',
        cost: 30,
        prerequisites: ['solarSails', 'lasers']
    }
} satisfies Record<string, Tech>;


export type TechId = keyof typeof ALL_TECHS;
export type FactionTechs = Partial<Record<TechId, boolean>>;
export const techIds = Object.keys(ALL_TECHS) as TechId[];

export const getMaybeTech = (id: TechId | undefined): Tech | undefined => {
    if (!id) {
        return undefined
    }
    return ALL_TECHS[id]
}

export const getTech = (id: TechId): Tech  => {
    return ALL_TECHS[id]
}
