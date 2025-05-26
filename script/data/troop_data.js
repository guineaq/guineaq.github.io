const RangeType = {
    MELEE: 1,
    RANGED: 2
}

const DamageType = {
    SHOCK: 1,
    ANTI_CAV: 2,
    PROJECTILE: 3,
    MAGIC: 4
}

const ArmorType = {
    BASIC: 1,
    ARMORED: 2,
    LIGHT: 3,
    ELITE: 4,
}

const PopType = {
    ILARUN: 1,
    ASH_ELF: 2,
}

class DamageData {
    constructor(range, damageType, damage) {
        this.range = range
        this.damageType = damageType
        this.damage = damage
        
    }
}

class DefenseData {
    constructor(armorType, armor, hp) {
        this.armorType = armorType
        this.armor = armor
        this.speed = speed
        this.hp = hp
        this.pop_type = pop_type
        this.pop_cost = pop_cost
    }
}

class CostData {
    constructor(cost_arr, pop_type, pop_cost) {
        this.cost_arr = cost_arr
        this.pop_type = pop_type
        this.pop_cost = pop_cost
    }
}

const ilarun_page = {
    classID: 10001,
    name: "Ilarun Page",
    damage: new DamageData(RangeType.MELEE, DamageType.SHOCK),
    defense: new DefenseData(ArmorType.BASIC, 1, 5),
    speed: 10,
    cost_data: new CostData(res_arr({wooden_weaponry: 1}), PopType.ILARUN, 1)
}