// systems/characters.js

const BASE_URL = "https://raw.githubusercontent.com/CrashHelmet/onepunchman-images/main/";

const characters = [
    // ⭐ GOD LEVEL (Auto‑Tiered)
    {
        name: "Saitama",
        base: "Saitama_(around God level).webp",
        display: "Saitama",
        threat: "God",
        rarity: "above_god",
        aliases: ["caped baldy"],
        hp: 30440,
        atk: 9120
    },
    {
        name: "God",
        base: "God_(around God level).webp",
        display: "God",
        threat: "God",
        rarity: "above_god",
        aliases: [],
        hp: 24000,
        atk: 9000
    },
    {
        name: "Cosmic_Garou",
        base: "Cosmic_Garou_(around God level).png",
        display: "Garou (Cosmic Fear Mode)",
        threat: "God",
        rarity: "very_high_god",
        aliases: ["cosmic garou"],
        hp: 18790,
        atk: 7340
    },
    {
        name: "MeteoricBurstBoros",
        base: "MeteoricBurstBoros_(around God level).webp",
        display: "Boros (Meteoric Burst)",
        threat: "God",
        rarity: "low_god",
        aliases: ["meteoric burst boros"],
        hp: 16810,
        atk: 5290
    },
    {
        name: "King",
        base: "King_(around God level).webp",
        display: "King",
        threat: "God",
        rarity: "very_low_god",
        aliases: [],
        hp: 100,
        atk: 3010
    },
    {
        name: "Blast",
        base: "Blast_(around God level).webp",
        display: "Blast",
        threat: "God",
        rarity: "god",
        aliases: [],
        hp: 15900,
        atk: 4820
    },
    {
        name: "MonsterGarou",
        base: "MonsterGarou_(around Dragon level).png",
        display: "Garou (Monster)",
        threat: "Dragon",
        rarity: "above_dragon",
        aliases: ["monster garou"],
        hp: 3500,
        atk: 950
    },
    {
        name: "Sage_Centipede",
        base: "Sage_Centipede_(around Dragon level).webp",
        display: "Sage Centipede",
        threat: "Dragon",
        rarity: "very_high_dragon",
        aliases: ["sage centipede"],
        hp: 4600,
        atk: 850
    },
    {
        name: "EvilNaturalOcean",
        base: "EvilNaturalOcean_(around Dragon level).webp",
        display: "Evil Natural Ocean",
        threat: "Dragon",
        rarity: "very_high_dragon",
        aliases: ["eno"],
        hp: 3800,
        atk: 800
    },
    {
        name: "EvilNaturalWater",
        base: "EvilNaturalWater_(around Dragon level).png",
        display: "Evil Natural Water",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: ["enw"],
        hp: 3300,
        atk: 680
    },
    {
        name: "HalfMonster_Garou",
        base: "Half-Monster_Garou_(around Dragon level).webp",
        display: "Garou (Half Monster)",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 2980,
        atk: 610
    },
    {
        name: "Armoured_Boros",
        base: "Armoured_Boros_(around Dragon level).webp",
        display: "Boros (Armoured)",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: ["armored boros", "armoured boros"],
        hp: 2740,
        atk: 680
    },
    {
        name: "Released_Boros",
        base: "Released_Boros_(around Dragon level).webp",
        display: "Boros (Released)",
        threat: "Dragon",
        rarity: "above_dragon",
        aliases: [],
        hp: 3910,
        atk: 900
    },
    {
        name: "ElderCentipede_Pre",
        base: "Elder_Centipede_Pre-Molting_(around Dragon level).webp",
        display: "Elder Centipede (Pre-Molting)",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2610,
        atk: 480
    },
    {
        name: "ElderCentipede_Post",
        base: "Elder_Centipede_Post-Molting_(around Dragon level).webp",
        display: "Elder Centipede (Post-Molting)",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3290,
        atk: 650
    },
    {
        name: "Marugori",
        base: "Marugori_aka_Beefcake_(around Dragon level).webp",
        display: "Marugori (Beefcake)",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: ["beefcake"],
        hp: 3470,
        atk: 690
    },
    {
        name: "MonsterKingOrochi",
        base: "MonsterKingOrochi_(around Dragon level).png",
        display: "Monster King Orochi",
        threat: "Dragon",
        rarity: "very_high_dragon",
        aliases: [],
        hp: 3500,
        atk: 700
    },
    {
        name: "Nyan",
        base: "Nyan_(around Dragon level).webp",
        display: "Nyan",
        threat: "Dragon",
        rarity: "low_dragon",
        aliases: [],
        hp: 2210,
        atk: 430
    },
    {
        name: "OvergrownRover",
        base: "OvergrownRover_(around Dragon level).png",
        display: "Overgrown Rover",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: ["rover"],
        hp: 3380,
        atk: 670
    },
    {
        name: "Gouketsu",
        base: "Gouketsu_(around Dragon level).webp",
        display: "Gouketsu",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3300,
        atk: 690
    },
    {
        name: "Cruel_Dragon",
        base: "Cruel_Dragon_(around Dragon level).webp",
        display: "Cruel Dragon",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: ["cruel dragon"],
        hp: 3400,
        atk: 720
    },
    {
        name: "Gums",
        base: "Gums_(around Dragon level).png",
        display: "Gums",
        threat: "Dragon",
        rarity: "very_low_dragon",
        aliases: [],
        hp: 2430,
        atk: 420
    },
    {
        name: "MetalKnight",
        base: "MetalKnight_(around Dragon level).png",
        display: "Metal Knight",
        threat: "Dragon",
        rarity: "low_dragon",
        aliases: [],
        hp: 2280,
        atk: 450
    },
    {
        name: "PigGod",
        base: "PigGod_(around Dragon level).webp",
        display: "Pig God",
        threat: "Dragon",
        rarity: "very_low_dragon",
        aliases: [],
        hp: 2400,
        atk: 430
    },
    {
      name: "Pluton",
      base: "Pluton_(around Dragon level).png",
      display: "Pluton",
      threat: "Dragon",
      rarity: "dragon",
      aliases: ["pluton"],
      hp: 3300,
      atk: 860
    },
    {
        name: "FlashyFlash",
        base: "FlashyFlash_(around Dragon level).webp",
        display: "Flashy Flash",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3100,
        atk: 380
    },
    {
        name: "SuperalloyDarkshine",
        base: "SuperalloyDarkshine_(around Dragon level).webp",
        display: "Superalloy Darkshine",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3450,
        atk: 700
    },
    {
      name: "Homeless_Emperor",
      base: "Homeless_Emperor_(around Dragon level).png",
      display: "Homeless Emperor",
      threat: "Dragon",
      rarity: "dragon",
      aliases: ["homeless emperor", "emperor"],
      hp: 100,
      atk: 1140
    },
    {
        name: "WatchdogMan",
        base: "WatchdogMan_(around Dragon level).webp",
        display: "Watchdog Man",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2900,
        atk: 610
    },
    {
        name: "DriveKnight",
        base: "DriveKnight_(around Dragon level).webp",
        display: "Drive Knight",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2760,
        atk: 540
    },
    {
        name: "Atomic_Samurai",
        base: "Atomic_Samurai_(around Dragon level).webp",
        display: "Atomic Samurai",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3150,
        atk: 670
    },
    {
        name: "Groribas",
        base: "Groribas_(around Dragon level).webp",
        display: "Groribas",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2600,
        atk: 500
    },
    {
        name: "Melzargard",
        base: "Melzargard_(around Dragon level).webp",
        display: "Melzargard",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 3000,
        atk: 600
    },
    {
        name: "Geryuganshoop",
        base: "Geryuganshoop_(around Dragon level).webp",
        display: "Geryuganshoop",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2700,
        atk: 520
    },
    {
        name: "Bakuzan_Monster",
        base: "Bakuzan_Monster_(around Dragon level).png",
        display: "Bakuzan (Monster)",
        threat: "Dragon",
        rarity: "dragon",
        aliases: ["monster bakuzan"],
        hp: 3000,
        atk: 620
    },
    {
        name: "TransformedVaccineMan",
        base: "TransformedVaccineMan_(around Dragon level).webp",
        display: "Vaccine Man (Transformed)",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3600,
        atk: 780
    },
    {
        name: "VaccineMan",
        base: "VaccineMan_(around Dragon level).webp",
        display: "Vaccine Man",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2600,
        atk: 520
    },
    {
        name: "Metal_Bat",
        base: "Metal_Bat_(around Dragon level).webp",
        display: "Metal Bat",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3100,
        atk: 650
    },
    {
        name: "Bang",
        base: "Bang_aka_Silverfang_(around Dragon level).webp",
        display: "Bang (Silverfang)",
        threat: "Dragon",
        rarity: "very_high_dragon",
        aliases: ["silverfang", "silver fang"],
        hp: 3400,
        atk: 700
    },
    {
        name: "Genos",
        base: "Genos_(around Dragon level).webp",
        display: "Genos",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2800,
        atk: 580
    },
    {
        name: "Tatsumaki",
        base: "Tatsumaki_(around Dragon level).webp",
        display: "Tatsumaki",
        threat: "Dragon",
        rarity: "very_high_dragon",
        aliases: ["tornado of terror"],
        hp: 3300,
        atk: 700
    },
    {
        name: "AncientKing",
        base: "AncientKing_(around Dragon level).png",
        display: "Ancient King",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 3000,
        atk: 600
    },
    {
        name: "BlackSperm",
        base: "BlackSperm_(around Dragon level).png",
        display: "Black Sperm",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3200,
        atk: 200
    },
    {
        name: "Bomb",
        base: "Bomb_(around Dragon level).png",
        display: "Bomb",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3100,
        atk: 640
    },
    {
        name: "ChildEmperor_BraveGiant",
        base: "ChildEmperor_BraveGiant_(around Dragon level).webp",
        display: "Child Emperor (Brave Giant)",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 2900,
        atk: 580
    },
    {
        name: "CarnageKabuto_CarnageMode",
        base: "CarnageKabuto_CarnageMode_(around Dragon level).webp",
        display: "Carnage Kabuto (Carnage Mode)",
        threat: "Dragon",
        rarity: "high_dragon",
        aliases: [],
        hp: 3500,
        atk: 700
    },
    {
        name: "CarnageKabuto",
        base: "CarnageKabuto_(around Dragon level).webp",
        display: "Carnage Kabuto",
        threat: "Dragon",
        rarity: "dragon",
        aliases: [],
        hp: 3000,
        atk: 600
    },
    {
        name: "DefenceUnit_Level_4",
        base: "DefenceUnit_Level_4_(around Demon level).jpg",
        display: "Defence Unit (Level 4)",
        threat: "Demon",
        rarity: "high_demon",
        aliases: ["defence unit 4", "defense unit 4"],
        hp: 1180,
        atk: 270
    },
    {
        name: "DefenceUnit_Level_1",
        base: "DefenceUnit_Level_1_(around Demon level).jpg",
        display: "Defence Unit (Level 1)",
        threat: "Demon",
        rarity: "demon",
        aliases: ["defence unit 1", "defense unit 1"],
        hp: 1100,
        atk: 260
    },
    {
        name: "Armored_Gorilla",
        base: "Armored_Gorilla_(around Demon level).webp",
        display: "Armored Gorilla",
        threat: "Demon",
        rarity: "low_demon",
        aliases: [],
        hp: 680,
        atk: 190
    },
    {
        name: "Baquma",
        base: "Baquma_(around Demon level).png",
        display: "Baquma",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 760,
        atk: 170
    },
    {
        name: "BeastKing",
        base: "BeastKing_(around Demon level).webp",
        display: "Beast King",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 1040,
        atk: 240
    },
    {
        name: "Blood_Absorbed_MosquitoGirl",
        base: "Blood_Absorbed_MosquitoGirl_(around Demon level).webp",
        display: "Mosquito Girl (Blood Absorbed)",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 990,
        atk: 220
    },
    {
        name: "Phoenix_Man",
        base: "Phoenix_Man_(around Demon level).webp",
        display: "Phoenix Man",
        threat: "Demon",
        rarity: "high_demon",
        aliases: ["phoenixman"],
        hp: 1080,
        atk: 240
    },
    {
        name: "Senior_Centipede",
        base: "Senior_Centipede_(around Demon level).webp",
        display: "Senior Centipede",
        threat: "Demon",
        rarity: "demon",
        aliases: ["senior centipede"],
        hp: 1100,
        atk: 285
    },
    {
        name: "ChildEmperor",
        base: "ChildEmperor_(around Demon level).webp",
        display: "Child Emperor",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 720,
        atk: 160
    },
    {
        name: "DeepSeaKing",
        base: "DeepSeaKing_(around Demon level).webp",
        display: "Deep Sea King",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 1100,
        atk: 250
    },
    {
        name: "DrGenus",
        base: "DrGenus_(around Demon level).png",
        display: "Dr. Genus",
        threat: "Demon",
        rarity: "very_low_demon",
        aliases: [],
        hp: 700,
        atk: 150
    },
    {
        name: "Fubuki",
        base: "Fubuki_(around Demon level).webp",
        display: "Fubuki",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 930,
        atk: 210
    },
    {
        name: "Gale_Wind",
        base: "Gale_Wind_(around Demon level).webp",
        display: "Gale Wind",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1080,
        atk: 240
    },
    {
        name: "HellfireFlame",
        base: "HellfireFlame_(around Demon level).png",
        display: "Hellfire Flame",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1060,
        atk: 235
    },
    {
        name: "Human_Garou",
        base: "Human_Garou_(around Demon level).webp",
        display: "Garou (Human)",
        threat: "Demon",
        rarity: "very_high_demon",
        aliases: [],
        hp: 1100,
        atk: 250
    },
    {
        name: "Hydrated_DeepSeaKing",
        base: "Hydrated_DeepSeaKing_(around Demon level).webp",
        display: "Deep Sea King (Hydrated)",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1090,
        atk: 245
    },
    {
        name: "MachineGodG4",
        base: "MachineGodG4_(around Demon level).webp",
        display: "Machine God G4",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1050,
        atk: 240
    },
    {
        name: "MachineGodG5",
        base: "MachineGodG5_(around Demon level).png",
        display: "Machine God G5",
        threat: "Demon",
        rarity: "very_high_demon",
        aliases: [],
        hp: 1100,
        atk: 260
    },
    {
        name: "MosquitoGirl",
        base: "MosquitoGirl_(around Demon level).webp",
        display: "Mosquito Girl",
        threat: "Demon",
        rarity: "low_demon",
        aliases: [],
        hp: 780,
        atk: 170
    },
    {
        name: "PowerAbsorbed_Baquma",
        base: "PowerAbsorbed_Baquma_(around Demon level).png",
        display: "Baquma (Power Absorbed)",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1060,
        atk: 275
    },
    {
        name: "PuriPuriPrisoner",
        base: "PuriPuriPrisoner_(around Demon level).png",
        display: "Puri-Puri Prisoner",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1080,
        atk: 240
    },
    {
        name: "Transformed_Bug_God",
        base: "Transformed_Bug_God_(around Demon level).webp",
        display: "Bug God (Transformed)",
        threat: "Demon",
        rarity: "very_high_demon",
        aliases: ["bug god transformed"],
        hp: 1120,
        atk: 260
    },
    {
        name: "Base_Bug_God",
        base: "Base_Bug_God_(around Demon level).webp",
        display: "Bug God (Base)",
        threat: "Demon",
        rarity: "high_demon",
        aliases: ["bug god"],
        hp: 1090,
        atk: 235
    },
    {
        name: "Sky_King",
        base: "Sky_King_(around Demon level).webp",
        display: "Sky King",
        threat: "Demon",
        rarity: "low_demon",
        aliases: [],
        hp: 760,
        atk: 165
    },
    {
        name: "Speed_o_Sound_Sonic",
        base: "Speed_o_Sound_Sonic_(around Demon level).png",
        display: "Speed-o'-Sound Sonic",
        threat: "Demon",
        rarity: "high_demon",
        aliases: ["sonic"],
        hp: 1050,
        atk: 245
    },
    {
        name: "SubterraneanKing",
        base: "SubterraneanKing_(around Demon level).png",
        display: "Subterranean King",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 1080,
        atk: 290
    },
    {
        name: "SweetMask",
        base: "SweetMask_(around Demon level).webp",
        display: "Sweet Mask",
        threat: "Demon",
        rarity: "high_demon",
        aliases: [],
        hp: 1040,
        atk: 235
    },
    {
        name: "TanktopMaster",
        base: "TanktopMaster_(around Demon level).webp",
        display: "Tanktop Master",
        threat: "Demon",
        rarity: "demon",
        aliases: [],
        hp: 960,
        atk: 210
    },
    {
        name: "Zombieman",
        base: "Zombieman_(around Demon level).webp",
        display: "Zombieman",
        threat: "Demon",
        rarity: "low_demon",
        aliases: [],
        hp: 820,
        atk: 180
    },
    {
        name: "Subterranean",
        base: "Subterranean_(around Tiger level).webp",
        display: "Subterranean",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 390,
        atk: 95
    },
    {
        name: "Hammerhead",
        base: "Hammerhead_(around Tiger level).png",
        display: "Hammerhead",
        threat: "Tiger",
        rarity: "high_tiger",
        aliases: [],
        hp: 400,
        atk: 105
    },
    {
        name: "Bakuzan_Human",
        base: "Human_Bakuzan_(around Tiger level).png",
        display: "Bakuzan (Human)",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 360,
        atk: 90
    },
    {
        name: "Bushidrill",
        base: "Bushidrill_(around Tiger level).webp",
        display: "Bushidrill",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 330,
        atk: 85
    },
    {
        name: "Crablante",
        base: "Crablante_(around Tiger level).webp",
        display: "Crablante",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 310,
        atk: 80
    },
    {
        name: "Death_Gatling",
        base: "Death_Gatling_(around Tiger level).webp",
        display: "Death Gatling",
        threat: "Tiger",
        rarity: "high_tiger",
        aliases: [],
        hp: 390,
        atk: 100
    },
    {
        name: "Eyelashes",
        base: "Eyelashes_(around Tiger level).png",
        display: "Eyelashes",
        threat: "Tiger",
        rarity: "low_tiger",
        aliases: [],
        hp: 270,
        atk: 65
    },
    {
        name: "Golden_Ball",
        base: "Golden_Ball_(around Tiger level).webp",
        display: "Golden Ball",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 320,
        atk: 75
    },
    {
        name: "GroundDragon",
        base: "GroundDragon_(around Tiger level).png",
        display: "Ground Dragon",
        threat: "Tiger",
        rarity: "low_tiger",
        aliases: [],
        hp: 260,
        atk: 60
    },
    {
        name: "Iaian",
        base: "Iaian_(around Tiger level).webp",
        display: "Iaian",
        threat: "Tiger",
        rarity: "high_tiger",
        aliases: [],
        hp: 380,
        atk: 95
    },
    {
        name: "JetNiceGuy",
        base: "JetNiceGuy_(around Tiger level).png",
        display: "Jet Nice Guy",
        threat: "Tiger",
        rarity: "low_tiger",
        aliases: [],
        hp: 290,
        atk: 70
    },
    {
        name: "Kamakyuri",
        base: "Kamakyuri_(around Tiger level).png",
        display: "Kamakyuri",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 310,
        atk: 80
    },
    {
        name: "Kombu_Infinity",
        base: "Kombu_Infinity_(around Tiger level).webp",
        display: "Kombu Infinity",
        threat: "Tiger",
        rarity: "high_tiger",
        aliases: [],
        hp: 390,
        atk: 100
    },
    {
        name: "LightningMax",
        base: "LightningMax_(around Tiger level).png",
        display: "Lightning Max",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 330,
        atk: 85
    },
    {
        name: "MagicMan",
        base: "MagicMan_(around Tiger level).png",
        display: "Magic Man",
        threat: "Tiger",
        rarity: "low_tiger",
        aliases: [],
        hp: 260,
        atk: 60
    },
    {
        name: "Maiko_Plasma",
        base: "Maiko_Plasma_(around Tiger level).png",
        display: "Maiko Plasma",
        threat: "Tiger",
        rarity: "low_tiger",
        aliases: [],
        hp: 270,
        atk: 65
    },
    {
        name: "Marshall_Gorilla",
        base: "Marshall_Gorilla_(around Tiger level).png",
        display: "Marshall Gorilla",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 320,
        atk: 75
    },
    {
        name: "MountainApe",
        base: "MountainApe_(around Tiger level).png",
        display: "Mountain Ape",
        threat: "Tiger",
        rarity: "low_tiger",
        aliases: [],
        hp: 260,
        atk: 60
    },
    {
        name: "Okamaitachi",
        base: "Okamaitachi_(around Tiger level).webp",
        display: "Okamaitachi",
        threat: "Tiger",
        rarity: "high_tiger",
        aliases: [],
        hp: 380,
        atk: 95
    },
    {
        name: "Snek",
        base: "Snek_(around Tiger level).webp",
        display: "Snek",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 310,
        atk: 80
    },
    {
        name: "Spring_Mustachio",
        base: "Spring_Mustachio_(around Tiger level).webp",
        display: "Spring Mustachio",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 320,
        atk: 75
    },
    {
        name: "Stinger",
        base: "Stinger_(around Tiger level).webp",
        display: "Stinger",
        threat: "Tiger",
        rarity: "tiger",
        aliases: [],
        hp: 330,
        atk: 85
    },
    {
        name: "Human_Marugori",
        base: "Human_Marugori_(around Wolf level).png",
        display: "Marugori (Human)",
        threat: "Wolf",
        rarity: "wolf",
        aliases: ["human beefcake"],
        hp: 180,
        atk: 50
    },
    {
        name: "All_BackMan",
        base: "All_BackMan_(around Wolf level).png",
        display: "All Back-Man",
        threat: "Wolf",
        rarity: "very_low_wolf",
        aliases: [],
        hp: 150,
        atk: 30
    },
    {
        name: "BunbunMan",
        base: "BunbunMan_(around Wolf level).png",
        display: "Bunbun Man",
        threat: "Wolf",
        rarity: "very_low_wolf",
        aliases: [],
        hp: 140,
        atk: 28
    },
    {
        name: "Charanko",
        base: "Charanko_(around Wolf level).png",
        display: "Charanko",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 160,
        atk: 35
    },
    {
        name: "Dark_Matter_Gunner",
        base: "Dark_Matter_Gunner_(around Wolf level).png",
        display: "Dark Matter Gunner",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 150,
        atk: 32
    },
    {
        name: "D_Pad",
        base: "D_Pad_(around Wolf level).png",
        display: "D-Pad",
        threat: "Wolf",
        rarity: "low_wolf",
        aliases: [],
        hp: 130,
        atk: 25
    },
    {
        name: "FrogMan",
        base: "FrogMan_(around Wolf level).png",
        display: "Frog Man",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 150,
        atk: 32
    },
    {
        name: "FuneralSuspenders",
        base: "FuneralSuspenders_(around Wolf level).png",
        display: "Funeral Suspenders",
        threat: "Wolf",
        rarity: "low_wolf",
        aliases: [],
        hp: 130,
        atk: 25
    },
    {
        name: "Lily",
        base: "Lily_(around Wolf level).png",
        display: "Lily",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 150,
        atk: 32
    },
    {
        name: "Piggy_Bancon",
        base: "Piggy_Bancon_(around Wolf level).png",
        display: "Piggy Bancon",
        threat: "Wolf",
        rarity: "low_wolf",
        aliases: [],
        hp: 130,
        atk: 25
    },
    {
        name: "Seafolk",
        base: "Seafolk_(around Wolf level).png",
        display: "Seafolk",
        threat: "Wolf",
        rarity: "high_wolf",
        aliases: [],
        hp: 180,
        atk: 40
    },
    {
        name: "Slugerous",
        base: "Slugerous_(around Wolf level).webp",
        display: "Slugerous",
        threat: "Wolf",
        rarity: "low_wolf",
        aliases: [],
        hp: 130,
        atk: 25
    },
    {
        name: "SourFace",
        base: "SourFace_(around Wolf level).png",
        display: "Sour Face",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 150,
        atk: 32
    },
    {
        name: "TankTop_BlackHole",
        base: "TankTop_BlackHole_(around Wolf level).png",
        display: "Tanktop Black Hole",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 150,
        atk: 32
    },
    {
        name: "MessengerOfTheSeafolk",
        base: "MessengerOfTheSeafolk_(around Wolf level).webp",
        display: "Messenger of the Seafolk",
        threat: "Wolf",
        rarity: "wolf",
        aliases: [],
        hp: 160,
        atk: 35
    },
    {
        name: "MumenRider",
        base: "MumenRider_(around Wolf level).webp",
        display: "Mumen Rider",
        threat: "Wolf",
        rarity: "low_wolf",
        aliases: [],
        hp: 140,
        atk: 28
    },
];
// Auto-generate encoded image URLs
for (const c of characters) {
    c.image = encodeURI(`${BASE_URL}${c.base}`);
}

// ⭐ INDEX SYSTEM — Slug, Display, Alias Maps + Helper Functions

const slugToCharacter = {};
const displayToSlug = {};
const aliasToSlug = {};

for (const c of characters) {
    const slug = c.name;

    // Map slug → character
    slugToCharacter[slug] = c;

    // Map display → slug
    displayToSlug[c.display.toLowerCase()] = slug;

    // Map aliases → slug
    if (Array.isArray(c.aliases)) {
        for (const alias of c.aliases) {
            aliasToSlug[alias.toLowerCase()] = slug;
        }
    }
}

function getCharacterBySlug(slug) {
    return slugToCharacter[slug] || null;
}

function getSlugFromDisplayOrAlias(input) {
    if (!input) return null;
    const key = input.toLowerCase();

    if (displayToSlug[key]) return displayToSlug[key];
    if (aliasToSlug[key]) return aliasToSlug[key];

    return null;
}

function getDisplayFromSlug(slug) {
    const c = slugToCharacter[slug];
    return c ? c.display : null;
}

function getRarity(slug) {
    const c = slugToCharacter[slug];
    return c ? c.rarity : null;
}

function getThreat(slug) {
    const c = slugToCharacter[slug];
    return c ? c.threat : null;
}

module.exports = {
    characters,
    slugToCharacter,
    displayToSlug,
    aliasToSlug,
    getCharacterBySlug,
    getSlugFromDisplayOrAlias,
    getDisplayFromSlug,
    getRarity,
    getThreat
};
