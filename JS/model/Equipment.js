import { updateEnemyHealthBar, updateHealthBar } from "../controller.js";
import { inflictStatus, probability } from "../repo/AbilityRepo.js";
import { objStatus } from "../repo/StatusRepo.js";

export const weapons = [
    {name: "Book", damage: 1},
    {name: "Rock", damage: 1},
    {name: "Stick", damage: 1},
    {name: "Konbanwa", damage: 3},
    {name: "ShortSword", damage: 3},
    {name: "Sword", damage: 5},
    {name: "Spear", damage: 5},
    {name: "Bow", damage: 5},
    {name: "Axe", damage: 6},
    {name: "Mace", damage: 7},
    {name: "Halberd", damage: 10},
    {name: "War Hammer", damage: 10},
    {name: "War Axe", damage: 10, effect: [objEffect("bleed", 3, 50, 6)]},
    {name: "Blessed Dagger", damage: 6, effect:[objEffect("heal", 10, 50)]},
    {name: "Red Spear", damage: 8, effect:[objEffect("strength", 10)]},
    {name: "Venomous Dagger", damage: 9, effect:[objEffect("poison", 10, 35, 4)]},
];

export const armors = [
    {name: "Cap", health: 5},
    {name: "Shirt", health: 5},
    {name: "Mask", health: 10},
    {name: "Leather", health: 10},
    {name: "WolfHide", health: 30},
    {name: "Chainmail", health: 40},
    {name: "Iron Plate", health: 60},
    {name: "Bulwark", health: 80},
    {name: "Gold Plate", health: 100},
];

export const specialArmor = [
    {name: "Ogalvar",              health: 230, category: 'special'},
    {name: "Loribo Chestplate",    health: 260, category: 'special'},
    {name: "Guraguard",            health: 340, category: 'special'},
    {name: "Black Plating",        health: 310, category: 'special'},
    {name: "Polar Crest",          health: 240, category: 'special'},
    {name: "Marcosoft: #LifeHack", health: 500, category: 'hack'},
]

export const specialWeapon = [
    {name: "Altaric Sword",         damage: 25,  category: 'special', effect:[objEffect("lifesteal", 20)]},
    {name: "Longinus Spear",        damage: 30,  category: 'special'},
    {name: "Soul Cipher",           damage: 45,  category: 'special', effect:[objEffect("healthsteal", 10)]},
    {name: "Checkaliber",           damage: 30,  category: 'special'},
    {name: "Xercero",               damage: 43,  category: 'special', effect:[objEffect("flames", 30)]},
    {name: "Dragonus",              damage: 50,  category: 'special', effect:[objEffect("flames", 50, 50)]},
    {name: "Pxosk",                 damage: 48,  category: 'special', effect:[objEffect("strength", 30, 35, 2)]},
    {name: "Wylter Pol",            damage: 35,  category: 'special', effect:[objEffect("lifebreak", 5)]},
    {name: "Marcosoft: #Violence",  damage: 100, category: 'hack'},
]

export const consumables = [
    {id: 1, name: "Small Healing Potion",   heal:50,  type: "heal", qty:1},
    {id: 1, name: "Small Healing Potion",   heal:50,  type: "heal", qty:1},
    {id: 1, name: "Small Healing Potion",   heal:50,  type: "heal", qty:1},
    {id: 1, name: "Small Healing Potion",   heal:50,  type: "heal", qty:1},
    {id: 1, name: "Small Healing Potion",   heal:50,  type: "heal", qty:1},
    {id: 2, name: "Healing Potion",         heal:150, type: "heal", qty:1},
    {id: 2, name: "Healing Potion",         heal:150, type: "heal", qty:1},
    {id: 2, name: "Healing Potion",         heal:150, type: "heal", qty:1},
    {id: 3, name: "Great Healing Potion",   heal:400, type: "heal", qty:1},
]

export const enchantments = [
    {id: 4, name: "Flames Enchant", effect: "Flames", amount:5 , type: "enchant", qty:1},
    {id: 5, name: "Poison Enchant", effect: "Poison", amount:5 , type: "enchant", qty:1},
    {id: 6, name: "LifeSteal Enchant", effect: "Lifesteal", amount:2 , type: "enchant", qty:1},
    {id: 7, name: "Bleed Enchant", effect: "Bleed", amount:3 , type: "enchant", qty:1},
    {id: 8, name: "Healing Enchant", effect: "Heal", amount:5 , type: "enchant", qty:1},
    {id: 9, name: "Strength Enchant", effect: "Strength", amount:5 , type: "enchant", qty:1},
    {id: 10, name: "Lifebreak Enchant", effect: "Lifebreak", amount:1 , type: "enchant", qty:1},
]

//Enchant Items
export function enchant(player, enchantment){
    const weaponEffects = player.equipWeapon.effect
    
    if(weaponEffects){
        const weaponEffect =  weaponEffects.find( effect => effect.name == enchantment.effect)

        if(weaponEffect){
            if(["inflict","buff"].includes(weaponEffect.type)){
                const key = Object.keys(weaponEffect.status)[0]
                weaponEffect.status[key] += enchantment.amount;
            }else if(["onhit"].includes(weaponEffect.type)){
                if(weaponEffect.mode == "flat"){
                    weaponEffect.amount += enchantment.amount
                }else if(weaponEffect.mode == "percentage"){
                    weaponEffect.percent += enchantment.amount
                }
            }
        }else{
            player.equipWeapon.effect.push(objEffect(enchantment.effect, enchantment.amount))
        }
        
    }else{
        player.equipWeapon.effect = [objEffect(enchantment.effect, enchantment.amount)];
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

//Item Effects
function objEffect(effectName, val, chance = 35, inflictDuration = 3){
    const weaponEffects = [
        {
            name: "Heal", 
            type: "onhit", 
            mode: "flat", 
            amount: val, chance: chance,
            desc: `${chance}% chance to heal <b class='hp'>${val}hp<b>`,
        },
        {
            name: "Lifesteal", 
            type:"onhit", 
            mode: "percentage", 
            percent: val,
            desc: `${val}% Lifesteal`,
        },
        {
            name: "Lifebreak", 
            type:"onhit", 
            mode: "percentage", 
            percent: val,
            desc: `Lifebreak: Deals ${val}%hp damage`,
        },
        {
            name: "Healthsteal", 
            type:"onkill", 
            mode: "percentage", 
            percent: val,
            desc: `Healtsteal: Gain enemy's ${val}% MaxHp on kill`,
        },
        {
            name: "Flames", 
            type:"inflict", 
            chance: chance, 
            status: objStatus("burn", val, inflictDuration),
            desc: `Flames: ${chance}% chance to inflict ${val} burn dmg for ${inflictDuration} rounds`,
        },
        {
            name: "Poison", 
            type: "inflict", 
            chance: chance, 
            status: objStatus("poison", val, inflictDuration),
            desc: `Poison: ${chance}% chance to inflict ${val} poison dmg for ${inflictDuration} rounds`,
        },
        {
            name: "Bleed", 
            type: "inflict", 
            chance: chance, 
            status: objStatus("bleed", val, inflictDuration),
            desc: `Bleed: ${chance}% chance to inflict ${val} bleed dmg for ${inflictDuration} rounds`,
        },
        {
            name: "Strength", 
            type: "buff", 
            chance: chance, 
            status: objStatus("strength", val, inflictDuration),
            desc: `Strength: ${chance}% chance to gain ${val} bonus dmg for ${inflictDuration} rounds`,
        },
    ];

    const name = effectName;
    const effect = weaponEffects.find( eff => eff.name.toLocaleLowerCase() == name.toLowerCase());
    
    return {...effect};
}

export const itemPool = {
    weapon: [
        ...weapons,
        ...weapons,
        ...weapons,
        ...specialWeapon
    ],
    armor: [
        ...armors,
        ...armors,
        ...armors,
        ...specialArmor
    ],
    consumable:[
        ...consumables,
        ...consumables,
        ...enchantments
    ]
}