class Resource {
    #resArr
    #resData
    #buildingData
    #htmlElement
    #displayObj = {}

    #unlocked = false
    /**
     * 
     * @param {Object} resArr TIER1_RESOURCE_TYPE[resource key]
     * @param {HTMLElement} htmlElement HTMLElement which displays this resource
     * @param {ResourceData} resData ResourceData object
     */
    constructor(resArr, htmlElement, resData, buildingData) {
        this.#resArr = resArr
        this.#resData = resData
        this.#htmlElement = htmlElement
        this.generateResourceDisplay()
    }

    // --------- Initialization Category ---------
    generateResourceDisplay() {
        let div = `<div id="${this.#resArr.classID}_div" style="display: none;">`
        let divEnd = `</div>`

        let barStart = `<span id="${this.#resArr.classID}_name" class="name" style="width:40%">${langObj["RES_"+this.#resArr.classID+"_NAME"]}:</span>`

        let bar = `<div id="${this.#resArr.classID}_bar" class="progress-bar"><div id="${this.#resArr.classID}_progress" style="background: ${this.#resArr.color}; width: 100%; height: 100%;"></div>`
        let barText = `<span id="${this.#resArr.classID}_text" class="res-text"></span></div>`

        this.#htmlElement.innerHTML += `${div}${barStart}${bar}${barText}${divEnd}`

        this.#displayObj.div = `${this.#resArr.classID}_div`
        this.#displayObj.barStart = `${this.#resArr.classID}_name`
        this.#displayObj.bar = `${this.#resArr.classID}_bar`
        this.#displayObj.barProgress = `${this.#resArr.classID}_progress`
        this.#displayObj.barText = `${this.#resArr.classID}_text`
    }

    // --------- Render Category ---------
    render() {
        let current = this.#resData.cur
        let max = this.calculate("max")

        document.getElementById(this.#displayObj.barText).innerHTML = `${Math.floor(current)} / ${max}`
        document.getElementById(this.#displayObj.barProgress).style.width = `${(current/max) * 100}%`
    }

    // --------- Update Category ---------
    update() {
        const gain = (this.calculate("passiveRate") + this.calculate("passiveRate", true)) / (1000 / TICK)
        const max = this.calculate("max")

        if (max === -1) {
            this.#resData.cur += gain
        } else {
            this.#resData.cur = Math.max(0, Math.min(this.#resData.cur + gain, max))
        }
    }

    updateResData(key) {
        if(key === "active1") {
            // add one unit of active rate income to current
            let gain = (evaluateResDataSum(this.#resData.activeRate) + evaluateResDataSum(this.#resData.bonuses.activeRate))
            let max = (evaluateResDataSum(this.#resData.max) + evaluateResDataSum(this.#resData.bonuses.max))
            this.#resData.cur = Math.min(this.#resData.cur + gain, max)
        }
    }

    // --------- Util Category ---------
    setUnlocked(unlocked) {
        this.#unlocked = true
        document.getElementById(this.#displayObj.div).style.display = "flex";
    }

    getUnlocked() {
        return this.#unlocked
    }

    getResData() {
        return this.#resData
    }

    getResArr() {
        return this.#resArr
    }

    changeLanguage() {
        document.getElementById(this.#displayObj.barStart).innerHTML = langObj[`RES_${this.#resArr.classID}_NAME`]+":"
    }

    calculate(resDataKey, isBonus = false) {
        let x = 0;
        if(!isBonus) {
            let keys = Object.keys(this.#resData[resDataKey])
            keys.forEach(key => {
                x += this.#resData[resDataKey][key]
            })
        } else {
            let keys = Object.keys(this.#resData.bonuses[resDataKey])
            keys.forEach(key => {
                x += this.#resData.bonuses[resDataKey][key]
            })
        }
        return x
    }

    save() {
        this.#resData.save()
    }
}

class ResourceData {
    constructor(resData) {
        this.classID = resData.classID
        this.name = fetch(`${this.classID}_name`, false, true) || resData.name
        this.cur = fetch(`${this.classID}_cur`) || resData.cur
        this.max = fetch(`${this.classID}_max`, true) || resData.max
        this.type = fetch(`${this.classID}_type`, false, true) || resData.type
        this.passiveRate = fetch(`${this.classID}_passiveRate`, true) || resData.passiveRate
        this.activeRate = fetch(`${this.classID}_activeRate`, true) || resData.activeRate
        this.bonuses = this.loadBonuses() || resData.bonuses
    }

    save() {
        store(`${this.classID}_name`, this.name)
        store(`${this.classID}_cur`, this.cur)
        store(`${this.classID}_max`, this.max, true)
        store(`${this.classID}_type`, this.type)
        store(`${this.classID}_passiveRate`, this.passiveRate, true)
        store(`${this.classID}_activeRate`, this.activeRate, true)
        RESOURCE_BONUSES_KEYS.forEach(key => {
            store(`${this.classID}_bonuses_${key}`, this.bonuses[key], true)
        })
    }

    loadBonuses() {
        let bonuses = {}
        RESOURCE_BONUSES_KEYS.forEach(key => {
            bonuses[key] = fetch(`${this.classID}_bonuses_${key}`, true) || {}
        })
        return bonuses
    }
}

class BuildingData {

}

const RESOURCE_BONUSES_KEYS = ["max", "passiveRate", "activeRate"]