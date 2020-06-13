// Display & GUI
function update_tier1_res_display() {
    ft1_el.innerHTML = Math.floor(tier1_res.ft1.cur);
    ft1_max_el.innerHTML = Math.floor(tier1_res.ft1.max);
    
    log_el.innerHTML = Math.floor(tier1_res.log.cur);
    log_max_el.innerHTML = Math.floor(tier1_res.log.max);

    ilarun_el.innerHTML = Math.floor(tier1_res.ilarun.cur);
    ilarun_max_el.innerHTML = Math.floor(tier1_res.ilarun.max);
    ilarun_worker_el.innerHTML = Math.floor(tier1_pop.worker.total);
    ilarun_worker_max_el.innerHTML = Math.floor(tier1_pop.worker.max);
    baroness_el.innerHTML = Math.floor(tier1_pop.baroness.total);
    baroness_max_el.innerHTML = Math.floor(tier1_pop.baroness.max);

    influence_el.innerHTML = Math.floor(tier1_res.influence.cur);
}

function update_tier1_cost_and_buildings() {
    let keys = Object.keys(tier1_buttons);
    let data = [
        tier1_res.ft1.act_rate, 
        tier1_res.log.act_rate, 
        tier1_res.ilarun.act_rate,
        tier1_buildings.berryBasket.cost.log,
        tier1_buildings.logStack.cost.ft1,
        tier1_buildings.ilarunWarren.cost.log,
        tier1_buildings.granary.cost.log,
        tier1_buildings.lumberYard.cost.ft1,
        tier1_buildings.hamlet.cost.ft1,
    ];
    for(let i = 0; i < keys.length; i++) {
        tier1_buttons[keys[i]].update(data[i]);
    }

    let keys_ = Object.keys(tier1_res_tooltip);
    let data_ = [
        [tier1_buildings.berryBasket.count, tier1_buildings.granary.count],
        [tier1_buildings.logStack.count, tier1_buildings.lumberYard.count],
        [tier1_buildings.ilarunWarren.count, tier1_buildings.hamlet.count],
        [tier1_pop.baroness.total],
    ];
    for(let i = 0; i < keys_.length; i++) {
        tier1_res_tooltip[keys_[i]].update(data_[i]);
    }
}

function update_tier1_demographic_ui() {
    let keys = Object.keys(tier1_pop_ui);
    let data = [
        tier1_pop.idle.total,
        tier1_pop.worker.total,
        tier1_pop.worker.forager.count,
        tier1_pop.worker.logger.count,
        (tier1_pop.worker.forager.income + tier1_pop_bonuses.worker.forager.income) * tier1_pop.worker.forager.count,
        (tier1_pop.worker.logger.income + tier1_pop_bonuses.worker.logger.income) * tier1_pop.worker.logger.count,
        (tier1_pop.idle.upkeep + tier1_pop_bonuses.idle.upkeep) * tier1_pop.idle.total,
        tier1_pop.worker.upkeep * tier1_pop.worker.total,
        tier1_pop.worker.breeder.count,
        (tier1_pop.worker.breeder.income + tier1_pop_bonuses.worker.breeder.income) * tier1_pop.worker.breeder.count,
        tier1_pop.baroness.total,
        (tier1_pop.baroness.income + tier1_pop_bonuses.baroness.income) * tier1_pop.baroness.total,
    ];
    for(let i = 0; i < keys.length; i++) {
        tier1_pop_ui[keys[i]].update(data[i]);
    }
}

function update_tier1_ui() {
    let keys = Object.keys(tier1_unlocks);
    keys.forEach(key => {
        if(tier1_unlocks[key].isOpen && !tier1_unlocks[key].isUnlocked) {
            console.log("DEBUG::"+key+" unlocked");
            if(tier1_unlocks[key].resUnlock != null)
                tier1_res_icons[tier1_unlocks[key].resUnlock].style.display = "block";
            tier1_unlocks[key].isUnlocked = true;
            tier1_unlocks[key].el.style.display = "block";
            tier1_res_update_flag = false;
        }  
    });
}