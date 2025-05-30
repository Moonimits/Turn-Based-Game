import { log, toggleButtons, updateEnemyStatusLabel, updateHealthBar } from "../controller.js";
import * as Abilities from "./AbilityRepo.js";
import * as StatusEffect from "./StatusRepo.js";

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
    var skillSet = Object.keys(enemy.skillSet)


    //Prevent using heal skill when hp is full
    if(enemy.curhealth == enemy.maxhealth){
        skillSet = skillSet.filter(skill => !(['heal'].includes(skill)));
    } 

    const filteredActions = actionKeys.filter((actionKey)=>{
        if(actionKey === 'skill' && Object.keys(skillSet).length == 0) return false;
        return true;
    })
    const rand = Math.floor(Math.random() * filteredActions.length);
    const selectedAction = filteredActions[rand];
    triggerStatus(enemy)
    actions[selectedAction](enemy,player);
    console.log(enemy.status)
    toggleButtons();
}

function triggerStatus(enemy){
    if(enemy.status.length){
        const statuses = enemy.status
        statuses.forEach((status) => {
            const key = Object.keys(status)[0]
            const tickEffect = StatusEffect[key]
            
            
            tickEffect(status,enemy)
            enemy.status = statuses.filter((status) => status.duration != 0)
            status.duration--
        });
    }
    updateEnemyStatusLabel(enemy)
}