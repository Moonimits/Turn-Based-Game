import { log } from "../controller.js";

export const enemy = [
    {name: "Slime",         health: 10,  damage: 5,  gold:1,   exp:5,  category: "basic" ,skill: {}},
    {name: "Grey Bird",     health: 10,  damage: 5,  gold:1,   exp:5,  category: "basic" ,skill: {}},
    {name: "Lorigon",       health: 15,  damage: 8,  gold:1,   exp:5,  category: "basic" ,skill: {}},
    {name: "Musicat",       health: 25,  damage: 10, gold:2,  exp:10, category: "basic" ,skill: {}},
    {name: "Minitor",       health: 35,  damage: 18, gold:3,  exp:15, category: "basic" ,skill: {jumpslash: 30}},
    {name: "Goblin",        health: 30,  damage: 10, gold:4,  exp:15, category: "basic" ,skill: {jumpslash: 35}},
    {name: "Bat",           health: 10,  damage: 5,  gold:1,   exp:5,  category: "basic" ,skill: {}},
    {name: "Giant Bat",     health: 35,  damage: 10, gold:3,  exp:15, category: "basic" ,skill: {vampiricHit: true}},
    {name: "Jared",         health: 40,  damage: 15, gold:5,  exp:20, category: "basic" ,skill: {jumpslash: 40, heal: 15}},
    {name: "Mimic",         health: 25,  damage: 14, gold:10,  exp:10, category: "basic" ,skill: {}},
    {name: "Makusa",        health: 55,  damage: 10, gold:7,  exp:25, category: "basic" ,skill: {heal:20}},
    {name: "Bugaro",        health: 70,  damage: 5,  gold:6,   exp:20, category: "basic" ,skill: {}},
    {name: "Heath",         health: 70,  damage: 5,  gold:6,   exp:20, category: "basic" ,skill: {heal:20}},
    {name: "Gulag",         health: 20,  damage: 10, gold:5,  exp:10, category: "basic" ,skill: {}},
    {name: "Lotar",         health: 50,  damage: 18, gold:5,  exp:20, category: "basic" ,skill: {regeneration: 5}},
    {name: "Altair Snake",  health: 60,  damage: 15, gold:7,  exp:20, category: "basic" ,skill: {venom: 10}},
    {name: "Wolf Alpha",    health: 60,  damage: 20, gold:8,  exp:25, category: "basic" ,skill: {critical: 2}},
    {name: "Luna",          health: 50,  damage: 18, gold:8,  exp:20, category: "basic" ,skill: {heal:20, critical: 2}},
    {name: "Naga",          health: 50,  damage: 15, gold:8,  exp:25, category: "basic" ,skill: {heal: 30, jumpslash: 35}},
    {name: "Minotor",       health: 70,  damage: 20, gold:7,  exp:25, category: "basic" ,skill: {rage: 20}},
    {name: "Apperation",    health: 40,  damage: 10, gold:7,  exp:15, category: "basic" ,skill: {curse: 5}},
];

export const specialEnemy = [
    {
        name: "Dragon",    
        health: 300, 
        damage: 50,  
        gold: 20,  
        exp:30,  
        skill: {fireball: 90, firebreath: 120}, 
        category: 'elite'
    },
    {
        name: "Hodor", 
        health: 400,  
        damage: 50,  
        gold: 20,  
        skill: {heal:80, regeneration: 20, vampiricHit:true}, 
        category: 'elite',
        exp: 30
    },
    {
        name: "Malphys",           
        health: 250,  
        damage: 90,  
        gold: 20,  
        skill: {fireball: 80, heal: 100, curse: 20},    
        category: 'elite',
        exp: 30
    },
    {
        name: "A'Rzor",           
        health: 380,  
        damage: 30,  
        gold: 30,  
        skill: {lacerate: 100, bloodBreak: 30},    
        category: 'elite',
        exp: 30
    },
    {
        name: "Luxan Duelist",           
        health: 190,  
        damage: 50,  
        gold: 25,  
        skill: {disarm: true, critical: 2},    
        category: 'elite',
        exp: 25
    },
    {
        name: "BioVoid",           
        health: 160,  
        damage: 10,  
        gold: 30,  
        skill: {healthSteal: 10},    
        category: 'elite',
        exp: 30
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
        damage: 80, 
        gold: 50, 
        skill: {heal: 100, critical: 3},               
        category: 'hack',
        exp: 100,
    },
    {
        name: "Malevolence", 
        health: 2500, 
        damage: 80, 
        gold: 50, 
        skill: {rage: 100, weaken: 50},               
        category: 'hack',
        exp: 100,
    },
]

// export var enemyPool = [...enemy, ...enemy, ...enemy, ...enemy];
export var enemyPool = [];

for (let index = 1; index <= 4; index++) {
    enemy.forEach(enemy => {
        enemyPool.push(structuredClone(enemy))
    });
}

export function increaseEnemyPool(round){
    return new Promise((resolve)=>{
        var increasePool = null;
        if(round % 10 == 0){
            specialEnemy.forEach(special => {
                enemyPool.push(structuredClone(special))
            });
            increasePool = `
                <div class='text-danger fw-bold'>!NUMBER OF SPECIAL ENEMIES INCREASED!</div>
                <hr>`;
            log(increasePool);
        }
    
        if(round % 50 == 0){
            for (let index = 1; index <= 2; index++) {
                bosses.forEach(boss => {
                    enemyPool.push(structuredClone(boss))
                });
            }
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
    constructor(name, health, damage, skills, category, exp, gold){
        this.name = name;
        this.maxhealth = health;
        this.curhealth = health;
        this.damage = damage;
        this.skillSet = {...skills};
        this.category = category;
        this.expval = exp;
        this.gold = gold;
        this.status = []
    }
}
