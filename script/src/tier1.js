// Resources
function update_ilarun_pop_demographic() {
    tier1_pop.worker.total = 0;
    tier1_pop.worker.max = Math.floor((0.4 + tier1_pop_bonuses.worker.max) * tier1_res.ilarun.cur);
    let types = ['forager', 'logger', 'breeder']
    types.forEach(key => {
        tier1_pop.worker.total += tier1_pop.worker[key].count;
    });
    tier1_pop.baroness.max = Math.floor(tier1_pop.worker.max / (10 + tier1_pop_bonuses.baroness.max));
    tier1_pop.idle.total = Math.floor(tier1_res.ilarun.cur) - tier1_pop.worker.total - tier1_pop.baroness.total;
}

function update_tier1_res() {
    let keys = Object.keys(tier1_res);
    keys.forEach(key => {
        gain_resource(key, tier1_res[key].pas_rate / (1000 / TICK));
        if(tier1_res[key] < 0) {
            tier1_res[key] = 0;
        }
    });

    update_ilarun_pop_demographic();
    update_tier1_demographic_ui();
    update_tier1_res_rate();
}

function update_tier1_res_rate() {
    // Each idle costs 0.1 Berries
    // Each worker costs 0.5 Berries
    // Each Forager produces 1 Berries per second
    // Each Logger produces 1 Log per second
    tier1_res.ft1.pas_rate = 0 + tier1_res_bonuses.ft1.pas_rate;;
    tier1_res.ft1.pas_rate -= tier1_pop.idle.total * (tier1_pop.idle.upkeep + tier1_pop_bonuses.idle.upkeep);
    tier1_res.ft1.pas_rate -= tier1_pop.worker.total * (tier1_pop.worker.upkeep + tier1_pop_bonuses.worker.upkeep);
    tier1_res.ft1.pas_rate += tier1_pop.worker.forager.count * (tier1_pop.worker.forager.income + tier1_pop_bonuses.worker.forager.income);
    
    tier1_res.log.pas_rate = 0 + tier1_res_bonuses.log.pas_rate;;
    tier1_res.log.pas_rate += tier1_pop.worker.logger.count * (tier1_pop.worker.logger.income + tier1_pop_bonuses.worker.logger.income);

    tier1_res.ilarun.pas_rate = 0 + tier1_res_bonuses.ilarun.pas_rate;;
    tier1_res.ilarun.pas_rate += tier1_pop.worker.breeder.count * (tier1_pop.worker.breeder.income + tier1_pop_bonuses.worker.breeder.income);

    tier1_res.influence.pas_rate = 0 + tier1_res_bonuses.influence.pas_rate;
    tier1_res.influence.pas_rate += tier1_pop.baroness.total * (tier1_pop.baroness.income + tier1_pop_bonuses.baroness.income);
}

function update_tier1_res_max() {
    tier1_res.ft1.max = 10 + tier1_res_bonuses.ft1.max;
    tier1_res.log.max = 10 + tier1_res_bonuses.log.max;
    tier1_res.ilarun.max = 0 + tier1_res_bonuses.ilarun.max;

    let buildings = Object.keys(tier1_buildings);
    buildings.forEach(key => {
        let res_key = ['ft1', 'log', 'ilarun'];
        res_key.forEach(rk => {
            tier1_res[rk].max += (tier1_buildings[key].size[rk] + tier1_buildings_bonuses[key].size[rk]) * tier1_buildings[key].count;
        });
    });
}

function gain_resource(res, amount) {
    if((tier1_res[res].cur + amount <= tier1_res[res].max) || (tier1_res[res].max == -1))
        tier1_res[res].cur += amount;
    else
        tier1_res[res].cur = tier1_res[res].max;
}

function spend_resources(costs) {
    let result = true;
    let res_keys = Object.keys(costs);
    res_keys.forEach(rk => {
        if(costs[rk] > tier1_res[rk].cur)
            result = false;
    });

    if(result) {
        res_keys.forEach(rk => {
            tier1_res[rk].cur -= costs[rk];
        });
    }
    return result;
}

function spend_idle_pop(amount) {
    tier1_pop.idle.total -= amount;
}

function gain_idle_pop(amount, addPop = true) {
    if(addPop)
        gain_resource('ilarun', amount);
    tier1_pop.idle.total += amount;
}

function check_space_available(amount) {
    if(tier1_res.ilarun.cur + amount <= tier1_res.ilarun.max)
        return true;
    else
        return false;
}

function check_available_idle_pop(amount) {
    if(tier1_pop.worker.total < tier1_pop.worker.max) {
        if(tier1_pop.idle.total >= amount) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function check_available_idle_pop_baroness(amount) {
    if(tier1_pop.baroness.total < tier1_pop.baroness.max) {
        if(tier1_pop.idle.total >= amount) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function gain_building(building_name, amount) {
    let b = tier1_buildings[building_name]
    tier1_buildings[building_name].count += amount;
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
    if(key == "ilarun") {
        size *= 10;
        size += Math.log(b.count * tier1_building_cost_modifier) / Math.log(2);
    } else {
        size += Math.log(b.count * tier1_building_cost_modifier) / Math.log(2);
    }
    tier1_buildings[building_name].cost.ft1 = Math.min(Math.floor(tier1_building_cost_modifier * b.cost.ft1), Math.floor(b.count * size));
    tier1_buildings[building_name].cost.log = Math.min(Math.floor(tier1_building_cost_modifier * b.cost.log), Math.floor(b.count * size));
}

function gain_pop(category, type, amount) {
    if(type != null)
        tier1_pop[category][type].count += amount;
    else
        tier1_pop[category].total += amount;
}

function buy_resource_tier1(target, type) {
    if(type == 'building') {
        if(spend_resources(tier1_buildings[target].cost))
            gain_building(target, 1);
    } else if(type == 'pop') {
        if(check_available_idle_pop(1)) {
            if(spend_resources(tier1_pop.worker[target].cost)) {
                spend_idle_pop(1);
                gain_pop('worker', target, 1);
            }
        }
    } else if(type == 'pop_baroness') {
        if(check_available_idle_pop_baroness(1)) {
            if(spend_resources(tier1_pop[target].cost)) {
                spend_idle_pop(1);
                gain_pop('baroness', null, 1);
            }
        }
    } else if(type == 'pop_special') {
        if(check_space_available(1))
            if(spend_resources({ft1: 100, log: 0, ilarun: 0}))
                gain_idle_pop(1);
    }

    if(type.indexOf("pop") !== -1) {
        update_ilarun_pop_demographic();
        update_tier1_demographic_ui();
    }
    update_tier1_res_rate(); 
    update_tier1_res_max();
}

function sell_resource_tier1(target) {
    if(tier1_pop.worker[target].count > 0) {
        tier1_pop.worker[target].count -= 1;
        gain_idle_pop(1, false);
    }

    update_ilarun_pop_demographic();
    update_tier1_demographic_ui();
    update_tier1_res_rate(); 
}

// Core - Tier 1

function update_tier1_unlocks() {
    // Needs to be hardcoded for now, but automation later using JSON?
    if((tier1_res.ft1.cur == tier1_res.ft1.max) && tier1_unlocks.log_harvest.isUnlocked == false) {
        tier1_unlocks.log_harvest.isOpen = true;
        tier1_ui_update_flag = true;
    }

    if((tier1_buildings.berryBasket.count >= 10) && (tier1_buildings.logStack.count >= 10) && tier1_unlocks.ilarun_recruit.isUnlocked == false) {
        tier1_unlocks.ilarun_recruit.isOpen = true;
        tier1_ui_update_flag = true;
    }

    if((tier1_buildings.berryBasket.count >= 25) && (tier1_buildings.logStack.count >= 25) && tier1_unlocks.tier1_2_storage.isUnlocked == false) {
        tier1_res_tooltip.ft1.add_to_txt("Granary: ");
        tier1_res_tooltip.log.add_to_txt("Lumber Yard: ");
        tier1_unlocks.tier1_2_storage.isOpen = true;
        tier1_ui_update_flag = true;
    }

    if((tier1_pop.worker.max >= 10) && tier1_unlocks.baroness_tech.isUnlocked == false) {
        baroness_display.style.display = "block";
        hero_tab.style.display = "block";
        tier1_unlocks.baroness_tech.isOpen = true;
        tier1_ui_update_flag = true;
    }

    if(active_perks.cilia.perk2) {
        tier1_unlocks.conquest.isOpen = true;
        tier1_ui_update_flag = true;
    }

    if(active_perks.cilia.perk4) {
        tier1_unlocks.hamlet.isOpen = true;
        tier1_ui_update_flag = true;
    }
}

function update_tier1() {
    update_tier1_res();
    update_tier1_res_display();
    update_tier1_cost_and_buildings();
    update_tier1_unlocks();
    if(tier1_ui_update_flag)
        update_tier1_ui();
}