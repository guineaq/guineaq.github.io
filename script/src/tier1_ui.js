// HTML elements for resource display on icon bar
function ResourceIcon(res_name, sub_displays) {
    this.div = document.getElementById(res_name+"_res_display");
    this.sub_displays = sub_displays;
    this.update = function() {
        sub_displays.forEach(display => {
            display.update();
        });
    }
    this.reveal_el = function(num) {
        sub_displays[num].display_self();
    }
}

function ResourceIconSubDisplay(name, update_function = function() {return null;}) {
    this.el = document.getElementById(name);
    this.update = function() {
        this.el.innerHTML = update_function();
    }
    this.display_self = function() {
        this.el.style.display = "block";
    }
}

function gen_color_coded_span_for_rate(rate) {
    let span_ = "<span>"
    if(rate > 0) {
        span_ = "<span style='color: #28ca5e;'>+"
    } else if(rate < 0) {
        span_ = "<span style='color: #ca4e28;'>-"
    }
    return span_;
}

var berry_display = new ResourceIcon("berry", [
    new ResourceIconSubDisplay("berry_sub1", function() {
        return Math.floor(berry.cur) + "/" + berry.max;
    }),
    new ResourceIconSubDisplay("berry_sub2", function() {
        return "Basket (" + (berry_basket.size.berry + berry_basket.bonuses.size.berry) + "): " + berry_basket.count;
    }),
    new ResourceIconSubDisplay("berry_sub2_1", function() {
        return "Granary (" + (granary.size.berry + granary.bonuses.size.berry) + "): " + granary.count;
    }),
    new ResourceIconSubDisplay("berry_sub3", function() {
        let span_begin = "<span>";
        let span_end = "</span>"
        span_begin = gen_color_coded_span_for_rate(berry.pas_rate);
        return span_begin + parseFloat(berry.pas_rate).toPrecision(3) + span_end;
    }),
]);

var log_display = new ResourceIcon("log", [
    new ResourceIconSubDisplay("log_sub1", function() {
        return Math.floor(log.cur) + "/" + log.max;
    }),
    new ResourceIconSubDisplay("log_sub2", function() {
        return "Stacks (" + (log_stack.size.log + log_stack.bonuses.size.log) + "): " + log_stack.count;
    }),
    new ResourceIconSubDisplay("log_sub2_1", function() {
        return "L.Yard (" + (lumber_yard.size.log + lumber_yard.bonuses.size.log) + "): " + lumber_yard.count;
    }),
    new ResourceIconSubDisplay("log_sub3", function() {
        let span_begin = "<span>";
        let span_end = "</span>"
        span_begin = gen_color_coded_span_for_rate(log.pas_rate);
        return span_begin + parseFloat(log.pas_rate).toPrecision(3) + span_end;
    }),
]);

var ilarun_display = new ResourceIcon("ilarun", [
    new ResourceIconSubDisplay("ilarun_sub1", function() {
        return Math.floor(ilarun.cur) + "/" + ilarun.max + "(I:" + idle.count + ")";
    }),
    new ResourceIconSubDisplay("ilarun_sub2", function() {
        return (forager.count + logger.count) + "/" + worker_max + "(F:" + forager.count + " L:" + logger.count + ")";
    }),
    new ResourceIconSubDisplay("ilarun_sub3", function() {
        return baroness.count + "/" + baroness_max;
    }),
    new ResourceIconSubDisplay("ilarun_sub4", function() {
        return "Warrens (" + (warren.size.ilarun + warren.bonuses.size.ilarun) + "): " + warren.count;
    }),
    new ResourceIconSubDisplay("ilarun_sub4_1", function() {
        return "Hamlet (" + (hamlet.size.ilarun + hamlet.bonuses.size.ilarun) + "): " + hamlet.count;
    }),
    new ResourceIconSubDisplay("ilarun_sub5", function() {
        let span_begin = "<span>";
        let span_end = "</span>"
        span_begin = gen_color_coded_span_for_rate(ilarun.pas_rate);
        return span_begin + parseFloat(ilarun.pas_rate).toPrecision(3) + span_end;
    }),
]);

var influence_display = new ResourceIcon("influence", [
    new ResourceIconSubDisplay("influence_sub1", function() {
        return Math.floor(influence.cur);
    }),
    new ResourceIconSubDisplay("influence_sub2", function() {
        let span_begin = "<span>";
        let span_end = "</span>"
        span_begin = gen_color_coded_span_for_rate(influence.pas_rate);
        return span_begin + parseFloat(influence.pas_rate).toPrecision(3) + span_end;
    }),
]);

var military_display = new ResourceIcon("military", [
    new ResourceIconSubDisplay("military_sub1", function() {
        let span_begin = "<span>";
        let span_end = "</span>"
        span_begin = gen_color_coded_span_for_rate(military.pas_rate);
        return span_begin + parseFloat(military.pas_rate).toPrecision(3) + span_end;
    }),
    new ResourceIconSubDisplay("military_sub2", function() {
        return "Squire(s): " + squire.count + "/" + squire_max;
    }),
]);

// Main Tab UI
function BuyButton(el, update_function) {
    this.el = document.getElementById(el);
    this.update = function() {
        this.el.innerHTML = update_function();
    }
}

var berry_basket_button = new BuyButton(
    "berry_storage_add", function() {
        return "Make Berry Basket (T1/Cost:" + berry_basket.cost.log + " Logs)";
    }
);

var log_basket_button = new BuyButton(
    "log_storage_add", function() {
        return "Set Log Stack (T1/Cost:" + berry_basket.cost.log + " Berries)";
    }
);

var warren_button = new BuyButton(
    "ilarun_storage_add", function() {
        return "Dig Ilarun Warren (T1/Cost:" + warren.cost.log + " Logs)";
    }
);

var granary_button = new BuyButton(
    "berry_storage_2_add", function() {
        return "Build Granary (T1.5/Cost:" + granary.cost.log + " Logs)";
    }
);

var lumber_yard_button = new BuyButton(
    "log_storage_2_add", function() {
        return "Build Lumber Yard (T1.5/Cost:" + lumber_yard.cost.berry + " Berries)";
    }
);

var hamlet_button = new BuyButton(
    "ilarun_storage_2_add", function() {
        return "Establish Hamlet (T1.5/Cost:" + hamlet.cost.log + " Berries & Logs)";
    }
);

// Display & GUI
function update_display() {
    berry_display.update();
    log_display.update();
    ilarun_display.update();
    influence_display.update();
    military_display.update();
}

function update_buttons() {
    berry_basket_button.update();
    log_basket_button.update();
    warren_button.update();
    granary_button.update();
    lumber_yard_button.update();
    hamlet_button.update();
}

function update_ui() {
    let keys = Object.keys(unlocks);
    keys.forEach(key => {
        if(unlocks[key]) {
            unlockable_el[key].forEach(el => {
                el.style.display = "block";
            });
        }
    });
    ui_update_flag = false;
}