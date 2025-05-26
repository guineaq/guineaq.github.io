// Resources
function update_ilarun_pop_demographic() {
    worker_max = 0
    worker_max = Math.floor((BASE_WORKER_PERC + worker_perc_bonus) * Math.floor(ilarun.max))

    baroness_max = 0
    baroness_max = Math.floor(worker_max / (BASE_BARONESS_RATIO + baroness_ratio_bonus))

    squire_max = baroness_max

    let worker_total = forager.count + logger.count + woodcrafter.count
    idle.count = Math.floor(ilarun.cur) - worker_total - baroness.count - squire.count
}

function update_ash_elf_pop_demographic() {
    elf_worker_max = 0
    elf_worker_max = Math.floor((BASE_ELF_WORKER_PERC + elf_worker_perc_bonus) * Math.floor(ash_elf.cur))

    ashen_maiden_max = 0
    ashen_maiden_max = Math.floor(elf_worker_max / (BASE_ASHEN_MAIDEN_RATIO + ashen_maiden_ratio_bonus))

    let worker_total = ashcrafter.count + berrybrewer.count
    elf_idle.count = Math.floor(ash_elf.cur) - worker_total - ashen_maiden.count
}

function update_res(res) {
    const gain = (res.pas_rate + res.bonuses.pas_rate) / (1000 / TICK)
    const max = res.max + res.bonuses.max

    if (max === -1) {
        res.cur += gain
    } else {
        res.cur = Math.max(0, Math.min(res.cur + gain, max))
    }
}

function update_tier1_res_rate() {
    let res_types = Object.keys(res_all)
    let pop_types = Object.keys(pop_all)
    let building_types = Object.keys(buildings_all)

    res_types.forEach(name => {
        res_all[name].pas_rate = 0 + res_all[name].bonuses.pas_rate
        pop_types.forEach(type => {
            res_all[name].pas_rate -= (pop_all[type].upkeep[name] - pop_all[type].bonuses.upkeep[name]) * pop_all[type].count
            res_all[name].pas_rate += (pop_all[type].income[name] + pop_all[type].bonuses.income[name]) * pop_all[type].count
        })
        building_types.forEach(b_type => {
            res_all[name].pas_rate += (buildings_all[b_type].income[name] * buildings_all[b_type].count)
        })
    })

    ilarun.pas_rate = (idle.count / 7) * idle.income.ilarun / Math.log(2)
}

function update_tier1_res_max() {
    // Reset all resource max values to their base + bonuses
    const baseMax = {
        berry: 10,
        log: 10,
        wooden_weaponry: 10,
        ilarun: 0,
        ash_elf: 0,
        ash_pottery: 10,
        berry_cider: 10,
        influence: -1
    }

    // Set the base + bonuses for each resource
    Object.keys(res_all).forEach(key => {
        if (baseMax.hasOwnProperty(key)) {
            res_all[key].max = baseMax[key] + (res_all[key].bonuses?.max || 0)
        } else {
            // If a new resource is added, just use bonuses
            res_all[key].max = (res_all[key].bonuses?.max || 0)
        }
    })

    // Add max from buildings
    Object.values(buildings_all).forEach(building => {
        Object.keys(building.size).forEach(rk => {
            if (res_all[rk]) {
                res_all[rk].max += ((building.size[rk] || 0) + (building.bonuses?.size?.[rk] || 0)) * building.count
            }
        })
    })

    // Add max from population bonuses
    Object.values(pop_all).forEach(pop => {
        if (pop.bonuses && pop.bonuses.size) {
            Object.keys(pop.bonuses.size).forEach(rk => {
                if (res_all[rk]) {
                    res_all[rk].max += (pop.bonuses.size[rk] || 0) * pop.count
                }
            })
        }
    })
}


// General Resource
function gain_resource(res, amount) {
    if((res_all[res].cur + amount <= res_all[res].max + res_all[res].bonuses.max) || (res_all[res].max == -1))
        res_all[res].cur += amount
    else
        res_all[res].cur = res_all[res].max + res_all[res].bonuses.max
}

function spend_resources(costs) {
    let result = true
    let res_keys = Object.keys(costs)
    res_keys.forEach(rk => {
        if(costs[rk] > res_all[rk].cur)
            result = false
    })

    if(result) {
        res_keys.forEach(rk => {
            res_all[rk].cur -= costs[rk]
        })
    }
    return result
}

// Pop Related
function check_pop_availability(amount) {
    if(idle.count - amount >= 0) {
        return true
    } else {
        return false
    }
}

function buy_pop(name, amount) {
    if (name === "ilarun" || name === "ash_elf") {
        handle_resource_pop(name, amount)
    } else if (["forager", "logger", "woodcrafter"].includes(name)) {
        handle_worker_pop(name, amount, ["forager", "logger", "woodcrafter"], worker_max, idle)
    } else if (["ashcrafter", "berrybrewer"].includes(name)) {
        handle_worker_pop(name, amount, ["ashcrafter", "berrybrewer"], elf_worker_max, elf_idle)
    } else if (name === "baroness") {
        handle_single_pop(name, amount, baroness_max)
    } else if (name === "ashen_maiden") {
        handle_single_pop(name, amount, ashen_maiden_max)
    } else if (name === "squire") {
        handle_single_pop(name, amount, squire_max)
    }

    update_ilarun_pop_demographic()
    update_ash_elf_pop_demographic()
    update_tier1_res_rate()
    update_tier1_res_max()
}

// --- Helper Functions ---
// Map resource-type pop names to their cost-determining pop object
const resourcePopCostMap = {
    ilarun: idle,
    ash_elf: elf_idle,
    // Add more resource-type pops here as needed
}

function handle_resource_pop(name, amount) {
    const pop_cost_obj = resourcePopCostMap[name]
    if (!pop_cost_obj) return // Unknown resource pop, do nothing

    const pop_cost = pop_cost_obj.cost
    const res = res_all[name]
    const max = res.max + res.bonuses.max

    if (res.cur + amount < max) {
        if (spend_resources(pop_cost)) res.cur += amount
    } else {
        if (res.cur >= max) return
        if (spend_resources(pop_cost)) res.cur = max
    }
}

function handle_worker_pop(name, amount, group, max_total, idle) {
    // group: array of pop names that share the max
    let total = group.reduce((sum, n) => sum + pop_all[n].count, 0)
    if (total + amount <= max_total && idle.count - amount >= 0) {
        if (spend_resources(pop_all[name].cost)) {
            pop_all[name].count += amount
        }
    }
}

function handle_single_pop(name, amount, max_count) {
    if (pop_all[name].count + amount <= max_count) {
        if (spend_resources(pop_all[name].cost)) {
            pop_all[name].count += amount
        }
    }
}

function sell_pop(name, amount) {
    const pop = pop_all[name]
    if (pop && (pop.count - amount >= 0)) {
        pop.count -= amount
    }

    update_ilarun_pop_demographic()
    update_ash_elf_pop_demographic()
    update_tier1_res_rate()
    update_tier1_res_max()
}

// Buildings Related
function add_building(name, amount) {
    let building = buildings_all[name]
    building.count += amount

    // Find the base cost definition for this building
    let baseCostDef = building_base_cost_defs.find(def => def.name === name)
    if (!baseCostDef) {
        console.error(`No base cost definition found for building: ${name}`)
        return
    }

    // Update the cost for each resource, using the base cost and dynamic formula
    let resourceKeys = Object.keys(res_all)
    resourceKeys.forEach(resourceKey => {
        // Use base cost if defined, otherwise default to 0
        let baseCost = baseCostDef.cost[resourceKey] || 0

        // let costModifier = getCostModifierForBuilding(name, resourceKey) // Implement as needed
        // let scaledCost = Math.floor(baseCost * costModifier * ...)

        let scaledCost = baseCost * Math.pow(building.cost_coefficient[resourceKey], building.count)
        building.cost[resourceKey] = Math.floor(scaledCost)
    })
}

function buy_building(building, amount) {
    if(spend_resources(buildings_all[building].cost)) {
        add_building(building, amount)
        update_tier1_res_max()
        update_buttons()
    }
}

// Core - Tier 1
ui_update_flag = true

const unlockConditions = [
    {
        condition: () => berry.cur === berry.max && !unlocks.log_harvest,
        actions: () => {
            showNotification("Log Harvest Unlocked")
            unlocks.log_harvest = true
            bar_unlocked.log = true
        }
    },
    {
        condition: () => berry_basket.count >= 10 && log_stack.count >= 10 && !unlocks.ilarun_recruit && !unlocks.techtree,
        actions: () => {
            showNotification("Ilarun Recruit & Tech Tree Unlocked")
            unlocks.ilarun_recruit = true
            unlocks.techtree = true
            bar_unlocked.ilarun = true
            bar_unlocked.idle_ilarun = true
            bar_unlocked.worker_ilarun = true
        }
    },
    {
        condition: () => berry_basket.count >= 25 && log_stack.count >= 25 && !unlocks.tier1_2_storage,
        actions: () => {
            showNotification("Tier 1.5 Storage unlocked")
            unlocks.tier1_2_storage = true
        }
    },
    {
        condition: () => baroness_max >= 1 && !unlocks.baroness_tech,
        actions: () => {
            showNotification("Heroes & Baroness Tech Unlocked")
            unlocks.baroness_tech = true
            bar_unlocked.influence = true
            bar_unlocked.baroness_ilarun = true
        }
    },
    {
        condition: () => active_perks.cilia.perk2.active && !unlocks.conquest,
        actions: () => {
            showNotification("Conquest Unlocked")
            unlocks.conquest = true
            bar_unlocked.wooden_weaponry = true
        }
    },
    {
        condition: () => active_perks.cilia.perk4.active && !unlocks.hamlet,
        actions: () => {
            showNotification("Hamlets Unlocked")
            unlocks.hamlet = true
        }
    },
    {
        condition: () => territories.leyliasion.progress === territories.leyliasion.required && !unlocks.ash_elf,
        actions: () => {
            showNotification("Ash Elves Join")
            unlocks.ash_elf = true
        }
    }
]

function update_unlocks() {
    for (const unlock of unlockConditions) {
        if (unlock.condition()) {
            unlock.actions()
            ui_update_flag = true
            return // Only one unlock per call
        }
    }
}


console.log(res_all)
console.log(buildings_all)
console.log(pop_all)
update_buttons()
function update_tier1() {
    let res = Object.keys(res_all)
    res.forEach(r => { update_res(res_all[r]) })
    
    update_display()
    update_ilarun_pop_demographic()
    update_ash_elf_pop_demographic()
    update_tier1_res_rate()
    update_unlocks()

    if(ui_update_flag) {
        update_ui()
        for (const hero in active_perks) {
            on_load(active_perks[hero])
        }
        
        on_load_tech(active_techs_col1)
    }
}