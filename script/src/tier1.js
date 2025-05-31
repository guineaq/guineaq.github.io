const TIER1_UNLOCK_FLAGS = {
    start: {
        unlocked: fetch("start_unlocked", false, false, true) || true,
        wasUnlocked: fetch("start_wasUnlocked", false, false, true) || false,
        updated: false,
        htmlID: ["10101001_div"],
        htmlID_block: ["10101001_btn"]
    },
    scrap: {
        unlocked: fetch("scrap_unlocked", false, false, true) || false,
        wasUnlocked: fetch("scrap_wasUnlocked", false, false, true) || false,
        updated: false,
        htmlID: ["20101003_div"],
        htmlID_block: ["20101003_btn", "50101001_btn", "50101002_btn", "t1storage"]
    },
}

function initializeTier1() {
    TIER1_RES_KEYS.forEach(resourceKey => {
        loadResourceFromLocalStorage(TIER1_RESOURCE, resourceKey)
    })

    TIER1_BUILDING_KEYS.forEach(buildingKey => {
        loadBuildingFromLocalStorage(TIER1_BUILDING, buildingKey)
    })

    TIER1_RES_KEYS.forEach(resourceKey => {
        let htmlElement = document.getElementById("res_bar")
        let classID = TIER1_RESOURCE[resourceKey].classID
        generateResourceDisplay(classID, TIER1_RESOURCE[resourceKey].color, htmlElement)
    })

    const RES_BTN_KEYS = ["biomass", "scrap"]
    RES_BTN_KEYS.forEach(resourceKey => {
        let htmlElement = document.getElementById("t1manual")
        generateResourceButton(TIER1_RESOURCE[resourceKey].classID,
            "TIER1_RESOURCE",
            TIER1_RESOURCE[resourceKey],
            resourceKey,
            TIER1_RESOURCE[resourceKey].color,
            htmlElement
        )
    })

    RES_BTN_KEYS.forEach(resourceKey => {
        generateResourceButton2(TIER1_RESOURCE[resourceKey].classID, TIER1_RESOURCE[resourceKey].color)
    })

    TIER1_BUILDING_KEYS.forEach(buildingKey => {
        let htmlElement = document.getElementById(getBuildingHtmlElement(buildingKey))
        generateBuildingButton(TIER1_BUILDING[buildingKey].classID,
            "TIER1_BUILDING",
            TIER1_BUILDING[buildingKey],
            buildingKey,
            TIER1_BUILDING[buildingKey].color,
            htmlElement
        )
    })

    TIER1_BUILDING_KEYS.forEach(buildingKey => {
        generateBuildingButton2(TIER1_BUILDING[buildingKey].classID, TIER1_BUILDING[buildingKey].color)
    })
}

function updateTier1() {
    checkTier1Unlocks()
    updateTier1Unlocks()
    TIER1_RES_KEYS.forEach(resourceKey => {
        updateResource(TIER1_RESOURCE, resourceKey)
    })
}

function checkTier1Unlocks() {
    if (TIER1_RESOURCE.biomass.cur >= 10 && TIER1_UNLOCK_FLAGS.scrap.unlocked === false) {
        TIER1_UNLOCK_FLAGS.scrap.unlocked = true
    }
}

function updateTier1Unlocks() {
    handleTierUnlock(TIER1_UNLOCK_FLAGS.start, "Game Started", "start");
    handleTierUnlock(TIER1_UNLOCK_FLAGS.scrap, "Scraps & Basic Storage Unlocked", "scrap");
}

function handleTierUnlock(flag, unlockMsg, unlockKey) {
    if (flag.unlocked === true && flag.updated === false) {
        revealElements(flag.htmlID);
        revealElements(flag.htmlID_block, true);
        flag.updated = true;
        if (!flag.wasUnlocked) {
            if (unlockMsg) showNotification(unlockMsg);
            flag.wasUnlocked = true;
            store(`${unlockKey}_unlocked`, flag.unlocked);
            store(`${unlockKey}_wasUnlocked`, flag.wasUnlocked);
        }
    }
}

function renderTier1() {
    TIER1_RES_KEYS.forEach(resourceKey => {
        renderResourceDisplay(TIER1_RESOURCE[resourceKey])
    })
}

function saveTier1() {
    showNotification("Game Saved", 3000)
    TIER1_RES_KEYS.forEach(resourceKey => {
        saveResourceToLocalStorage(TIER1_RESOURCE, resourceKey)
    })

    TIER1_BUILDING_KEYS.forEach(buildingKey => {
        saveBuildingToLocalStorage(TIER1_BUILDING, buildingKey)
    })
}