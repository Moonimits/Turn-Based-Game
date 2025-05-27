import { log, toggleButtons, updateHealthBar } from "../controller.js";
import * as Abilities from "./AbilityRepo.js";

const actions = {
    attack: (enemy, player) => attack(enemy, player),
    skill: (enemy, player) => useSkill(enemy, player)
};

export function attack(enemy, player){
    player.curhealth -= enemy.damage;
    updateHealthBar(player);
    var attackLog = `
        <div><b id="elog">${enemy.name}</b> attacked <b>You</b>, dealt <b>${enemy.damage}dmg</b>.</div><hr>`;    
    log(attackLog);
}

export function useSkill(enemy, player){
    var skillSet = Object.keys(enemy.skillSet)
    var abilityKey = Object.keys(Abilities);

    //Prevent using heal skill when hp is full
    if(enemy.curhealth == enemy.maxhealth){
        abilityKey = abilityKey.filter(ability => !(['heal'].includes(ability)));
    } 

    const availableSkill = abilityKey.filter(ability => skillSet.includes(ability));
    const abilityRand = Math.floor(Math.random() * availableSkill.length);
    const selectedSkill = availableSkill[abilityRand];
    Abilities[selectedSkill](enemy, player);
}

export function randomBehavior(enemy, player){
    const actionKeys = Object.keys(actions);

    const filteredActions = actionKeys.filter((actionKey)=>{
        if(actionKey === 'skill' && Object.keys(enemy.skillSet).length == 0) return false;
        return true;
    })
    const rand = Math.floor(Math.random() * filteredActions.length);
    const selectedAction = filteredActions[rand];
    actions[selectedAction](enemy,player);
    toggleButtons();
}
