// LocalStorage function
function fetch(key, isJSON = false) {
    if(!isJSON)
        return Number(window.localStorage.getItem(key));
    else
        return JSON.parse(window.localStorage.getItem(key));
}

function store(key, item, isJSON = false) {
    if(!isJSON)
        window.localStorage.setItem(key, item);
    else
        window.localStorage.setItem(key, JSON.stringify(item));
}

// Resource Variables
function init_resource(name, cur, max, act_rate, pas_rate = 0) {
    return {
        cur: fetch(name+".cur") || cur,
        max: fetch(name+".max") || max,
        act_rate: fetch(name+".act_rate") || act_rate,
        pas_rate: fetch(name+".pas_rate") || pas_rate,
        bonuses: fetch(name+".bonuses", true) || {
            max: 0,
            act_rate: 0,
            pas_rate: 0,
        },
    }
}

function save_resource(name, res) {
    store(name+".cur", res.cur);
    store(name+".max", res.max);
    store(name+".act_rate", res.act_rate);
    store(name+".pas_rate", res.pas_rate);
    store(name+".bonuses", res.bonuses, true);
}

const resource_defs = [
    {name: 'berry', cur: 0, max: 10, act_rate: 1, pas_rate: 0},
    {name: 'log', cur: 0, max: 10, act_rate: 1, pas_rate: 0},
    {name: 'wooden_weaponry', cur: 0, max: 10, act_rate: 0, pas_rate: 0},
    {name: 'ilarun', cur: 0, max: 0, act_rate: 1, pas_rate: 0},
    {name: 'influence', cur: 0, max: -1, act_rate: 0, pas_rate: 0},
    {name: 'ash_pottery', cur: 0, max: 10, act_rate: 0, pas_rate: 0},
    {name: 'berry_cider', cur: 0, max: 10, act_rate: 0, pas_rate: 0},
    {name: 'ash_elf', cur: 0, max: 0, act_rate: 0, pas_rate: 0},
];

var res_all = {};
resource_defs.forEach(def => {
    window[def.name] = init_resource(def.name, def.cur, def.max, def.act_rate, def.pas_rate);
    res_all[def.name] = window[def.name];
});

// Pop Related
function res_arr({berry = 0, log = 0, wooden_weaponry = 0, ilarun = 0, influence = 0, ash_pottery = 0, berry_cider = 0, ash_elf = 0} = {}) {
    return {berry, log, wooden_weaponry, ilarun, influence, ash_pottery, berry_cider, ash_elf};
}

function init_pop(name, count, upkeep, cost, income) {
    return {
        count: fetch(name+".count") || count,
        upkeep: fetch(name+".upkeep", true) || upkeep,
        cost: fetch(name+".cost", true) || cost,
        income: fetch(name+".income", true) || income,
        bonuses: fetch(name+".bonuses", true) || {
            upkeep: res_arr(),
            cost: res_arr(),
            income: res_arr(),
            size: res_arr(),
        }
    };
}

function save_pop(name, pop) {
    store(name+".count", pop.count);
    store(name+".upkeep", pop.upkeep, true);
    store(name+".cost", pop.cost, true);
    store(name+".income", pop.income, true);
    store(name+".bonuses", pop.bonuses, true);
}

var worker_max = 0;
var baroness_max = 0;
var squire_max = 0;
var lady_of_fief_max = 0;

var elf_worker_max = 0;
var ashen_maiden_max = 0;

const BASE_WORKER_PERC = 0.4;
var worker_perc_bonus = fetch("worker_perc_bonus") || 0;

const BASE_ELF_WORKER_PERC = 0.5
var elf_worker_perc_bonus = fetch("elf_worker_perc_bonus") || 0;

const BASE_BARONESS_RATIO = 10;
var baroness_ratio_bonus = fetch("baroness_ratio_bonus") || 0;

const BASE_LADY_OF_FIEF_RATIO = 50;
var lady_of_fief_ratio_bonus = fetch("lady_of_fief_ratio_bonus") || 0;

const BASE_ASHEN_MAIDEN_RATIO = 12;
var ashen_maiden_ratio_bonus = fetch("ashen_maiden_ratio_bonus") || 0;

var squire_max = 0;

const pop_defs = [
    {name: "idle", count: 0, upkeep: {berry: 0.1}, cost: {berry: 100}, income: {ilarun: 0.01}},
    {name: "elf_idle", count: 0, upkeep: {berry: 0.2, log: 0.1}, cost: {berry: 100, log: 100}, income: {ash_elf: 0.002}},
    {name: "forager", count: 0, upkeep: {berry: 0.25}, cost: {berry: 100}, income: {berry: 1}},
    {name: "logger", count: 0, upkeep: {berry: 0.25}, cost: {log: 100}, income: {log: 1}},
    {name: "woodcrafter", count: 0, upkeep: {berry: 0.25, log: 1}, cost: {berry: 50, log: 50}, income: {wooden_weaponry: 0.5}},
    {name: "ashcrafter", count: 0, upkeep: {berry: 0.4, log: 0.2}, cost: {log: 200}, income: {ash_pottery: 0.5}},
    {name: "berrybrewer", count: 0, upkeep: {berry: 0.6}, cost: {berry: 200}, income: {berry_cider: 0.5}},
    {name: "baroness", count: 0, upkeep: {berry: 1}, cost: {berry: 250, log: 100}, income: {influence: 0.1}},
    {name: "lady_of_fief", count: 0, upkeep: {berry: 5, log: 2.5, berry_cider: 1, ash_pottery: 1}, cost: {berry: 1000, log: 500, berry_cider: 50, ash_pottery: 50}, income: {influence: 2}},
    {name: "ashen_maiden", count: 0, upkeep: {berry: 1, log: 1, berry_cider: 0.2, ash_pottery: 0.2}, cost: {berry: 100, log: 250, berry_cider: 10, ash_pottery: 10}, income:  {influence: 0.4}},
    {name: "squire", count: 0, upkeep: {influence: 0.1}, cost: {influence: 10}, income: {}},
];

var pop_all = {};
pop_defs.forEach(def => {
    window[def.name] = init_pop(
        def.name,
        def.count,
        res_arr(def.upkeep),
        res_arr(def.cost),
        res_arr(def.income)
    );
    pop_all[def.name] = window[def.name];
});

// Building Related
function init_building(name, count, cost, cost_coefficient, size, income, upkeep) {
    return {
        count: fetch(name+".count") || count,
        cost: fetch(name+".cost", true) || cost,
        cost_coefficient: fetch(name+".cost_coefficient", true) || cost_coefficient,
        size: fetch(name+".size", true) || size,
        bonuses: fetch(name+".bonuses", true) || {
            cost: res_arr(),
            size: res_arr(),
        },
        income: fetch(name+".income", true) || income,
        upkeep: fetch(name+".upkeep", true) || upkeep,
    }
}

function save_building(name, b) {
    store(name+".count", b.count);
    store(name+".cost", b.cost, true);
    store(name+".cost_coefficient", b.cost_coefficient, true);
    store(name+".size", b.size, true);
    store(name+".bonuses", b.bonuses, true);
    store(name+".income", b.income, true);
    store(name+".upkeep", b.upkeep, true);
}

const building_defs = [
    {name: "berry_basket", count: 0, cost: {log: 10}, cost_coefficient: {log: 1.05}, size: {berry: 15}},
    {name: "log_stack", count: 0, cost: {berry: 10}, cost_coefficient: {berry: 1.05}, size: {log: 15}},
    {name: "warren", count: 0, cost: {log: 50}, cost_coefficient: {log: 1.2}, size: {ilarun: 4}},
    {name: "granary", count: 0, cost: {log: 75}, cost_coefficient: {log: 1.07}, size: {berry: 100}},
    {name: "weapon_rack", count: 0, cost: {log: 25}, cost_coefficient: {log: 1.07}, size: {wooden_weaponry: 5}},
    {name: "lumber_yard", count: 0, cost: {berry: 75}, cost_coefficient: {berry: 1.07}, size: {log: 100}},
    {name: "hamlet", count: 0, cost: {berry: 125, log: 125}, cost_coefficient: {berry: 1.25, log: 1.25}, size: {ilarun: 15}},
    {name: "cellar", count: 0, cost: {ash_pottery: 10}, cost_coefficient: {ash_pottery: 1.07}, size: {berry_cider: 20}},
    {name: "ash_market", count: 0, cost: {berry_cider: 10}, cost_coefficient: {berry_cider: 1.07}, size: {ash_pottery: 20}},
    {name: "ashen_abode", count: 1, cost: {log: 25, ash_pottery: 5}, cost_coefficient: {log: 1.05, ash_pottery: 1.05}, size: {ash_elf: 4}},
];

const building_base_cost_defs = [
    {name: "berry_basket", cost: {log: 10}},
    {name: "log_stack", cost: {berry: 10}},
    {name: "weapon_rack", cost: {log: 25}},
    {name: "warren", cost: {log: 50}},
    {name: "granary", cost: {log: 75}},
    {name: "lumber_yard", cost: {berry: 75}},
    {name: "hamlet", cost: {berry: 125, log: 125}},
    {name: "cellar", cost: {ash_pottery: 10}},
    {name: "ash_market", cost: {berry_cider: 10}},
    {name: "ashen_abode", cost: {log: 25, ash_pottery: 5}},
];

var buildings_all = {};
building_defs.forEach(def => {
    window[def.name] = init_building(
        def.name,
        def.count,
        res_arr(def.cost),
        res_arr(def.cost_coefficient),
        res_arr(def.size),
        res_arr(def.income || {}),
        res_arr(def.upkeep || {})
    );
    buildings_all[def.name] = window[def.name];
});


// Unlocks
var ui_update_flag = true;

var unlockable_el = {
    berry_harvest: [document.getElementById("berry_add")],
    log_harvest: [document.getElementById("building_action_bar"), document.getElementById("log_harvest"), document.getElementById("log_add"), document.getElementById("berry_storage_add"), document.getElementById("log_storage_add")],
    tier1_2_storage: [document.getElementById("log_storage_2_add"), document.getElementById("berry_storage_2_add"), document.getElementById("tier1_2_storage")],
    ilarun_recruit: [document.getElementById("ilarun_add"), document.getElementById("ilarun_storage_add"), document.getElementById("ilarun_recruit"), document.getElementById("berry_worker_add"), document.getElementById("log_worker_add"), document.getElementById("berry_worker_remove"), document.getElementById("log_worker_remove"), document.getElementById("ilarun_action_bar")],
    baroness_tech: [document.getElementById("baroness_tech"), document.getElementById("baroness_add"), document.getElementById("heroTab")],
    hamlet: [document.getElementById("ilarun_storage_2_add")],
    conquest: [document.getElementById("wooden_weaponry_storage_add"), document.getElementById("wooden_weaponry_worker_add"), document.getElementById("wooden_weaponry_worker_remove")],
    techtree: [document.getElementById("techTreeTab")],
    ash_elf: [document.getElementById("ash_elf"), document.getElementById("ash_elf_storage_add"), document.getElementById("berry_cider_storage_add"), document.getElementById("ash_pottery_storage_add"), document.getElementById("ash_elf_add"), document.getElementById("ash_elf_action_bar")],
}

var unlocks = fetch("unlocks", true) || {
    berry_harvest: true,
    log_harvest: false,
    tier1_2_storage: false,
    ilarun_recruit: false,
    baroness_tech: false,
    hamlet: false,
    conquest: false,
    techtree: false,
    ash_elf: false,
}

function update_save() {
    console.log("Game Saved");

    // Save all resources
    for (const [name, res] of Object.entries(res_all)) {
        save_resource(name, res);
    }

    // Save all populations
    for (const [name, pop] of Object.entries(pop_all)) {
        save_pop(name, pop);
    }

    // Save all buildings
    for (const [name, building] of Object.entries(buildings_all)) {
        save_building(name, building);
    }

    // Save scalar variables
    store("worker_perc_bonus", worker_perc_bonus);
    store("baroness_ratio_bonus", baroness_ratio_bonus);
    store("elf_worker_perc_bonus", elf_worker_perc_bonus);
    store("ashen_maiden_ratio_bonus", ashen_maiden_ratio_bonus);
    store("lady_of_fief_ratio_bonus", lady_of_fief_ratio_bonus);

    // Save unlocks
    store("unlocks", unlocks, true);
    store("bar_unlocked", bar_unlocked, true);

    // Save other systems
    update_save_heroes();
    update_save_military();
    update_save_tech();
}

function update_unlocks_data() {
    let master_keys = Object.keys({
        berry_harvest: true,
        log_harvest: false,
        tier1_2_storage: false,
        ilarun_recruit: false,
        baroness_tech: false,
        hamlet: false,
        conquest: false,
        techtree: false,
        ash_elf: false,
    });
    master_keys.forEach(key => {
        if(unlocks[key] == null) {
            unlocks[key] = false;
        }
    });
}