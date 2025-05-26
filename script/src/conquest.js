var territory_count = fetch("territory.count") || 0
var territories = {
    morhaven: {
        el: document.getElementById("t0_progress"),
        button_el: document.getElementById("target_t0"),
        progress: fetch("t0.progress") || 0,
        required: 100000,
        on_conquer: function() {
            forager.bonuses.income.berry += 1
            logger.bonuses.income.log += 1
            berry_basket.bonuses.size.berry += 15
            log_stack.bonuses.size.log += 15
            territory_count += 1
            update_tier1_res_max()
        }
    },
    leyliasion: {
        el: document.getElementById("t1_progress"),
        button_el: document.getElementById("target_t1"),
        progress: fetch("t1.progress") || 0,
        required: 250000,
        on_conquer: function() {
            unlocks.ash_elf = true
            territory_count += 1
            update_unlocks()
            update_ui()
        }
    },
}
var conquest_target = null

function set_conquest_target(id, target) {
    el = document.getElementById(id)
    let suffix = " (Targetted)"
    
    if(conquest_target == null) {
        conquest_target = target
        el.innerHTML += suffix
    } else if(conquest_target == target) {
        conquest_target = null
        el.innerHTML = el.innerHTML.slice(0, -suffix.length)
    }
}

function update_save_military() {
    store("territory.count", territory_count)

    let t = Object.keys(territories)
    let i = 0
    t.forEach(territory => {
        store("t"+i+".progress", territories[territory].progress)
        i++
    })
}