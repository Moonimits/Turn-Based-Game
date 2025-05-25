export const enemy = [
    {name: "Slime",     health: 10,  damage: 5,   exp:3,   skill: {}},
    {name: "Goblin",    health: 30,  damage: 10,  exp:10,  skill: {jumpslash: 35}},
    {name: "Bat",       health: 10,  damage: 5,   exp:3,   skill: {}},
    {name: "Giant Bat", health: 35,  damage: 10,  exp:7,   skill: {vampiricHit: true}},
    {name: "Jared",     health: 40,  damage: 15,  exp:10,  skill: {jumpslash: 40, heal: 15}},
    {name: "Mimic",     health: 25,  damage: 14,  exp:10,  skill: {}},
    {name: "Makusa",    health: 55,  damage: 10,  exp:10,  skill: {heal:20}},
    {name: "Bugaro",    health: 70,  damage: 5,   exp:10,  skill: {}},
    {name: "Gulag",     health: 20,  damage: 10,  exp:5,   skill: {}},
    {name: "Naga",      health: 50,  damage: 15,  exp:15,  skill: {heal: 30, jumpslash: 35}},
    {name: "Dragon",    health: 200, damage: 50,  exp:35,  skill: {fireball: 75, firebreath: 90}, category: 'elite'},
];

export const specialEnemy = [
    {
        name: "Hodor", 
        health: 250,  
        damage: 45,  
        skill: {heal:50 , vampiricHit:true}, 
        category: 'elite',
        exp: 50
    },
    {
        name: "Malphys",           
        health: 150,  
        damage: 90,  
        skill: {fireball: 75, heal: 70},    
        category: 'elite',
        exp: 50
    },
    {
        name: "A'Rzor",           
        health: 200,  
        damage: 30,  
        skill: {lacerate: 100, bloodBreak: .40},    
        category: 'elite',
        exp: 50
    },
    {
        name: "Luxan Duelist",           
        health: 100,  
        damage: 40,  
        skill: {disarm: true, critical: 3},    
        category: 'elite',
        exp: 50
    },
    {
        name: "BioVoid",           
        health: 100,  
        damage: 10,  
        skill: {healthSteal: 0.1},    
        category: 'elite',
        exp: 50
    },
    // {
    //     name: "Living Charter",           
    //     health: 430,  
    //     damage: 10,  
    //     skill: {replicateWeapon: true},    
    //     category: 'elite',
    //     exp: 50
    // },
    {
        name: "Marco: Game Ender", 
        health: 9999, 
        damage: 999, 
        skill: {heal: 100},               
        category: 'hack',
        exp: 100
    },
]

export const enemyPool = [...enemy, ...enemy, ...specialEnemy]

export function Enemy(name, health, damage, skills, category, exp){
    this.name = name;
    this.maxhealth = health;
    this.curhealth = health;
    this.damage = damage;
    this.skillSet = skills;
    this.category = category;
    this.expval = exp;
}
