import { Player } from "../model/Player.js";
import { Enemy } from "../model/Entity.js";
import { updateEnemyHealthBar, updateHealthBar } from "../controller.js";

export function poison(dmg, target){
    target.curhealth -= dmg
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}
export function burn(dmg, target){
    target.curhealth -= dmg
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}
export function regen(amount, target){
    target.curhealth += amount
    target.curhealth = target.curhealth > target.maxhealth ? target.maxhealth : target.curhealth;
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}
export function strength(dmg, duration, target){}
export function resistance(block, duration, target){}