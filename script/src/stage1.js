function updateTier1() {
    updateTier1Unlocks()
    TIER1_RES_KEYS.forEach(resourceKey => {
        TIER1_RES_ALL[resourceKey].update()
    })
}

function updateTier1Unlocks() {
    if(!TIER1_RES_ALL.biomass.getUnlocked()) TIER1_RES_ALL.biomass.setUnlocked(true)
}

function renderTier1() {
    TIER1_RES_KEYS.forEach(resourceKey => {
        TIER1_RES_ALL[resourceKey].render()
    })
    TAB_ALL.tierOneTab.render()
}

function saveTier1() {
    TIER1_RES_KEYS.forEach(resourceKey => {
        TIER1_RES_ALL[resourceKey].save()
    })
}