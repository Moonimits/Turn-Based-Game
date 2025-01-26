import { log, updateHealthBar, updateEnemyHealthBar } from "../controller.js";
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
export function revengeStrike(enemy, player){{

}}
export function lacerate(enemy, player){{

}}