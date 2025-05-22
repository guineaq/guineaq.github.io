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

function showNotification(message, duration = 2000) {
    const n = document.getElementById('notification');
    n.textContent = message;
    n.style.display = 'block';
    n.style.opacity = '1';

    // Hide after duration
    setTimeout(() => {
        n.style.opacity = '0';
        setTimeout(() => n.style.display = 'none', 300);
    }, duration);
}

function wipe_save() {
    if (confirm("Are you sure you want to wipe your save? This cannot be undone.")) {
        localStorage.clear();
        // If you use other storage mechanisms, clear them here as well
        location.reload();
    }
}

function export_save() {
    // Export all localStorage as a JSON string
    const saveData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        saveData[key] = localStorage.getItem(key);
    }
    const saveString = btoa(unescape(encodeURIComponent(JSON.stringify(saveData))));
    // Show in prompt for easy copy
    prompt("Copy your save string below:", saveString);
}

function import_save() {
    const saveString = prompt("Paste your save string here:");
    if (!saveString) return;
    try {
        const saveData = JSON.parse(decodeURIComponent(escape(atob(saveString))));
        // Clear current save
        localStorage.clear();
        // Restore each key
        for (const key in saveData) {
            localStorage.setItem(key, saveData[key]);
        }
        alert("Save imported! Reloading...");
        location.reload();
    } catch (e) {
        alert("Invalid save string.");
    }
}


// Ticks

window.setInterval(update_tier1, TICK);
window.setInterval(update_save, 60000);