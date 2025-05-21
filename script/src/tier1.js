// Resources
function update_ilarun_pop_demographic() {
    worker_max = 0;
    worker_max = Math.floor((BASE_WORKER_PERC + worker_perc_bonus) * Math.floor(ilarun.cur));

    baroness_max = 0;
    baroness_max = Math.floor(worker_max / (BASE_BARONESS_RATIO + baroness_ratio_bonus));

    squire_max = baroness_max;

    let worker_total = forager.count + logger.count;
    idle.count = Math.floor(ilarun.cur) - worker_total - baroness.count - squire.count;
}

function update_ash_elf_pop_demographic() {
    elf_worker_max = 0;
    elf_worker_max = Math.floor((BASE_ELF_WORKER_PERC + elf_worker_perc_bonus) * Math.floor(ash_elf.cur));

    ashen_maiden_max = 0;
    ashen_maiden_max = Math.floor(elf_worker_max / (BASE_ASHEN_MAIDEN_RATIO + ashen_maiden_ratio_bonus));

    let worker_total = ashcrafter.count + berrybrewer.count;
    elf_idle.count = Math.floor(ash_elf.cur) - worker_total - ashen_maiden.count;
}

function update_res(res) {
    let gain = (res.pas_rate + res.bonuses.pas_rate) / (1000 / TICK);
    if(res.cur + gain < res.max + res.bonuses.max || res.max == -1) {
        res.cur += gain;
    } else {
        res.cur = res.max + res.bonuses.max;
    }
}

function update_tier1_res_rate() {
    let res_types = Object.keys(res_all);
    let pop_types = Object.keys(pop_all);
    let building_types = Object.keys(buildings_all);

    res_types.forEach(name => {
        res_all[name].pas_rate = 0 + res_all[name].bonuses.pas_rate;
        pop_types.forEach(type => {
            res_all[name].pas_rate -= (pop_all[type].upkeep[name] - pop_all[type].bonuses.upkeep[name]) * pop_all[type].count;
            res_all[name].pas_rate += (pop_all[type].income[name] + pop_all[type].bonuses.income[name]) * pop_all[type].count;
        });
        building_types.forEach(b_type => {
            res_all[name].pas_rate += (buildings_all[b_type].income[name] * buildings_all[b_type].count);
        });
    });

    ilarun.pas_rate = (idle.count / 7) * idle.income.ilarun / Math.log(2);
    military.pas_rate = get_military_income_total() + military.bonuses.pas_rate + goldbeak_perk4_bonus;
}

function update_tier1_res_max() {
    berry.max = 10 + berry.bonuses.max;
    log.max = 10 + log.bonuses.max;
    ilarun.max = 0 + ilarun.bonuses.max;
    ash_elf.max = 0 + ash_elf.bonuses.max;
    ash_pottery.max = 10 + ash_pottery.bonuses.max;
    berry_cider.max = 10 + berry_cider.bonuses.max;

    let buildings = Object.keys(buildings_all);
    buildings.forEach(key => {
        let res_key = Object.keys(res_all)
        res_key.forEach(rk => {
            res_all[rk].max += (buildings_all[key].size[rk] + buildings_all[key].bonuses.size[rk]) * buildings_all[key].count;
        });
    });

    let pop = Object.keys(pop_all);
    pop.forEach(key => {
        let res_key = Object.keys(res_all)
        res_key.forEach(rk => {
            res_all[rk].max += (pop_all[key].bonuses.size[rk]) * pop_all[key].count;
        });
    });
}

// General Resource
function gain_resource(res, amount) {
    if((res_all[res].cur + amount <= res_all[res].max + res_all[res].bonuses.max) || (res_all[res].max == -1))
        res_all[res].cur += amount;
    else
        res_all[res].cur = res_all[res].max + res_all[res].bonuses.max;
}

function spend_resources(costs) {
    let result = true;
    let res_keys = Object.keys(costs);
    res_keys.forEach(rk => {
        if(costs[rk] > res_all[rk].cur)
            result = false;
    });

    if(result) {
        res_keys.forEach(rk => {
            res_all[rk].cur -= costs[rk];
        });
    }
    return result;
}

// Pop Related
function check_pop_availability(amount) {
    if(idle.count - amount >= 0) {
        return true;
    } else {
        return false;
    }
}

function buy_pop(name, amount) {
    if(name == "ilarun" | name == "ash_elf") {
        pop_cost = 0;
        if(name == "ilarun") pop_cost = idle.cost;
        if(name == "ash_elf") pop_cost = elf_idle.cost;
        if(res_all[name].cur + amount < (res_all[name].max + res_all[name].bonuses.max)) {
            if(spend_resources(pop_cost))
                res_all[name].cur += amount;
        } else {
            if(res_all[name].cur >= (res_all[name].max + res_all[name].bonuses.max))
                return;
            if(spend_resources(pop_cost))
                res_all[name].cur = res_all[name].max + res_all[name].bonuses.max;
        }
    } else {
        if(name == "forager" | name == "logger") {
            if((forager.count + logger.count + amount) <= worker_max) {
                if(spend_resources(pop_all[name].cost)) {
                    if(name == 'forager') forager.count += amount;
                    if(name == 'logger') logger.count += amount;
                }
            }
        } // Workers

        if(name == "ashcrafter" | name == "berrybrewer") {
            if((ashcrafter.count + berrybrewer.count + amount) <= elf_worker_max) {
                if(spend_resources(pop_all[name].cost)) {
                    if(name == 'ashcrafter') ashcrafter.count += amount;
                    if(name == 'berrybrewer') berrybrewer.count += amount;
                }
            }
        } // Elf Workers

        if(name == "baroness") {
            if(baroness.count + amount <= baroness_max) {
                if(spend_resources(pop_all[name].cost)) {
                    baroness.count += amount;
                }
            }
        } // Baroness

        if(name == "ashen_maiden") {
            if(ashen_maiden.count + amount <= ashen_maiden_max) {
                if(spend_resources(pop_all[name].cost)) {
                    ashen_maiden.count += amount;
                }
            }
        } // Ashen Maiden

        if(name == "squire") {
            if(squire.count + amount <= squire_max) {
                if(spend_resources(pop_all[name].cost)) {
                    squire.count += amount;
                }
            }
        } // Military
    }

    update_ilarun_pop_demographic();
    update_ash_elf_pop_demographic();
    update_tier1_res_rate();
    update_tier1_res_max();
}

function sell_pop(name, amount) {
    if(name == 'forager' && (forager.count - amount >= 0)) forager.count -= amount;
    if(name == 'logger'&& (logger.count - amount >= 0)) logger.count -= amount;
    if(name == 'squire' && (squire.count - amount >= 0)) squire.count -= amount;

    update_ilarun_pop_demographic();
    update_ash_elf_pop_demographic();
    update_tier1_res_rate();
    update_tier1_res_max();
}

// Buildings Related
function add_building(name, amount) {
    let b = buildings_all[name]
    buildings_all[name].count += amount;
    let sizes = b.size;
    let size = 0;
    let key = "";
    let s = Object.keys(sizes);
    s.forEach(k => {
        if(size < sizes[k]) {
            size = sizes[k];
            key = k;
        }
    });
    if(key == "ilarun" | key == "ash_elf") {
        size *= 10;
        size += Math.log(b.count * BUILDING_COST_MOD) / Math.log(2);
    } else {
        size += Math.log(b.count * BUILDING_COST_MOD) / Math.log(2);
    }
    let res_key = Object.keys(res_all);
    res_key.forEach(key => {
        buildings_all[name].cost[key] = Math.min(Math.floor(BUILDING_COST_MOD * b.cost[key]), Math.floor(b.count * size));
    });
}

function buy_building(building, amount) {
    if(spend_resources(buildings_all[building].cost)) {
        add_building(building, amount);
        update_tier1_res_max();
        update_buttons();
    }
}

// Core - Tier 1
ui_update_flag = true;
function update_unlocks() {
    if(berry.cur == berry.max && !unlocks.log_harvest) {
        console.log("Log Harvest Unlocked")
        unlocks.log_harvest = true;
        ui_update_flag = true;
        return;
    }

    if(berry_basket.count >= 10 && log_stack.count >= 10 && !unlocks.ilarun_recruit && !unlocks.techtree) {
        console.log("Ilarun Recruit & Tech Tree Unlocked")
        unlocks.ilarun_recruit = true;
        unlocks.techtree = true;
        ui_update_flag = true;
        return;
    }

    if(berry_basket.count >= 25 && log_stack.count >= 25 && !unlocks.tier1_2_storage) {
        console.log("Tier 1.5 Storage unlocked")
        unlocks.tier1_2_storage = true;
        ui_update_flag = true;
        return;
    }

    if(baroness_max >= 1 && !unlocks.baroness_tech) {
        console.log("Heroes & Baroness Tech Unlocked")
        unlocks.baroness_tech = true;
        ui_update_flag = true;
        return;
    }

    if(active_perks.cilia.perk2.active && !unlocks.conquest) {
        console.log("Conquest Unlocked")
        unlocks.conquest = true;
        ui_update_flag = true;
        return;
    }

    if(active_perks.cilia.perk4.active && !unlocks.hamlet) {
        console.log("Hamlets Unlocked")
        unlocks.hamlet = true;
        ui_update_flag = true;
        return;
    }

    if(territories.leyliasion.progress == territories.leyliasion.required &&!unlocks.ash_elf) {
        console.log("Ash Elves Join")
        unlocks.ash_elf = true;
        ui_update_flag = true;
        return;
    }
}

console.log(res_all);
console.log(buildings_all);
console.log(pop_all);
update_buttons();
function update_tier1() {
    let res = Object.keys(res_all);
    res.forEach(r => { update_res(res_all[r]) });
    
    update_display();
    update_ilarun_pop_demographic();
    update_ash_elf_pop_demographic();
    update_tier1_res_rate();
    update_military();
    update_unlocks();

    if(ui_update_flag) {
        update_ui();
        on_load(active_perks.cilia);
        on_load(active_perks.goldbeak);
        
        on_load_tech(active_techs_col1);
    }
}