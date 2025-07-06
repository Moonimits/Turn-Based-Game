import { updateEnemyHealthBar, updateHealthBar, updatePlayerDmgLabel } from "../controller.js";
import { healthSteal, inflictStatus, probability } from "../repo/AbilityRepo.js";
import { objStatus } from "../repo/StatusRepo.js";

export const weapons = [
    {name: "Book",            damage: 1,  gold: 1,},
    {name: "Rock",            damage: 1,  gold: 1,},
    {name: "Stick",           damage: 1,  gold: 1,},
    {name: "Konbanwa",        damage: 3,  gold: 2,},
    {name: "ShortSword",      damage: 3,  gold: 3,},
    {name: "Sword",           damage: 5,  gold: 5,},
    {name: "Spear",           damage: 5,  gold: 5,},
    {name: "Bow",             damage: 5,  gold: 5,},
    {name: "Axe",             damage: 6,  gold: 5,},
    {name: "Mace",            damage: 7,  gold: 6,},
    {name: "Halberd",         damage: 10, gold: 7,},
    {name: "War Hammer",      damage: 10, gold: 7,},
    {name: "War Axe",         damage: 10, gold: 10, effect: [objEffect("bleed", 3, 50, 6)]},
    {name: "Blessed Dagger",  damage: 6,  gold: 10, effect:[objEffect("heal", 10, 50)]},
    {name: "Red Spear",       damage: 8,  gold: 10, effect:[objEffect("strength", 10)]},
    {name: "Venomous Dagger", damage: 9,  gold: 10, effect:[objEffect("poison", 10, 35, 4)]},
];

export const armors = [
    {name: "Cap",        health: 5,   gold: 1},
    {name: "Shirt",      health: 5,   gold: 1},
    {name: "Mask",       health: 10,  gold: 2},
    {name: "WolfHide",   health: 30,  gold: 4},
    {name: "Leather",    health: 10,  gold: 4},
    {name: "Chainmail",  health: 40,  gold: 7},
    {name: "Iron Plate", health: 60,  gold: 9},
    {name: "Bulwark",    health: 80,  gold: 10},
    {name: "Gold Plate", health: 100, gold: 10},
];

export const specialArmor = [
    {name: "Ogalvar",              health: 230, gold: 15, category: 'special'},
    {name: "Loribo Chestplate",    health: 260, gold: 15, category: 'special'},
    {name: "Guraguard",            health: 340, gold: 17, category: 'special'},
    {name: "Black Plating",        health: 310, gold: 19, category: 'special'},
    {name: "Polar Crest",          health: 240, gold: 20, category: 'special'},
    {name: "Marcosoft: #LifeHack", health: 500, gold: 50, category: 'hack'},
]

export const specialWeapon = [
    {name: "Altaric Sword",      damage: 25, gold: 12,  category: 'special', effect:[objEffect("lifesteal", 20)]},
    {name: "Longinus Spear",     damage: 30, gold: 12,  category: 'special', effect:[objEffect("strength", 20, 50, 2)]},
    {name: "Soul Cipher",        damage: 45, gold: 15,  category: 'special', effect:[objEffect("lifesteal", 30)]},
    {name: "Checkaliber",        damage: 30, gold: 15,  category: 'special', effect:[objEffect("heal", 20, 50)]},
    {name: "Xercero",            damage: 43, gold: 14,  category: 'special', effect:[objEffect("flames", 30)]},
    {name: "Dragonus",           damage: 50, gold: 17,  category: 'special', effect:[objEffect("flames", 50, 50)]},
    {name: "Pxosk",              damage: 48, gold: 16,  category: 'special', effect:[objEffect("strength", 30, 35, 2)]},
    {name: "Wylter Pol",         damage: 35, gold: 12,  category: 'special', effect:[objEffect("lifebreak", 5)]},
    {name: "Vendragon",          damage: 47, gold: 17,  category: 'special', effect:[objEffect("poison", 60, 70, 3)]},
    {name: "Abnormality",        damage: 47, gold: 18,  category: 'special', effect:[objEffect("poison", 15, 50, 3), objEffect("flames", 15, 50, 3), objEffect("bleed", 15, 50, 3)]},
    {name: "Crimson Edge",       damage: 25, gold: 17,  category: 'special', effect:[objEffect("bleed", 10, 70, 5)]},
    {name: "Excalibur",          damage: 55, gold: 18,  category: 'special', effect:[objEffect("heal", 50, 50)]},
    {name: "Divine Greatsword",  damage: 65, gold: 20,  category: 'special', effect:[objEffect("heal", 100, 90)]},
    {name: "Draconic Twinblade", damage: 45, gold: 18,  category: 'special', effect:[objEffect("lifesteal", 50)]},
];

export const ultraWeapons = [
    {name: "Marcosoft: #Violence",        damage: 130, gold: 50, category: 'hack'},
    {name: "Charter Arsenal: Absorber",   damage: 35,  gold: 50,  category: 'hack', effect:[objEffect("healthsteal", 50)]},
    {name: "Charter: Malefic Permanence", damage: 10,  gold: 50,  category: 'hack', effect:[objEffect("damagegain", 10)]},
]

export const consumables = [
    {id: 1, name: "Small Healing Potion", heal:50,  type: "heal", price: 5, qty:1},
    {id: 2, name: "Healing Potion",       heal:150, type: "heal", price: 15, qty:1},
    {id: 3, name: "Great Healing Potion", heal:400, type: "heal", price: 40, qty:1},
]

export const enchantments = [
    {id: 4, name: "Flames Enchant",     effect: "Flames",    amount:5,  price: 20, type: "enchant", qty:1},
    {id: 5, name: "Poison Enchant",     effect: "Poison",    amount:5,  price: 20, type: "enchant", qty:1},
    {id: 6, name: "LifeSteal Enchant",  effect: "Lifesteal", amount:3,  price: 20, type: "enchant", qty:1},
    {id: 7, name: "Bleed Enchant",      effect: "Bleed",     amount:4,  price: 20, type: "enchant", qty:1},
    {id: 8, name: "Healing Enchant",    effect: "Heal",      amount:10, price: 20, type: "enchant", qty:1},
    {id: 9, name: "Strength Enchant",   effect: "Strength",  amount:5,  price: 20, type: "enchant", qty:1},
    {id: 10, name: "Lifebreak Enchant", effect: "Lifebreak", amount:2,  price: 20, type: "enchant", qty:1},
]
export const enchantmentsII = [
    {id: 11, name: "Flames Enchant II",     effect: "Flames",    amount:10, price: 50, type: "enchant", qty:1},
    {id: 12, name: "Poison Enchant II",     effect: "Poison",    amount:10, price: 50, type: "enchant", qty:1},
    {id: 13, name: "LifeSteal Enchant II",  effect: "Lifesteal", amount:5,  price: 50, type: "enchant", qty:1},
    {id: 14, name: "Bleed Enchant II",      effect: "Bleed",     amount: 8, price: 50, type: "enchant", qty:1},
    {id: 15, name: "Healing Enchant II",    effect: "Heal",      amount:15, price: 50, type: "enchant", qty:1},
    {id: 16, name: "Strength Enchant II",   effect: "Strength",  amount:10, price: 50, type: "enchant", qty:1},
    {id: 17, name: "Lifebreak Enchant II",  effect: "Lifebreak", amount:4,  price: 50, type: "enchant", qty:1},
]
export const enchantmentsIII = [
    {id: 18, name: "Flames Enchant III",    effect: "Flames",    amount:15, price: 100, type: "enchant", qty:1},
    {id: 19, name: "Poison Enchant III",    effect: "Poison",    amount:15, price: 100, type: "enchant", qty:1},
    {id: 20, name: "LifeSteal Enchant III", effect: "Lifesteal", amount:8,  price: 100, type: "enchant", qty:1},
    {id: 21, name: "Bleed Enchant III",     effect: "Bleed",     amount: 12,price: 100, type: "enchant", qty:1},
    {id: 22, name: "Healing Enchant III",   effect: "Heal",      amount:20, price: 100, type: "enchant", qty:1},
    {id: 23, name: "Strength Enchant III",  effect: "Strength",  amount:15, price: 100, type: "enchant", qty:1},
    {id: 24, name: "Lifebreak Enchant III", effect: "Lifebreak", amount:6,  price: 100, type: "enchant", qty:1},
]
export const statEnhancer = [
    {id: 25, name: "Life Shard", amount: 20, type: "boost", price: 20, boost: "hp", qty:1},
    {id: 26, name: "Blade Shard", amount: 5, type: "boost", price: 10, boost: "dmg", qty:1},
]
//Enchant Items
export function enchant(player, enchantment){
    const weaponEffects = player.equipWeapon.effect
    var chance = 35
    var duration = 3;
    var level = 1

    if(enchantment.name.includes("III")){
        chance = 45
        duration = 5
        level = 3
    }else if(enchantment.name.includes("II")){
        duration = 4;
        level = 2
    }

    if(weaponEffects){
        const weaponEffect = weaponEffects.find( effect => effect.name == enchantment.effect)

        if(weaponEffect){
            if(["inflict","buff"].includes(weaponEffect.type)){
                const key = Object.keys(weaponEffect.status)[0]
                weaponEffect.status[key] += enchantment.amount;
                if(level == 3){
                    weaponEffect.status.duration += 2;
                    weaponEffect.chance += 5;
                }else if(level == 2){
                    weaponEffect.status.duration += 1;
                }
            }else if(["onhit"].includes(weaponEffect.type)){
                if(weaponEffect.mode == "flat"){
                    weaponEffect.amount += enchantment.amount;
                    if(level == 3) weaponEffect.chance += 5;
                }else if(weaponEffect.mode == "percentage"){
                    weaponEffect.percent += enchantment.amount;
                }
            }
        }else{
            player.equipWeapon.effect.push(objEffect(enchantment.effect, enchantment.amount, chance, duration))
        }
        
    }else{
        player.equipWeapon.effect = [objEffect(enchantment.effect, enchantment.amount, chance, duration)];
    }
}

//Proc item Effects
export function procItemEffect(player, enemy){
    const weaponEffects = player.equipWeapon.effect
    let extraDmgLbl = '';

    if(weaponEffects)
    {
        weaponEffects.forEach(weaponEffect => {
            const effectName = weaponEffect.name;
    
            if(effectName == "Lifesteal"){
                player.curhealth += Math.round(player.damage * (weaponEffect.percent/100));
                if(player.curhealth > player.maxhealth) player.curhealth = player.maxhealth
                updateHealthBar(player)
            }else if(effectName == "Lifebreak"){
                enemy.curhealth -= Math.round(enemy.curhealth * (weaponEffect.percent/100));
                extraDmgLbl = `+(${weaponEffect.percent}%HP)`;
            }else if(effectName == "Healthsteal"){
                if(enemy.curhealth <= 0){
                    player.maxhealth += Math.round(enemy.maxhealth * (weaponEffect.percent/100));
                    player.curhealth += Math.round(enemy.maxhealth * (weaponEffect.percent/100));
                    updateHealthBar(player)
                }
            }else if(effectName == "Damagegain"){
                if(enemy.curhealth <= 0){
                    player.damage += Math.round(enemy.damage * (weaponEffect.percent/100));
                    updatePlayerDmgLabel(player)
                }
            }else if(effectName == "Heal"){
                if(probability(weaponEffect.chance)){
                    player.curhealth += weaponEffect.amount;
                    if(player.curhealth > player.maxhealth) player.curhealth = player.maxhealth
                    updateHealthBar(player)
                }
            }else if(weaponEffect.type == "buff"){
                if(probability(weaponEffect.chance)){
                    inflictStatus(player, weaponEffect.status)
                }
            }else if(weaponEffect.type == "inflict"){
                if(probability(weaponEffect.chance)){
                    inflictStatus(enemy, weaponEffect.status)
                }
            }
        });
    }
    return extraDmgLbl;
}

export function effectDesc(effect){
    const status = effect.status || {};

    const descMap = {
        heal: `Heal: ${effect.chance}% chance to heal <b class='hp'>${effect.amount}hp</b>`,
        lifesteal: `Lifesteal: ${effect.percent}%`,
        lifebreak: `Lifebreak: Deals ${effect.percent}%hp damage`,
        healthsteal: `Healtsteal: Permanently gain enemy's ${effect.percent}% MaxHp on kill`,
        damagegain: `DamageGain: Permanently gain enemy's ${effect.percent}%Dmg on kill`,
        flames: `Flames: ${effect.chance}% chance to inflict ${status.burn ?? 0} burn dmg for ${status.duration} rounds`,
        poison: `Poison: ${effect.chance}% chance to inflict ${status.poison ?? 0} poison dmg for ${status.duration} rounds`,
        bleed: `Bleed: ${effect.chance}% chance to inflict ${status.bleed ?? 0} bleed dmg for ${status.duration} rounds`,
        strength: `Strength: ${effect.chance}% chance to gain ${status.strength ?? 0} bonus dmg for ${status.duration} rounds`,
    }
    
    const key = effect.name.toLowerCase();
    return descMap[key];
}

//Item Effects
function objEffect(effectName, val, chance = 35, inflictDuration = 3){
    const weaponEffects = [
        {
            name: "Heal", 
            type: "onhit", 
            mode: "flat", 
            amount: val, 
            chance: chance,
            get desc(){ return `Heal: ${this.chance}% chance to heal <b class='hp'>${this.amount}hp</b>`},
        },
        {
            name: "Lifesteal", 
            type:"onhit", 
            mode: "percentage", 
            percent: val,
            get desc(){ return `Lifesteal: ${this.percent}%`},
        },
        {
            name: "Lifebreak", 
            type:"onhit", 
            mode: "percentage", 
            percent: val,
            get desc(){ return `Lifebreak: Deals ${this.percent}%hp damage`},
        },
        {
            name: "Healthsteal", 
            type:"onkill", 
            mode: "percentage", 
            percent: val,
            get desc(){ return `Healtsteal: Permanently gain enemy's ${this.percent}% MaxHp on kill`},
        },
        {
            name: "Damagegain", 
            type:"onkill", 
            mode: "percentage", 
            percent: val,
            get desc(){ return `DamageGain: Permanently gain enemy's ${this.percent}%Dmg on kill`},
        },
        {
            name: "Flames", 
            type:"inflict", 
            chance: chance, 
            status: objStatus("burn", val, inflictDuration),
            get desc(){ return `Flames: ${this.chance}% chance to inflict ${this.status.burn} burn dmg for ${this.status.duration} rounds`},
        },
        {
            name: "Poison", 
            type: "inflict", 
            chance: chance, 
            status: objStatus("poison", val, inflictDuration),
            get desc(){ return `Poison: ${this.chance}% chance to inflict ${this.status.poison} poison dmg for ${this.status.duration} rounds`},
        },
        {
            name: "Bleed", 
            type: "inflict", 
            chance: chance, 
            status: objStatus("bleed", val, inflictDuration),
            get desc(){ return `Bleed: ${this.chance}% chance to inflict ${this.status.bleed} bleed dmg for ${this.status.duration} rounds`},
        },
        {
            name: "Strength", 
            type: "buff", 
            chance: chance, 
            status: objStatus("strength", val, inflictDuration),
            get desc(){ return `Strength: ${this.chance}% chance to gain ${this.status.strength} bonus dmg for ${this.status.duration} rounds`},
        },
    ];

    const name = effectName;
    const effect = weaponEffects.find( eff => eff.name.toLocaleLowerCase() == name.toLowerCase());

    const clone = Object.create(
        Object.getPrototypeOf(effect),
        Object.getOwnPropertyDescriptors(effect)
    );

    if (clone.status) {
        clone.status = structuredClone(effect.status); // status is data-only, safe to clone
    }
    
    return clone;
}

export const itemPool = {
    weapon: [
        ...weapons,
        ...weapons,
        ...weapons,
        ...weapons,
        ...specialWeapon,
        ...specialWeapon,
        ...ultraWeapons
    ],
    armor: [
        ...armors,
        ...armors,
        ...armors,
        ...specialArmor
    ],
    consumable:[
        consumables[0],
        consumables[0],
        consumables[0],
        consumables[0],
        consumables[0],
        consumables[1],
        consumables[1],
        consumables[1],
        consumables[2],
        ...statEnhancer,
    ],
    enchantment:[
        ...enchantments,
        ...enchantments,
        ...enchantments,
        ...enchantmentsII,
        ...enchantmentsII,
        ...enchantmentsIII
    ]
}