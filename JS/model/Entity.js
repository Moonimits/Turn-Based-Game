export const enemy = [
    {name: "Slime",     health: 10,  damage: 5,     skill: {}},
    {name: "Goblin",    health: 30,  damage: 10,    skill: {jumpslash: 35}},
    {name: "Bat",       health: 10,  damage: 5,     skill: {}},
    {name: "Giant Bat", health: 35,  damage: 10,    skill: {vampiricHit: true}},
    {name: "Jared",     health: 40,  damage: 15,    skill: {jumpslash: 40, heal: 15}},
    {name: "Mimic",     health: 25,  damage: 14,    skill: {}},
    {name: "Makusa",    health: 55,  damage: 10,    skill: {heal:20}},
    {name: "Bugaro",    health: 70,  damage: 5,     skill: {}},
    {name: "Gulag",     health: 20,  damage: 10,    skill: {}},
    {name: "Naga",      health: 50,  damage: 15,    skill: {heal: 30, jumpslash: 35}},
    {name: "Dragon",    health: 200, damage: 50,    skill: {fireball: 75, firebreath: 90}, category: 'elite'},
];

export const specialEnemy = [
    {
        name: "Hodor", 
        health: 250,  
        damage: 45,  
        skill: {heal:50 , vampiricHit:true}, 
        category: 'elite'
    },
    {
        name: "Malphys",           
        health: 150,  
        damage: 90,  
        skill: {fireball: 75, heal: 70},    
        category: 'elite'
    },
    {
        name: "Marco: Game Ender", 
        health: 9999, 
        damage: 999, 
        skill: {heal: 100},               
        category: 'hack'
    },
]

export const enemyPool = [...enemy, ...enemy, ...enemy, ...specialEnemy]

export function Enemy(name, health, damage, skills, category){
    this.name = name;
    this.maxhealth = health;
    this.curhealth = health;
    this.damage = damage;
    this.skillSet = skills;
    this.category = category;
}
