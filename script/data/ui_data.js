// Resource Display Section
function generateResourceDisplay(classID, color, htmlElement) {
    let div = `<div id="${classID}_div" style="display: none;">`
    let divEnd = `</div>`
    let barStart = `<span id="${classID}_name" class="name" style="width:40%">${langObj["RES_" + classID + "_NAME"]}:</span>`
    let bar = `<div id="${classID}_bar" class="progress-bar"><div id="${classID}_progress" style="background: ${color}; width: 100%;height: 100%;"></div>`
    let barText = `<span id="${classID}_text" class="res-text"></span></div>`

    htmlElement.innerHTML += `${div}${barStart}${bar}${barText}${divEnd}`
}

function renderResourceDisplay(resData) {
    let barText = `${resData.classID}_text`
    let barProgress = `${resData.classID}_progress`

    let cur = calculate(resData, "cur", false)
    let max = calculate(resData, "max", false)

    document.getElementById(barText).innerHTML = `${Math.floor(cur)} / ${max}`
    document.getElementById(barProgress).style.width = `${(cur / max) * 100}%`
}

// Resource Button Section
function generateResourceButton(classID, resText, resData, resKey, color, htmlElement) {
    let baseColor = color

    htmlElement.innerHTML += `<button id="${classID}_btn" style="display: none; background-color: ${baseColor}" class="flButton"></button>`

    let langID = `RES_${classID}_BUY`
    let langKeys = Object.keys(LANG_VARS[langID])
    let btnString = langObj[langID]

    langKeys.forEach(key => {
        btnString = btnString.replace(LANG_VARS[langID][key], evaluateLangVarKey(key, resData))
    })

    let btn = document.getElementById(`${classID}_btn`)

    btn.innerHTML = `<span>${btnString}</span>`
    btn.setAttribute("onclick", `updateResource(${resText}, "${resKey}", true)`)
}

function generateResourceButton2(classID, color) {
    let btn = document.getElementById(`${classID}_btn`)

    let baseColor = color
    let hoverColor = subtractColors(baseColor, "#111111")
    let activeColor = subtractColors(baseColor, "#202020")

    removeHoverAndActiveColor(btn)
    addHoverAndActiveColor(btn, baseColor, hoverColor, activeColor)
}

// Building Button Section
function generateBuildingButton(classID, bText, bData, bKey, color, htmlElement) {
    let baseColor = color

    htmlElement.innerHTML += `<button id="${classID}_btn" style="display: none; background-color: ${baseColor}" class="flButton"></button>`

    let langID = `BLD_${classID}_BUY`
    let langKeys = Object.keys(LANG_VARS[langID])
    let btnString = langObj[langID]

    langKeys.forEach(key => {
        btnString = btnString.replace(LANG_VARS[langID][key], evaluateLangVarKey(key, bData))
    })

    let btn = document.getElementById(`${classID}_btn`)

    btn.innerHTML = `<span>${btnString}</span>`
    btn.setAttribute("onclick", `updateBuilding(${bText}, "${bKey}")`)
}

function generateBuildingButton2(classID, color) {
    let btn = document.getElementById(`${classID}_btn`)

    let baseColor = color
    let hoverColor = subtractColors(baseColor, "#111111")
    let activeColor = subtractColors(baseColor, "#202020")

    removeHoverAndActiveColor(btn)
    addHoverAndActiveColor(btn, baseColor, hoverColor, activeColor)
}

function updateBuildingButton(classID, bData) {
    let langID = `BLD_${classID}_BUY`
    let langKeys = Object.keys(LANG_VARS[langID])
    let btnString = langObj[langID]

    langKeys.forEach(key => {
        btnString = btnString.replace(LANG_VARS[langID][key], evaluateLangVarKey(key, bData))
    })

    let btn = document.getElementById(`${classID}_btn`)

    btn.innerHTML = `<span>${btnString}</span>`
}

function getBuildingHtmlElement(key) {
    if (TIER1_BUILDING[key].type === "storage")
        return "t1storage"
    else if (TIER1_BUILDING[key].type === "producer")
        return "t1producer"
}

// General UI
function revealElements(htmlID, isBlock = false) {
    let style = "flex"
    if (isBlock)
        style = "block"

    htmlID.forEach(id => {
        document.getElementById(id).style.display = style
    })
}

// Language Related
function changeLanguageResourceDisplay(resData) {
    let barName = `${resData.classID}_name`

    document.getElementById(barName).innerHTML = langObj[`RES_${resData.classID}_NAME`] + ":"
}

function changeLanguageResourceButton(resData, isBuilding=false) {
    let btnName = `${resData.classID}_btn`
    let langID = `RES_${resData.classID}_BUY`
    if (isBuilding)
        langID = `BLD_${resData.classID}_BUY`
    let langKeys = Object.keys(LANG_VARS[langID])
    let btnString = langObj[langID]

    langKeys.forEach(key => {
        btnString = btnString.replace(LANG_VARS[langID][key], evaluateLangVarKey(key, resData))
    })

    document.getElementById(btnName).innerHTML = `<span>${btnString}</span>`
}

function evaluateLangVarKey(key, resData) {
    if (key === "qty") {
        return Math.floor(calculate(resData, "activeRate") + calculate(resData, "activeRate", true))
    }
    if (key === "building_cost_0" || key === "building_cost_1") {
        let index = key.split("_")[2]
        let keys = Object.keys(resData.baseCost)

        let baseCost = resData.baseCost[keys[index]]
        let costCoefficient = resData.costCoefficient[keys[index]]
        
        return Math.floor(Math.pow(costCoefficient, resData.count) * baseCost)
    }
}