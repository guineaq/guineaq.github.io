// Tab Management Simple

var TIER1_ENABLED = true;
var TIER2_ENABLED = false;

function openTab(ev, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for(i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for(i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    ev.currentTarget.className += " active";
}

// Ticks

window.setInterval(update_tier1, TICK);
window.setInterval(update_save, 60000);