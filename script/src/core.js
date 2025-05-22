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
    const saveData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        saveData[key] = localStorage.getItem(key);
    }
    const jsonString = JSON.stringify(saveData);

    const saveString = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode('0x' + p1)));

    // Create a Blob and trigger download
    const blob = new Blob([saveString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it
    const a = document.createElement("a");
    a.href = url;
    a.download = "save.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

function import_save() {
    let saveString = prompt("Paste your save string here:");
    if (!saveString) return;
    // Remove all whitespace and line breaks
    saveString = saveString.replace(/\s/g, '');
    try {
        const jsonString = decodeURIComponent(Array.prototype.map.call(atob(saveString), 
            c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
        const saveData = JSON.parse(jsonString);
        localStorage.clear();
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