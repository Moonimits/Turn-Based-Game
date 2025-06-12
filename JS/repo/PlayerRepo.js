import { log, updateHealthBar, updateEnemyHealthBar, updateEnemyStatusLabel, updatePlayerStatusLabel } from "../controller.js";
import { enchant, procItemEffect } from "../model/Equipment.js";
import * as Abilities from "./AbilityRepo.js";
import {triggerStatus} from "./StatusRepo.js";

export function attackEnemy(enemy, player){
    return new Promise((resolve)=>{
        var extraDmgLbl = '';
        triggerStatus(player)
        enemy.curhealth -= player.damage;
        if(player.equipWeapon) {
            extraDmgLbl = procItemEffect(player, enemy);
        }
        updateEnemyHealthBar(enemy);
        var attackLog = `
            <div><b>You</b> attacked <b id="elog">${enemy.name}</b>, dealt <b>${player.damage}${extraDmgLbl}dmg</b>.</div><hr>`;    
        log(attackLog);
        if(player.skillCd != 0) player.skillCd--;
        resolve()
    })
}

export function useItem(player, itemId){
    return new Promise((resolve)=>{
        const item = player.inventory.find(item => item.id == itemId);
        if(item.type == 'heal')
        {
            const heal = item.heal;
            player.curhealth += heal;
            player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
            
            var healLog = `
                <div><b>You</b> used ${item.name}, heal <b id="heal">${heal}hp</b>.</div><hr>`;    
            log(healLog);
            updateHealthBar(player);
        }
        else if(item.type == 'enchant')
        {
            enchant(player, item)
            var enchantlog = `
                <div><b>You</b> used ${item.name}, Your weapon now has increased <b>${item.effect} Effect</b>.</div><hr>`;    
            log(enchantlog);
        }
        item.qty--;
        player.inventory = player.inventory.filter(item => item.qty != 0);
        resolve();
    })
}

export function useSkill(enemy, player){
    return new Promise((resolve)=>{
        triggerStatus(player)
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
        player.equipWeapon = structuredClone(equipment);
        player.damage += equipment.damage;
        dmg.innerHTML = player.damage;
    }else if (type == 'armor'){
        if(player.equipArmor) {
            player.maxhealth -= player.equipArmor.health
            player.curhealth -= player.equipArmor.health
        };
        player.equipArmor = {...equipment};
        player.maxhealth += equipment.health;
        player.curhealth += equipment.health;
        player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
        updateHealthBar(player)
    }else{
        const inventoryItem = player.inventory.find(items => items.id === equipment.id)
        if(inventoryItem){
            inventoryItem.qty += equipment.qty
        }else{
            player.inventory.push({...equipment})
        }
    }
}