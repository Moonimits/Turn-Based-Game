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
    const abilityKey = Object.keys(Abilities);

    const availableSkill = abilityKey.filter(ability => skillSet.includes(ability));
    console.log(availableSkill.length)
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
