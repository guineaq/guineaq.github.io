class Tab {
    #subHTMLElements
    /*
    * SubElements
    * {
    *   story:
    *   actions:
    *   
    * }
    */

    /*
    * SubElement
    * {
    *   id: 
    *   langId: "TAB_00000001_DESC"
    *   render: function
    *   hidden: true
    * }
    */
    #id
    #actionIdList

    constructor(parentId, id) {
        this.#id = id
        this.#subHTMLElements = {
            story: [],
        }
        this.#actionIdList = [];
    }

    addSubElementStory(HTMLElement) {
        this.#subHTMLElements.story.push(HTMLElement)
        document.getElementById(this.#id).innerHTML += HTMLElement
    }

    createSubElementActionBar(id, langId) {
        this.#subHTMLElements[id] = [];
        this.#subHTMLElements[`${id}_text`] = langObj[langId]
        this.#actionIdList.push(id)

        document.getElementById(this.#id).innerHTML += new HTMLElementActionBar()
    }

    addSubElementActionBar(id, HTMLElement) {
        this.#subHTMLElements[id].push(HTMLElement)
    }

    render() {
        let keys = Object.keys(this.#subHTMLElements)
        keys.forEach(key => {
            this.#subHTMLElements[key].forEach(el => {
                el.render()
            })
        }) 
    }

    changeLanguage() {

    }
}

class ActionBar {
    #subHTMLElements
    #id

    constructor(id) {
        this.#id
    }

    addSubElement(HTMLElement) {

    }
}

class HTMLElementButton {
    #id
    /* 
    * {
    *   style: []
    *   onclick: function
    *   className: ""
    *   langId: ""
    * }
    */
    #renderData
    #htmlString

    constructor(id, renderData, htmlString) {
        this.#id = id
        this.#renderData = renderData
        this.#htmlString = htmlString

        let el = document.getElementById(this.#id)
        el.addEventListener("click", (event) => this.#renderData.onlick(event))
        el.className = this.#renderData.className
    }

    init() {

    }

    update() {
        
    }

    render() {
        let el = document.getElementById(this.#id)
        el.innerHTML = this.#htmlString

        this.#renderData.style.forEach(s => {
            Object.assign(el.style, s)
        })
    }
}

class HTMLElementActionBar {
    constructor(parentId, id, langId) {
        let el = document.getElementById(parentId)
        el.innerHTML += langObj[langId]
    }
}

const TAB_ALL = {
    tierOneTab: new Tab("defaultTab"),
}