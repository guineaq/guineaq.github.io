var active_techs_col1 = {
    tech11: fetch("tech11", true) || {active: false, btn_id: null, exclusive: false},
    tech21: fetch("tech21", true) || {active: false, btn_id: null, exclusive: false},
    tech31: fetch("tech31", true) || {active: false, btn_id: null, exclusive: false},
    tech51: fetch("tech51", true) || {active: false, btn_id: null, exclusive: false},
    tech61: fetch("tech61", true) || {active: false, btn_id: null, exclusive: false},
    tech71: fetch("tech71", true) || {active: false, btn_id: null, exclusive: false},
    tech41: fetch("tech41", true) || {active: false, btn_id: null, exclusive: false},
    tech81: fetch("tech81", true) || {active: false, btn_id: null, exclusive: false},
    tech91: fetch("tech91", true) || {active: false, btn_id: null, exclusive: false},
    tech01: fetch("tech01", true) || {active: false, btn_id: null, exclusive: false},
}

const tech_cost_col1 = {
    tech11: {berry: 50, log: 50},
    tech21: {ilarun: 100},
    tech31: {berry: 300, log: 300},
}

const techs = {
    // Improved Collection
    tech11: function(btn_id) {
        if(berry.cur >= tech_cost_col1.tech11.berry && log.cur >= tech_cost_col1.tech11.log) {
            berry.cur -= tech_cost_col1.tech11.berry;
            log.cur -= tech_cost_col1.tech11.log;
            berry.bonuses.act_rate += 1;
            log.bonuses.act_rate += 1;
            active_techs_col1.tech11.active = true;
            active_techs_col1.tech11.btn_id = btn_id;
            deactivate_button_tech(btn_id);
        }
    },
    // Wintermark Efficiency
    tech21: function(btn_id) {
        if(ilarun.cur >= tech_cost_col1.tech21.ilarun) {
            logger.bonuses.size.log += 10;
            forager.bonuses.size.berry += 10;
            active_techs_col1.tech21.active = true;
            active_techs_col1.tech21.btn_id = btn_id;
            deactivate_button_tech(btn_id);
        }
    },
    // Extra Bits
    tech31: function(btn_id) {
        if(berry.cur >= tech_cost_col1.tech31.berry && log.cur >= tech_cost_col1.tech31.log) {
            berry.cur -= tech_cost_col1.tech31.berry;
            log.cur -= tech_cost_col1.tech31.log;
            berry_basket.income.berry += 0.1;
            log_stack.income.log += 0.1;
            active_techs_col1.tech31.active = true;
            active_techs_col1.tech31.btn_id = btn_id;
            deactivate_button_tech(btn_id);
        }
    },
}

function purchase_tech(tech_code, id) {
    techs[tech_code](id);
    update_buttons();
    update_tier1_res_max();
    update_tier1_res_rate();
}

function deactivate_button_tech(btn_id, exclusive=false) {
    if(document.getElementById(btn_id).disabled == false) {
        document.getElementById(btn_id).disabled = true;
        if(exclusive) {
            document.getElementById(btn_id).innerHTML += "<br>(Locked Out)";
            document.getElementById(btn_id).className = "tech_button_locked";
        }
        else {
            document.getElementById(btn_id).innerHTML += "<br>(Purchased)";
            document.getElementById(btn_id).className = "tech_button_disabled";
        }
    }
}

function on_load_tech(active_techs_key_list) {
    let techs_ = Object.keys(active_techs_key_list);
    console.log(techs_);
    techs_.forEach(key => {
        if(key.indexOf('apply_') === -1) {
            if(active_techs_key_list[key].active && active_techs_key_list[key].btn_id != null) {
                deactivate_button_tech(active_techs_key_list[key].btn_id);
            }
        }
    });
}

function update_save_tech() {
    store("tech11", active_techs_col1.tech11, true);
    store("tech21", active_techs_col1.tech21, true);
    store("tech31", active_techs_col1.tech31, true);
    store("tech41", active_techs_col1.tech41, true);
    store("tech51", active_techs_col1.tech51, true);
    store("tech61", active_techs_col1.tech61, true);
    store("tech71", active_techs_col1.tech71, true);
    store("tech81", active_techs_col1.tech81, true);
    store("tech91", active_techs_col1.tech91, true);
    store("tech01", active_techs_col1.tech01, true);
}