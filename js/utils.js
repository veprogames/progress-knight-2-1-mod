function softcap(value, cap, power = 0.5) {
	if (value <= cap) return value
    
    return Math.pow(value, power) * Math.pow(cap, 1 - power)
}

function format(number, decimals = 1) {
    const units = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "O", "N", "D", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Od", "Nd", "V", "Uv", "Dv", "Tv",
    "Qav", "Qiv", "Sxv", "Spv", "Ov", "Nv", "Tr", "Ut", "Dt", "Tt"]

    // what tier? (determines SI symbol)
    const tier = Math.log10(number) / 3 | 0;
    if (tier <= 0) return math.floor(number, decimals).toFixed(decimals);

    if ((gameData.settings.numberNotation == 0 || tier < 3) && (tier < units.length)) {
        const suffix = units[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = number / scale;
        return math.floor(scaled, decimals).toFixed(decimals) + suffix;
    } else {
        if (gameData.settings.numberNotation == 1) {
            const exp = Math.log10(number) | 0;
            const scale = Math.pow(10, exp);
            const scaled = number / scale;
            return math.floor(scaled, decimals).toFixed(decimals) + "e" + exp;
        }
        else {
            const exp = Math.log10(number) / 3 | 0;
            const scale = Math.pow(10, exp * 3);
            const scaled = number / scale;
            return math.floor(scaled, decimals).toFixed(decimals) + "e" + exp * 3;
        }
    }
}

function formatCoins(coins, element) {
    const money2 = [
        { "name": "✹", "color": "#ffffcc", "value": 1e30 },
        { "name": "∰", "color": "#ff0083", "value": 1e26 },
        { "name": "𐙋", "color": "#27b897", "value": 1e23 },
        { "name": "𐅍", "color": "#cd72ff", "value": 1e20 },
        { "name": "Δ", "color": "#f5c211", "value": 1e17 },
        { "name": "d", "color": "#ffffff", "value": 1e14 },
        { "name": "r", "color": "#ed333b", "value": 1e12 },
        { "name": "S", "color": "#6666ff", "value": 1e10 },
        { "name": "e", "color": "#2ec27e", "value": 1e8 },
        { "name": "p", "color": "#79b9c7", "value": 1e6 },
        { "name": "g", "color": "#E5C100", "value": 10000 },
        { "name": "s", "color": "#a8a8a8", "value": 100 },
        { "name": "c", "color": "#a15c2f", "value": 1 },
    ];


    for(const c of element.children){
        c.textContent = "";
    }
    let c = 0
    for (let i = 0; i < money2.length; i++) {
        const m = money2[i];
        const prev = money2[i - 1];
        const diff = prev ? prev.value / m.value : Infinity;
        const amount = Math.floor(coins / m.value) % diff;
        if ((amount > 0 || m.name == "c")) {
            element.children[c].textContent = format(amount, amount < 1000 ? 0 : 1) + m.name
            element.children[c].style.color = m.color
            c++
        }
        if(c >= 2 || amount >= 100) break;
    }
}

function formatTime(sec_num, show_ms=false) {
    if (sec_num == null) {
        return "unknown"
    }

    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60))
    let ms = Math.floor((sec_num - Math.floor(sec_num)) * 1000)
    let mss = (show_ms ? "." + ms.toString().padStart(3, "0") : "")

    if (hours < 10) hours = "0" + hours
    if (minutes < 10) minutes = "0" + minutes
    if (seconds < 10) seconds = "0" + seconds
    return hours + ':' + minutes + ':' + seconds + mss   
}

function formatAge(days) {
    const years = daysToYears(days)
    const day = getCurrentDay(days)
    if (years > 10000)    
        return "Age " + format(years)    
    else
        return "Age " + years + " Day " + day
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function yearsToDays(years) {
    return years * 365
}

function daysToYears(days) {
    return Math.floor(days / 365)
}
 
function getCurrentDay(days) {
    return Math.floor(days - daysToYears(days) * 365)
}

function getElementsByClass(className) {
    return document.getElementsByClassName(removeSpaces(className))
}

function removeSpaces(string) {
    return string.replace(/ /g, "")
}