const tech_definitions = {
    col1: [
        { code: "tech11", cost: {berry: 50, log: 50}, pop_cost: {}, effect: function() {
            berry.cur -= 50; log.cur -= 50
            berry.bonuses.act_rate += 1; log.bonuses.act_rate += 1
        }},
        { code: "tech21", cost: {ilarun: 100}, pop_cost: {}, effect: function() {
            logger.bonuses.size.log += 10; forager.bonuses.size.berry += 10
        }},
        { code: "tech31", cost: {berry: 300, log: 300}, pop_cost: {}, effect: function() {
            berry.cur -= 300; log.cur -= 300
            berry_basket.income.berry += 0.1; log_stack.income.log += 0.1
        }},
        { code: "tech41", cost: {berry: 1000, log: 1000}, pop_cost: {}, effect: function() {
            berry.cur -= 1000; log.cur -= 1000
            granary.income.berry += 0.5; lumber_yard.income.log =+ 0.5
        }},
        { code: "tech51", cost: {berry: 300, log: 300}, pop_cost: {baroness: 1}, effect: function() {
            berry.cur -= 300; log.cur -= 300
            influence.bonuses.pas_rate += 1
        }},
        // ... add other techs for col1 here
    ],
    // col2: [...], // Add more columns as needed
}

function init_active_techs(tech_definitions) {
    const active_techs = {}
    Object.values(tech_definitions).forEach(col => {
        col.forEach(tech => {
            active_techs[tech.code] = fetch(tech.code, true) || {active: false, btn_id: null, exclusive: false}
        })
    })
    return active_techs
}

const active_techs_col1 = init_active_techs({col1: tech_definitions.col1}) // For column 1
// const active_techs_col2 = init_active_techs({col2: tech_definitions.col2}) // For column 2, etc.

function get_tech_cost(tech_code, is_pop = false) {
    for (const col in tech_definitions) {
        const found = tech_definitions[col].find(t => t.code === tech_code)
        if (found && !is_pop) return found.cost
        else return found.pop_cost
    }
    return null
}

function run_tech_effect(tech_code) {
    for (const col in tech_definitions) {
        const found = tech_definitions[col].find(t => t.code === tech_code)
        if (found) {
            found.effect()
            return true
        }
    }
    return false
}

function deactivate_button_tech(btn_id, exclusive=false) {
    if(document.getElementById(btn_id).disabled == false) {
        document.getElementById(btn_id).disabled = true
        if(exclusive) {
            document.getElementById(btn_id).innerHTML += "<br>(Locked Out)"
            document.getElementById(btn_id).className = "tech_button_locked"
        }
        else {
            document.getElementById(btn_id).innerHTML += "<br>(Purchased)"
            document.getElementById(btn_id).className = "tech_button_disabled"
        }
    }
}

function purchase_tech(tech_code, btn_id) {
    const cost = get_tech_cost(tech_code)
    if (!cost) return

    const pop_cost = get_tech_cost(tech_code, true)
    if (!pop_cost) return

    // Check if player can afford
    let can_afford = Object.keys(cost).every(res => (window[res]?.cur ?? 0) >= cost[res])
    if (!can_afford) return

    let can_afford_pop = Object.keys(cost).every(res => (window[res]?.cur ?? 0) >= cost[res])
    if (!can_afford_pop) return

    // Apply effect
    if (run_tech_effect(tech_code)) {
        // Mark as active
        active_techs_col1[tech_code].active = true
        active_techs_col1[tech_code].btn_id = btn_id
        deactivate_button_tech(btn_id)
        update_buttons()
        update_tier1_res_max()
        update_tier1_res_rate()
    }
}

function update_save_tech() {
    Object.keys(active_techs_col1).forEach(code => {
        store(code, active_techs_col1[code], true)
    })
    // Repeat for other columns if needed
}

function on_load_tech(active_techs_key_list) {
    Object.keys(active_techs_key_list).forEach(key => {
        if (!key.startsWith('apply_')) {
            if (active_techs_key_list[key].active && active_techs_key_list[key].btn_id != null) {
                deactivate_button_tech(active_techs_key_list[key].btn_id)
            }
        }
    })
}