import { log, updateHealthBar, updateEnemyHealthBar, updateEnemyDmgLabel, updatePlayerStatusLabel, updateEnemyStatusLabel } from "../controller.js";
import { equip } from "./PlayerRepo.js";
import { Player } from "../model/Player.js";
import { strength } from "./StatusRepo.js";
import { attack } from "./EntityRepo.js";

export function heal(enemy){
    const heal = enemy.skillSet.heal;
    enemy.curhealth += heal;
    enemy.curhealth = enemy.curhealth > enemy.maxhealth ? enemy.maxhealth : enemy.curhealth;
    
    var healLog = `
        <div><b id="elog">${enemy.name}</b> used heal, healed <b id="heal">${heal}hp</b>.</div><hr>`;    
    log(healLog);
    updateEnemyHealthBar(enemy);
}

export function rage(enemy, player){
    const rage = enemy.skillSet.rage;
    const strengthStatus = enemy.status.find(stat => stat.strength)
    //If strength status exist just attack
    if(!strengthStatus){ 
        inflictStatus(enemy, {strength: rage, duration: 3, lbl:"ATK+", applied: false})
    }else{
        attack(enemy,player);
        return false;
    }
    
    var rageLog = `
        <div><b id="elog">${enemy.name}</b> used Rage, <b>+${rage}dmg</b>.</div><hr>`;    
    log(rageLog);
    updateEnemyDmgLabel(enemy)
    updateEnemyHealthBar(enemy);
}

export function fireball(enemy,player){
    const skillDmg = enemy.skillSet.fireball;
    player.curhealth -= skillDmg;
    if(probability(30)) inflictStatus(player, {burn: 25, duration: 3, lbl:"BRN"})
    updateHealthBar(player);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> used <b id='elog'>FireBall</b>, dealt <b>${skillDmg}dmg</b>.</div><hr>`;
    log(skillLog);
}

export function firebreath(enemy,player){
    const skillDmg = enemy.skillSet.firebreath;
    player.curhealth -= skillDmg;
    if(probability(50)) inflictStatus(player, {burn: 35, duration: 3, lbl:"BRN"})
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

export function venom(enemy,player){
    const venomDmg = enemy.skillSet.venom;
    player.curhealth -= venomDmg;
    inflictStatus(player, {poison: venomDmg, duration: 5, lbl:"PSN"})
    updateHealthBar(player);
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> used <b id='elog'>Poison</b>, <b>You</b> take <b>${venomDmg}dmg</b> for 5 turns.</div><hr>`;
    log(skillLog);
}

export function regeneration(enemy){
    const regen = enemy.skillSet.regeneration
    enemy.curhealth += regen
    enemy.curhealth = enemy.curhealth > enemy.maxhealth ? enemy.maxhealth : enemy.curhealth;
    inflictStatus(enemy, {regen: regen, duration: 4, lbl:"RGN"})
    updateEnemyHealthBar(enemy)
    var skillLog = `
        <div><b id="elog">${enemy.name}</b> used <b id='elog'>Regeneration</b> healing ${regen}hp for 4 Turns.</div><hr>`;
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
    const breakDmg = Math.floor(player.maxhealth * (enemy.skillSet.bloodBreak/100))
    player.curhealth -= breakDmg
    updateHealthBar(player)
    var skillLog =`
        <div><b id="elog">${enemy.name}</b> used Blood Break, dealt <b>${breakDmg}dmg</b> (${enemy.skillSet.bloodBreak * 100}% MaxHP).</div><hr>`;
    log(skillLog)
}}

export function healthSteal(enemy, player){{
    const healthSteal = 10 + Math.floor(player.maxhealth * (enemy.skillSet.healthSteal/100))
    player.maxhealth -= healthSteal
    enemy.maxhealth += healthSteal
    enemy.curhealth += healthSteal + ((enemy.maxhealth - enemy.curhealth)*0.35);
    if(probability(50)) inflictStatus(enemy, {regen:10, duration: 5, lbl: "RGN"})
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
    const heal = player.skill.greaterHeal.val;
    player.curhealth += heal;
    player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
    
    var healLog = `
        <div><b>You</b> used Greater Heal, healed <b id="heal">${heal}hp</b>.</div><hr>`;    
    log(healLog);
    updateHealthBar(player);
}
export function critHit(enemy, player){{
    const critHit = player.skill.critHit
    const critDamage = player.damage * critHit.val;
    enemy.curhealth -= critDamage
    if(probability(30)) inflictStatus(enemy, {poison: 20, duration: 3, lbl:"PSN"})
    updateEnemyHealthBar(enemy);
    var skillLog = `
        <div><b>You</b> performed a ${critHit.name}, <b id='elog'>${enemy.name}</b> suffered <b>${critDamage}dmg</b>.</div><hr>`;
    log(skillLog);
}}
export function echoingHit(enemy, player){{
    const echoingHit = player.skill.echoingHit
    const echo = Math.floor(Math.random() * (echoingHit.val - 1 + 1) + 1);
    const echoHit = player.damage * echo;
    enemy.curhealth -= echoHit
    updateEnemyHealthBar(enemy);
    var skillLog = `
        <div><b>You</b> performed a ${echoingHit.name}, your hit echoed <b>${echo}x</b>, dealt <b>${echoHit}dmg</b> to <b id='elog'>${enemy.name}</b>.</div><hr>`;
    log(skillLog);
}}
// Deals Damage based on max health
export function bradish(enemy, player){{
    const bradish = player.skill.bradish
    const bradishDmg = Math.floor(enemy.maxhealth * bradish.val)
    enemy.curhealth -= bradishDmg
    updateEnemyHealthBar(enemy)
    var skillLog =`
        <div><b>You</b> performed a ${bradish.name}, dealt <b>${bradishDmg}dmg</b> (${bradish.val * 100}% MaxHP) to <b id='elog'>${enemy.name}</b>.</div><hr>`;
    log(skillLog)
}}
//Deals 30 Damage + 80% of missing hp
export function revengeStrike(enemy, player){{
    const revengeStrike = player.skill.revengeStrike
    const revengeDmg = revengeStrike.val + (Math.floor(player.maxhealth - player.curhealth)*.8)
    enemy.curhealth -= revengeDmg
    updateEnemyHealthBar(enemy)
    var skillLog =`
        <div><b>You</b> performed a ${revengeStrike.name}, dealt <b>${revengeDmg}dmg</b> to <b id='elog'>${enemy.name}</b>.</div><hr>`;
    log(skillLog)
}}

export function probability(percent){
    return (Math.random() < (percent / 100))
}

export function inflictStatus(target, newStatus){
    const statuses = target.status
    const newStatusName = Object.keys(newStatus)[0]//Index 0 is always the name
    let exists = false

    statuses.forEach(status => {
        const statusName = Object.keys(status)[0]
        if(statusName === newStatusName) {
            status.duration = newStatus.duration
            exists = true;
        }
    });

    if(!exists) target.status.push(newStatus)

    if(target instanceof Player){
        updatePlayerStatusLabel(target)
    }else{
        updateEnemyStatusLabel(target)
    }
}