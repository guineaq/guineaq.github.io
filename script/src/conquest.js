var military = init_resource('military', 0, -1, 0, 0);
var military_income = {
    squire: 1,
}

var territory_count = fetch("territory.count") || 0;
var territories = {
    morhaven: {
        el: document.getElementById("t0_progress"),
        button_el: document.getElementById("target_t0"),
        progress: fetch("t0.progress") || 0,
        required: 100000,
        on_conquer: function() {
            forager.bonuses.income.berry += 1;
            logger.bonuses.income.log += 1;
            berry_basket.bonuses.size.berry += 15;
            log_stack.bonuses.size.log += 15;
            territory_count += 1;
            update_tier1_res_max();
        }
    }
}
var conquest_target = null;

var military_income_bonuses = fetch("military_income_bonuses", true) || {
    squire: 0,
}
var goldbeak_perk4_bonus = 0;

function get_military_income_total() {
    let sum = 0;
    sum += squire.count * (military_income.squire + military_income_bonuses.squire) // Squires
    return sum;
}

function set_conquest_target(id, target) {
    el = document.getElementById(id)
    let suffix = " (Targetted)"
    
    if(conquest_target == null) {
        conquest_target = target;
        el.innerHTML += suffix
    } else if(conquest_target == target) {
        conquest_target = null;
        el.innerHTML = el.innerHTML.slice(0, -suffix.length);
    }
}

function update_military() {
    let tlist = Object.keys(territories);
    tlist.forEach(t => {
        if(t == conquest_target) {
            if(territories[t].progress + military.pas_rate < territories[t].required) {
                territories[t].progress += military.pas_rate;
            } else {
                territories[t].progress = territories[t].required;
                territories[t].on_conquer();
                conquest_target = null;
            }
        }
    })
    update_military_ui();
}

function update_military_ui() {
    let tlist = Object.keys(territories);
    tlist.forEach(t => {
        if(territories[t].progress < territories[t].required) {
            territories[t].el.style.width = (territories[t].progress / territories[t].required) * 100 + "%";
            territories[t].el.innerHTML = territories[t].progress + "/" + territories[t].required
        } else {
            territories[t].el.style.width = (territories[t].progress / territories[t].required) * 100 + "%";
            territories[t].el.innerHTML = "Conquered!"
            territories[t].button_el.disabled = true; territories[t].button_el.className = "disabled_conquer_button"
        }
    })
}

function update_save_military() {
    save_resource("military", military);

    store("military_income_bonuses", military_income_bonuses, true);
    store("territory.count", territory_count);

    let t = Object.keys(territories);
    let i = 0;
    t.forEach(territory => {
        store("t"+i+".progress", territories[territory].progress);
    });
}