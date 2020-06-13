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
    res_types.forEach(name => {
        res_all[name].pas_rate = 0 + res_all[name].bonuses.pas_rate;
        pop_types.forEach(type => {
            res_all[name].pas_rate -= (pop_all[type].upkeep[name] - pop_all[type].bonuses.upkeep[name]) * pop_all[type].count;
            res_all[name].pas_rate += (pop_all[type].income[name] + pop_all[type].bonuses.income[name]) * pop_all[type].count;
        });
    });

    ilarun.pas_rate = (idle.count / 7) * idle.income.ilarun / Math.log(2);
}

function update_tier1_res_max() {
    berry.max = 10 + berry.bonuses.max;
    log.max = 10 + log.bonuses.max;
    ilarun.max = 0 + ilarun.bonuses.max;

    let buildings = Object.keys(buildings_all);
    buildings.forEach(key => {
        let res_key = Object.keys(res_all)
        res_key.forEach(rk => {
            res_all[rk].max += (buildings_all[key].size[rk] + buildings_all[key].bonuses.size[rk]) * buildings_all[key].count;
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
    if(name == "ilarun") {
        if(ilarun.cur + amount < (ilarun.max + ilarun.bonuses.max)) {
            if(spend_resources(idle.cost))
                ilarun.cur += amount;
        } else {
            if(ilarun.cur >= (ilarun.max + ilarun.bonuses.max))
                return;
            if(spend_resources(idle.cost))
                ilarun.cur = ilarun.max + ilarun.bonuses.max;
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

        if(name == "baroness") {
            if(baroness.count + amount <= baroness_max) {
                if(spend_resources(pop_all[name].cost)) {
                    baroness.count += amount;
                }
            }
        } // Baroness

        if(name == "squire") {
            if(squire.count + amount <= squire_max) {
                if(spend_resources(pop_all[name].cost)) {
                    squire.count += amount;
                }
            }
        } // Military
    }

    update_ilarun_pop_demographic();
    update_tier1_res_rate();
}

function sell_pop(name, amount) {
    if(name == 'forager' && (forager.count - amount >= 0)) forager.count -= amount;
    if(name == 'logger'&& (logger.count - amount >= 0)) logger.count -= amount;
    if(name == 'squire' && (squire.count - amount >= 0)) squire.count -= amount;

    update_ilarun_pop_demographic();
    update_tier1_res_rate();
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
    if(key == "ilarun") {
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
    if(berry.cur == berry.max && unlocks.log_harvest == false) {
        console.log("Log Harvest Unlocked")
        unlocks.log_harvest = true;
        ui_update_flag = true;
        return;
    }

    if(berry_basket.count >= 10 && log_stack.count >= 10 && unlocks.ilarun_recruit == false) {
        console.log("Ilarun Recruit Unlocked")
        unlocks.ilarun_recruit = true;
        ui_update_flag = true;
        return;
    }

    if(berry_basket.count >= 25 && log_stack.count >= 25 && unlocks.tier1_2_storage == false) {
        console.log("Tier 1.5 Storage unlocked")
        berry_display.reveal_el(2);
        log_display.reveal_el(2);
        unlocks.tier1_2_storage = true;
        ui_update_flag = true;
        return;
    }

    if(baroness_max >= 1 && unlocks.baroness_tech == false) {
        console.log("Heroes & Baroness Tech Unlocked")
        unlocks.baroness_tech = true;
        ui_update_flag = true;
        return;
    }
}

console.log(res_all);
console.log(buildings_all);
console.log(pop_all);
function update_tier1() {
    let res = Object.keys(res_all);
    res.forEach(r => { update_res(res_all[r]) });
    update_display();
    update_ilarun_pop_demographic();
    update_tier1_res_rate();
    update_unlocks();
    if(ui_update_flag) {
        update_ui();
        on_load();
    }
}