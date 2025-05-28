var updateUIFlag = false

const TIER1_UNLOCK_FLAGS = {
    scrap: false,
}

function updateTier1() {
    updateTier1Unlocks()
    TIER1_RES_KEYS.forEach(resourceKey => {
        TIER1_RES_ALL[resourceKey].update()
    })

    if(updateUIFlag) {
        TIER1_TAB.update()
        updateUIFlag = false
    }
}

function updateTier1Unlocks() {
    if (!TIER1_RES_ALL.biomass.getUnlocked()) TIER1_RES_ALL.biomass.setUnlocked(true)

    if (TIER1_RES_ALL.biomass.getResData().cur >= 10 && !TIER1_UNLOCK_FLAGS.scrap) {
        TIER1_RES_ALL.scrap.setUnlocked(true)
        TIER1_UNLOCK_FLAGS.scrap = true
        updateUIFlag = true
        console.log("unlocked scrap")
    }
}

function renderTier1() {
    TIER1_RES_KEYS.forEach(resourceKey => {
        TIER1_RES_ALL[resourceKey].render()
    })
}

function saveTier1() {
    TIER1_RES_KEYS.forEach(resourceKey => {
        TIER1_RES_ALL[resourceKey].save()
    })
}