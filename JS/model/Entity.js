import { log } from "../controller.js";

export const enemy = [
    {name: "Slime",         health: 10,  damage: 5,   exp:5,  category: "basic" ,skill: {}},
    {name: "Grey Bird",     health: 10,  damage: 5,   exp:5,  category: "basic" ,skill: {}},
    {name: "Lorigon",       health: 15,  damage: 8,   exp:5,  category: "basic" ,skill: {}},
    {name: "Musicat",       health: 25,  damage: 10,  exp:10, category: "basic" ,skill: {}},
    {name: "Minitor",       health: 35,  damage: 18,  exp:15, category: "basic" ,skill: {jumpslash: 30}},
    {name: "Goblin",        health: 30,  damage: 10,  exp:15, category: "basic" ,skill: {jumpslash: 35}},
    {name: "Bat",           health: 10,  damage: 5,   exp:5,  category: "basic" ,skill: {}},
    {name: "Giant Bat",     health: 35,  damage: 10,  exp:15, category: "basic" ,skill: {vampiricHit: true}},
    {name: "Jared",         health: 40,  damage: 15,  exp:20, category: "basic" ,skill: {jumpslash: 40, heal: 15}},
    {name: "Mimic",         health: 25,  damage: 14,  exp:10, category: "basic" ,skill: {}},
    {name: "Makusa",        health: 55,  damage: 10,  exp:25, category: "basic" ,skill: {heal:20}},
    {name: "Bugaro",        health: 70,  damage: 5,   exp:20, category: "basic" ,skill: {}},
    {name: "Heath",         health: 70,  damage: 5,   exp:20, category: "basic" ,skill: {heal:20}},
    {name: "Gulag",         health: 20,  damage: 10,  exp:10, category: "basic" ,skill: {}},
    {name: "Lotar",         health: 50,  damage: 18,  exp:20, category: "basic" ,skill: {regeneration: 5}},
    {name: "Altair Snake",  health: 60,  damage: 15,  exp:20, category: "basic" ,skill: {venom: {dmg: 10, dur:5}}},
    {name: "Wolf Alpha",    health: 60,  damage: 20,  exp:25, category: "basic" ,skill: {critical: 2}},
    {name: "Luna",          health: 50,  damage: 18,  exp:20, category: "basic" ,skill: {heal:20, critical: 2}},
    {name: "Naga",          health: 50,  damage: 15,  exp:25, category: "basic" ,skill: {heal: 30, jumpslash: 35}},
    {name: "Minotor",       health: 70,  damage: 20,  exp:25, category: "basic" ,skill: {rage: 20}},
];

export const specialEnemy = [
    {
        name: "Dragon",    
        health: 300, 
        damage: 50,  
        exp:35,  
        skill: {fireball: 90, firebreath: 120}, 
        category: 'elite'
    },
    {
        name: "Hodor", 
        health: 400,  
        damage: 50,  
        skill: {heal:80, regeneration: 20, vampiricHit:true}, 
        category: 'elite',
        exp: 35
    },
    {
        name: "Malphys",           
        health: 250,  
        damage: 90,  
        skill: {fireball: 80, heal: 100},    
        category: 'elite',
        exp: 35
    },
    {
        name: "A'Rzor",           
        health: 380,  
        damage: 30,  
        skill: {lacerate: 100, bloodBreak: .40},    
        category: 'elite',
        exp: 35
    },
    {
        name: "Luxan Duelist",           
        health: 190,  
        damage: 50,  
        skill: {disarm: true, critical: 3},    
        category: 'elite',
        exp: 25
    },
    {
        name: "BioVoid",           
        health: 160,  
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
        damage: 60, 
        skill: {heal: 100, critical: 3},               
        category: 'hack',
        exp: 100,
    },
    {
        name: "Malevolence", 
        health: 2500, 
        damage: 50, 
        skill: {rage: 100},               
        category: 'hack',
        exp: 100,
    },
]

export var enemyPool = [...enemy, ...enemy, ...enemy, ...enemy,];

export function increaseEnemyPool(round){
    return new Promise((resolve)=>{
        var increasePool = null;
        if(round % 10 == 0){
            enemyPool = [...enemyPool, ...specialEnemy];
            increasePool = `
                <div class='text-danger fw-bold'>!NUMBER OF SPECIAL ENEMIES INCREASED!</div>
                <hr>`;
            log(increasePool);
        }
    
        if(round % 50 == 0){
            enemyPool = [...enemyPool, ...bosses, ...bosses,]
            increasePool = `
                <div class='text-danger fw-bold'>!NUMBER OF BOSSES INCREASED!</div>
                <hr>`;
            log(increasePool);
        }

        if(increasePool != null){
            setTimeout(()=>{resolve()}, 1000)
        }else{
            resolve()
        }

    })
}

export class Enemy{
    constructor(name, health, damage, skills, category, exp){
        this.name = name;
        this.maxhealth = health;
        this.curhealth = health;
        this.damage = damage;
        this.skillSet = skills;
        this.category = category;
        this.expval = exp;
        this.status = []
    }
}
