import { log, updateHealthBar, updateEnemyHealthBar } from "../controller.js";
import * as Abilities from "./AbilityRepo.js";

export function attackEnemy(enemy, player){
    return new Promise((resolve)=>{
        enemy.curhealth -= player.damage;
        updateEnemyHealthBar(enemy);
        var attackLog = `
            <div><b>You</b> attacked <b id="elog">${enemy.name}</b>, dealt <b>${player.damage}dmg</b>.</div><hr>`;    
        log(attackLog);
        if(player.skillCd != 0) player.skillCd--;
        resolve()
    })
}

export function useItem(player){
    return new Promise((resolve)=>{
        const heal = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
        player.curhealth += heal;
        player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
        
        var healLog = `
            <div><b>You</b> used an Item, heal <b id="heal">${heal}hp</b>.</div><hr>`;    
        log(healLog);
        if(player.skillCd != 0) player.skillCd--;
        updateHealthBar(player);
        resolve();
    })
}

export function useSkill(enemy, player){
    return new Promise((resolve)=>{
        const skill = Object.keys(player.skill);
        const abilities = Object.keys(Abilities);

        const usableAbility = abilities.filter(ability => skill.includes(ability));
        Abilities[usableAbility](enemy,player);
        player.skillCd = player.skill.cd;
        resolve();
    })
}

export function equip(player, type, equipment){
    if(type == 'weapon'){
        if(player.equipWeapon) player.damage -= player.equipWeapon.damage;
        player.equipWeapon = equipment;
        player.damage += equipment.damage;
        dmg.innerHTML = player.damage;
    }else{
        if(player.equipArmor) {
            player.maxhealth -= player.equipArmor.health
            player.curhealth -= player.equipArmor.health
        };
        player.equipArmor = equipment;
        player.maxhealth += equipment.health;
        player.curhealth += equipment.health;
        player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
        updateHealthBar(player)
    }
}