// Tier 1
/**
 * Resource List
 * 
 * | Bio Materials |
 * - Biomass * Raw / Tier 1
 * - Nutrient Paste * Food / Tier 1
 * - Redberries * Raw / Tier 1
 * 
 * | Basic Materials |
 * - Scrap * Raw / Tier 1
 * - Metal * Processed / Tier 1
 * 
 * | Advanced Materials |
 * - Basic Circuitry * Component / Tier 1
 * - Chemfuel * Fuel / Tier 1
 * - Basic Chemicals * Component / Tier 1
 * 
 * | Energy |
 * - Power * Power / Universal
 * 
 * | Crafted Goods |
 * - Survival Rifle * Weapon / Tier 1
 * - Redberry Shine * Luxury Good / Tier 1
 * - Synthfiber * Fabric / Tier 1
 * - Uniform * Normal Good / Tier 1
 * - Low Nobility Attire * Luxury Good / Tier 1
 * - Low Tech Munitions * Ammo / Tier 1
 */

/* Types
 * 01 - Raw
 * 02 - Component
 * 03 - Processed
 * 04 - Fuel
 * 05 - Ammo
 * 06 - Fabric
 * 07 - Food
 * 08 - Inferior Good
 * 09 - Normal Good
 * 10 - Luxury Good
 * 11 - Weapon
 */

/* ClassID
 * 1xxtt000 ~ Bio Materials | xx (Tier) | tt (Type)
 * 2xxtt000 ~ Basic Materials | xx (Tier) | tt (Type)
 * 3xxtt000 ~ Advanced Materials | xx (Tier) | tt (Type)
 * 4xxtt000 ~ Crafted Goods | xx (Tier) | tt (Type)
 * 10100000 : Power
 */

const TIER1_RESOURCE = {
    power: {
        classID: 10100000,
        name: "Power",
        type: "power",
        color: "#dee04b",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    biomass: {
        classID: 10101001,
        name: "Biomass",
        type: "raw",
        color: "#7ac538",
        cur: 0,
        max: { base: 10 },
        passiveRate: { },
        activeRate: { base: 1 },
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    nutrientPaste: {
        classID: 10107001,
        name: "Nutrient Paste",
        type: "food",
        color: "#297e29",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    redberries: {
        classID: 10101002,
        name: "Redberries",
        type: "raw",
        color: "#c94e4e",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    scrap: {
        classID: 20101003,
        name: "Scrap",
        type: "raw",
        color: "#948a8a",
        cur: 0,
        max: { base: 10 },
        passiveRate: {},
        activeRate: { base: 1},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    metal: {
        classID: 20103001,
        name: "Metal",
        type: "processed",
        color: "#5f4f4f",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    basicCircuitry: {
        classID: 30102001,
        name: "Basic Circuitry",
        type: "component",
        color: "#afafaf",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    chemfuel: {
        classID: 30104001,
        name: "Chemfuel",
        type: "fuel",
        color: "#792e2e",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    basicChemicals: {
        classID: 30102002,
        name: "Basic Chemicals",
        type: "component",
        color: "#7777aa",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    survivalRifle: {
        classID: 40111001,
        name: "Survival Rifle",
        type: "raw",
        color: "#555555",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    redberryShine: {
        classID: 40110001,
        name: "Redberry Shine",
        type: "luxury_good",
        color: "#841e7e",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    synthfiber: {
        classID: 40106002,
        name: "Synthfiber",
        type: "fabric",
        color: "#247e7e",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    uniform: {
        classID: 40109001,
        name: "Uniform",
        type: "normal_good",
        color: "#444e2e",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    lowNobilityAttire: {
        classID: 40110002,
        name: "Low Nobility Attire",
        type: "luxury_good",
        color: "#741ea4",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    },
    lowTechMunitions: {
        classID: 40105001,
        name: "Low Tech Munitions",
        type: "ammo",
        color: "#657575",
        cur: 0,
        max: {},
        passiveRate: {},
        activeRate: {},
        bonuses: {
            max: {},
            passiveRate: {},
            activeRate: {},
        }
    }
};

const TIER1_BUILDING = {
    /* ClassID
    * 5rrtt000 ~
    */
    barrel: {
        classID: 50101001,
        name: "Biomass Barrel",
        type: "storage",
        color: "#7ac538",
        count: 0,
        baseCost: {
            scrap: 10
        },
        costCoefficient: {
            scrap: 1.05
        },
        bonuses: {
            biomass: {
                max: 10,
                passiveRate: 0,
                activeRate: 0,
            }
        },
        special: {

        }
    },
    scrapStack: {
        classID: 50101002,
        name: "Scrap Stack",
        type: "storage",
        color: "#948a8a",
        count: 0,
        baseCost: {
            biomass: 10
        },
        costCoefficient: {
            biomass: 1.05
        },
        bonuses: {
            scrap: {
                max: 10,
                passiveRate: 0,
                activeRate: 0,
            }
        },
        special: {

        }
    },
}

// ---- Global Constant ----

const TIER1_RES_KEYS = Object.keys(TIER1_RESOURCE)
const TIER1_BUILDING_KEYS = Object.keys(TIER1_BUILDING)