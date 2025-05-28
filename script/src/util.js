// LocalStorage function
function fetch(key, isJSON = false, isString = false) {
    if (!isJSON)
        if (isString)
            return window.localStorage.getItem(key);
        else
            return Number(window.localStorage.getItem(key));
    else
        return JSON.parse(window.localStorage.getItem(key));
}

function store(key, item, isJSON = false) {
    if (!isJSON)
        window.localStorage.setItem(key, item);
    else
        window.localStorage.setItem(key, JSON.stringify(item));
}

// ------------ UI Util Functions -----------------

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const num = parseInt(hex, 16);
    return [
        (num >> 16) & 0xFF, // Red
        (num >> 8) & 0xFF,  // Green
        num & 0xFF          // Blue
    ];
}

function rgbToHex([r, g, b]) {
    return (
        '#' +
        [r, g, b]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')
    );
}

function subtractColors(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const result = rgb1.map((c, i) => Math.max(0, c - rgb2[i]));
    return rgbToHex(result);
}

function addHoverAndActiveColor(button, base, hover, active) {
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = hover; // hover color
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = base; // default color
    });

    button.addEventListener('mousedown', () => {
        button.style.backgroundColor = active; // active color
    });

    button.addEventListener('mouseup', () => {
        button.style.backgroundColor = hover; // back to hover color
    });
}

function removeHoverAndActiveColor(button) {
    if (!button._onMouseOver) return;
    button.removeEventListener('mouseover', button._onMouseOver);
    button.removeEventListener('mouseout', button._onMouseOut);
    button.removeEventListener('mousedown', button._onMouseDown);
    button.removeEventListener('mouseup', button._onMouseUp);
}

function evaluateResDataSum(resData) {
    if (typeof resData === 'object' && resData !== null && Object.keys(resData).length === 0) {
        return 0; // normalization in case empty to avoid error
    } else {
        let sum = 0;
        let dataKeys = Object.keys(resData)
        dataKeys.forEach(key => {
            sum += resData[key]
        })
        return sum
    }
}