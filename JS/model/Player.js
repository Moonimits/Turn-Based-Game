export const heroClass = [
    {class: "Warrior",  health: 200, damage: 10, skill:{revengeStrike: 30, cd: 3}},
    {class: "Tactican", health: 120, damage: 20, skill:{echoingHit:  5,  cd: 6}},
    {class: "Assassin", health: 60,  damage: 30, skill:{critHit:     3,  cd: 4}},
    {class: "Thrasher", health: 100, damage: 20, skill:{bradish:    0.35, cd: 4}},
]
export function Player(name, health, damage, heroClass, skill){
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
}