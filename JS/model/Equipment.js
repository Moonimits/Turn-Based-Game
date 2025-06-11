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
    {name: "War Axe", damage: 10},
    {name: "Blessed Dagger", damage: 6, effect:{name: "Heal", amount: 10, chance: 50}},
    {name: "Red Spear", damage: 8, effect:{name: "Strength", type: "buff", chance: 35, status: objStatus("strength", 10, 3)}},
    {name: "Venomous Dagger", damage: 9, effect:{name: "Posion", type: "inflict", chance: 35, status: objStatus("poison", 10, 4)}},
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
    {name: "Altaric Sword",         damage: 25,  category: 'special', effect:{name: "Lifesteal", percent: 20}},
    {name: "Longinus Spear",        damage: 30,  category: 'special'},
    {name: "Soul Cipher",           damage: 45,  category: 'special', effect:{name: "Healthsteal", percent: 10}},
    {name: "Checkaliber",           damage: 30,  category: 'special'},
    {name: "Xercero",               damage: 43,  category: 'special', effect:{name: "Flames", type:"inflict", chance: 35, status: objStatus("burn", 30, 3)}},
    {name: "Dragonus",              damage: 50,  category: 'special', effect:{name: "Flames", type:"inflict", chance: 50, status: objStatus("burn", 50, 3)}},
    {name: "Pxosk",                 damage: 48,  category: 'special', effect:{name: "Strength", type: "buff", chance: 35, status: objStatus("strength", 30, 2)}},
    {name: "Wylter Pol",            damage: 35,  category: 'special', effect:{name: "Lifebreak", percent: 5}},
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
    {id: 4, name: "Rage Enchant", amount:5 , type: "enchant", qty:1},
    {id: 4, name: "Poison Enchant", amount:5 , type: "enchant", qty:1},
]

export function procItemEffect(player, enemy){
    const weaponEffect = player.equipWeapon.effect

    if(weaponEffect)
    {
        const effectName = Object.values(weaponEffect)[0];

        if(effectName == "Lifesteal"){
            player.curhealth += Math.round(player.damage * (weaponEffect.percent/100));
            if(player.curhealth > player.maxhealth) player.curhealth = player.maxhealth
            updateHealthBar(player)
        }else if(effectName == "Lifebreak"){
            enemy.curhealth -= Math.round(enemy.curhealth * (weaponEffect.percent/100));
            const extraDmgLbl = `+(${weaponEffect.percent}%HP)`;

            return extraDmgLbl;
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
    }
    return '';
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
        ...consumables
    ]
}