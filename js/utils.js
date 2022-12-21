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
    const platina = Math.floor(coins / 1e6)
    const gold = Math.floor((coins - platina * 1e6) / 1e4)
    const silver = Math.floor((coins - platina * 1e6 - gold * 1e4) / 100)
    const copper = Math.floor(coins - platina * 1e6 - gold * 1e4 - silver * 100)

    const money = {
        "p": { "color": "#79b9c7", "value": platina },
        "g": { "color": "#E5C100", "value": gold },
        "s": { "color": "#a8a8a8", "value": silver },
        "c": { "color": "#a15c2f", "value": copper },
    }

    /*const money2 = [
        { "name": "p", "color": "#79b9c7", "value": 1e6 },
        { "name": "g", "color": "#E5C100", "value": 10000 },
        { "name": "s", "color": "#a8a8a8", "value": 100 },
        { "name": "c", "color": "#a15c2f", "value": 1 },
    ];*/

    let i = 0
    for (const key in money) {
        if(i >= 2) break;
        const m = money[key];
        if ((m.value > 0 || key == "c")) {
            element.children[i].textContent = format(m.value, m.value < 1000 ? 0 : 1) + key
            element.children[i].style.color = m.color
            i++
        }
        else {
            element.children[i].textContent = ""            
        }
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