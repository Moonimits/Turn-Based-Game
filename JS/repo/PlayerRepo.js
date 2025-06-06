import { log, updateHealthBar, updateEnemyHealthBar, updateEnemyStatusLabel, updatePlayerStatusLabel } from "../controller.js";
import * as Abilities from "./AbilityRepo.js";
import * as StatusEffect from "./StatusRepo.js";

export function attackEnemy(enemy, player){
    return new Promise((resolve)=>{
        triggerStatus(player)
        enemy.curhealth -= player.damage;
        updateEnemyHealthBar(enemy);
        var attackLog = `
            <div><b>You</b> attacked <b id="elog">${enemy.name}</b>, dealt <b>${player.damage}dmg</b>.</div><hr>`;    
        log(attackLog);
        if(player.skillCd != 0) player.skillCd--;
        resolve()
    })
}

export function useItem(player, itemId){
    return new Promise((resolve)=>{
        triggerStatus(player)
        const item = player.inventory.find(item => item.id == itemId);
        if(item.type == 'heal')
        {
            const heal = item.heal;
            player.curhealth += heal;
            player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
            
            var healLog = `
                <div><b>You</b> used ${item.name}, heal <b id="heal">${heal}hp</b>.</div><hr>`;    
            log(healLog);
            if(player.skillCd != 0) player.skillCd--;
            updateHealthBar(player);
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

export function triggerStatus(player){
    if(player.status.length){
        const statuses = player.status
        statuses.forEach((status) => {
            const key = Object.keys(status)[0]
            const tickEffect = StatusEffect[key]
            tickEffect(status,player)

            status.duration--
            player.status = statuses.filter((status) => status.duration != 0)
        });
    }
    updatePlayerStatusLabel(player)
}

export function equip(player, type, equipment){
    if(type == 'weapon'){
        if(player.equipWeapon) player.damage -= player.equipWeapon.damage;
        player.equipWeapon = equipment;
        player.damage += equipment.damage;
        dmg.innerHTML = player.damage;
    }else if (type == 'armor'){
        if(player.equipArmor) {
            player.maxhealth -= player.equipArmor.health
            player.curhealth -= player.equipArmor.health
        };
        player.equipArmor = equipment;
        player.maxhealth += equipment.health;
        player.curhealth += equipment.health;
        player.curhealth = player.curhealth > player.maxhealth ? player.maxhealth : player.curhealth;
        updateHealthBar(player)
    }else{
        var inventoryItem = player.inventory.find(items => items.id === equipment.id)
        if(inventoryItem){
            inventoryItem.qty += equipment.qty
        }else{
            player.inventory.push(equipment)
        }
    }
}