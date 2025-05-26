var languageCode = fetch("languageCode") || 1

function changeLanguage() {
    // Future
    // May add additional language codes
    if(languageCode == 1) {
        langObj = KO_KR
        store("languageCode", 2)
        languageCode = 2
    } else if (languageCode == 2) {
        langObj = EN_US
        store("languageCode", 1)
        languageCode = 1
    }
    console.log(`Changing Language to ${languageCode}`)
    updateStaticHTMLLangAssets()
    Object.keys(TIER1_RES_ALL).forEach(key => {
        TIER1_RES_ALL[key].changeLanguage()
    })
}

function updateStaticHTMLLangAssets() {
    document.getElementById("changeLanguageBtn").innerHTML = langObj['ETC_00000001']
    document.getElementById("importSaveBtn").innerHTML = langObj['ETC_00000002']
    document.getElementById("exportSaveBtn").innerHTML = langObj['ETC_00000003']
    document.getElementById("wipeSaveBtn").innerHTML = langObj['ETC_00000004']
    document.getElementById("defaultTab").innerHTML = langObj['TAB_00000001']
}

const EN_US = {
    RES_10100000_NAME: "Power",
    RES_10101001_NAME: "Biomass",
    RES_10107001_NAME: "Nutrient Paste",
    RES_10101002_NAME: "Redberries",
    RES_20101003_NAME: "Scrap",
    RES_20103001_NAME: "Metal",
    RES_30102001_NAME: "Basic Circuitry",
    RES_30104001_NAME: "Chemfuel",
    RES_30102002_NAME: "Basic Chemicals",
    RES_40111001_NAME: "Survival Rifle",
    RES_40110001_NAME: "Redberry Shine",
    RES_40106002_NAME: "Synthfiber",
    RES_40109001_NAME: "Uniform",
    RES_40110002_NAME: "Low Nobility Attire",
    RES_40105001_NAME: "Low Tech Munitions",
    ETC_00000001: "Change Language",
    ETC_00000002: "Import Save",
    ETC_00000003: "Export Save",
    ETC_00000004: "Wipe Save",
    ETC_00000005: "Paste your save string here:",
    ETC_00000006: "Save imported! Reloading...",
    ETC_00000007: "Invalid save string.",
    ETC_00000008: "Are you sure you want to wipe your save? This cannot be undone.",
    TAB_00000001: "Tier 1"
}

const KO_KR = {
    RES_10100000_NAME: "전력",
    RES_10101001_NAME: "바이오매스",
    RES_10107001_NAME: "영양죽",
    RES_10101002_NAME: "레드베리",
    RES_20101003_NAME: "고철",
    RES_20103001_NAME: "철강",
    RES_30102001_NAME: "기초 회로 부품",
    RES_30104001_NAME: "화학연료",
    RES_30102002_NAME: "기초 화학품",
    RES_40111001_NAME: "생존용 라이플",
    RES_40110001_NAME: "레드베리주",
    RES_40106002_NAME: "인공천",
    RES_40109001_NAME: "제복",
    RES_40110002_NAME: "하위 귀족 옷가지",
    RES_40105001_NAME: "기초 기술 탄약",
    ETC_00000001: "언어 변경",
    ETC_00000002: "불러오기",
    ETC_00000003: "내보내기",
    ETC_00000004: "세이브 초기화",
    ETC_00000005: "세이브 파일을 여기에 붙혀넣으세요:",
    ETC_00000006: "세이브 불러오기 성공! 새로고침하는 중입니다...",
    ETC_00000007: "올바르지 않은 세이브 파일입니다.",
    ETC_00000008: "세이브 파일을 초기화 하시겠습니까? 삭제 시 복구가 불가능합니다.",
    TAB_00000001: "1티어",
}

var langObj
if(languageCode == 1) {
    langObj = EN_US
} else {
    langObj = KO_KR
}
updateStaticHTMLLangAssets()