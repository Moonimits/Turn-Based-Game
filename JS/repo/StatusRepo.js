import { Player } from "../model/Player.js";
import { Enemy } from "../model/Entity.js";
import { updateEnemyDmgLabel, updateEnemyHealthBar, updateEnemyStatusLabel, updateHealthBar, updatePlayerDmgLabel, updatePlayerStatusLabel } from "../controller.js";

var strengthAmount;
var weaknessAmount;

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
        target.damage += status.strength;
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

export function weaken(status, target){
    const index = target.status.findIndex(stat => stat.weaken) 
    const applied = target.status[index].applied;
    if(!applied){
        if(status.percent){
            weaknessAmount = target.damage * (status.weaken / 100);
            target.damage -= weaknessAmount;
        }else{
            target.damage -= status.weaken;
        }
        target.status[index].applied = true
    }
    if(status.duration <= 0) {
        if(status.percent){
            target.damage += weaknessAmount;
        }else{
            target.damage += status.weaken
        }
    }

    if(target instanceof Player){
        updatePlayerDmgLabel(target)
    }else{
        updateEnemyDmgLabel(target)
    }
}

export function bleed(status, target){
    target.curhealth -= status.bleed
    if(target instanceof Player){
        updateHealthBar(target)
    }else{
        updateEnemyHealthBar(target)
    }
}

export function resistance(status, target){}

export function triggerStatus(target){
    const statusMap = {
        poison: poison,
        burn: burn,
        regen: regen,
        strength: strength,
        weaken: weaken,
        bleed: bleed,
        resistance: resistance,
    }
    if(target.status.length){
        const statuses = target.status
        statuses.forEach((status) => {
            const key = Object.keys(status)[0]
            const tickEffect = statusMap[key]
            
            tickEffect(status,target)
            status.duration--
        });
        target.status = statuses.filter((status) => (status.duration > 0 || (status.applied != undefined && status.duration >= 0)))
    }

    if(target instanceof Player){
        updatePlayerStatusLabel(target)
    }else{
        updateEnemyStatusLabel(target)
    }
}

export function objStatus(name, amount, duration, perc = false){
    const statusArray = [
        {strength: amount, id:1, duration: duration, lbl:"ATK+", applied: false, percent: perc},
        {weaken: amount,   id:2, duration: duration, lbl:"ATK-", applied: false, percent: perc},
        {burn: amount,     id:3, duration: duration, lbl:"BRN"},
        {poison: amount,   id:4, duration: duration, lbl:"PSN"},
        {regen: amount,    id:5, duration: duration, lbl:"RGN"},
        {bleed: amount,    id:6, duration: duration, lbl:"BLD"},
    ]

    const statusName = name
    const status = statusArray.find(status => status[statusName]);

    return {...status};
}