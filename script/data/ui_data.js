class Tab {
    #parentId
    #storyId
    #actionBarId
    #actionBars

    constructor(parentId, storyId, actionBarId, actionBars) {
        this.#parentId = parentId
        this.#storyId = storyId
        this.#actionBarId = actionBarId
        this.#actionBars = actionBars

        this.update()
    }

    addButton(actionBarId, button) {
        this.#actionBars[actionBarId].buttons[button.id] = button
    }

    update() {
        let actionBarKeys = Object.keys(this.#actionBars)
        actionBarKeys.forEach(key => {
            let actionBar = this.#actionBars[key]
            let el = document.getElementById(actionBar.id)

            el.innerHTML = langObj[actionBar.langObjId]
            try {
                let b = Object.keys(actionBar.buttons)
                b.forEach(btnKey => {
                    actionBar.buttons[btnKey].update()
                })
            } catch (e) { }
        })
    }
}

class ResourceButton {
    #res
    #langObjId
    #hasLangVars
    #parentId
    #isUnlocked
    #onClick

    constructor(parentId, res, langObjId, hasLangVars, isUnlocked, onClick) {
        this.#parentId = parentId
        this.#res = res
        this.#langObjId = langObjId
        this.#hasLangVars = hasLangVars
        this.#isUnlocked = isUnlocked
        this.#onClick = onClick
    }

    update() {
        if(!this.#isUnlocked && this.#res.getUnlocked()) this.#isUnlocked = true
        let e = document.getElementById(this.#parentId)
        let unlocked = this.#isUnlocked ? `display: block;` : `display: none;`
        let baseColor = this.#res.getResArr().color

        e.innerHTML += `<button id="${this.#langObjId}_btn" style="${unlocked}; background-color: ${baseColor};" class="flButton"></button>`

        let btn = document.getElementById(`${this.#langObjId}_btn`)

        let hoverColor = subtractColors(baseColor, "#111111")
        let activeColor = subtractColors(baseColor, "#202020")

        addHoverAndActiveColor(btn, baseColor, hoverColor, activeColor)

        let btnString = ""
        if (this.#hasLangVars) {
            let langKeys = Object.keys(LANG_VARS[this.#langObjId])
            btnString = langObj[this.#langObjId]

            langKeys.forEach(key => {
                btnString = btnString.replace(LANG_VARS[this.#langObjId][key], this.#evaluateLangVarKey(key))
            })
        } else {
            btnString = langObj[this.#langObjId]
        }
        btn.innerHTML = `<span>${btnString}</span>`
        btn.setAttribute("onclick", this.#onClick)
    }

    #evaluateLangVarKey(key) {
        if (key === "qty") {
            let resData = this.#res.getResData()
            return Math.floor(evaluateResDataSum(resData.activeRate) + evaluateResDataSum(resData.bonuses["activeRate"]))
        }
    }
}

class BuildingButton {

}

class PopulationButton {

}

const TIER1_TAB = new Tab("tier1", "t1story", "t1actions", {
    manual: {
        id: "t1manual", langObjId: "TAB_00000002", buttons: {
            buyBiomass: new ResourceButton("t1manual", TIER1_RES_ALL["biomass"], "RES_10101001_BUY", true, true, `TIER1_RES_ALL["biomass"].updateResData("active1")`),
            buyScrap: new ResourceButton("t1manual", TIER1_RES_ALL["scrap"], "RES_20101003_BUY", true, false, `TIER1_RES_ALL["scrap"].updateResData("active1")`),
        }
    },
    producer: {
        id: "t1producer", langObjId: "TAB_00000003", buttons: {

        }
    },
    storage: {
        id: "t1storage", langObjId: "TAB_00000004", button: {
            buyBarrel: new BuildingButton(),
            buyScrapStack: new BuildingButton(),
        }
    }
})