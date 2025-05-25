import { log, updateHealthBar, updateEnemyHealthBar } from "../controller.js";
import { equip } from "./PlayerRepo.js";

export function heal(enemy){
    const heal = enemy.skillSet.heal;
    enemy.curhealth += heal;
    enemy.curhealth = enemy.curhealth > enemy.maxhealth ? enemy.maxhealth : enemy.curhealth;
    
    var healLog = `
        <div><b id="elog">${enemy.name}</b> used heal, healed <b id="heal">${heal}hp</b>.</div><hr>`;    
    log(healLog);
    updateEnemyHealthBar(enemy);
}

export function fireball(enemy,player){
    const skillDmg = enemy.skillSet.fireball;
    player.curhealth -= skillDmg;
    updateHealthBar(player);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> used <b id='elog'>FireBall</b>, dealt <b>${skillDmg}dmg</b>.</div><hr>`;
    log(skillLog);
}

export function firebreath(enemy,player){
    const skillDmg = enemy.skillSet.firebreath;
    player.curhealth -= skillDmg;
    updateHealthBar(player);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> used <b id='elog'>Firebreath</b>, dealt <b>${skillDmg}dmg</b>.</div><hr>`;
    log(skillLog);
}

export function jumpslash(enemy,player){
    const skillDmg = enemy.skillSet.jumpslash;
    player.curhealth -= skillDmg;
    updateHealthBar(player);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> used <b id='elog'>Jump Slash</b>, dealt <b>${skillDmg}dmg</b>.</div><hr>`;
    log(skillLog);
}

export function vampiricHit(enemy,player){
    player.curhealth -= enemy.damage;
    enemy.curhealth += enemy.damage;
    enemy.curhealth = enemy.curhealth > enemy.maxhealth ? enemy.maxhealth : enemy.curhealth;
    updateHealthBar(player);
    updateEnemyHealthBar(enemy);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> attacked with a <b id='elog'>vampiricHit</b>, dealt <b>${enemy.damage}dmg</b> and healed <b id="heal">${enemy.damage}hp</b>.</div><hr>`;
    log(skillLog);
}

export function lacerate(enemy, player){{
    const lacerateDmg = enemy.skillSet.lacerate + Math.floor(player.maxhealth * 0.1)
    player.curhealth -= lacerateDmg
    updateHealthBar(player)
    var skillLog =`
        <div><b id="elog">${enemy.name}</b> used Lacerate, dealt <b>${lacerateDmg}dmg</b>.</div><hr>`;
    log(skillLog)
}}

export function bloodBreak(enemy, player){{
    const breakDmg = Math.floor(player.maxhealth * enemy.skillSet.bloodBreak)
    player.curhealth -= breakDmg
    updateHealthBar(player)
    var skillLog =`
        <div><b id="elog">${enemy.name}</b> used Blood Break, dealt <b>${breakDmg}dmg</b> (${enemy.skillSet.bloodBreak * 100}% MaxHP).</div><hr>`;
    log(skillLog)
}}

export function healthSteal(enemy, player){{
    const healthSteal = 10 + Math.floor(player.maxhealth * enemy.skillSet.healthSteal)
    player.maxhealth -= healthSteal
    enemy.maxhealth += healthSteal
    enemy.curhealth += healthSteal
    if(player.curhealth >= player.maxhealth) player.curhealth = player.maxhealth
    updateEnemyHealthBar(enemy)
    updateHealthBar(player)
    var skillLog =`
        <div><b id="elog">${enemy.name}</b> used Health Steal, stole <b>${healthSteal}hp</b> (10 + ${enemy.skillSet.healthSteal * 100}% MaxHP) from you and added to its own.</div><hr>`;
    log(skillLog)
}}

export function critical(enemy, player){{
    const critDamage = enemy.damage * enemy.skillSet.critical;
    player.curhealth -= critDamage
    updateHealthBar(player);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b>  performed a Crit Hit, dealt <b>${critDamage}dmg</b>.</div><hr>`;
    log(skillLog);
}}

export function disarm(enemy, player){
    const disarm = {name: "", damage: 0}
    const disarmDmg = 10;
    player.curhealth -= disarmDmg
    updateHealthBar(player);
    equip(player, "weapon", disarm);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> disarmed your weapon. dealt <b>${disarmDmg}dmg</b>.</div><hr>`;
    log(skillLog);
}

//player Abilities
export function greaterHeal(enemy, player){
    const heal = player.skill.greaterHeal;
    player.curhealth += heal;
    player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
    
    var healLog = `
        <div><b>You</b> used Greater Heal, healed <b id="heal">${heal}hp</b>.</div><hr>`;    
    log(healLog);
    updateHealthBar(player);
}
export function critHit(enemy, player){{
    const critDamage = player.damage * player.skill.critHit;
    enemy.curhealth -= critDamage
    updateEnemyHealthBar(enemy);
    var skillLog = `
        <div><b>You</b> performed a Crit Hit, <b id='elog'>${enemy.name}</b> suffered <b>${critDamage}dmg</b>.</div><hr>`;
    log(skillLog);
}}
export function echoingHit(enemy, player){{
    const echo = Math.floor(Math.random() * (player.skill.echoingHit - 1 + 1) + 1);
    const echoHit = player.damage * echo;
    enemy.curhealth -= echoHit
    updateEnemyHealthBar(enemy);
    var skillLog = `
        <div><b>You</b> performed a Echoing Hit, your hit echoed <b>${echo}x</b>, dealt <b>${echoHit}dmg</b> to <b id='elog'>${enemy.name}</b>.</div><hr>`;
    log(skillLog);
}}
// Deals Damage based on max health
export function bradish(enemy, player){{
    const bradishDmg = Math.floor(enemy.maxhealth * player.skill.bradish)
    enemy.curhealth -= bradishDmg
    updateEnemyHealthBar(enemy)
    var skillLog =`
        <div><b>You</b> performed a Bradishing Strike, dealt <b>${bradishDmg}dmg</b> (${player.skill.bradish * 100}% MaxHP) to <b id='elog'>${enemy.name}</b>.</div><hr>`;
    log(skillLog)
}}
//Deals 30 Damage + 80% of missing hp
export function revengeStrike(enemy, player){{
    const revengeDmg = player.skill.revengeStrike + (Math.floor(player.maxhealth - player.curhealth)*.8)
    enemy.curhealth -= revengeDmg
    updateEnemyHealthBar(enemy)
    var skillLog =`
        <div><b>You</b> performed a Revenge Strike, dealt <b>${revengeDmg}dmg</b> to <b id='elog'>${enemy.name}</b>.</div><hr>`;
    log(skillLog)
}}

