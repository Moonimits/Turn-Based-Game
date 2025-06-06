export const heroClass = [
    {
        class: "Warrior",  
        health: 200, 
        damage: 10, 
        skill:{
            revengeStrike: {
                name: "Revenge Strike",
                desc: "As the Warrior endured all of the damage dealt to him, it is now return to the enemy as a devastating blow dealing 30 + (80% Missing HP)DMG to the target.",
                val: 30,
            }, 
            cd: 3
        }
    },
    {
        class: "Tactican", 
        health: 120, 
        damage: 20, 
        skill:{
            echoingHit: {
                name: "Echoing Hit",
                desc: "Through sheer focus, speed and concentration, the Tactican's attack can swiftly land 1-5 times on the target, each dealing a full damage and compressed in a single strike.",
                val: 5,
            },  
            cd: 6
        }
    },
    {
        class: "Assassin", 
        health: 60,  
        damage: 30, 
        skill:{
            critHit: {
                name: "Critical Hit",
                desc: "With the Assassin's keen observation of the weak points of their target, the Assassin's toxic blade would deal 3x the amount of his damage which has a 30% chance of inflicting poison status",
                val: 3
            },  
            cd: 4
        }
    },
    {
        class: "Thrasher", 
        health: 100, 
        damage: 20, 
        skill:{
            bradish: {
                name: "Bradish",
                desc: "The Thrasher's immense combat ability can deal calamitious damage towards the target, effectively dealing 35% of the targets Max HP",
                val: 0.35
            }, 
            cd: 4
        }
    },
]
export class Player{
    constructor(name, health, damage, heroClass, skill){
        this.maxhealth = health;
        this.curhealth = health;
        this.name = name;
        this.damage = damage;
        this.heroClass = heroClass;
        this.skill = skill;
        this.equipWeapon;
        this.equipArmor;
    
        //player Utility
        this.skillCd = 0;
        this.level = 1;
        this.expreq = 100;
        this.exp = 0;
        this.status = []
        this.inventory = []
    }
}