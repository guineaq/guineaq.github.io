// LocalStorage function
function fetch(key, isJSON = false) {
    if(!isJSON)
        return Number(window.localStorage.getItem(key));
    else
        return JSON.parse(window.localStorage.getItem(key));
}

function store(key, item, isJSON = false) {
    if(!isJSON)
        window.localStorage.setItem(key, item);
    else
        window.localStorage.setItem(key, JSON.stringify(item));
}