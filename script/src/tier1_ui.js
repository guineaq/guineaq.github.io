// HTML elements for resource display on icon bar
class ResourceDisplay {
    constructor(name, res) {
        this.name = name
        this.html_string = {
            div: `<div id="${name}_res_display" style="display: none;">`,
            div_unlocked: `<div id="${name}_res_display" style="display: flex;">`,
            bar_start: `<span class="name" style="width:40%">${name[0].toUpperCase() + name.slice(1)}: </span>`,
            bar: `<div id="${name}_res_progress_bar" class="res_progress_bar"><div id="${name}_res_progress" class="res_progress ${name}_bar" style="width:${(res.cur/res.max)*100}%"></div><span id="${name}_res_progress_text" class="res_progress_text">${Math.floor(res.cur)} / ${res.max}</span></div>`,
            tooltip: `<span class="tooltip-text-res"></span>`,
            div_end: `</div>`
        }

        let div = this.unlocked ? this.html_string.div_unlocked : this.html_string.div
        document.getElementById("res_bar").innerHTML += `${div}${this.html_string.bar_start}${this.html_string.bar}${this.html_string.tooltip}${this.html_string.div_end}`
    }

    update_bar(res) {
        let bar_el = document.getElementById(`${this.name}_res_progress`);
        let text_el = document.getElementById(`${this.name}_res_progress_text`);
        if(res.max != -1) {
            bar_el.style.width = ((res.cur / res.max) * 100) + "%";
            text_el.innerHTML = `${Math.floor(res.cur)}${gen_color_coded_span_for_rate(res.pas_rate)} / ${res.max}`;
        } else {
            bar_el.style.width = "100%";
            text_el.innerHTML = `${Math.floor(res.cur)}${gen_color_coded_span_for_rate(res.pas_rate)}`;
        }
    }

    unlock() {
        document.getElementById(`${this.name}_res_display`).style.display = "flex"
    }
}

class PopulationDisplay {
    constructor(name, className, displayName) {
        this.initialized = false
        this.name = name
        this.html_string = {
            div: `<div id="${name}_pop_display" style="display: none;">`,
            div_unlocked: `<div id="${name}_pop_display" style="display: flex;">`,
            bar_start: `<span class="name" style="width:40%">${displayName}: </span>`,
            tooltip: `<span class="tooltip-text-res"></span>`,
            div_end: `</div>`
        }
        this.bar_template_strings = {
            idle: `<div id="${name}_idle_progress_bar" class="res_progress_bar"><div id="${name}_idle_progress" class="res_progress ${className}"></div><span id="${name}_idle_progress_text" class="res_progress_text"></span></div>`,
            worker: `<div id="${name}_worker_progress_bar" class="res_progress_bar"></div>`,
            military: `<div id="${name}_military_progress_bar" class="res_progress_bar"></div>`,
            noble: `<div id="${name}_noble_progress_bar" class="res_progress_bar"></div>`
        }
        let div = this.unlocked ? this.html_string.div_unlocked : this.html_string.div
        document.getElementById("res_bar").innerHTML += `${div}${this.html_string.bar_start}${this.html_string.tooltip}${this.html_string.div_end}`
    }

    update_bar_idle(pop, res) {
        if(!this.initialized) {
            let top_div = document.getElementById(`${this.name}_pop_display`)
            top_div.innerHTML = `${this.html_string.bar_start}${this.bar_template_strings.idle}${this.html_string.tooltip}${this.html_string.div_end}`
            this.initialized = true
        }

        let bar_el = document.getElementById(`${this.name}_idle_progress`);
        let text_el = document.getElementById(`${this.name}_idle_progress_text`);

        bar_el.style.width = ((pop.count / Math.floor(res.cur)) * 100) + "%";
        text_el.innerHTML = `${Math.floor(pop.count)} / ${Math.floor(res.cur)}`;
    }

    update_bar_worker(relevant_pops, worker_max, classNames) {
        if(!this.initialized) {
            let top_div = document.getElementById(`${this.name}_pop_display`)
            top_div.innerHTML = `${this.html_string.bar_start}${this.bar_template_strings.worker}${this.html_string.tooltip}${this.html_string.div_end}`
            this.initialized = true
        }

        let next_top_div = document.getElementById(`${this.name}_worker_progress_bar`)
        next_top_div.innerHTML = ""
        let count_string = ""
        let left_weight = 0
        let i = 0

        relevant_pops.forEach(pop => {
            let w = (pop.count/worker_max)*100;
            let html_string = `<div class="res_progress ${classNames[i]}" style="width:${w}%; left: ${left_weight}%; top: -${i*100}%; position: relative;"></div>`
            count_string += `${pop.count}+`
            next_top_div.innerHTML += html_string
            i++
            left_weight += w
        })

        let text_string = `<span class="res_progress_text" style="top: -${i*100}%;">${count_string.slice(0, -1)} / ${worker_max}</span>`
        next_top_div.innerHTML += text_string
    }

    update_bar_single(pop, max, className) {
        if(!this.initialized) {
            let top_div = document.getElementById(`${this.name}_pop_display`)
            top_div.innerHTML = `${this.html_string.bar_start}${this.bar_template_strings.noble}${this.html_string.tooltip}${this.html_string.div_end}`
            this.initialized = true
        }

        let next_top_div = document.getElementById(`${this.name}_noble_progress_bar`)
        let html_string= `<div class="res_progress ${className}" style="width:${(pop.count/max)*100}%"></div><span class="res_progress_text"">${pop.count} / ${max}</span>`
        next_top_div.innerHTML = html_string
    }

    unlock() {
        document.getElementById(`${this.name}_pop_display`).style.display = "flex"
    }
}

const bar_berry = new ResourceDisplay('berry', res_all.berry)
const bar_berry_cider = new ResourceDisplay('berry_cider', res_all.berry_cider)

const bar_log = new ResourceDisplay('log', res_all.log)
const bar_wooden_weaponry = new ResourceDisplay('wooden_weaponry', res_all.wooden_weaponry)
const bar_ash_pottery = new ResourceDisplay('ash_pottery', res_all.ash_pottery)

const bar_influence = new ResourceDisplay('influence', res_all.influence)

const bar_ilarun = new ResourceDisplay('ilarun', res_all.ilarun)
// population display goes under pop res
const bar_idle_ilarun = new PopulationDisplay('idle_ilarun', 'ilarun_bar', 'Idle')
const bar_worker_ilarun = new PopulationDisplay('workers', 'ilarun_bar', 'Workers')
const bar_baroness_ilarun = new PopulationDisplay('baroness', 'influence_bar', 'Baroness')

const bar_ash_elf = new ResourceDisplay('ash_elf', res_all.ash_elf)
// population display goes under pop res

const bar_unlocked = fetch("bar_unlocked", true) || {
    berry: true,
    log: false,
    wooden_weaponry: false,
    ilarun: false,
    influence: false,
    ash_pottery: false,
    berry_cider: false,
    ash_elf: false,
    idle_ilarun: false,
    worker_ilarun: false,
    baroness_ilarun: false,
}

const res_bars = {
    berry: {name: bar_berry, generators: [], storages: []},
    log: {name: bar_log, generators: [], storages: []},
    wooden_weaponry: {name: bar_wooden_weaponry, generators: [], storages: []},
    ilarun: {name: bar_ilarun, generators: [], storages: []},
    influence: {name: bar_influence, generators: [], storages: []},
    ash_pottery: {name: bar_ash_pottery, generators: [], storages: []},
    berry_cider: {name: bar_berry_cider, generators: [], storages: []},
    ash_elf: {name: bar_ash_elf, generators: [], storages: []},
    idle_ilarun: {name: bar_idle_ilarun, generators: [], storages: []},
    worker_ilarun: {name: bar_worker_ilarun, generators: [], storages: []},
    baroness_ilarun: {name: bar_baroness_ilarun, generators: [], storages: []},
}

function gen_color_coded_span_for_rate(rate) {
    let span_ = "<span>"
    if(rate > 0) {
        span_ = `<span style='color: #28ca5e;'> +${Number(rate.toFixed(3))}</span>`
    } else if(rate < 0) {
        span_ = `<span style='color: #ca4e28;'> ${Number(rate.toFixed(3))}</span>`
    }
    return span_;
}

// Main Tab UI
function BuyButton(el, update_function) {
    this.el = document.getElementById(el);
    this.update = function() {
        this.el.innerHTML = update_function();
    }
}

const berry_add_button = new BuyButton(
    "berry_add", function() {
        return "Pick " + (berry.act_rate + berry.bonuses.act_rate) + " Berries";
    }
);

const log_add_button = new BuyButton(
    "log_add", function() {
        return "Pick " + (log.act_rate + log.bonuses.act_rate) + " Logs";
    }
);

const berry_basket_button = new BuyButton(
    "berry_storage_add", function() {
        return "Make Berry Basket (T1/Cost:" + berry_basket.cost.log + " Logs)";
    }
);

const log_stack_button = new BuyButton(
    "log_storage_add", function() {
        return "Set Log Stack (T1/Cost:" + log_stack.cost.berry + " Berries)";
    }
);

const weapon_rack_button = new BuyButton(
    "wooden_weaponry_storage_add", function() {
        return `Build Weapon Rack (T1/Cost: ${weapon_rack.cost.log} Logs)`
    }
)

const warren_button = new BuyButton(
    "ilarun_storage_add", function() {
        return "Dig Ilarun Warren (T1/Cost:" + warren.cost.log + " Logs)";
    }
);

const granary_button = new BuyButton(
    "berry_storage_2_add", function() {
        return "Build Granary (T1.5/Cost:" + granary.cost.log + " Logs)";
    }
);

const lumber_yard_button = new BuyButton(
    "log_storage_2_add", function() {
        return "Build Lumber Yard (T1.5/Cost:" + lumber_yard.cost.berry + " Berries)";
    }
);

const hamlet_button = new BuyButton(
    "ilarun_storage_2_add", function() {
        return "Establish Hamlet (T1.5/Cost:" + hamlet.cost.log + " Berries & Logs)";
    }
);

const ashen_abode_button = new BuyButton(
    "ash_elf_storage_add", function() {
        return "Build Ashen Abode (T1/Cost:" + ashen_abode.cost.log + " Logs & " + ashen_abode.cost.ash_pottery + " Ash Pottery)";
    }
);

const ash_market_button = new BuyButton(
    "ash_pottery_storage_add", function() {
        return "Establish Ash Market (T1/Cost:" + ash_market.cost.berry_cider + " Berry Cider)";
    }
);

const cellar_button = new BuyButton(
    "berry_cider_storage_add", function() {
        return "Dig Cellar (T1/Cost:" + cellar.cost.ash_pottery + " Ash Pottery)";
    }
);

const buyButtons = [
    berry_add_button,
    log_add_button,
    berry_basket_button,
    log_stack_button,
    weapon_rack_button,
    granary_button,
    lumber_yard_button,
    warren_button,
    hamlet_button,
    ashen_abode_button,
    cellar_button,
    ash_market_button,
]

// Display & GUI
function update_display() {
    bar_berry.update_bar(res_all.berry)
    bar_log.update_bar(res_all.log)
    bar_wooden_weaponry.update_bar(res_all.wooden_weaponry)
    bar_ilarun.update_bar(res_all.ilarun)
    bar_idle_ilarun.update_bar_idle(pop_all.idle, res_all.ilarun)
    bar_worker_ilarun.update_bar_worker([pop_all.forager, pop_all.logger, pop_all.woodcrafter], worker_max, ['berry_bar', 'log_bar', 'wooden_weaponry_bar'])
    bar_baroness_ilarun.update_bar_single(pop_all.baroness, baroness_max, 'influence_bar')
    bar_influence.update_bar(res_all.influence)
}

function update_buttons() {
    buyButtons.forEach(button => {
        button.update();
    })
}

function update_ui() {
    let keys = Object.keys(unlocks);
    keys.forEach(key => {
        if(unlocks[key]) {
            console.log(key)
            unlockable_el[key].forEach(el => {
                el.style.display = "block";
            });
        }
    });

    let bar_keys = Object.keys(bar_unlocked);
    bar_keys.forEach(key => {
        if(bar_unlocked[key])
            res_bars[key].name.unlock()
    })
    ui_update_flag = false;
}