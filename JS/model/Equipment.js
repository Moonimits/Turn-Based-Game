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
    {name: "Longinus Spear",        damage: 30,  category: 'special'},
    {name: "Soul Cipher",           damage: 55,  category: 'special'},
    {name: "Checkaliber",           damage: 30,  category: 'special'},
    {name: "Xercero",               damage: 43,  category: 'special'},
    {name: "Dragonus",              damage: 60,  category: 'special'},
    {name: "Pxosk",                 damage: 48,  category: 'special'},
    {name: "Wylter Pol",            damage: 35,  category: 'special'},
    {name: "Marcosoft: #Violence",  damage: 100, category: 'hack'},
]

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
}