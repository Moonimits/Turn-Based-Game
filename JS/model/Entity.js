import { log } from "../controller.js";

export const enemy = [
    {name: "Slime",     health: 10,  damage: 5,   exp:10, category: "basic" ,skill: {}},
    {name: "Grey Bird", health: 10,  damage: 5,   exp:10, category: "basic" ,skill: {}},
    {name: "Lorigon",   health: 15,  damage: 8,   exp:10, category: "basic" ,skill: {}},
    {name: "Musicat",   health: 25,  damage: 10,  exp:10, category: "basic" ,skill: {}},
    {name: "Minitor",   health: 35,  damage: 18,  exp:15, category: "basic" ,skill: {jumpslash: 30}},
    {name: "Goblin",    health: 30,  damage: 10,  exp:15, category: "basic" ,skill: {jumpslash: 35}},
    {name: "Bat",       health: 10,  damage: 5,   exp:10, category: "basic" ,skill: {}},
    {name: "Giant Bat", health: 35,  damage: 10,  exp:20, category: "basic" ,skill: {vampiricHit: true}},
    {name: "Jared",     health: 40,  damage: 15,  exp:20, category: "basic" ,skill: {jumpslash: 40, heal: 15}},
    {name: "Mimic",     health: 25,  damage: 14,  exp:15, category: "basic" ,skill: {}},
    {name: "Makusa",    health: 55,  damage: 10,  exp:25, category: "basic" ,skill: {heal:20}},
    {name: "Bugaro",    health: 70,  damage: 5,   exp:20, category: "basic" ,skill: {}},
    {name: "Heath",     health: 70,  damage: 5,   exp:20, category: "basic" ,skill: {heal:20}},
    {name: "Gulag",     health: 20,  damage: 10,  exp:10, category: "basic" ,skill: {}},
    {name: "Lotar",     health: 50,  damage: 18,  exp:20, category: "basic" ,skill: {}},
    {name: "Wolf Alpha",health: 60,  damage: 20,  exp:25, category: "basic" ,skill: {critical: 2}},
    {name: "Luna",      health: 50,  damage: 18,  exp:20, category: "basic" ,skill: {heal:20}, critical: 2},
    {name: "Naga",      health: 50,  damage: 15,  exp:25, category: "basic" ,skill: {heal: 30, jumpslash: 35}},
    {name: "Minotor",   health: 70,  damage: 20,  exp:25, category: "basic" ,skill: {rage: 10}},
];

export const specialEnemy = [
    {
        name: "Dragon",    
        health: 200, 
        damage: 50,  
        exp:35,  
        skill: {fireball: 75, firebreath: 90}, 
        category: 'elite'
    },
    {
        name: "Hodor", 
        health: 350,  
        damage: 45,  
        skill: {heal:50 , vampiricHit:true}, 
        category: 'elite',
        exp: 35
    },
    {
        name: "Malphys",           
        health: 250,  
        damage: 90,  
        skill: {fireball: 75, heal: 70},    
        category: 'elite',
        exp: 35
    },
    {
        name: "A'Rzor",           
        health: 300,  
        damage: 30,  
        skill: {lacerate: 100, bloodBreak: .40},    
        category: 'elite',
        exp: 35
    },
    {
        name: "Luxan Duelist",           
        health: 150,  
        damage: 40,  
        skill: {disarm: true, critical: 3},    
        category: 'elite',
        exp: 25
    },
    {
        name: "BioVoid",           
        health: 150,  
        damage: 10,  
        skill: {healthSteal: 0.1},    
        category: 'elite',
        exp: 35
    },
    // {
    //     name: "Living Charter",           
    //     health: 430,  
    //     damage: 10,  
    //     skill: {replicateWeapon: true},    
    //     category: 'elite',
    //     exp: 50
    // },
]

export const bosses = [
    {
        name: "Ultir", 
        health: 3000, 
        damage: 100, 
        skill: {heal: 100, critical: 5},               
        category: 'hack',
        exp: 100,
    },
    {
        name: "Malevolence", 
        health: 2500, 
        damage: 100, 
        skill: {rage: 100},               
        category: 'hack',
        exp: 100,
    },
]

export var enemyPool = [...enemy, ...enemy, ...enemy, ...enemy,];

export function increaseEnemyPool(round){
    var increasePool;
    if(round % 10 == 0){
        enemyPool = [...enemyPool, ...specialEnemy];
        increasePool = `
            <div class='text-danger fw-bold'>!NUMBER OF SPECIAL ENEMIES INCREASED!</div>
            <hr>`;
        log(increasePool);
    }

    if(round % 50 == 0){
        enemyPool = [...enemyPool, ...bosses, ...bosses, ...bosses];
        increasePool = `
            <div class='text-danger fw-bold'>!NUMBER OF BOSSES INCREASED!</div>
            <hr>`;
        log(increasePool);
    }
}

export function Enemy(name, health, damage, skills, category, exp){
    this.name = name;
    this.maxhealth = health;
    this.curhealth = health;
    this.damage = damage;
    this.skillSet = skills;
    this.category = category;
    this.expval = exp;
}
