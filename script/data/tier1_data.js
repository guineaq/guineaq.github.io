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
var ash_pottery = init_resource('ash_pottery', 0, 10, 0, 0);
var berry_cider = init_resource('berry_cider', 0, 10, 0, 0);
var ash_elf = init_resource('ash_elf', 0, 0, 0, 0);

var res_all = {
    berry: berry,
    log: log,
    ilarun: ilarun,
    influence: influence,
    ash_pottery: ash_pottery,
    berry_cider: berry_cider,
    ash_elf: ash_elf,
}

// Pop Related
function res_arr({berry = 0, log = 0, ilarun = 0, influence = 0, ash_pottery = 0, berry_cider = 0, ash_elf = 0} = {}) {
    return {berry, log, ilarun, influence, ash_pottery, berry_cider, ash_elf};
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

var idle = init_pop("idle", 0, res_arr({berry: 0.1}), res_arr({berry: 100}), res_arr({ilarun: 0.01}));
var elf_idle = init_pop("elf_idle", 0, res_arr({berry: 0.2, log: 0.1}), res_arr({berry: 100, log: 100}), res_arr({ash_elf: 0.002}));
var forager = init_pop("forager", 0, res_arr({berry: 0.25}), res_arr({berry: 100}), res_arr({berry: 1}));
var logger = init_pop("logger", 0, res_arr({berry: 0.25}), res_arr({log: 100}), res_arr({log: 1}));
var ashcrafter = init_pop("ashcrafter", 0, res_arr({berry: 0.4, log: 0.2}), res_arr({log: 200}), res_arr({ash_pottery: 0.5}));
var berrybrewer = init_pop("berrybrewer", 0, res_arr({berry: 0.6}), res_arr({berry: 200}), res_arr({berry_cider: 0.5}));
var baroness = init_pop("baroness", 0, res_arr({berry: 1}), res_arr({berry: 250, log: 100}), res_arr({influence: 0.1}));
var lady_of_fief = init_pop("lady_of_fief", 0, res_arr({berry: 5, log: 2.5, berry_cider: 1, ash_pottery: 1}), res_arr({berry: 1000, log: 500, berry_cider: 50, ash_pottery: 50}), res_arr({influence: 2}));
var ashen_maiden = init_pop("ashen_maiden", 0, res_arr({berry: 1, log: 1, berry_cider: 0.2, ash_pottery: 0.2}), res_arr({berry: 100, log: 250, berry_cider: 10, ash_pottery: 10}), res_arr({influence: 0.4}))
var squire = init_pop("squire", 0, res_arr({influence: 0.1}), res_arr({influence: 10}), res_arr());

var pop_all = {
    idle: idle,
    elf_idle: elf_idle,
    forager: forager,
    logger: logger,
    baroness: baroness,
    squire: squire,
    ashcrafter: ashcrafter,
    berrybrewer: berrybrewer,
    ashen_maiden: ashen_maiden,
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
var cellar = init_building("cellar", 0, res_arr({ash_pottery: 10}), res_arr({berry_cider: 20}), res_arr(), res_arr());
var ash_market = init_building("ash_market", 0, res_arr({berry_cider: 10}), res_arr({ash_pottery: 20}), res_arr(), res_arr());
var ashen_abode = init_building("ashen_abode", 1, res_arr({log: 25, ash_pottery: 5}), res_arr({ash_elf: 4}), res_arr(), res_arr());

var buildings_all = {
    berry_basket: berry_basket,
    log_stack: log_stack,
    warren: warren,
    granary: granary,
    lumber_yard: lumber_yard,
    hamlet: hamlet,
    cellar: cellar,
    ash_market: ash_market,
    ashen_abode: ashen_abode,
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
    techtree: [document.getElementById("techTreeTab")],
    ash_elf: [document.getElementById("ash_elf"), document.getElementById("ash_elf_res_display"), document.getElementById("berry_cider_res_display"), document.getElementById("ash_pottery_res_display"), document.getElementById("ash_elf_storage_add"), document.getElementById("berry_cider_storage_add"), document.getElementById("ash_pottery_storage_add"), document.getElementById("ash_elf_add"), document.getElementById("ash_elf_action_bar")],
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
    save_resource("berry", berry);
    save_resource("log", log);
    save_resource("ilarun", ilarun);
    save_resource("influence", influence);
    save_resource("ash_pottery", ash_pottery);
    save_resource("berry_cider", berry_cider);
    save_resource("ash_elf", ash_elf);

    save_pop("idle", idle);
    save_pop("forager", forager);
    save_pop("logger", logger);
    save_pop("baroness", baroness);
    save_pop("squire", squire);
    save_pop("lady_of_fief", lady_of_fief);

    save_pop("elf_idle", elf_idle);
    save_pop("ashcrafter", ashcrafter);
    save_pop("berrybrewer", berrybrewer);
    save_pop("ashen_maiden", ashen_maiden);
    
    store("worker_perc_bonus", worker_perc_bonus);
    store("baroness_ratio_bonus", baroness_ratio_bonus);
    store("elf_worker_perc_bonus", elf_worker_perc_bonus);
    store("ashen_maiden_ratio_bonus", ashen_maiden_ratio_bonus);
    store("lady_of_fief_ratio_bonus", lady_of_fief_ratio_bonus);

    save_building("berry_basket", berry_basket);
    save_building("log_stack", log_stack);
    save_building("warren", warren);
    save_building("granary", granary);
    save_building("lumber_yard", lumber_yard);
    save_building("hamlet", hamlet);
    save_building("cellar", cellar);
    save_building("ash_market", ash_market);
    save_building("ashen_abode", ashen_abode);

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
        techtree: false,
        ash_elf: false,
    });
    master_keys.forEach(key => {
        if(unlocks[key] == null) {
            unlocks[key] = false;
        }
    });
}