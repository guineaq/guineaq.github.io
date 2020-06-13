// Resource Variables
var tier1_res = {
    ft1: {
        cur: 0,
        max: 10,
        act_rate: 1,
        pas_rate: 0,
    },
    log: {
        cur: 0,
        max: 10,
        act_rate: 1,
        pas_rate: 0,
    },
    ilarun: {
        cur: 0,
        max: 0,
        act_rate: 1,
        pas_rate: 0,
    },
    influence: {
        cur: 0,
        max: -1,
        pas_rate: 0,
    }
}

var tier1_res_bonuses = {
    //TODO finish
    ft1: {
        max: 0,
        act_rate: 0,
        pas_rate: 0,
    },
    log: {
        max: 0,
        act_rate: 0,
        pas_rate: 0,
    },
    ilarun: {
        cur: 0,
        max: 0,
        act_rate: 1,
        pas_rate: 0,
    },
    influence: {
        cur: 0,
        pas_rate: 0,
    }
}

/*
Ilaruns have complex management system
*/
var tier1_pop = {
    pop_total: 0,
    idle: {
        total: 0,
        upkeep: 0.1,
    },
    worker: {
        total: 0,
        upkeep: 0.25,
        max: 0,
        forager: {
            count: 0,
            cost: {ft1: 100, log: 0, ilarun: 0},
            income: 1,
        },
        logger: {
            count: 0,
            cost: {ft1: 0, log: 100, ilarun: 0},
            income: 1,
        },
        breeder: {
            count: 0,
            cost: {ft1: 125, log: 125, ilarun: 0},
            income: 0.01,
        },
    },
    baroness: {
        total: 0,
        cost: {ft1: 250, log: 100, ilarun: 0},
        income: 0.05,
        upkeep: 1,
        max: 0,
    },
    military: {
        total: 0,
        max: 0,
        squire: {
            upkeep: 0.05,
            count: 0,
            cost: {ft1: 100, log: 100, ilarun: 0},
            income: 1,
        },
    }
};

var tier1_pop_bonuses = {
    //TODO finish
    idle: {
        upkeep: 0,
    },
    worker: {
        upkeep: 0,
        max: 0,
        forager: {
            cost: {ft1: 0, log: 0, ilarun: 0},
            income: 0,
        },
        logger: {
            cost: {ft1: 0, log: 0, ilarun: 0},
            income: 0,
        },
        breeder: {
            cost: {ft1: 0, log: 0, ilarun: 0},
            income: 0,
        },
    },
    baroness: {
        upkeep: 0,
        max: 0,
        cost: {ft1: 0, log: 0, ilarun: 0},
        income: 0,
    }
};

// Building Related
const tier1_building_cost_modifier = 1.1;
var tier1_buildings = {
    berryBasket: {
        count: 0, 
        cost: {ft1: 0, log: 10, ilarun: 0}, 
        size: {ft1: 15, log: 0, ilarun: 0},
    },
    logStack: {
        count: 0, 
        cost: {ft1: 10, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 15, ilarun: 0},
    },
    ilarunWarren: {
        count: 0, 
        cost: {ft1: 0, log: 50, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 5},
    },
    granary: {
        count: 0, 
        cost: {ft1: 0, log: 75, ilarun: 0}, 
        size: {ft1: 100, log: 0, ilarun: 0},
    },
    lumberYard: {
        count: 0, 
        cost: {ft1: 75, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 100, ilarun: 0},
    },
    hamlet: {
        count: 0, 
        cost: {ft1: 125, log: 125, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 25},
    },
};

//TODO implement building bonuses
var tier1_buildings_bonuses = {
    berryBasket: {
        cost: {ft1: 0, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 0},
    },
    logStack: {
        cost: {ft1: 0, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 0},
    },
    ilarunWarren: {
        cost: {ft1: 0, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 0},
    },
    granary: {
        cost: {ft1: 0, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 0},
    },
    lumberYard: {
        cost: {ft1: 0, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 0},
    },
    hamlet: {
        cost: {ft1: 0, log: 0, ilarun: 0}, 
        size: {ft1: 0, log: 0, ilarun: 0},
    },
}

// HTML elements for resource display on icon bar
const ft1_el = document.getElementById("ft1_count");
const ft1_max_el = document.getElementById("ft1_max");

const log_el = document.getElementById("log_count");
const log_max_el = document.getElementById("log_max");

const ilarun_el = document.getElementById("ilarun_count");
const ilarun_max_el = document.getElementById("ilarun_max");
const ilarun_worker_el = document.getElementById("ilarun_worker_count");
const ilarun_worker_max_el = document.getElementById("ilarun_worker_max");
const baroness_el = document.getElementById("baroness_count");
const baroness_max_el = document.getElementById("baroness_max");

const influence_el = document.getElementById("influence_count");

const tier1_div = document.getElementById("Tier_1");
const hero_tab = document.getElementById("heroTab");
const baroness_display = document.getElementById("baroness_res_display");

// Resource Icon Bar
var tier1_res_icons = {
    ft1: document.getElementById("ft1_res_display"),
    log: document.getElementById("log_res_display"),
    ilarun: document.getElementById("ilarun_res_display"),
    influence: document.getElementById("influence_res_display")
};

var tier1_res_tooltip = {
    ft1: new Tooltip(document.getElementById("ft1_res_tooltip"), ["Basket: "]),
    log: new Tooltip(document.getElementById("log_res_tooltip"), ["Log Stack: "]),
    ilarun: new Tooltip(document.getElementById("ilarun_res_tooltip"), ["Warren: "]),
    influence: new Tooltip(document.getElementById("influence_res_tooltip"), ["Baroness: "]),
};

function Tooltip(el, txt) {
    this.el = el
    this.txt = txt
    this.add_to_txt = function(t) {
        this.txt.push(t);;
    }
    this.update = function(data) {
        str = "<pre>";
        for(let i = 0; i < txt.length; i++) {
            str += this.txt[i] + data[i];
            if(i != txt.length)
                str += "\n";
        }
        el.innerHTML = str + "</pre>";
    }
}

// Main Tab UI
var tier1_pop_ui = {
    idle: new PopUI(document.getElementById("idle_display")),
    total_worker: new PopUI(document.getElementById("total_worker_display")),
    ft1_worker: new PopUI(document.getElementById("ft1_worker_display")),
    log_worker: new PopUI(document.getElementById("log_worker_display")),
    ft1_income: new PopUI(document.getElementById("ft1_income_display")),
    log_income: new PopUI(document.getElementById("log_income_display")),
    idle_upkeep: new PopUI(document.getElementById("idle_upkeep_display"), true),
    worker_upkeep: new PopUI(document.getElementById("worker_upkeep_display"), true),
    ilarun_worker: new PopUI(document.getElementById("ilarun_worker_display")),
    ilarun_income: new PopUI(document.getElementById("ilarun_income_display"), true),
    baroness: new PopUI(document.getElementById("baroness_display")),
    baroness_income: new PopUI(document.getElementById("influence_income_display"), true),
}

function PopUI(el, reqPrec = false) {
    this.el = el,
    this.reqPrec = reqPrec,
    this.update = function(data, precision = 0) {
        if(this.reqPrec)
            el.innerHTML = parseFloat(data).toPrecision(2);
        else
            el.innerHTML = data;
    }
}

// Buttons
var tier1_buttons = {
    ft1_add: new ButtonData(document.getElementById("ft1_add"), ["Pick ", " Berries"]),
    log_add: new ButtonData(document.getElementById("log_add"), ["Pick ", " Twig(s)"]),
    ilarun: new ButtonData(document.getElementById("ilarun_add"), ["Host ", " Ilarun(s)"]),
    ft1_storage_add: new ButtonData(document.getElementById("ft1_storage_add"), ["Make Berry Basket (T1/Cost:", ")"]),
    log_storage_add: new ButtonData(document.getElementById("log_storage_add"), ["Set Log Stack (T1/Cost:", ")"]),
    ilarun_storage_add: new ButtonData(document.getElementById("ilarun_storage_add"), ["Dig Ilarun Warren (T1/Cost:", ")"]),
    ft1_storage_2_add: new ButtonData(document.getElementById("ft1_storage_2_add"),["Build Granary (T1.5/Cost:", ")"]),
    log_storage_2_add: new ButtonData(document.getElementById("log_storage_2_add"), ["Build Lumber Yard (T1.5/Cost:", ")"]),
    ilarun_storage_2_add: new ButtonData(document.getElementById("ilarun_storage_2_add"), ["Establish Hamlet (T1.5/Cost:", "Berries & Logs)"]),
};

function ButtonData(el, txt = ["Placeholder" , "DEBUG::Placeholder"]) {
    this.el = el;
    this.txt = txt;
    this.update = function(data) {
        this.el.innerHTML = this.txt[0] + data + this.txt[1];
    }
}

// Unlocks
var tier1_ui_update_flag = true;
var tier1_unlocks = {
    ft1_harvest: {isOpen: true, el: document.getElementById("ft1_harvest"), isUnlocked: false, resUnlock: "ft1"},
    log_harvest: {isOpen: false, el: document.getElementById("log_harvest"), isUnlocked: false, resUnlock: "log"},
    ilarun_recruit: {isOpen: false, el: document.getElementById("ilarun_recruit"), isUnlocked: false, resUnlock: "ilarun"},
    tier1_2_storage: {isOpen: false, el: document.getElementById("tier1_2_storage"), isUnlocked: false, resUnlock: null},
    baroness_tech: {isOpen: false, el: document.getElementById("baroness_tech"), isUnlocked: false, resUnlock: "influence"},
    conquest: {isOpen: false, el: document.getElementById("conquestTab"), isUnlocked: false},
    hamlet: {isOpen: false, el: document.getElementById("ilarun_storage_2_add"), isUnlocked: false},
};