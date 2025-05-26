// Tab Management Simple

var TIER1_ENABLED = true
var TIER2_ENABLED = false

function openTab(ev, tabName) {
    var i, tabcontent, tablinks

    tabcontent = document.getElementsByClassName("tabcontent");
    for(i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"
    }

    tablinks = document.getElementsByClassName("tablinks")
    for(i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    document.getElementById(tabName).style.display = "block"
    ev.currentTarget.className += " active"
}

function showNotification(message, duration = 10000, id = "") {
    const n = document.getElementById(`notification`)
    const msg = document.getElementById(`${id}notification_message`)
    const closeBtn = document.getElementById(`${id}notification_close`)

    msg.textContent = message
    n.style.display = 'block'
    n.style.opacity = '1'

    // Remove any previous click listeners to avoid stacking
    closeBtn.onclick = () => {
        hideNotification()
        clearTimeout(n._timeout) // Prevent auto-hide if closed manually
    };

    // Hide after duration
    n._timeout = setTimeout(() => {
        hideNotification();
    }, duration)

    function hideNotification() {
        n.style.opacity = '0'
        setTimeout(() => n.style.display = 'none', 300)
    }
}

function wipeSave() {
    if (confirm(langObj.ETC_00000008)) {
        localStorage.clear()
        // If you use other storage mechanisms, clear them here as well
        location.reload()
    }
}

function exportSave() {
    const saveData = {}
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        saveData[key] = localStorage.getItem(key)
    }
    const jsonString = JSON.stringify(saveData)

    const saveString = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode('0x' + p1)))

    // Create a Blob and trigger download
    const blob = new Blob([saveString], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and click it
    const a = document.createElement("a")
    a.href = url
    a.download = "save.txt"
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }, 0)
}

function importSave() {
    let saveString = prompt(langObj.ETC_00000005)
    if (!saveString) return
    // Remove all whitespace and line breaks
    saveString = saveString.replace(/\s/g, '')
    try {
        const jsonString = decodeURIComponent(Array.prototype.map.call(atob(saveString), 
            c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''))
        const saveData = JSON.parse(jsonString)
        localStorage.clear()
        for (const key in saveData) {
            localStorage.setItem(key, saveData[key])
        }
        alert(langObj.ETC_00000006)
        location.reload()
    } catch (e) {
        alert(langObj.ETC_00000007)
    }
}

// Ticks