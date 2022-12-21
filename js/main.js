onerror = () => {
    document.getElementById("errorInfo").hidden = false
    setInterval(() => {
        document.getElementById("errorInfo").hidden = true
    }, 30 * 1000)
}

var gameData = {
    taskData: {},
    itemData: {},
    milestoneData: {},

    coins: 0,
    days: 365 * 14,
    evil: 0,
    essence: 0,
    paused: false,
    timeWarpingEnabled: true,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,
    rebirthThreeCount: 0,

    currentJob: null,
    currentProperty: null,
    currentMisc: null,

    settings: {
        stickySidebar: true,
        theme: 1,
        numberNotation: 0,
        layout: 1,
        fontSize: 3,
        selectedTab: 'jobs'
    },
    stats: {
        startDate: new Date(),
        fastest1: null,
        fastest2: null,
        fastest3: null,
        fastestGame: null,
        EvilPerSecond: 0,
        maxEvilPerSecond: 0,
        maxEvilPerSecondRt: 0,
        EssencePerSecond: 0,
        maxEssencePerSecond: 0,
        maxEssencePerSecondRt: 0,


    },
    active_challenge: "",
    challenges: {
        an_unhappy_life: 0,
        rich_and_the_poor: 0,
        time_does_not_fly: 0,
        dance_with_the_devil: 0,
        legends_never_die: 0,
    },
    realtime: 0.0,
    realtimeRun: 0.0,
    completedTimes: 0,    
}

var tempData = {}

var autoBuyEnabled = true

const updateSpeed = 20
const baseLifespan = 365 * 70
const baseGameSpeed = 4
const heroIncomeMult = 2500000000000000000


const permanentUnlocks = ["Quick task display"]

const jobBaseData = {
    "Beggar": { name: "Beggar", maxXp: 50, income: 5, heroxp: 36 },
    "Farmer": {name: "Farmer", maxXp: 100, income: 9, heroxp: 37 },
    "Fisherman": { name: "Fisherman", maxXp: 200, income: 15, heroxp: 38 },
    "Miner": { name: "Miner", maxXp: 400, income: 40, heroxp: 39 },
    "Blacksmith": { name: "Blacksmith", maxXp: 800, income: 80, heroxp: 40 },
    "Merchant": { name: "Merchant", maxXp: 1600, income: 150, heroxp: 41 },

    "Squire": { name: "Squire", maxXp: 42, income: 5, heroxp: 51 },
    "Footman": { name: "Footman", maxXp: 1000, income: 50, heroxp: 52 },
    "Veteran footman": { name: "Veteran footman", maxXp: 10000, income: 120, heroxp: 53 },
    "Centenary": { name: "Centenary", maxXp: 100000, income: 300, heroxp: 54 },
    "Knight": { name: "Knight", maxXp: 1000000, income: 1000, heroxp: 63 },
    "Veteran Knight": { name: "Veteran Knight", maxXp: 7500000, income: 3000, heroxp: 63 },
    "Holy Knight": { name: "Holy Knight", maxXp: 40000000, income: 5000, heroxp: 64 },
    "Lieutenant General": { name: "Lieutenant General", maxXp: 150000000, income: 50000, heroxp: 77 },

    "Student": { name: "Student", maxXp: 100000, income: 100, heroxp: 79 },
    "Apprentice Mage": { name: "Apprentice Mage", maxXp: 1000000, income: 1000, heroxp: 82 },
    "Adept Mage": { name: "Adept Mage", maxXp: 10000000, income: 9500, heroxp: 82 },
    "Master Wizard": { name: "Master Wizard", maxXp: 100000000, income: 70000, heroxp: 95 },
    "Archmage": { name: "Archmage", maxXp: 10000000000, income: 350000, heroxp: 95 },
    "Chronomancer": { name: "Chronomancer", maxXp: 2000000000000, income: 1000000, heroxp: 95 },
    "Chairman": { name: "Chairman", maxXp: 20000000000000, income: 10000000, heroxp: 106 },
    "Imperator": { name: "Imperator", maxXp: 9000000000000000, income: 60000000, heroxp: 129 },
	
    "Corrupted": { name: "Corrupted", maxXp: 100000000000000, income: 25000000, heroxp: 131 },
    "Void Slave": { name: "Void Slave", maxXp: 650000000000000, income: 200000000, heroxp: 134 },
    "Void Fiend": { name: "Void Fiend", maxXp: 18000000000000000, income: 600000000, heroxp: 237 }, 
    "Abyss Anomaly": { name: "Abyss Anomaly", maxXp: 18000000000000000, income: 1200000000, heroxp: 237 },
    "Void Wraith": { name: "Void Wraith", maxXp: 180000000000000000, income: 5000000000, heroxp: 238 }, 
    "Void Reaver": { name: "Void Reaver", maxXp: 2600000000000000000, income: 25000000000, heroxp: 238 },
    "Void Lord": { name: "Void Lord", maxXp: 28000000000000000000, income: 100000000000, heroxp: 238 },
    "Abyss God": { name: "Abyss God", maxXp: 400000000000000000000, income: 1000000000000, heroxp: 250 },
    "Eternal Wanderer": { name: "Eternal Wanderer", maxXp: 55000000000000000000, income: 1000000000000, heroxp: 250 },

    "Nova": { name: "Nova", maxXp: 51000000000000000000, income: 3000000000000, heroxp: 250 },
    "Sigma Proioxis": { name: "Sigma Proioxis", maxXp: 500000000000000000000, income: 25000000000000, heroxp: 260 },
    "Acallaris": { name: "Acallaris", maxXp: 50000000000000000000000, income: 215000000000000, heroxp: 263 },
    "One Above All": { name: "One Above All", maxXp: 5000000000000000000000000000, income: 25000000000000000, heroxp: 265 },
	
}

const skillBaseData = {
    "Concentration": { name: "Concentration", maxXp: 100, heroxp: 36, effect: 0.01, description: "Ability XP"},
    "Productivity": { name: "Productivity", maxXp: 100, heroxp: 37, effect: 0.01, description: "Class XP"},
    "Bargaining": { name: "Bargaining", maxXp: 100, heroxp: 38, effect: -0.01, description: "Reduced Expenses"},
    "Meditation": { name: "Meditation", maxXp: 100, heroxp: 39, effect: 0.01, description: "Happiness"},

    "Strength": { name: "Strength", maxXp: 100, heroxp: 40, effect: 0.01, description: "Military Pay"},
    "Battle Tactics": { name: "Battle Tactics", maxXp: 100, heroxp: 41, effect: 0.01, description: "Military XP"},
    "Muscle Memory": { name: "Muscle Memory", maxXp: 100, heroxp: 42, effect: 0.01, description: "Strength XP"},

    "Mana Control": { name: "Mana Control", maxXp: 100, heroxp: 46, effect: 0.01, description: "T.A.A. XP"},
    "Life Essence": { name: "Life Essence", maxXp: 100, heroxp: 82, effect: 0.01, description: "Longer Lifespan"},
    "Time Warping": { name: "Time Warping", maxXp: 100, heroxp: 82, effect: 0.01, description: "Gamespeed"},
    "Astral Body": { name: "Astral Body", maxXp: 100, heroxp: 100, effect: 0.0035, description: "Longer lifespan"},
    "Temporal Dimension": { name: "Temporal Dimension", maxXp: 100, heroxp: 115, effect: 0.006, description: "Gamespeed"},
    "All Seeing Eye": { name: "All Seeing Eye", maxXp: 100, heroxp: 120, effect: 0.0027, description: "T.A.A Pay"},
    "Brainwashing": { name: "Brainwashing", maxXp: 100, heroxp: 145, effect: -0.01, description: "Reduced Expenses"},
	
    "Dark Influence": { name: "Dark Influence", maxXp: 100, heroxp: 155, effect: 0.01, description: "All XP"},
    "Evil Control": { name: "Evil Control", maxXp: 100, heroxp: 156, effect: 0.01, description: "Evil Gain"},
    "Intimidation": { name: "Intimidation", maxXp: 100, heroxp: 157, effect: -0.01, description: "Reduced Expenses" },
    "Demon Training": { name: "Demon Training", maxXp: 100, heroxp: 174, effect: 0.01, description: "All XP"},
    "Blood Meditation": { name: "Blood Meditation", maxXp: 100, heroxp: 176, effect: 0.01, description: "Evil Gain"},
    "Demon's Wealth": { name: "Demon's Wealth", maxXp: 100, heroxp: 178, effect: 0.002, description: "Class Pay"},
    "Dark Knowledge": { name: "Dark Knowledge", maxXp: 100, heroxp: 180, effect: 0.003, description: "Class XP" },

    "Void Influence": { name: "Void Influence", maxXp: 100, heroxp: 206, effect: 0.0028, description: "All XP"},
    "Time Loop": { name: "Time Loop", maxXp: 100, heroxp: 207, effect: 0.001, description: "Gamespeed"},
    "Evil Incarnate": { name: "Evil Incarnate", maxXp: 100, heroxp: 208, effect: 0.01, description: "Ability XP" },
    "Absolute Wish": { name: "Absolute Wish", maxXp: 100, heroxp: 198, effect: 0.005, description: "Evil Gain" },
    "Void Amplification": { name: "Void Amplification", maxXp: 100, heroxp: 251, effect: 0.01, description: "The Void XP" },
    "Mind Release": { name: "Mind Release", maxXp: 100, heroxp: 251, effect: 0.0006, description: "Increased Happiness" },
    "Ceaseless Abyss": { name: "Ceaseless Abyss", maxXp: 100, heroxp: 251, effect: 0.000585, description: "Longer Lifespan" },
    "Void Symbiosis": { name: "Void Symbiosis", maxXp: 100, heroxp: 253, effect: 0.0015, description: "Ability XP" },
    "Void Embodiment": { name: "Void Embodiment", maxXp: 100, heroxp: 258, effect: 0.0025, description: "Evil Gain" },
    "Abyss Manipulation": { name: "Abyss Manipulation", maxXp: 100, heroxp: 266, effect: -0.01, description: "Reduced Expenses" },

    "Cosmic Longevity": { name: "Cosmic Longevity", maxXp: 100, heroxp: 266, effect: 0.0015, description: "Longer Lifespan" },
    "Cosmic Recollection": { name: "Cosmic Recollection", maxXp: 100, heroxp: 272, effect: 0.00065, description: "Max Lvl Multiplier" },
    "Essence Collector": { name: "Essence Collector", maxXp: 100, heroxp: 288, effect: 0.01, description: "Essence Gain" },
    "Galactic Command": { name: "Galactic Command", maxXp: 100, heroxp: 290, effect: -0.01, description: "Reduced Expenses" },

    "Yin Yang": { name: "Yin Yang", maxXp: 100, heroxp: 290, effect: 0.020, description: "Essence + Evil Gain" },
    "Parallel Universe": { name: "Parallel Universe", maxXp: 290, heroxp: 300, effect: 0.02, description: "All XP"},
    "Higher Dimensions": { name: "Higher Dimensions", maxXp: 290, heroxp: 300, effect: 0.001, description: "Longer Lifespan" },
    "Epiphany": { name: "Epiphany", maxXp: 100, heroxp: 280, effect: 0.012, description: "Galactic Council XP"},

}

const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1, heromult: 2, heroeffect: 2e6},
    "Tent": { name: "Tent", expense: 15, effect: 1.4, heromult: 2, heroeffect: 2e7 },
    "Wooden Hut": { name: "Wooden Hut", expense: 100, effect: 2, heromult: 3, heroeffect: 2e8 },
    "Cottage": { name: "Cottage", expense: 750, effect: 3.5, heromult: 3, heroeffect: 2e9 },
    "House": { name: "House", expense: 3000, effect: 6, heromult: 4, heroeffect: 2e10 },
    "Large House": { name: "Large House", expense: 25000, effect: 12, heromult: 4, heroeffect: 2e11 },
    "Small Palace": { name: "Small Palace", expense: 300000, effect: 25, heromult: 5, heroeffect: 2e12 },
    "Grand Palace": { name: "Grand Palace", expense: 5000000, effect: 60, heromult: 5, heroeffect: 2e13 },
    "Town Ruler": { name: "Town Ruler", expense: 35000000, effect: 120, heromult: 6, heroeffect: 2e15 },
    "City Ruler": { name: "City Ruler", expense: 1100000000, effect: 500, heromult: 7, heroeffect: 2e17 },
    "Nation Ruler": { name: "Nation Ruler", expense: 13000000000, effect: 1200, heromult: 8, heroeffect: 2e19 },
    "Pocket Dimension": { name: "Pocket Dimension", expense: 49000000000, effect: 5000, heromult: 9, heroeffect: 2e22 },
    "Void Realm": { name: "Void Realm", expense: 121000000000, effect: 15000, heromult: 10, heroeffect: 2e25 },
    "Void Universe": { name: "Void Universe", expense: 2000000000000, effect: 30000, heromult: 11, heroeffect: 2e28 },
    "Astral Realm": { name: "Astral Realm", expense: 160000000000000, effect: 150000, heromult: 12, heroeffect: 2e31 },
    "Galactic Throne": { name: "Galactic Throne", expense: 5000000000000000, effect: 300000, heromult: 13, heroeffect: 2e35 },
    "Spaceship": { name: "Spaceship", expense: 1000000000000000000, effect: 1500000, heromult: 15, heroeffect: 5e42 },
                                                            

    "Book": { name: "Book", expense: 10, effect: 1.5, description: "Ability XP", heromult: 2 },
    "Dumbbells": { name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength XP", heromult: 2 },
    "Personal Squire": { name: "Personal Squire", expense: 200, effect: 2, description: "Class XP", heromult: 3 },
    "Steel Longsword": { name: "Steel Longsword", expense: 1000, effect: 2, description: "Military XP", heromult: 3 },
    "Butler": { name: "Butler", expense: 7500, effect: 1.5, description: "Happiness", heromult: 4 },
    "Sapphire Charm": { name: "Sapphire Charm", expense: 50000, effect: 3, description: "Magic XP", heromult:4 },
    "Study Desk": { name: "Study Desk", expense: 1000000, effect: 2, description: "Ability XP", heromult: 5 },
    "Library": { name: "Library", expense: 10000000, effect: 2, description: "Ability XP", heromult: 5 },
    "Observatory": { name: "Observatory", expense: 140000000, effect: 5, description: "Magic XP", heromult: 6 },
    "Mind's Eye": { name: "Mind's Eye", expense: 3250000000, effect: 10, description: "Fundamentals XP", heromult: 8 },
    "Void Necklace": { name: "Void Necklace", expense: 28050000000, effect: 3, description: "Void Manipulation XP", heromult: 10 },
    "Void Armor": { name: "Void Armor", expense: 197050000000, effect: 3, description: "The Void XP", heromult: 10 },
    "Void Blade": { name: "Void Blade", expense: 502050000000, effect: 3, description: "Ability XP", heromult: 11 },
    "Void Orb": { name: "Void Orb", expense: 1202050000000, effect: 3, description: "Void Manipulation XP", heromult: 11 },
    "Void Dust": { name: "Void Dust", expense: 25002050000000, effect: 3, description: "The Void XP", heromult: 12 },
    "Celestial Robe": { name: "Celestial Robe", expense: 300002050000000, effect: 5, description: "Galactic Council XP", heromult: 12 },
    "Universe Fragment": { name: "Universe Fragment", expense: 18500002050000000, effect: 3, description: "Ability XP", heromult: 13 },
    "Multiverse Fragment": { name: "Multiverse Fragment", expense: 200500002050000000, effect: 5, description: "Happiness", heromult: 15 },
}

milestoneBaseData = {
    "Magic Eye": { name: "Magic Eye", expense: 5000, tier: 1, description: "Automatically gain max levels at age 65" },
    "Almighty Eye": { name: "Almighty Eye", expense: 15000, tier: 2, description: "Automatically gain max levels" },
    "Deal with the Devil": { name: "Deal with the Devil", expense: 30000, tier: 3, description: "Passively gain a small amount of Evil" },
    "Transcendent Master": { name: "Transcendent Master", expense: 50000, tier: 4, description: "Essence gain" },
    "Eternal Time": { name: "Eternal Time", expense: 75000, tier: 5, description: "x2 Time Warping" },
    "Hell Portal": { name: "Hell Portal", expense: 120000, tier: 6, description: "Passively gain a huge amount of Evil" },
    "Inferno": { name: "Inferno", expense: 170000, tier: 7, description: "x5 Evil gain" },
    "God's Blessings": { name: "God's Blessings", expense: 250000, tier: 8, description: "x10M Happiness" },
    "Faint Hope": { name: "Faint Hope", expense: 400000, tier: 9, description: "Essence gain (increases over time)" },
    "New Beginning": { name: "New Beginning", expense: 5000000, tier: 10, description: "Heroic jobs, skills and items are unlocked" },

    "Rise of Great Heroes": { name: "Rise of Great Heroes", expense: 10000000, tier: 11, description: "Essence gain + x10000 Hero XP" },
    "Lazy Heroes": { name: "Lazy Heroes", expense: 20000000, tier: 12, description: "Hero XP", effect : 1e12},
    "Dirty Heroes": { name: "Dirty Heroes", expense: 30000000, tier: 13, description: "Hero XP", effect : 1e15 },
    "Angry Heroes": { name: "Angry Heroes", expense: 50000000, tier: 14, description: "Hero XP", effect : 1e15 },
    "Tired Heroes": { name: "Tired Heroes", expense: 100000000, tier: 15, description: "Hero XP", effect : 1e15 },
    "Scared Heroes": { name: "Scared Heroes", expense: 150000000, tier: 16, description: "Hero XP", effect : 1e15 },
    "Good Heroes": { name: "Good Heroes", expense: 200000000, tier: 17, description: "Hero XP", effect : 1e15 },
    "Funny Heroes": { name: "Funny Heroes", expense: 300000000, tier: 18, description: "Hero XP", effect : 1e25 },
    "Beautiful Heroes": { name: "Beautiful Heroes", expense: 400000000, tier: 19, description: "Hero XP", effect : 1e50 },
    "Awesome Heroes": { name: "Awesome Heroes", expense: 500000000, tier: 20, description: "Hero XP", effect : 1e10 },
    "Furious Heroes": { name: "Furious Heroes", expense: 750000000, tier: 21, description: "Hero XP", effect : 1e18 },
    "Superb Heroes": { name: "Superb Heroes", expense: 10000000000, tier: 22, description: "Hero XP", effect : 1e3 },
}

const jobCategories = {
    "Common work"            : ["Beggar", "Farmer", "Fisherman", "Miner", "Blacksmith", "Merchant"],
    "Military"               : ["Squire", "Footman", "Veteran footman", "Centenary", "Knight", "Veteran Knight", "Holy Knight", "Lieutenant General"],
    "The Arcane Association" : ["Student", "Apprentice Mage", "Adept Mage", "Master Wizard", "Archmage", "Chronomancer", "Chairman", "Imperator"],
	"The Void"               : ["Corrupted", "Void Slave", "Void Fiend", "Abyss Anomaly", "Void Wraith", "Void Reaver", "Void Lord", "Abyss God"],
    "Galactic Council"       : ["Eternal Wanderer", "Nova", "Sigma Proioxis", "Acallaris", "One Above All"]
}

const skillCategories = {
    "Fundamentals"           : ["Concentration", "Productivity", "Bargaining", "Meditation"],
    "Combat"                 : ["Strength", "Battle Tactics", "Muscle Memory"],
    "Magic"                  : ["Mana Control", "Life Essence", "Time Warping", "Astral Body", "Temporal Dimension", "All Seeing Eye", "Brainwashing"],
    "Dark Magic"             : ["Dark Influence", "Evil Control", "Intimidation", "Demon Training", "Blood Meditation", "Demon's Wealth", "Dark Knowledge", "Void Influence", "Time Loop", "Evil Incarnate"],
	"Void Manipulation"      : ["Absolute Wish", "Void Amplification", "Mind Release", "Ceaseless Abyss", "Void Symbiosis", "Void Embodiment", "Abyss Manipulation"],
	"Celestial Powers"       : ["Cosmic Longevity", "Cosmic Recollection", "Essence Collector", "Galactic Command"],
	"Almightiness"           : ["Yin Yang", "Parallel Universe", "Higher Dimensions", "Epiphany"]
}

const itemCategories = {
    "Properties": ["Homeless", "Tent", "Wooden Hut", "Cottage", "House", "Large House", "Small Palace", "Grand Palace", "Town Ruler", "City Ruler", "Nation Ruler", "Pocket Dimension", "Void Realm", "Void Universe", "Astral Realm", "Galactic Throne", "Spaceship"],
    "Misc": ["Book", "Dumbbells", "Personal Squire", "Steel Longsword", "Butler", "Sapphire Charm", "Study Desk", "Library", "Observatory", "Mind's Eye", "Void Necklace", "Void Armor", "Void Blade", "Void Orb", "Void Dust", "Celestial Robe", "Universe Fragment", "Multiverse Fragment"]
}

const milestoneCategories = {
    "Essence Milestones": ["Magic Eye", "Almighty Eye", "Deal with the Devil", "Transcendent Master", "Eternal Time", "Hell Portal", "Inferno", "God's Blessings", "Faint Hope"],
    "Heroic Milestones": ["New Beginning", "Rise of Great Heroes", "Lazy Heroes", "Dirty Heroes", "Angry Heroes", "Tired Heroes", "Scared Heroes", "Good Heroes", "Funny Heroes", "Beautiful Heroes", "Awesome Heroes", "Furious Heroes", "Superb Heroes"]
}

function getPreviousTaskInCategory(task)
{
    var prev = ""
    for (const category in jobCategories) {
        for (job of jobCategories[category]) {
            if (job == task)
                return prev
            prev = job
        }        
    }

    prev = ""
    for (const category in skillCategories) {
        for (skill of skillCategories[category]) {
            if (skill == task)
                return prev
            prev = skill
        }
    }
    return prev
}

const headerRowColors = {
    "Common work": "#55a630",
    "Military": "#e63946",
    "The Arcane Association": "#C71585",
	"The Void": "#762B91",
    "Galactic Council": "#D5C010",
    "Fundamentals": "#55a630",
    "Combat": "#e63946",
    "Magic": "#C71585",
    "Dark Magic": "#73000f",
	"Almightiness": "#18d2d9",
	"Void Manipulation": "#762B91",
	"Celestial Powers": "#D5C010",
    "Properties_Auto": "#21cc5e",
    "Misc_Auto": "#f54546",
    "Properties": "#219ebc",
    "Misc": "#b56576",
    "Essence Milestones": "#0066ff",
    "Heroic Milestones": "#ff6600",
}

const headerRowTextColors = {
    "Common work": "darkblue",
    "Military": "purple",
    "The Arcane Association": "magenta",
    "The Void": "white",
    "Galactic Council": "purple",
    "Fundamentals": "purple",
    "Combat": "pink",
    "Magic": "purple",
    "Dark Magic": "pink",
    "Almightiness": "purple",
    "Void Manipulation": "white",
    "Celestial Powers": "purple",
    "Properties_Auto": "purple",
    "Misc_Auto": "purple",
    "Properties": "purple",
    "Misc": "purple",
    "Essence Milestones": "purple",
    "Heroic Milestones": "purple",
}

const tooltips = {
	// Common work
    "Beggar": "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",
    "Farmer": "Plow the fields and grow the crops. It's not much but it's honest work.",
    "Fisherman": "Reel in various fish and sell them for a handful of coins. A relaxing but still poor paying job.",
    "Miner": "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved.",
    "Blacksmith": "Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job.",
    "Merchant": "Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive.",
	
    // Military
    "Squire": "Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable.",
    "Footman": "Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things.",
    "Veteran footman": "More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad.",
    "Centenary": "By proving your skills with a bow, you were appointed to lead a small group of archers to ambush your enemies from a distance.",
    "Knight": "Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job.",
    "Veteran Knight": "Utilising your unmatched combat ability, slaugher enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this.",
    "Holy Knight": "Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while wielding a magically imbued blade. Such a feared unit on the battlefield is paid extremely well.",
    "Lieutenant General": "Feared by nations, obliterate entire armies in a blink of an eye. Roughly every century, only one holy knight is worthy of receiving such an esteemed title.",

    // The Arcane Association
    "Student": "Study the theory of mana and practice basic spells. There is minor pay to cover living costs; however, this is a necessary stage in becoming a mage.",
    "Apprentice Mage": "Under the supervision of a skilled mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
    "Adept Mage": "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
    "Master Wizard": "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.",
    "Archmage": "Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that an archmage has enough destructive power to wipe an empire off the map.",
	"Chronomancer": "Specialize in harnessing temporal energies that alter the flow of time with supernatural divinations and otherwordly expertise.",
    "Chairman": "Spend your days administrating The Arcane Association and investigate the concepts of true immortality. The chairman receives ludicrous amounts of pay daily.",
	"Imperator": "You wield an unlimited power, making you unstoppable. By ruling with an iron fist, everyone in the Arcane Association has to obey your commands.",

    // The Void
    "Corrupted": "Corrupted by Void, you are slowly turning into a slave with no free will, just to serve the Void for the rest of eternity... Can you resist it, or will it consume you forever?",
    "Void Slave": "Each day, you are succumbing to the Void more and more. Can you hold onto your humanity for a bit longer, or will you let the Void devour you?",
    "Void Fiend": "You become an inquisitive yet putrid creature that siphons life from everything around you.",
	"Abyss Anomaly": "Screaming into existence, you become a manifestation of the unknowable nothingness that lies beyond.",
	"Void Wraith": "Damned soul... a shadow of your former self, lingering between realms and consumed by void... Can you ever find peace?",
	"Void Reaver": "There are few who may tread the paths between worlds, these powers grant you an ability to generate fields of void energy that devour all living things.",
	"Void Lord": "You gazed into the dark heart of the Void long enough to become one of the most powerful and feared beings. All lesser void creatures are at your command.",
	"Abyss God": "Creator of the Void, a vast canvas of blackness and nothingness, in which the concept of its existence defies all logic. Nothing will escape you.",
 
    // Galactic Council
    "Eternal Wanderer": "With the powers bestowed upon you by an unknown entity, you wander around, visiting places revered and feared in search of answers.",
    "Nova": "Extremely powerful being with tremedous telekinetic powers and the ability to rearrange the molecular structure of matter and energy, even up to cosmic scale.",
	"Sigma Proioxis": "A nigh-omnipotent cosmological entity, with vast matter and energy manipulation abilities that help you push the boundaries of the Universe itself.",
    "Acallaris": "Primordial being that predate the universe, involved with the creation of life and powerful beyond mortal comprehension, existing as myths to the oldest species in the universe.",
	"One Above All": "Creator of everything.",	

    // Fundamentals
    "Concentration": "Improve your learning speed through practising intense concentration activities.",
    "Productivity": "Learn to procrastinate less at work and receive more job experience per day.",
    "Bargaining": "Study the tricks of the trade and persuasive skills to lower any type of expense.",
    "Meditation": "Fill your mind with peace and tranquility to tap into greater happiness from within.",

    // Combat
    "Strength": "Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
    "Battle Tactics": "Create and revise battle strategies, improving experience gained in the military.",
    "Muscle Memory": "Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

    // Magic
    "Mana Control": "Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.",
    "Life Essence": "Lengthen your lifespan through the means of magic. However, is this truly the immortality you have tried seeking for...?",
    "Time Warping": "Bend space and time through forbidden techniques, speeding up your learning processes.",
    "Astral Body": "Lengthen your lifespan drastically beyond comprehension by harnessing ethereal energy.",
	"Temporal Dimension": "Create your own pocket dimension where centuries go by in mere seconds.",
	"All Seeing Eye": "As the highest rank of T.A.A, all funds go directly to you.",
	"Brainwashing": "A technique designed to manipulate human thought and action against their desire.",

    // Dark magic - Evil Required
    "Dark Influence": "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
    "Evil Control": "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
    "Intimidation": "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
    "Demon Training": "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
    "Blood Meditation": "Grow and culture the evil within you through the sacrifice of other living beings, drastically increasing evil gain.",
    "Demon's Wealth": "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",
	"Dark Knowledge": "Sealed for a very long time, you utilize these forbidden texts for your own personal gain.",
	"Void Influence": "Tapping into the powers of the Void while combining them with evil grants you an unlimited potential.",
	"Time Loop": "Mastery is achieved when 'telling time' becomes 'telling time what to do'.",
	"Evil Incarnate": "You have became the very thing you swore to destroy.",
	
	// Void Manipulation
	"Absolute Wish": "The power to fulfill absolutely any and all wishes without any limitations.",
    "Void Amplification": "You surrender yourself to the Void, making it easier to take control of you.",
    "Mind Release": "In a trance like state, you feel the Void amplifying your thoughts, perception, memories, emotions and personality.",
	"Ceaseless Abyss": "Never ending torture, you swore to serve the Void for the rest of your existence.",
	"Void Symbiosis": "A symbiotic relationship that helps you become one with the Void.",
	"Void Embodiment": "If thou gaze long into an abyss, the abyss will also gaze into thee.",
	"Abyss Manipulation": "Allows you to shape your own reality within the Void itself.",
	
	// Celestial Powers - Endgame
	"Cosmic Longevity": "You have seen it all, from the very beginning to the very end.",
	"Cosmic Recollection": "Being able to exist in multiple parallel timelines and manipulating you parallel selves, influencing their lives as you see fit.",
	"Essence Collector": "Exploit the unlimited potential of multiverse energies and collect its resources.",
	"Galactic Command": "Absolute power corrupts absolutely.",
	
	//Almightiness
	"Yin Yang": "Born from chaos when the universe was first created, believed to exist in harmony, balancing evil and good.",
	"Parallel Universe": "Self-contained plane of existence, co-existing with one's own, helping you restore fragments of your forgotten power.",
	"Higher Dimensions": "By possesing the power to partially alter the laws of physics and transceding lower dimensional spaces, your existence becomes never-ending.",
	"Epiphany": "You become one with everything.",
	
    //Properties
    "Homeless": "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
    "Tent": "A thin sheet of tattered cloth held up by a couple of feeble, wooden sticks. Horrible living conditions but at least you have a roof over your head.",
    "Wooden Hut": "Shabby logs and dirty hay glued together with horse manure. Much more sturdy than a tent, however, the stench isn't very pleasant.",
    "Cottage": "Structured with a timber frame and a thatched roof. Provides decent living conditions for a fair price.",
    "House": "A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.",
    "Large House": "Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
    "Small Palace": "A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
    "Grand Palace": "A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",
	"Town Ruler": "You rule your very own community in your small town, owning multiple establishments.",
    "City Ruler": "As the highest ranking official, you manage and oversee everything that happens. While your pay is astronomical, so are your expenses.",
	"Nation Ruler": "You reign the whole nation. While your riches may be corrupted, everything you see belongs to you.",
	"Pocket Dimension": "A Dimension just for you that can be summoned at will. What happens there stays there.",
	"Void Realm": "Unknown how or when the Void realm came into existence, containing elements which don’t exist outside of its dimensional plane are now all to your disposal",
	"Void Universe": "Predating our own universe, the Void has an unlimited amount of space for your belongings, if you are willing to submit to it.",
	"Astral Realm": "Beneath personality and ego lays the source of our deep character, our personhood. Here are the psychic senses, our deep mind and emotions, symbols and inner reality.",
    "Galactic Throne": "You sit on your throne, overseeing the existence itself.", 
    "Spaceship": "Your own personal cosmic house.",

    //Misc
    "Book": "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
    "Dumbbells": "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before.",
    "Personal Squire": "Assists you in completing day to day activities, giving you more time to be productive at work.",
    "Steel Longsword": "A fine blade used to slay enemies even quicker in combat and therefore gain more experience.",
    "Butler": "Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.",
    "Sapphire Charm": "Embedded with a rare sapphire, this charm activates more mana channels within your body, providing a much easier time learning magic.",
    "Study Desk": "A dedicated area which provides many fine stationary and equipment designed for furthering your progress in research.",
    "Library": "Stores a collection of books, each containing vast amounts of information from basic life skills to complex magic spells.",
	"Observatory": "Used for observing terrestrial, marine and celestial events.",
	"Mind's Eye": "Lets you see memories, remember images, and even see new pictures and ideas.",
	"Void Necklace": "Helps you shape and manipulate void matter, even transmute and rebuild it into anything of your choosing.",
	"Void Armor": "Generates an innate armor as a part of you body, which is resistant to attacks, harm or pain.",
	"Void Blade": "Forged from void dust and dark matter, this blade can slash through dimensional barriers. It's a weapon of choice for every Void Reaver.",
	"Void Orb": "When the orb touches non void entities, it instantly disintegrates them by harnessing its power from Void realm.",
	"Void Dust": "Purest version of void created material; a teaspoon of it is as heavy as a small planet.",
	"Celestial Robe": "The most powerful and essential equipment of any Celestial. Acts as a source of infinite power.",
	"Universe Fragment": "From the time the universe was born. Can create more small universes.",
    "Multiverse Fragment": "Came into existance long before our universe was created, this strange looking object with no shape radiates unlimited energy.",

    //Essence Milestones
    "Magic Eye": "The Eye in your Amulet starts to glow.",
    "Almighty Eye": "The Eye in your Amulet shines like a star.",
    "Deal with the Devil": "You made a deal with the Devil.",
    "Transcendent Master": "You've mastered Transcendence.",
    "Eternal Time": "Does time matter now?",
    "Hell Portal": "You've opened a portal to Hell.",
    "Inferno": "You are at the last level of Hell. What is next?",
    "God's Blessings": "God bless you!",
    "Faint Hope": "Maybe there is hope?",
    "New Beginning": "Try to upgrade One Above All to level 2000",

    //Heroic Milestones
    "Rise of Great Heroes": "Every active Great job or skill will increase Essence gain a bit.",
    "Lazy Heroes": "Total Hero XP multiplier is 5e20",
    "Dirty Heroes": "Total Hero XP multiplier is 5e35",
    "Angry Heroes": "Total Hero XP multiplier is 5e50",
    "Tired Heroes": "Total Hero XP multiplier is 5e65",
    "Scared Heroes": "Total Hero XP multiplier is 5e80",
    "Good Heroes": "Total Hero XP multiplier is 5e95",
    "Funny Heroes": "Total Hero XP multiplier is 5e120",
    "Beautiful Heroes": "Total Hero XP multiplier is 5e170",
    "Awesome Heroes": "Total Hero XP multiplier is 5e180",
    "Furious Heroes": "Total Hero XP multiplier is 5e198",
    "Superb Heroes": "Total Hero XP multiplier is 5e201",
}
  
function getBindedTaskEffect(taskName) {
    const task = gameData.taskData[taskName]
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    const item = gameData.itemData[itemName]
    return item.getEffect.bind(item)
}

function addMultipliers() {
    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark Influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon Training"))
		task.xpMultipliers.push(getBindedTaskEffect("Void Influence"))
		task.xpMultipliers.push(getBindedTaskEffect("Parallel Universe"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's Wealth"))
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
			task.xpMultipliers.push(getBindedTaskEffect("Dark Knowledge"))
            task.xpMultipliers.push(getBindedItemEffect("Personal Squire"))
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study Desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
			task.xpMultipliers.push(getBindedItemEffect("Void Blade"))
			task.xpMultipliers.push(getBindedTaskEffect("Void Symbiosis"))
			task.xpMultipliers.push(getBindedItemEffect("Universe Fragment"))
			task.xpMultipliers.push(getBindedTaskEffect("Evil Incarnate"))
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle Tactics"))
            task.xpMultipliers.push(getBindedItemEffect("Steel Longsword"))
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle Memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Sapphire Charm"))
			task.xpMultipliers.push(getBindedItemEffect("Observatory"))
	    } else if (skillCategories["Void Manipulation"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Void Necklace"))
			task.xpMultipliers.push(getBindedItemEffect("Void Orb"))
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mana Control"))
			task.incomeMultipliers.push(getBindedTaskEffect("All Seeing Eye"))	
	    } else if (jobCategories["The Void"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Void Amplification"))
			task.xpMultipliers.push(getBindedItemEffect("Void Armor"))
			task.xpMultipliers.push(getBindedItemEffect("Void Dust"))
		} else if (jobCategories["Galactic Council"].includes(task.name)) {
			task.xpMultipliers.push(getBindedItemEffect("Celestial Robe"))
			task.xpMultipliers.push(getBindedTaskEffect("Epiphany"))
        } else if (skillCategories["Dark Magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvilXpGain)
        } else if (skillCategories["Almightiness"].includes(task.name)) {
			task.xpMultipliers.push(getEssenceXpGain)
        } else if (skillCategories["Fundamentals"].includes(task.name)) {
			task.xpMultipliers.push(getBindedItemEffect("Mind's Eye"))
		}	
    }

    for (const itemName in gameData.itemData) {
        const item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
		item.expenseMultipliers.push(getBindedTaskEffect("Brainwashing"))
		item.expenseMultipliers.push(getBindedTaskEffect("Abyss Manipulation"))
		item.expenseMultipliers.push(getBindedTaskEffect("Galactic Command"))
    }
}

function getHeroXpGainMultipliers(job)
{
    var baseMult = 1

    if (job instanceof Job)
        baseMult = 50000

    if (gameData.requirements["Rise of Great Heroes"].isCompleted())
        baseMult *= 10000

    if (gameData.requirements["Lazy Heroes"].isCompleted())
        baseMult *= 1e12

    if (gameData.requirements["Dirty Heroes"].isCompleted())
        baseMult *= 1e15

    if (gameData.requirements["Angry Heroes"].isCompleted())
        baseMult *= 1e15

    if (gameData.requirements["Tired Heroes"].isCompleted())
        baseMult *= 1e15

    if (gameData.requirements["Scared Heroes"].isCompleted())
        baseMult *= 1e15

    if (gameData.requirements["Good Heroes"].isCompleted())
        baseMult *= 1e15

    if (gameData.requirements["Funny Heroes"].isCompleted())
        baseMult *= 1e25

    if (gameData.requirements["Beautiful Heroes"].isCompleted())
        baseMult *= 1e50

    if (gameData.requirements["Awesome Heroes"].isCompleted())
        baseMult *= 1e10

    if (gameData.requirements["Furious Heroes"].isCompleted()) {
        if (job instanceof Job)
            baseMult *= 1000000
        baseMult *= 1e12
    }

    if (gameData.requirements["Superb Heroes"].isCompleted())
        baseMult *= 1e3

    return baseMult
}


function setCustomEffects() {
    const bargaining = gameData.taskData["Bargaining"]
    bargaining.getEffect = function () {
        const multiplier = 1 - getBaseLog(bargaining.isHero? 3 : 7, bargaining.level + 1) / 10
        if (multiplier < 0.1) return 0.1
        return multiplier
    }

    const intimidation = gameData.taskData["Intimidation"]
    intimidation.getEffect = function () {
        const multiplier = 1 - getBaseLog(intimidation.isHero ? 3 : 7, intimidation.level + 1) / 10
        if (multiplier < 0.1) return 0.1
        return multiplier
    }
	
	const brainwashing = gameData.taskData["Brainwashing"]
    brainwashing.getEffect = function () {
        const multiplier = 1 - getBaseLog(brainwashing.isHero ? 3 : 7, brainwashing.level + 1) / 10
        if (multiplier < 0.1) return 0.1
        return multiplier
    }
	
	const abyssManipulation = gameData.taskData["Abyss Manipulation"]
    abyssManipulation.getEffect = function () {
        const multiplier = 1 - getBaseLog(abyssManipulation.isHero ? 3 : 7, abyssManipulation.level + 1) / 10
        if (multiplier < 0.1) return 0.1
        return multiplier
    }

    const galacticCommand = gameData.taskData["Galactic Command"]
    galacticCommand.getEffect = function () {
        const multiplier = 1 - getBaseLog(galacticCommand.isHero ? 3 : 7, galacticCommand.level + 1) / 10
        if (multiplier < 0.1) return 0.1
        return multiplier
    }

    const timeWarping = gameData.taskData["Time Warping"]
    timeWarping.getEffect = function() {
        return 1 + getBaseLog(timeWarping.isHero ? 1.005 : 10, timeWarping.level + 1)
    }

    const immortality = gameData.taskData["Life Essence"]
    immortality.getEffect = function () {
        return 1 + getBaseLog(immortality.isHero? 1.01 : 33, immortality.level + 1) 
    }
	
	const unholyRecall = gameData.taskData["Cosmic Recollection"];
    unholyRecall.getEffect = function() {
        return unholyRecall.level * (unholyRecall.isHero ? 0.065 : 0.00065);
    }

    const transcendentMaster = gameData.milestoneData["Transcendent Master"]
    transcendentMaster.getEffect = function () {
        if (gameData.requirements["Transcendent Master"].isCompleted()) 
            return 1.5

        return 1
    }

    const faintHope = gameData.milestoneData["Faint Hope"]
    faintHope.getEffect = function () {
        var mult = 1
        if (gameData.requirements["Faint Hope"].isCompleted()) {
            mult = 1 + 0.005 * (gameData.realtime * getCompletedGameSpeedBoost())
            mult = mult ** 1.5;
        }

        return mult
    }

    const riseOfGreatHeroes = gameData.milestoneData["Rise of Great Heroes"]
    riseOfGreatHeroes.getEffect = function () {
        var mult = 1
        if (gameData.requirements["Rise of Great Heroes"].isCompleted()) {
            var countHeroes = 0
            for (const taskName in gameData.taskData) {
                if (gameData.taskData[taskName].isHero)
                    countHeroes++
            }
            mult = 1 + 6 * countHeroes / 74
        }

        return mult
    }
}

function getHappiness() {

    const meditationEffect = getBindedTaskEffect("Meditation")
    const butlerEffect = getBindedItemEffect("Butler")
	const mindreleaseEffect = getBindedTaskEffect("Mind Release")
    const multiverseFragment = getBindedItemEffect("Multiverse Fragment")
    const godsBlessings = gameData.requirements["God's Blessings"].isCompleted() ? 10000000 : 1
    const happiness = godsBlessings * meditationEffect() * butlerEffect() * mindreleaseEffect() 
        * multiverseFragment() * gameData.currentProperty.getEffect() * getChallengeBonus("an_unhappy_life")

    if (gameData.active_challenge == "dance_with_the_devil") return Math.pow(happiness, 0.075)
    if (gameData.active_challenge == "an_unhappy_life") return Math.pow(happiness, 0.5)
    if (gameData.active_challenge == "legends_never_die") return 1

    return happiness
}

function getEvil() {
    return gameData.evil
}

function getEvilXpGain() {
    if (gameData.active_challenge == "dance_with_the_devil") {
        const evilEffect = (Math.pow(getEvil(), 0.35) / 1e3) - 1
        return evilEffect < 0 ? 0 : evilEffect
    }

    if (gameData.active_challenge == "legends_never_die") return 1

    return getEvil()
}

function getEssence() {
    return gameData.essence
}

function getEssenceXpGain() {
    if (gameData.active_challenge == "dance_with_the_devil") {
        const essenceEffect = (Math.pow(getEssence(), 0.35) / 1e2) - 1
        return essenceEffect <= 0.01 ? 0 : essenceEffect
    }

    return getEssence()
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1
    multipliers.forEach((multiplierFunction) => {
        finalMultiplier *= multiplierFunction()
    })
    return value * finalMultiplier
}

function applySpeed(value) {
    if (value == 0)
        return 0
    return value * getGameSpeed() / updateSpeed
}

function getEvilGain() {
    const evilControl = gameData.taskData["Evil Control"]
    const bloodMeditation = gameData.taskData["Blood Meditation"]
	const absoluteWish = gameData.taskData ["Absolute Wish"]
	const oblivionEmbodiment = gameData.taskData ["Void Embodiment"]
    const yingYang = gameData.taskData["Yin Yang"]
    const inferno = gameData.requirements["Inferno"].isCompleted() ? 5 : 1
    return evilControl.getEffect() * bloodMeditation.getEffect() * absoluteWish.getEffect() 
        * oblivionEmbodiment.getEffect() * yingYang.getEffect() * inferno * getChallengeBonus("legends_never_die")
}

function getEssenceGain() {
    const essenceControl = gameData.taskData["Yin Yang"]
    const essenceCollector = gameData.taskData["Essence Collector"]
    const transcendentMaster = gameData.milestoneData["Transcendent Master"]
    const faintHope = gameData.milestoneData["Faint Hope"]
    const rise = gameData.milestoneData["Rise of Great Heroes"]

    return essenceControl.getEffect() * essenceCollector.getEffect() * transcendentMaster.getEffect()
        * faintHope.getEffect() * rise.getEffect() * getChallengeBonus("dance_with_the_devil")
}

function getCompletedGameSpeedBoost() {
    return Math.pow(2, gameData.completedTimes)
}

function getGameSpeed() {
    const timeWarping = gameData.taskData["Time Warping"]
	const temporalDimension = gameData.taskData["Temporal Dimension"]
    const timeLoop = gameData.taskData["Time Loop"]
    const warpDrive = (gameData.requirements["Eternal Time"].isCompleted()) ? 2 : 1
    const timeWarpingSpeed = timeWarping.getEffect() * temporalDimension.getEffect() * timeLoop.getEffect() * warpDrive
    const gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed * getCompletedGameSpeedBoost() * getChallengeBonus("time_does_not_fly")

    return gameData.active_challenge == "time_does_not_fly" ? Math.pow(gameSpeed, 0.7) : gameSpeed
}

function applyExpenses() {
    if (gameData.coins == Infinity)
        return

    gameData.coins -= applySpeed(getExpense())

    if (gameData.coins < 0)
        goBankrupt()
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
    autoBuyEnabled = true
}

async function downloadFile() {
    let response = await fetch("./changelog.txt");

    if (response.status != 200) {
        throw new Error("Server Error");
    }

    // read response stream as text
    let text_data = await response.text();

    return text_data;
}

document.querySelector("#changelogTabTabButton").addEventListener('click', async function () {
    try {
        let text_data = await downloadFile();
        document.querySelector("#changelog").textContent = text_data;
    }
    catch (e) {
        alert(e.message);
    }
});

function togglePause() {
    gameData.paused = !gameData.paused
}

function forceAutobuy() {
    autoBuyEnabled = true
}

function setCurrentProperty(propertyName) {
    autoBuyEnabled = false
    gameData.currentProperty = gameData.itemData[propertyName]
}

function setMisc(miscName) {
    autoBuyEnabled = false
    const misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createGameObjects(data, baseData) {
    for (const key in baseData)
        createGameObject(data, baseData[key])
}

function createGameObject(data, entity) {
    if ("income" in entity) { data[entity.name] = new Job(entity) }
    else if ("maxXp" in entity) { data[entity.name] = new Skill(entity) }
    else if ("tier" in entity) { data[entity.name] = new Milestone(entity) }    
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function setNotation(index) {
    gameData.settings.numberNotation = index
    selectElementInGroup("Notation", index)
}

function getNet() {
    return Math.abs(getIncome() - getExpense())
}

function getIncome() {
    return gameData.currentJob.getIncome()
}

function getExpense() {
    var expense = 0
    expense += gameData.currentProperty.getExpense()
    for (misc of gameData.currentMisc) {
        expense += misc.getExpense()
    }
    return expense
}

function performTask(task) {
    task.increaseXp()
    if (task instanceof Job && task == gameData.currentJob) {
        increaseCoins()
    }
}

function increaseCoins() {
    gameData.coins += applySpeed(getIncome())
}

function autoPromote() {
    let maxIncome = 0;
    for (const key in gameData.taskData) {
        const task = gameData.taskData[key]
        if (task instanceof Job && gameData.requirements[key].completed) {
            const income = task.getIncome();
            if (income > maxIncome) {
                maxIncome = income
                gameData.currentJob = task
            }
        }
    }
}

function autoBuy() {
    if (!autoBuyEnabled) return

    let usedExpense = 0
    const income = getIncome()

    for (const key in gameData.itemData) {
        if (gameData.requirements[key].completed) {
            const item = gameData.itemData[key]
            const expense = item.getExpense()

            if (itemCategories['Properties'].indexOf(key) != -1) {
                if (expense < income) {
                    gameData.currentProperty = item
                    usedExpense = expense
                }
            }
        }
    }

    for (const key in gameData.currentMisc) {
        usedExpense += gameData.currentMisc[key].getExpense()
    }

    for (const key in gameData.itemData) {
        if (gameData.requirements[key].completed) {
            const item = gameData.itemData[key]
            const expense = item.getExpense()
            if (itemCategories['Misc'].indexOf(key) != -1) {
                if (expense < income - usedExpense) {
                    if (gameData.currentMisc.indexOf(item) == -1) {
                        gameData.currentMisc.push(item)
                        usedExpense += expense
                    }
                }
            }
        }
    }
}

function increaseDays() {
    gameData.days += applySpeed(1)
}

function increaseRealtime() {
    if (!gameData.paused && isAlive()) 
        gameData.realtime += 1.0 / updateSpeed;
    gameData.realtimeRun += 1.0 / updateSpeed;
}

function setTheme(index, reload=false) {
    const body = document.getElementById("body")

    body.classList.remove("dark")
    body.classList.remove("colorblind")


    if (index == 0) {
        // lignt
    }
    else if (index == 1) {
        // dark
        body.classList.add("dark")
    }
    else if (index == 2){
        // colorblind Tritanopia 
        body.classList.add("colorblind")
    }   

    gameData.settings.theme = index
    selectElementInGroup("Theme", index)

    if (reload) {
        saveGameData()
        location.reload()
    }
}

function rebirthOne() {
    gameData.rebirthOneCount += 1
    if (gameData.stats.fastest1 == null || gameData.realtime < gameData.stats.fastest1)
        gameData.stats.fastest1 = gameData.realtime

    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()

    if (gameData.stats.fastest2 == null || gameData.realtime < gameData.stats.fastest2)
        gameData.stats.fastest2 = gameData.realtime
	
    rebirthReset()
    gameData.active_challenge = ""

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = 0
    }    
}

function rebirthThree() {
    gameData.rebirthThreeCount += 1	
	gameData.essence += getEssenceGain()	
    gameData.evil = 0

    if (gameData.stats.fastest3 == null || gameData.realtime < gameData.stats.fastest3)
        gameData.stats.fastest3 = gameData.realtime
	
	const recallEffect = gameData.taskData["Cosmic Recollection"].getEffect();

	for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = Math.floor(recallEffect * task.level);
    }

    rebirthReset()
    gameData.active_challenge = ""
}

function applyMilestones() {
    if (((gameData.requirements["Magic Eye"].isCompleted()) && (gameData.requirements["Rebirth note 2"].isCompleted())) ||
        (gameData.requirements["Almighty Eye"].isCompleted())){
        for (taskName in gameData.taskData) {
            const task = gameData.taskData[taskName]
            if (task.level > task.maxLevel) task.maxLevel = task.level
        }
    }

    if (!gameData.paused) {
        if (gameData.requirements["Deal with the Devil"].isCompleted() && gameData.requirements["Rebirth note 3"].isCompleted()) {
            if (gameData.evil == 0)
                gameData.evil = 1
            if (gameData.evil < getEvilGain())
                gameData.evil *= Math.pow(1.001, 1 + gameData.completedTimes)
        }

        if (gameData.requirements["Hell Portal"].isCompleted()) {
            if (gameData.evil == 0)
                gameData.evil = 1
            if (gameData.evil < getEvilGain())
                gameData.evil *= Math.pow(1.01, 1 + gameData.completedTimes)
        }
    }
}

function rebirthReset(set_tab_to_jobs = true) {
    if (set_tab_to_jobs)
        setTab("jobs")

    gameData.coins = 0
    gameData.days = 365 * 14
    gameData.realtime = 0
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
    gameData.stats.EssencePerSecond = 0
    gameData.stats.maxEssencePerSecond = 0
    gameData.stats.maxEssencePerSecondRt = 0
    gameData.stats.EvilPerSecond = 0
    gameData.stats.maxEvilPerSecond = 0
    gameData.stats.maxEvilPerSecondRt = 0

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
        task.isHero = false
        task.isFinished =false
    }

    for (const itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]        
        item.isHero = false
    }

    for (const key in gameData.requirements) {
        const requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    const immortality = gameData.taskData["Life Essence"]
    const superImmortality = gameData.taskData["Astral Body"]
	const higherDimensions = gameData.taskData["Higher Dimensions"]
	const abyss = gameData.taskData["Ceaseless Abyss"]
    const cosmicLongevity = gameData.taskData["Cosmic Longevity"]
    const lifespan = baseLifespan * immortality.getEffect() * superImmortality.getEffect() * abyss.getEffect()
        * cosmicLongevity.getEffect() * higherDimensions.getEffect() * getCompletedGameSpeedBoost()

    if (gameData.active_challenge == "legends_never_die") return Math.pow(lifespan, 0.72) + 365 * 20

    return lifespan
}

function isAlive() {
    const condition = gameData.days < getLifespan() || getLifespan() == Infinity
    const deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function isHeroesUnlocked() {
    return gameData.requirements["New Beginning"].isCompleted() && (gameData.taskData["One Above All"].level >= 2000 || gameData.taskData["One Above All"].isHero)
}

function makeHero(task) {
    if ((task instanceof Job || task instanceof Skill) && !task.isHero) {           
        task.level = 0
        task.maxLevel = 0
        task.xp = 0
        task.isHero = true
    }
}

function makeHeroes() {
    if (!isHeroesUnlocked()) return

    for (const taskname in gameData.taskData) {
        const task = gameData.taskData[taskname]

        if (task.isHero)
            continue        

        const prev = getPreviousTaskInCategory(taskname)

        if (prev != "" && (!gameData.taskData[prev].isHero || gameData.taskData[prev].level < 20)) 
                continue

        const req = gameData.requirements[taskname]
        let isNewHero = true

        if (req instanceof TaskRequirement) {
            if (!req.isCompletedActual(true))
                continue
            for (const requirement of req.requirements)
                if (!(gameData.taskData[requirement.task] && gameData.taskData[requirement.task].isHero)) {
                    isNewHero = false
                    break
                }
        }

        if (isNewHero)
            makeHero(task)
    }

    for (const key in gameData.itemData) {
        const item = gameData.itemData[key]
        if (item.isHero)
            continue
        item.isHero = true
        gameData.currentProperty = gameData.itemData["Homeless"]
        gameData.currentMisc = []
    }    
}


function assignMethods() {
    for (const key in gameData.taskData) {
        let task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
            
        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (const key in gameData.itemData) {
        let item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (const key in gameData.requirements) {
        let requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "essence") {
            requirement = Object.assign(new EssenceRequirement(requirement.elements, requirement.requirements), requirement)
        }

        const tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    const newArray = []
    for (const misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (const key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (const key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function peekThemeFromSave() {
    try {
        const save = localStorage.getItem("gameDataSave")
        if (save == null)
            return 1
        const gameDataSave = JSON.parse(save)
        if (gameDataSave.settings == undefined || gameDataSave.settings.theme == undefined)
            return 1
        return gameDataSave.settings.theme
    } catch (error) {
        console.error(error)
        console.log(localStorage.getItem("gameDataSave"))
        alert("It looks like you tried to load a corrupted save... If this issue persists feel free to contact the developers!")
    }
}

function loadGameData() {
    try {
        const gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

        if (gameDataSave !== null) {
            replaceSaveDict(gameData, gameDataSave)
            replaceSaveDict(gameData.requirements, gameDataSave.requirements)
            replaceSaveDict(gameData.taskData, gameDataSave.taskData)
            replaceSaveDict(gameData.itemData, gameDataSave.itemData)
            replaceSaveDict(gameData.settings, gameDataSave.settings)
            replaceSaveDict(gameData.stats, gameDataSave.stats)
            replaceSaveDict(gameData.challenges, gameDataSave.challenges)
            gameData = gameDataSave

            if (gameData.coins == null)
                gameData.coins = 0

            if (gameData.essence == null)
                gameData.essence = 0

            if (gameData.days == null)
                gameData.days = 365 * 14

            if (gameData.evil == null)
                gameData.evil = 0

            if (gameData.settings.theme == null) {
                gameData.settings.theme = 1
            }
        }
    } catch (error) {
        console.error(error)
        console.log(localStorage.getItem("gameDataSave"))
        alert("It looks like you tried to load a corrupted save... If this issue persists, feel free to contact the developers!")
    }

    assignMethods()
}

// TODO Not used currently. I assume we want to use this to update the game when the tab is focussed
function addMinutes(count = 1) {
    for (let i = 0; i < count * 60 * updateSpeed; i++) {
        update(false)
        if (i % 60 * updateSpeed == 0)
            updateUI()
    }
}

function update(needUpdateUI = true) {
    makeHeroes()
    increaseRealtime()
    increaseDays()
    //setChallengeProgress()
    autoPromote()
    autoBuy()  
    applyExpenses()
    for (const key in gameData.taskData) {
        const task = gameData.taskData[key]
        if ((task instanceof Skill || task instanceof Job) && gameData.requirements[key].completed) {
            performTask(task)
        }
    }
    
    applyMilestones() 
    updateStats()
    if (needUpdateUI)
        updateUI()
}

function updateStats() {
    if (gameData.requirements["Rebirth stats evil"].isCompleted()) {
        gameData.stats.EvilPerSecond = getEvilGain() / gameData.realtime
        if (gameData.stats.EvilPerSecond > gameData.stats.maxEvilPerSecond) {
            gameData.stats.maxEvilPerSecond = gameData.stats.EvilPerSecond
            gameData.stats.maxEvilPerSecondRt = gameData.realtime
        }
    }

    if (gameData.requirements["Rebirth stats essence"].isCompleted()) {
        gameData.stats.EssencePerSecond = getEssenceGain() / gameData.realtime
        if (gameData.stats.EssencePerSecond > gameData.stats.maxEssencePerSecond) {
            gameData.stats.maxEssencePerSecond = gameData.stats.EssencePerSecond
            gameData.stats.maxEssencePerSecondRt = gameData.realtime
        }
    }

    
       

}

function restartGame() {
    gameData.paused = true
    clearInterval(saveloop)
    clearInterval(gameloop)

    if (gameData.stats.fastestGame == null || gameData.realtimeRun < gameData.stats.fastestGame)
        gameData.stats.fastestGame = gameData.realtimeRun

    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []

    gameData.itemData = {}
    gameData.taskData = {}
    gameData.milestoneData = {}
    gameData.requirements = {}
    gameData.coins = 0
    gameData.days = 365 * 14
    gameData.evil = 0
    gameData.essence = 0
    gameData.paused = false
    gameData.timeWarpingEnabled = true
    gameData.realtime = 0
    gameData.realtimeRun = 0
    gameData.settings.selectedTab = 'jobs'

    gameData.active_challenge = ""
    gameData.challenges.an_unhappy_life = 0
    gameData.challenges.rich_and_the_poor = 0
    gameData.challenges.time_does_not_fly = 0
    gameData.challenges.dance_with_the_devil = 0

    gameData.completedTimes += 1
    saveGameData()
    location.reload()
}

function resetGameData() {
    clearInterval(saveloop)
    clearInterval(gameloop)
    if (!confirm('Are you sure you want to reset the game?')) {
        gameloop = setInterval(update, 1000 / updateSpeed)
        saveloop = setInterval(saveGameData, 3000)
        return
    }
    localStorage.clear()
    location.reload()
}

function importGameData() {
    try {
        const importExportBox = document.getElementById("importExportBox")
        if (importExportBox.value == "") {
            alert("It looks like you tried to load an empty save... Paste save data into the box, then click \"Import Save\" again.")
            return
        }
        const data = JSON.parse(window.atob(importExportBox.value))
        clearInterval(gameloop)
        gameData = data
        saveGameData()
        location.reload()
    } catch (error) {
        alert("It looks like you tried to load a corrupted save... If this issue persists, feel free to contact the developers!")
    }
}

function exportGameData() {
    const importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
    copyTextToClipboard(importExportBox.value)
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.getElementById("exportTooltip");
        tooltip.innerHTML = "&nbsp;&nbsp;Save copied to clipboard!" ;
    }, err => {
        //console.error('Async: Could not copy text: ', err);
    })
}

function outExportButton() {
    const tooltip = document.getElementById("exportTooltip");
    tooltip.innerHTML = "";
}

function onFontButtonHover() {
    const tooltip = document.getElementById("fontSizeTooltip");
    tooltip.classList.remove("hidden")
}

function onFontButtonStopHover() {
    const tooltip = document.getElementById("fontSizeTooltip");
    tooltip.classList.add("hidden")
}

function isNextMilestoneInReach() {
    const totalEssence = gameData.essence + getEssenceGain()

    for (const key in gameData.milestoneData) {
        const requirementObject = gameData.requirements[key]

        if (requirementObject instanceof EssenceRequirement) {
            if (!requirementObject.isCompleted()) {
                if (totalEssence > requirementObject.requirements[0].requirement)
                    return true
            }
        }
    }
    return false
}


//Init
createGameObjects(gameData.taskData, jobBaseData)
createGameObjects(gameData.taskData, skillBaseData)
createGameObjects(gameData.itemData, itemBaseData)
createGameObjects(gameData.milestoneData, milestoneBaseData)

gameData.settings.theme = peekThemeFromSave()

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable")
createAllRows(milestoneCategories, "milestoneTable")

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    //Other
    "The Arcane Association": new TaskRequirement(getElementsByClass("The Arcane Association"), [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
	"Galactic Council": new AgeRequirement(getElementsByClass("Galactic Council"), [{requirement: 10000}]),
	"The Void": new AgeRequirement(getElementsByClass("The Void"), [{requirement: 1000}]),
	"Void Manipulation": new AgeRequirement(getElementsByClass("Void Manipulation"), [{requirement: 1000}]),
	"Celestial Powers": new AgeRequirement(getElementsByClass("Celestial Powers"), [{requirement: 10000}]),
    "Dark Magic": new EvilRequirement(getElementsByClass("Dark Magic"), [{requirement: 1}]),
	"Almightiness": new EssenceRequirement(getElementsByClass("Almightiness"), [{requirement: 1}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
	"Rebirth note 4": new AgeRequirement([document.getElementById("rebirthNote4")], [{requirement: 1000}]),
	"Rebirth note 5": new AgeRequirement([document.getElementById("rebirthNote5")], [{requirement: 10000}]),
    "Rebirth note 6": new TaskRequirement([document.getElementById("rebirthNote6")], [{ task: "Cosmic Recollection", requirement: 1 }]),

    "Rebirth note End": new TaskRequirement([document.getElementById("rebirthNoteEnd")], [{ task: "One Above All", requirement: 1000000000000, isHero: true }]),
    "Rebirth button End": new TaskRequirement([document.getElementById("rebirthButtonEnd")], [{ task: "One Above All", requirement: 1000000000000, isHero: true }]),

    "Rebirth button 1": new AgeRequirement([document.getElementById("rebirthButton1")], [{ requirement: 65 }]),
    "Rebirth button 2": new AgeRequirement([document.getElementById("rebirthButton2")], [{ requirement: 200 }]),
    "Rebirth button 3": new TaskRequirement([document.getElementById("rebirthButton3")], [{ task: "Cosmic Recollection", requirement: 1 }]),

    "Rebirth stats evil": new AgeRequirement([document.getElementById("statsEvilGain")], [{ requirement: 200 }]),
    "Rebirth stats essence": new TaskRequirement([document.getElementById("statsEssenceGain")], [{ task: "Cosmic Recollection", requirement: 1 }]),


    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
	"Essence info": new EssenceRequirement([document.getElementById("essenceInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Adept Mage", requirement: 10}]),

    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //Common work
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Farmer": new TaskRequirement([getTaskElement("Farmer")], [{task: "Beggar", requirement: 10}]),
    "Fisherman": new TaskRequirement([getTaskElement("Fisherman")], [{task: "Farmer", requirement: 10}]),
    "Miner": new TaskRequirement([getTaskElement("Miner")], [{task: "Strength", requirement: 10}, {task: "Fisherman", requirement: 10}]),
    "Blacksmith": new TaskRequirement([getTaskElement("Blacksmith")], [{task: "Strength", requirement: 30}, {task: "Miner", requirement: 10}]),
    "Merchant": new TaskRequirement([getTaskElement("Merchant")], [{task: "Bargaining", requirement: 50}, {task: "Blacksmith", requirement: 10}]),

    //Military 
    "Squire": new TaskRequirement([getTaskElement("Squire")], [{task: "Strength", requirement: 5}]),
    "Footman": new TaskRequirement([getTaskElement("Footman")], [{task: "Strength", requirement: 20}, {task: "Squire", requirement: 10}]),
    "Veteran footman": new TaskRequirement([getTaskElement("Veteran footman")], [{task: "Battle Tactics", requirement: 40}, {task: "Footman", requirement: 10}]),
    "Centenary": new TaskRequirement([getTaskElement("Centenary")], [{task: "Strength", requirement: 100}, {task: "Veteran footman", requirement: 10}]),
    "Knight": new TaskRequirement([getTaskElement("Knight")], [{task: "Battle Tactics", requirement: 150}, {task: "Centenary", requirement: 10}]),
    "Veteran Knight": new TaskRequirement([getTaskElement("Veteran Knight")], [{task: "Strength", requirement: 300}, {task: "Knight", requirement: 10}]),
    "Holy Knight": new TaskRequirement([getTaskElement("Holy Knight")], [{task: "Mana Control", requirement: 500}, {task: "Veteran Knight", requirement: 10}]),
    "Lieutenant General": new TaskRequirement([getTaskElement("Lieutenant General")], [{task: "Mana Control", requirement: 1000}, {task: "Battle Tactics", requirement: 1000}, {task: "Holy Knight", requirement: 10}]),
	
	
    //The Arcane Association
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Apprentice Mage": new TaskRequirement([getTaskElement("Apprentice Mage")], [{task: "Mana Control", requirement: 400}, {task: "Student", requirement: 10}]),
    "Adept Mage": new TaskRequirement([getTaskElement("Adept Mage")], [{task: "Mana Control", requirement: 700}, {task: "Apprentice Mage", requirement: 10}]),
    "Master Wizard": new TaskRequirement([getTaskElement("Master Wizard")], [{task: "Mana Control", requirement: 1000}, {task: "Adept Mage", requirement: 10}]),
    "Archmage": new TaskRequirement([getTaskElement("Archmage")], [{task: "Mana Control", requirement: 1200}, {task: "Master Wizard", requirement: 10}]),
	"Chronomancer": new TaskRequirement([getTaskElement("Chronomancer")], [{task: "Mana Control", requirement: 1500}, {task: "Meditation", requirement: 1500}, {task: "Archmage", requirement: 25}]),
    "Chairman": new TaskRequirement([getTaskElement("Chairman")], [{task: "Mana Control", requirement: 2000}, {task: "Productivity", requirement: 2000}, {task: "Chronomancer", requirement: 50}]),
    "Imperator": new TaskRequirement([getTaskElement("Imperator")], [{ task: "All Seeing Eye", requirement: 3000, herequirement:650}, {task: "Concentration", requirement: 3000},  {task: "Chairman", requirement: 666}]),
	
	//The Void
    "Corrupted": new AgeRequirement([getTaskElement("Corrupted")], [{requirement: 1000}]),
    "Void Slave": new TaskRequirement([getTaskElement("Void Slave")], [{task: "Corrupted", requirement: 30}]),
    "Void Fiend": new TaskRequirement([getTaskElement("Void Fiend")], [{ task: "Brainwashing", requirement: 3000 }, { task: "Void Slave", requirement: 200 }]),
    "Abyss Anomaly": new TaskRequirement([getTaskElement("Abyss Anomaly")], [{ task: "Mind Release", requirement: 3000, herequirement: 100 }, { task: "Void Fiend", requirement: 200, herequirement: 100 }]),
    "Void Wraith": new TaskRequirement([getTaskElement("Void Wraith")], [{ task: "Temporal Dimension", requirement: 3400 }, { task: "Abyss Anomaly", requirement: 300, herequirement: 180 }]),
    "Void Reaver": new TaskRequirement([getTaskElement("Void Reaver")], [{ task: "Void Amplification", requirement: 3400, herequirement: 180 }, { task: "Void Wraith", requirement: 250, herequirement: 125 }]),
    "Void Lord": new TaskRequirement([getTaskElement("Void Lord")], [{ task: "Void Symbiosis", requirement: 3800, herequirement: 200 }, { task: "Void Reaver", requirement: 150 }]),
    "Abyss God": new TaskRequirement([getTaskElement("Abyss God")], [{ task: "Void Embodiment", requirement: 4700, herequirement: 300 }, { task: "Void Lord", requirement: 750, herequirement : 125 }]),

	
	 //Galactic Council
    "Eternal Wanderer": new AgeRequirement([getTaskElement("Eternal Wanderer")], [{ requirement: 10000 }]),
    "Nova": new TaskRequirement([getTaskElement("Nova")], [{ task: "Eternal Wanderer", requirement: 15 }, { task: "Cosmic Longevity", requirement: 4000, herequirement: 180 }]),
    "Sigma Proioxis": new TaskRequirement([getTaskElement("Sigma Proioxis")], [{ task: "Nova", requirement: 200 }, { task: "Cosmic Recollection", requirement: 4500, herequirement: 350 }]),
    "Acallaris": new TaskRequirement([getTaskElement("Acallaris")], [{ task: "Galactic Command", requirement: 5000, herequirement: 250 }, { task: "Sigma Proioxis", requirement: 1000, herequirement: 480 }]),
    "One Above All": new TaskRequirement([getTaskElement("One Above All")], [{ task: "Meditation", requirement: 6300 }, { task: "Acallaris", requirement: 1400, herequirement: 500 }]),	

    //Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Bargaining": new TaskRequirement([getTaskElement("Bargaining")], [{task: "Concentration", requirement: 20}]),
    "Meditation": new TaskRequirement([getTaskElement("Meditation")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    //Combat
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Battle Tactics": new TaskRequirement([getTaskElement("Battle Tactics")], [{task: "Concentration", requirement: 20}]),
    "Muscle Memory": new TaskRequirement([getTaskElement("Muscle Memory")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    //Magic
    "Mana Control": new TaskRequirement([getTaskElement("Mana Control")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Life Essence": new TaskRequirement([getTaskElement("Life Essence")], [{task: "Apprentice Mage", requirement: 10}]),
    "Time Warping": new TaskRequirement([getTaskElement("Time Warping")], [{task: "Adept Mage", requirement: 10}]),
    "Astral Body": new TaskRequirement([getTaskElement("Astral Body")], [{task: "Archmage", requirement: 10}]),
    "Temporal Dimension": new TaskRequirement([getTaskElement("Temporal Dimension")], [{task: "Chronomancer", requirement: 25}]),
	"All Seeing Eye": new TaskRequirement([getTaskElement("All Seeing Eye")], [{task: "Mana Control", requirement: 2350}, {task: "Chairman", requirement: 100}]),
	"Brainwashing": new TaskRequirement([getTaskElement("Brainwashing")], [{task: "Imperator", requirement: 100}]),

    //Dark magic
    "Dark Influence": new EvilRequirement([getTaskElement("Dark Influence")], [{requirement: 1}]),
    "Evil Control": new EvilRequirement([getTaskElement("Evil Control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon Training": new EvilRequirement([getTaskElement("Demon Training")], [{requirement: 20}]),
    "Blood Meditation": new EvilRequirement([getTaskElement("Blood Meditation")], [{requirement: 50}]),
    "Demon's Wealth": new EvilRequirement([getTaskElement("Demon's Wealth")], [{requirement: 500}]),
	"Dark Knowledge": new EvilRequirement([getTaskElement("Dark Knowledge")], [{requirement: 5000}]),
	"Void Influence": new EvilRequirement([getTaskElement("Void Influence")], [{requirement: 50000}]),
	"Time Loop": new EvilRequirement([getTaskElement("Time Loop")], [{requirement: 2500000}]),
	"Evil Incarnate": new EvilRequirement([getTaskElement("Evil Incarnate")], [{requirement: 1000000000}]),
	
	//Void Manipulation
	"Absolute Wish": new TaskRequirement([getTaskElement("Absolute Wish")], [{task: "Void Slave", requirement: 25}, {task: "Chairman", requirement: 300}]),
    "Void Amplification": new TaskRequirement([getTaskElement("Void Amplification")], [{ task: "Void Slave", requirement: 100 }, { task: "Absolute Wish", requirement: 3000, herequirement: 1700 }]),
    "Mind Release": new TaskRequirement([getTaskElement("Mind Release")], [{ task: "Void Amplification", requirement: 3000, herequirement: 100 }]),
    "Ceaseless Abyss": new TaskRequirement([getTaskElement("Ceaseless Abyss")], [{ task: "Void Influence", requirement: 4000, herequirement: 1950 }, { task: "Abyss Anomaly", requirement: 50 }]),
    "Void Symbiosis": new TaskRequirement([getTaskElement("Void Symbiosis")], [{ task: "Ceaseless Abyss", requirement: 3500, herequirement: 220 }, { task: "Void Reaver", requirement: 50 }]),
    "Void Embodiment": new TaskRequirement([getTaskElement("Void Embodiment")], [{ task: "Dark Influence", requirement: 4600, herequirement: 3700 }, { task: "Void Lord", requirement: 50 }]),
    "Abyss Manipulation": new TaskRequirement([getTaskElement("Abyss Manipulation")], [{ task: "Abyss God", requirement: 350, herequirement: 200 }, { task: "Dark Influence", requirement: 6000, herequirement: 4100 }, { task: "Void Influence", requirement: 6000, herequirement: 2600 }]),
	
	//Celestial Powers
	"Cosmic Longevity": new TaskRequirement([getTaskElement("Cosmic Longevity")], [{task: "Eternal Wanderer", requirement: 1}]),
    "Cosmic Recollection": new TaskRequirement([getTaskElement("Cosmic Recollection")], [{ task: "Nova", requirement: 50 }, { task: "Meditation", requirement: 4200 }, { task: "Mind Release", requirement: 900 }]),
    "Essence Collector": new TaskRequirement([getTaskElement("Essence Collector")], [{ task: "Sigma Proioxis", requirement: 500, herequirement: 360 }, { task: "Absolute Wish", requirement: 4900, herequirement: 2900 }, { task: "Dark Knowledge", requirement: 6300, herequirement: 3400 }]),
    "Galactic Command": new TaskRequirement([getTaskElement("Galactic Command")], [{ task: "Essence Collector", requirement: 5000, herequirement: 210 }, { task: "Bargaining", requirement: 5000 }]),

    //Essence
	"Yin Yang": new EssenceRequirement([getTaskElement("Yin Yang")], [{requirement: 1}]),
	"Parallel Universe": new EssenceRequirement([getTaskElement("Parallel Universe")], [{requirement: 1}]),
	"Higher Dimensions": new EssenceRequirement([getTaskElement("Higher Dimensions")], [{requirement: 10000}]),
	"Epiphany": new EssenceRequirement([getTaskElement("Epiphany")], [{requirement: 30000}]),

    //Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Tent": new CoinRequirement([getItemElement("Tent")], [{requirement: 0}]),
    "Wooden Hut": new CoinRequirement([getItemElement("Wooden Hut")], [{requirement: gameData.itemData["Wooden Hut"].getExpense() * 100}]),
    "Cottage": new CoinRequirement([getItemElement("Cottage")], [{requirement: gameData.itemData["Cottage"].getExpense() * 100}]),
    "House": new CoinRequirement([getItemElement("House")], [{requirement: gameData.itemData["House"].getExpense() * 100}]),
    "Large House": new CoinRequirement([getItemElement("Large House")], [{requirement: gameData.itemData["Large House"].getExpense() * 100}]),
    "Small Palace": new CoinRequirement([getItemElement("Small Palace")], [{requirement: gameData.itemData["Small Palace"].getExpense() * 100}]),
    "Grand Palace": new CoinRequirement([getItemElement("Grand Palace")], [{requirement: gameData.itemData["Grand Palace"].getExpense() * 100}]),
	"Town Ruler": new CoinRequirement([getItemElement("Town Ruler")], [{requirement: gameData.itemData["Town Ruler"].getExpense() * 100}]),
	"City Ruler": new CoinRequirement([getItemElement("City Ruler")], [{requirement: gameData.itemData["City Ruler"].getExpense() * 100}]),
	"Nation Ruler": new CoinRequirement([getItemElement("Nation Ruler")], [{requirement: gameData.itemData["Nation Ruler"].getExpense() * 100}]),
    "Pocket Dimension": new CoinRequirement([getItemElement("Pocket Dimension")], [{requirement: gameData.itemData["Pocket Dimension"].getExpense() * 100}]),
	"Void Realm": new CoinRequirement([getItemElement("Void Realm")], [{requirement: gameData.itemData["Void Realm"].getExpense() * 100}]),
	"Void Universe": new CoinRequirement([getItemElement("Void Universe")], [{requirement: gameData.itemData["Void Universe"].getExpense() * 100}]),
	"Astral Realm": new CoinRequirement([getItemElement("Astral Realm")], [{requirement: gameData.itemData["Astral Realm"].getExpense() * 100}]),
    "Galactic Throne": new CoinRequirement([getItemElement("Galactic Throne")], [{ requirement: gameData.itemData["Galactic Throne"].getExpense() * 100 }]),
    "Spaceship": new CoinRequirement([getItemElement("Spaceship")], [{ requirement: gameData.itemData["Spaceship"].getExpense() * 100 }]),

    //Misc
    "Book": new CoinRequirement([getItemElement("Book")], [{requirement: 0}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Personal Squire": new CoinRequirement([getItemElement("Personal Squire")], [{requirement: gameData.itemData["Personal Squire"].getExpense() * 100}]),
    "Steel Longsword": new CoinRequirement([getItemElement("Steel Longsword")], [{requirement: gameData.itemData["Steel Longsword"].getExpense() * 100}]),
    "Butler": new CoinRequirement([getItemElement("Butler")], [{requirement: gameData.itemData["Butler"].getExpense() * 100}]),
    "Sapphire Charm": new CoinRequirement([getItemElement("Sapphire Charm")], [{requirement: gameData.itemData["Sapphire Charm"].getExpense() * 100}]),
    "Study Desk": new CoinRequirement([getItemElement("Study Desk")], [{requirement: gameData.itemData["Study Desk"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
	"Observatory": new CoinRequirement([getItemElement("Observatory")], [{requirement: gameData.itemData["Observatory"].getExpense() * 100}]),
	"Mind's Eye": new CoinRequirement([getItemElement("Mind's Eye")], [{requirement: gameData.itemData["Mind's Eye"].getExpense() * 100}]),
	"Void Necklace": new CoinRequirement([getItemElement("Void Necklace")], [{requirement: gameData.itemData["Void Necklace"].getExpense() * 100}]),
	"Void Armor": new CoinRequirement([getItemElement("Void Armor")], [{requirement: gameData.itemData["Void Armor"].getExpense() * 100}]),
	"Void Blade": new CoinRequirement([getItemElement("Void Blade")], [{requirement: gameData.itemData["Void Blade"].getExpense() * 100}]),
	"Void Orb": new CoinRequirement([getItemElement("Void Orb")], [{requirement: gameData.itemData["Void Orb"].getExpense() * 100}]),
	"Void Dust": new CoinRequirement([getItemElement("Void Dust")], [{requirement: gameData.itemData["Void Dust"].getExpense() * 100}]),
	"Celestial Robe": new CoinRequirement([getItemElement("Celestial Robe")], [{requirement: gameData.itemData["Celestial Robe"].getExpense() * 100}]),
	"Universe Fragment": new CoinRequirement([getItemElement("Universe Fragment")], [{requirement: gameData.itemData["Universe Fragment"].getExpense() * 100}]),
    "Multiverse Fragment": new CoinRequirement([getItemElement("Multiverse Fragment")], [{ requirement: gameData.itemData["Multiverse Fragment"].getExpense() * 100 }]),

    // Milestones
    "Milestones": new EssenceRequirement([document.getElementById("milestonesTabButton")], [{ requirement: 1 }]),

    // Challenges
    "Challenges": new EvilRequirement([document.getElementById("challengesTabButton")], [{ requirement: 10000 }]),
    "Challenge_an_unhappy_life": new EvilRequirement([document.getElementById("anUnhappyLifeChallenge")], [{ requirement: 10000 }]),
    "Challenge_the_rich_and_the_poor": new EvilRequirement([document.getElementById("theRichAndThePoorChallenge")], [{ requirement: 1000000 }]),
    "Challenge_time_does_not_fly": new EssenceRequirement([document.getElementById("timeDoesNotFlyChallenge")], [{ requirement: 10000 }]),
    "Challenge_dance_with_the_devil": new EssenceRequirement([document.getElementById("danceWithTheDevilChallenge")], [{ requirement: 1e6 }]),
    "Challenge_legends_never_die": new EssenceRequirement([document.getElementById("legendsNeverDieChallenge")], [{ requirement: 2.5e7 }]),
}

for (const key in milestoneBaseData) {
    const milestone = gameData.milestoneData[key]
    gameData.requirements[milestone.name] = new EssenceRequirement([getMilestoneElement(milestone.name)],
        [{ requirement: milestone.expense }])
}

tempData["requirements"] = {}
for (const key in gameData.requirements) {
    const requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

gameData.milestoneData = {}
createGameObjects(gameData.milestoneData, milestoneBaseData)

initUI()

setCustomEffects()
addMultipliers()

update()

setTab(gameData.settings.selectedTab)
setTabSettings("settingsTab")

var gameloop = setInterval(update, 1000 / updateSpeed)
var saveloop = setInterval(saveGameData, 3000)