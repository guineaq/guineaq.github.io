// Tier 1
/**
 * Resource List
 * 
 * | Bio Materials |
 * - Biomass * Raw / Tier 1
 * - Nutrient Paste * Food / Tier 1
 * - Redberries * Raw / Tier 1
 * 
 * | Basic Materials |
 * - Scrap * Raw / Tier 1
 * - Metal * Processed / Tier 1
 * 
 * | Advanced Materials |
 * - Basic Circuitry * Component / Tier 1
 * - Chemfuel * Fuel / Tier 1
 * - Basic Chemicals * Component / Tier 1
 * 
 * | Energy |
 * - Power * Power / Universal
 * 
 * | Crafted Goods |
 * - Survival Rifle * Weapon / Tier 1
 * - Redberry Shine * Luxury Good / Tier 1
 * - Synthfiber * Fabric / Tier 1
 * - Uniform * Normal Good / Tier 1
 * - Low Nobility Attire * Luxury Good / Tier 1
 * - Low Tech Munitions * Ammo / Tier 1
 */
const TIER1_RESOURCE_TYPE = {
    /* Types
    * 01 - Raw
    * 02 - Component
    * 03 - Processed
    * 04 - Fuel
    * 05 - Ammo
    * 06 - Fabric
    * 07 - Food
    * 08 - Inferior Good
    * 09 - Normal Good
    * 10 - Luxury Good
    * 11 - Weapon
    */

    /* ClassID
    * 1xxtt000 ~ Bio Materials | xx (Tier) | tt (Type)
    * 2xxtt000 ~ Basic Materials | xx (Tier) | tt (Type)
    * 3xxtt000 ~ Advanced Materials | xx (Tier) | tt (Type)
    * 4xxtt000 ~ Crafted Goods | xx (Tier) | tt (Type)
    * 10100000 : Power
    */
    power: {classID: 10100000, name: "Power", type: "power", color: "#dee04b"},
    biomass: {classID: 10101001, name: "Biomass", type: "raw", color: "#7ac538"},
    nutrientPaste: {classID: 10107001, name: "Nutrient Paste", type: "food", color: "#297e29"},
    redberries: {classID: 10101002, name: "Redberries", type: "raw", color: "#c94e4e"},
    scrap: {classID: 20101003, name: "Scrap", type: "raw", color: "#948a8a"},
    metal: {classID: 20103001, name: "Metal", type: "processed", color: "#5f4f4f"},
    basicCircuitry: {classID: 30102001, name: "Basic Circuitry", type: "component", color: "#afafaf"},
    chemfuel: {classID: 30104001, name: "Chemfuel", type: "fuel", color: "#792e2e"},
    basicChemicals: {classID: 30102002, name: "Basic Chemicals", type: "component", color: "#7777aa"},
    survivalRifle: {classID: 40111001, name: "Survival Rifle", type: "raw", color: "#555555"},
    redberryShine: {classID: 40110001, name: "Redberry Shine", type: "luxury_good", color: "#841e7e"},
    synthfiber: {classID: 40106002, name: "Synthfiber", type: "fabric", color: "#247e7e"},
    uniform: {classID: 40109001, name: "Uniform", type: "normal_good", color: "#444e2e"},
    lowNobilityAttire: {classID: 40110002, name: "Low Nobility Attire", type: "luxury_good", color: "#741ea4"},
    lowTechMunitions: {classID: 40105001, name: "Low Tech Munitions", type: "ammo", color: "#657575"},
}

const TIER1_RES_KEYS = Object.keys(TIER1_RESOURCE_TYPE)

const TIER1_RES_ALL = {}

class Resource {
    #resArr
    #genPop
    #genBuil
    #stoPop
    #stoBuil
    #htmlElement
    #displayObj = {}
    /**
     * 
     * @param {Object} resArr (TIER1_RESOURCE_TYPE) obj
     * @param {HTMLElement} htmlElement HTMLElement which displays this resource
     * @param {Array} genPop Array of pop obj which generates this resource
     * @param {Array} genBuil Array of building obj which generates this resource
     * @param {Array} stoPop Array of pop obj which stores this resource
     * @param {Array} stoBuil Array of building obj which stores this resource
     */
    constructor(resArr, htmlElement, genPop = [], genBuil = [], stoPop = [], stoBuil = []) {
        this.#resArr = resArr
        this.#genPop = genPop
        this.#genBuil = genBuil
        this.#stoPop = stoPop
        this.#stoBuil = stoBuil
        this.#htmlElement = htmlElement
        this.generateResourceDisplay()
    }

    generateResourceDisplay() {
        let div = `<div id="${this.#resArr.classID}_div" style="display: flex;">`
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

    updateResourceDisplay(tier) {
        let resAll

        if (tier == 1) {
            resAll = TIER1_RES_ALL
        }
    }

    changeLanguage() {
        document.getElementById(this.#displayObj.barStart).innerHTML = langObj[`RES_${this.#resArr.classID}_NAME`]+":"
    }
}

class _BuyButton {
    /**
     * Creates a buy button, buy button can be used for purchasing population, or building.
     * @param {HTMLElement} htmlElement HTMLElement which displays this buy button
     * @param {function} updateFunction update function for its content string
     */
    constructor(htmlElement, updateFunction) {

    }
}

// temporary logic
// Initialize all resources into a RES_ALL where it can be fetched through class keys
let htmlElement = document.getElementById("res_bar")
TIER1_RES_KEYS.forEach(resourceKey => {
    TIER1_RES_ALL[resourceKey] = new Resource(TIER1_RESOURCE_TYPE[resourceKey], htmlElement)
})