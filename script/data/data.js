/**
 * Calculates the passive gain 
 * @param {*} resData TIER1_RESOURCE, TIER2_RESOURCE...
 * @param {*} resKey biomass, power, ...
 */
function updateResource(resData, resKey, isActive=false) {
    let key = "passiveRate"
    if(isActive)
        key = "activeRate"

    let divisor = (1000 / TICK)
    if(isActive)
        divisor = 1

    const gain = (calculate(resData[resKey], key) + calculate(resData[resKey], key, true)) / divisor
    const max = calculate(resData[resKey], "max")

    if (max === -1) {
        resData[resKey].cur += gain
    } else {
        resData[resKey].cur = Math.max(0, Math.min(resData[resKey].cur + gain, max))
    }
}

function updateBuilding(bData, bKey) {
    let costs = [] // where the costs for all resource types will go
    let resKeys = Object.keys(bData[bKey].baseCost)

    resKeys.forEach(resKey => {
        // calculate the cost with cost coefficient per type
        costs.push(Math.floor(bData[bKey].baseCost[resKey] * Math.pow(bData[bKey].costCoefficient[resKey], bData[bKey].count)))
    })

    let canPurchase = true
    let index = 0
    resKeys.forEach(resKey => {
        // check if all resource has the enough res
        if(TIER1_RESOURCE[resKey].cur < costs[index])
            canPurchase = false
        index += 1
    })

    // if there's enough, purchase it
    if(canPurchase) {
        bData[bKey].count += 1
        index = 0
        resKeys.forEach(resKey => {
            TIER1_RESOURCE[resKey].cur -= costs[index]
            index += 1
        })

        let bonusKeys = Object.keys(bData[bKey].bonuses)
        bonusKeys.forEach(bonusKey => {
            RESOURCE_BONUSES_KEYS.forEach(key => {
                TIER1_RESOURCE[bonusKey][key][bKey] = bData[bKey].bonuses[bonusKey][key] * bData[bKey].count
            })
        })

        updateBuildingButton(bData[bKey].classID, bData[bKey])
    }
}

/**
 * Loads resource data from local storage
 * @param {*} resData TIER1_RESOURCE, TIER2_RESOURCE...
 * @param {*} resKey biomass, power, ...
 */
function loadResourceFromLocalStorage(resData, resKey) {
    resData[resKey].name = fetch(`${resData[resKey].classID}_name`, false, true) || resData[resKey].name
    resData[resKey].cur = fetch(`${resData[resKey].classID}_cur`) || resData[resKey].cur
    resData[resKey].max = fetch(`${resData[resKey].classID}_max`, true) || resData[resKey].max
    resData[resKey].type = fetch(`${resData[resKey].classID}_type`, false, true) || resData[resKey].type
    resData[resKey].passiveRate = fetch(`${resData[resKey].classID}_passiveRate`, true) || resData[resKey].passiveRate
    resData[resKey].activeRate = fetch(`${resData[resKey].classID}_activeRate`, true) || resData[resKey].activeRate
    resData[resKey].bonuses = loadResourceBonuses(resData, resKey) || resData[resKey].bonuses
}

/**
 * Saves resource data to local storage
 * @param {*} resData TIER1_RESOURCE, TIER2_RESOURCE...
 * @param {*} resKey biomass, power, ...
 */
function saveResourceToLocalStorage(resData, resKey) {
    store(`${resData[resKey].classID}_name`, resData[resKey].name)
    store(`${resData[resKey].classID}_cur`, resData[resKey].cur)
    store(`${resData[resKey].classID}_max`, resData[resKey].max, true)
    store(`${resData[resKey].classID}_type`, resData[resKey].type)
    store(`${resData[resKey].classID}_passiveRate`, resData[resKey].passiveRate, true)
    store(`${resData[resKey].classID}_activeRate`, resData[resKey].activeRate, true)
    RESOURCE_BONUSES_KEYS.forEach(key => {
        store(`${resData[resKey].classID}_bonuses_${key}`, resData[resKey].bonuses[key], true)
    })
}

/**
 * Loads resource data from local storage
 * @param {*} resData TIER1_RESOURCE, TIER2_RESOURCE...
 * @param {*} resKey biomass, power, ...
 */
function loadBuildingFromLocalStorage(buildingData, buildingKey) {
    buildingData[buildingKey].name = fetch(`${buildingData[buildingKey].classID}_name`, false, true) || buildingData[buildingKey].name
    buildingData[buildingKey].count = fetch(`${buildingData[buildingKey].classID}_count`) || buildingData[buildingKey].count
    buildingData[buildingKey].baseCost = fetch(`${buildingData[buildingKey].classID}_baseCost`, true) || buildingData[buildingKey].baseCost
    buildingData[buildingKey].costCoefficient = fetch(`${buildingData[buildingKey].classID}_costCoefficient`, true) || buildingData[buildingKey].costCoefficient
    buildingData[buildingKey].type = fetch(`${buildingData[buildingKey].classID}_type`, false, true) || buildingData[buildingKey].type
    Object.keys(buildingData[buildingKey].bonuses).forEach(resKey => {
        BUILDING_BONUSES_KEYS.forEach(key => {
            buildingData[buildingKey].bonuses[resKey][key] = fetch(`${buildingData[buildingKey].classID}_bonuses_${resKey}_${key}`) || buildingData[buildingKey].bonuses[resKey][key]
        })
    })
}

/**
 * Saves building data to local storage
 * @param {*} buildingData TIER1_BUILDING, TIER2_BUILDING...
 * @param {*} buildingKey barrel, scrapStack, ...
 */
function saveBuildingToLocalStorage(buildingData, buildingKey) {
    store(`${buildingData[buildingKey].classID}_name`, buildingData[buildingKey].name)
    store(`${buildingData[buildingKey].classID}_count`, buildingData[buildingKey].count)
    store(`${buildingData[buildingKey].classID}_baseCost`, buildingData[buildingKey].baseCost, true)
    store(`${buildingData[buildingKey].classID}_costCoefficient`, buildingData[buildingKey].costCoefficient, true)
    store(`${buildingData[buildingKey].classID}_type`, buildingData[buildingKey].type)
    Object.keys(buildingData[buildingKey].bonuses).forEach(resKey => {
        BUILDING_BONUSES_KEYS.forEach(key => {
            store(`${buildingData[buildingKey].classID}_bonuses_${resKey}_${key}`, buildingData[buildingKey].bonuses[resKey][key])
        })
    })
}

/**
 * Loads resource bonus
 * @param {*} resData TIER1_RESOURCE, TIER2_RESOURCE...
 * @param {*} resKey biomass, power, ...
 */
function loadResourceBonuses(resData, resKey) {
    let bonuses = {}
    RESOURCE_BONUSES_KEYS.forEach(key => {
        bonuses[key] = fetch(`${resData[resKey].classID}_bonuses_${key}`, true) || {}
    })
    return bonuses
}

/**
 * Calculates the sum of all values in a key
 * @param {*} resData TIER1_RESOURCE['biomass'], TIER2_RESOURCE[...], ...
 * @param {*} key cur, max, ...
 * @param {*} isBonus True or False
 * @returns 
 */
function calculate(resData, key, isBonus = false) {
    const target = isBonus ? resData.bonuses : resData
    const data = target[key]

    if (typeof data === 'number') {
        return data
    }
    if (typeof data === 'object' && data !== null) {
        return Object.values(data)
            .filter(val => typeof val === 'number')
            .reduce((sum, val) => sum + val, 0)
    }
    return 0
}

const RESOURCE_BONUSES_KEYS = ["max", "passiveRate", "activeRate"]
const BUILDING_BONUSES_KEYS = ["max", "passiveRate", "activeRate"]