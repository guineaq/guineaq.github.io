var affinities = fetch("affinities", true) || {
    virtue: 0,
    nobility: 0,
}

var active_perks = {
    cilia: {
        hired: fetch("cilia.hired", true) || {active: false, btn_id: null},
        perk1: fetch("cilia.perk1", true) || {active: false, btn_id: null},
        perk2: fetch("cilia.perk2", true) || {active: false, btn_id: null},
        perk3: fetch("cilia.perk3", true) || {active: false, btn_id: null},
        perk4: fetch("cilia.perk4", true) || {active: false, btn_id: null},
        perk4_1: fetch("cilia.perk4_1", true) || {active: false, btn_id: null},
        apply_perk4_1: function() {
            baroness_ratio_bonus -= 1;
        }
    },
    goldbeak: {
        hired: fetch("goldbeak.hired", true) || {active: false, btn_id: null},
        perk1: fetch("goldbeak.perk1", true) || {active: false, btn_id: null},
        perk2: fetch("goldbeak.perk2", true) || {active: false, btn_id: null},
        perk3: fetch("goldbeak.perk3", true) || {active: false, btn_id: null},
        perk4: fetch("goldbeak.perk4", true) || {active: false, btn_id: null},
        apply_perk4: function() {
            let total_active_perks = 0;
            let keys = ["hired", "perk1", "perk2", "perk3", "perk4"];
            keys.forEach(key => {
                if(active_perks.cilia[key].active) total_active_perks += 1;
                if(active_perks.goldbeak[key].active) total_active_perks += 1;
            });
            goldbeak_perk4_bonus = 5 * total_active_perks;
        }
    }
}

const hero_cost = {
    cilia_on_hire: 50,
    cilia_perk1: 100,
    cilia_perk2: 200,
    cilia_perk3: 200,
    cilia_perk4: 500,
    goldbeak_on_hire: 200,
    goldbeak_perk1: 500,
    goldbeak_perk2: 500,
    goldbeak_perk3: 1000,
    goldbeak_perk4: 2500,
}

const heroes = {
    cilia: {
        on_hire: function(btn_id) {
            if(influence.cur >= hero_cost.cilia_on_hire) {
                influence.cur -= hero_cost.cilia_on_hire;
                influence.bonuses.pas_rate += 0.5;
                warren.bonuses.size.ilarun += 1;
                active_perks.cilia.hired.active = true;
                active_perks.cilia.hired.btn_id = btn_id;
                deactivate_button(btn_id);
                affinities.virtue += 1;
                affinities.nobility += 1;
            }
        },
        perk1: function(btn_id) {
            if(influence.cur >= hero_cost.cilia_perk1) {
                influence.cur -= hero_cost.cilia_perk1;
                warren.bonuses.size.ilarun += 2;
                active_perks.cilia.perk1.active = true;
                active_perks.cilia.perk1.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        },
        perk2: function(btn_id) {
            if(influence.cur >= hero_cost.cilia_perk2) {
                influence.cur -= hero_cost.cilia_perk2;
                baroness.bonuses.income.influence += 0.1;
                active_perks.cilia.perk2.active = true;
                active_perks.cilia.perk2.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        },
        perk3: function(btn_id) {
            if(influence.cur >= hero_cost.cilia_perk3) {
                influence.cur -= hero_cost.cilia_perk3;
                idle.bonuses.upkeep.berry += 0.05;
                forager.bonuses.upkeep.berry += 0.05;
                logger.bonuses.upkeep.berry += 0.05;
                active_perks.cilia.perk3.active = true;
                active_perks.cilia.perk3.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        },
        perk4: function(btn_id) {
            if(influence.cur >= hero_cost.cilia_perk4) {
                influence.cur -= hero_cost.cilia_perk4;
                active_perks.cilia.perk4.active = true;
                active_perks.cilia.perk4.btn_id = btn_id;
                if(affinities.virtue >= 2) {
                    active_perks.cilia.perk4_1.active = true;
                    active_perks.cilia.apply_perk4_1();
                }
                deactivate_button(btn_id);
            }
        }
    },

    goldbeak: {
        on_hire: function(btn_id) {
            if(influence.cur >= hero_cost.goldbeak_on_hire && active_perks.cilia.perk2.active) {
                influence.cur -= hero_cost.goldbeak_on_hire;
                military.bonuses.pas_rate += 10;
                active_perks.goldbeak.hired.active = true;
                active_perks.goldbeak.hired.btn_id = btn_id;
                deactivate_button(btn_id);
                affinities.virtue += 1;
                affinities.nobility += 1;
            }
        },
        perk1: function(btn_id) {
            if(influence.cur >= hero_cost.goldbeak_perk1) {
                influence.cur -= hero_cost.goldbeak_perk1;
                military_income_bonuses.squire += 1;
                active_perks.goldbeak.perk1.active = true;
                active_perks.goldbeak.perk1.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        },
        perk2: function(btn_id) {
            if(influence.cur >= hero_cost.goldbeak_perk2 && active_perks.goldbeak.perk1.active) {
                influence.cur -= hero_cost.goldbeak_perk2;
                forager.bonuses.income.berry += 1;
                active_perks.goldbeak.perk2.active = true;
                active_perks.goldbeak.perk2.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        },
        perk3: function(btn_id) {
            if(influence.cur >= hero_cost.goldbeak_perk3 && active_perks.cilia.hired.active) {
                influence.cur -= hero_cost.goldbeak_perk3;
                warren.bonuses.size.ilarun += 1;
                influence.bonuses.pas_rate += 1.5;
                active_perks.goldbeak.perk3.active = true;
                active_perks.goldbeak.perk3.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        },
        perk4: function(btn_id) {
            if(influence.cur >= hero_cost.goldbeak_perk4 && territory_count >= 1) {
                influence.cur -= hero_cost.goldbeak_perk4;
                active_perks.goldbeak.apply_perk4();
                active_perks.goldbeak.perk4.active = true;
                active_perks.goldbeak.perk4.btn_id = btn_id;
                deactivate_button(btn_id);
            }
        }
    }
}

function on_load(active_perks_key_list) {
    let perks_ = Object.keys(active_perks_key_list);
    console.log(perks_);
    perks_.forEach(key => {
        if(key.indexOf('apply_') === -1) {
            if(active_perks_key_list[key].active && active_perks_key_list[key].btn_id != null) {
                deactivate_button(active_perks_key_list[key].btn_id);
            }
        }
    });
}

function is_function(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
   }

function purchase_perk(hero_code, perk_code, id) {
    heroes[hero_code][perk_code](id);
    update_ilarun_pop_demographic();
    update_tier1_res_max();
    update_tier1_res_rate();
    if((hero_code == "cilia" || hero_code == "goldbeak") && active_perks.goldbeak.perk4.active)
        active_perks.goldbeak.apply_perk4();
    if(perk_code == "on_hire")
        affinity_check();
}

function affinity_check() {
    if(affinities.virtue >= 2) {
        if(active_perks.cilia.perk4_1.active != true) {
            active_perks.cilia.perk4_1.active = true;
            active_perks.cilia.apply_perk4_1();
        }
    }
}

function deactivate_button(btn_id) {
    if(document.getElementById(btn_id).disabled == false) {
        document.getElementById(btn_id).disabled = true;
        document.getElementById(btn_id).innerHTML += "<br>(Purchased)";
        document.getElementById(btn_id).className = "hero_button_disabled";
    }
}

function update_save_heroes() {
    store("affinities", affinities, true);

    store("cilia.hired", active_perks.cilia.hired, true);
    store("cilia.perk1", active_perks.cilia.perk1, true);
    store("cilia.perk2", active_perks.cilia.perk2, true);
    store("cilia.perk3", active_perks.cilia.perk3, true);
    store("cilia.perk4", active_perks.cilia.perk4, true);
    store("cilia.perk4_1", active_perks.cilia.perk4_1, true);

    store("goldbeak.hired", active_perks.goldbeak.hired, true);
    store("goldbeak.perk1", active_perks.goldbeak.perk1, true);
    store("goldbeak.perk2", active_perks.goldbeak.perk2, true);
    store("goldbeak.perk3", active_perks.goldbeak.perk3, true);
    store("goldbeak.perk4", active_perks.goldbeak.perk4, true);
}