var affinities = {
    virtue: 0,
    nobility: 0,
};

var active_perks = {
    cilia: {
        hired: false,
        perk1: false,
        perk2: false,
        perk3: false,
        perk4: false,
        perk4_1: false,
        apply_perk4_1: function() {
            tier1_pop_bonuses.baroness.max -= 1;
        }
    },
    goldbeak: {
        hired: false,
        perk1: false,
        perk2: false,
        perk3: false,
        perk4: false,
    }
}

var heroes = {
    cilia: {
        on_hire: function(btn_id) {
            if(tier1_res.influence.cur >= 100) {
                tier1_res.influence.cur -= 100;
                tier1_res_bonuses.influence.pas_rate += 0.5;
                tier1_buildings_bonuses.ilarunWarren.size.ilarun += 1;
                active_perks.cilia.hired = true;
                document.getElementById(btn_id).disabled = true;
                document.getElementById(btn_id).innerHTML += "(Purchased)";
                affinities.virtue += 1;
                affinities.nobility += 1;
            }
        },
        perk1: function(btn_id) {
            if(tier1_res.influence.cur >= 250) {
                tier1_res.influence.cur -= 250;
                tier1_buildings_bonuses.ilarunWarren.size.ilarun += 2;
                active_perks.cilia.perk1 = true;
                document.getElementById(btn_id).disabled = true;
                document.getElementById(btn_id).innerHTML += "(Purchased)";
            }
        },
        perk2: function(btn_id) {
            if(tier1_res.influence.cur >= 500) {
                tier1_res.influence.cur -= 500;
                tier1_pop_bonuses.baroness.income += 0.1;
                active_perks.cilia.perk2 = true;
                document.getElementById(btn_id).disabled = true;
                document.getElementById(btn_id).innerHTML += "(Purchased)";
            }
        },
        perk3: function(btn_id) {
            if(tier1_res.influence.cur >= 1000) {
                tier1_res.influence.cur -= 1000;
                tier1_pop_bonuses.idle.upkeep -= 0.05;
                tier1_pop_bonuses.worker.upkeep -= 0.05;
                active_perks.cilia.perk3 = true;
                document.getElementById(btn_id).disabled = true;
                document.getElementById(btn_id).innerHTML += "(Purchased)";
            }
        },
        perk4: function(btn_id) {
            if(tier1_res.influence.cur >= 2500) {
                tier1_res.influence.cur -= 2500;
                active_perks.cilia.perk4 = true;
                if(affinities.virtue >= 2) {
                    active_perks.cilia.perk4_1 = true;
                    active_perks.cilia.apply_perk4_1();
                }
                document.getElementById(btn_id).disabled = true;
                document.getElementById(btn_id).innerHTML += "(Purchased)";
            }
        }
    }
}

//TODO implement hero upgrades
function purchase_perk(hero_code, perk_code, id) {
    heroes[hero_code][perk_code](id);
    update_ilarun_pop_demographic();
    update_tier1_demographic_ui();
    update_tier1_res_max();
    update_tier1_res_rate();
    if(perk_code == "on_hire")
        affinity_check();
}

function affinity_check() {
    if(affinities.virtue >= 2) {
        if(active_perks.cilia.perk4_1 != true) {
            active_perks.cilia.perk4_1 = true;
            active_perks.cilia.apply_perk4_1();
        }
    }
}