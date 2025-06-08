import { Player } from "../model/Player.js";
import { Enemy } from "../model/Entity.js";
import { updateEnemyDmgLabel, updateEnemyHealthBar, updateHealthBar, updatePlayerDmgLabel } from "../controller.js";

export function poison(status, target){
    target.curhealth -= status.poison
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}
export function burn(status, target){
    target.curhealth -= status.burn
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}
export function regen(status, target){
    target.curhealth += status.regen
    target.curhealth = target.curhealth > target.maxhealth ? target.maxhealth : target.curhealth;
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}
export function strength(status, target){
    const index = target.status.findIndex(stat => stat.strength) 
    const applied = target.status[index].applied;
    if(!applied){
        target.damage += status.strength;;
        target.status[index].applied = true
    }
    if(status.duration <= 0) {
        target.damage -= status.strength
    }
    if(target instanceof Player){
        updatePlayerDmgLabel(target)
    }else{
        updateEnemyDmgLabel(target)
    }
}
export function bleed(status, target){}
export function resistance(status, target){}