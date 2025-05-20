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

var berry = init_resource('berry', 0, 10, 1, 0);
var log = init_resource('log', 0, 10, 1, 0);
var ilarun = init_resource('ilarun', 0, 0, 1, 0);
var influence = init_resource('influence', 0, -1, 0, 0);

var res_all = {
    berry: berry,
    log: log,
    ilarun: ilarun,
    influence: influence,
}

// Pop Related
function res_arr({berry = 0, log = 0, ilarun = 0, influence = 0} = {}) {
    return {berry, log, ilarun, influence};
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

const BASE_WORKER_PERC = 0.4;
var worker_perc_bonus = fetch("worker_perc_bonus") || 0;

const BASE_BARONESS_RATIO = 10;
var baroness_ratio_bonus = fetch("baroness_ratio_bonus") || 0;

var squire_max = 0;

var idle = init_pop("idle", 0, res_arr({berry: 0.1}), res_arr({berry: 100}), res_arr({ilarun: 0.01}));
var forager = init_pop("forager", 0, res_arr({berry: 0.25}), res_arr({berry: 100}), res_arr({berry: 1}));
var logger = init_pop("logger", 0, res_arr({berry: 0.25}), res_arr({log: 100}), res_arr({log: 1}));
var baroness = init_pop("baroness", 0, res_arr({berry: 1}), res_arr({berry: 250, log: 100}), res_arr({influence: 0.1}));
var squire = init_pop("squire", 0, res_arr({influence: 0.1}), res_arr({influence: 10}), res_arr())

var pop_all = {
    idle: idle,
    forager: forager,
    logger: logger,
    baroness: baroness,
    squire: squire,
}

// Building Related
const BUILDING_COST_MOD = 1.1;
function init_building(name, count, cost, size, income, upkeep) {
    return {
        count: fetch(name+".count") || count,
        cost: fetch(name+".cost", true) || cost,
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
    store(name+".size", b.size, true);
    store(name+".bonuses", b.bonuses, true);
    store(name+".income", b.income, true);
    store(name+".upkeep", b.upkeep, true);
}

var berry_basket = init_building("berry_basket", 0, res_arr({log: 10}), res_arr({berry: 15}), res_arr(), res_arr());
var log_stack = init_building("log_stack", 0, res_arr({berry: 10}), res_arr({log: 15}), res_arr(), res_arr());
var warren = init_building("warren", 0, res_arr({log: 50}), res_arr({ilarun: 5}), res_arr(), res_arr());
var granary = init_building("granary", 0, res_arr({log: 75}), res_arr({berry: 100}), res_arr(), res_arr());
var lumber_yard = init_building("lumber_yard", 0, res_arr({berry: 75}), res_arr({log: 100}), res_arr(), res_arr());
var hamlet = init_building("hamlet", 0, res_arr({berry: 125, log: 125}), res_arr({ilarun: 25}), res_arr(), res_arr());

var buildings_all = {
    berry_basket: berry_basket,
    log_stack: log_stack,
    warren: warren,
    granary: granary,
    lumber_yard: lumber_yard,
    hamlet: hamlet,
}

// Unlocks
var ui_update_flag = true;

var unlockable_el = {
    berry_harvest: [document.getElementById("berry_add"), document.getElementById("berry_res_display")],
    log_harvest: [document.getElementById("building_action_bar"), document.getElementById("log_harvest"), document.getElementById("log_add"), document.getElementById("log_res_display"), document.getElementById("berry_storage_add"), document.getElementById("log_storage_add"), document.getElementById("berry_sub2")],
    tier1_2_storage: [document.getElementById("log_storage_2_add"), document.getElementById("berry_storage_2_add"), document.getElementById("tier1_2_storage"), document.getElementById("berry_sub2_1"), document.getElementById("log_sub2_1")],
    ilarun_recruit: [document.getElementById("ilarun_add"), document.getElementById("ilarun_storage_add"), document.getElementById("ilarun_recruit"), document.getElementById("berry_worker_add"), document.getElementById("log_worker_add"), document.getElementById("berry_worker_remove"), document.getElementById("log_worker_remove"), document.getElementById("ilarun_action_bar"), document.getElementById("ilarun_res_display")],
    baroness_tech: [document.getElementById("baroness_tech"), document.getElementById("baroness_add"), document.getElementById("influence_res_display"), document.getElementById("heroTab")],
    hamlet: [document.getElementById("ilarun_storage_2_add"), document.getElementById("ilarun_sub4_1")],
    conquest: [document.getElementById("conquestTab"), document.getElementById("military_res_display")],
    techtree: [document.getElementById("techTreeTab")]
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
}

function update_save() {
    console.log("Game Saved");
    save_resource("berry", berry);
    save_resource("log", log);
    save_resource("ilarun", ilarun);
    save_resource("influence", influence);

    save_pop("idle", idle);
    save_pop("forager", forager);
    save_pop("logger", logger);
    save_pop("baroness", baroness);
    save_pop("squire", squire);
    store("worker_perc_bonus", worker_perc_bonus);
    store("baroness_ratio_bonus", baroness_ratio_bonus);

    save_building("berry_basket", berry_basket);
    save_building("log_stack", log_stack);
    save_building("warren", warren);
    save_building("granary", granary);
    save_building("lumber_yard", lumber_yard);
    save_building("hamlet", hamlet);

    store("unlocks", unlocks, true);

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
    });
    master_keys.forEach(key => {
        if(unlocks[key] == null) {
            unlocks[key] = false;
        }
    });
}