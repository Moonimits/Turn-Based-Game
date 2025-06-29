import { enemyPool, Enemy, specialEnemy, increaseEnemyPool } from "./model/Entity.js";
import { heroClass, Player } from "./model/Player.js";
import { attackEnemy, useItem, equip, useSkill } from "./repo/PlayerRepo.js";
import { randomBehavior } from "./repo/EntityRepo.js";
import { itemPool, weapons, armors } from "./model/Equipment.js";
import { probability } from "./repo/AbilityRepo.js";
//================ HTML ELEMENTS ===========================//
const statusLabel = document.getElementById("statusLabel")
const classSummary = document.getElementById("classSummary");
const tableSummary = document.getElementById("tableSummary");
const playerSummary = document.getElementById("playerSummary");
const selectBox = document.getElementById("selectBox");
const battleLog = document.getElementById('battleLog');
const inventory = document.getElementById('inventory');
const itemSlot = document.getElementById('itemSlot');
const selectClass = document.getElementById('heroClass');
const gameover = document.getElementById('gameover');
const roundCounter = document.getElementById('roundCounter');
const scoreBoard = document.getElementById('scoreBoard');
const overMessage = document.getElementById('overMessage');
const overSubMsg = document.getElementById('overSubMsg');
const playerSet = document.getElementById('start');
const gamelog = document.getElementById('game');
const start = document.getElementById('submit');
//player info
const attackBtn = document.getElementById('attack');
const showInv = document.getElementById('showInv');
const closeInv = document.getElementById('closeInv');
const skillBtn = document.getElementById('skill');
const cd = document.getElementById('CD');

const name  = document.getElementById('name');
const hp    = document.getElementById('hp');
const dmg   = document.getElementById('dmg');
const st   = document.getElementById('st');
const exp   = document.getElementById('exp');
const expbar= document.getElementById('expbar');

//enemy info
const ename = document.getElementById('ename');
const ehp   = document.getElementById('ehp');
const edmg  = document.getElementById('edmg');
const est  = document.getElementById('est');
var score   = 0;
var round = 0;
var eStatIncrease = 0
var enemy, player, equipment, itemType;

window.itempool = itemPool;
//================ HTML ELEMENTS ===========================//

//================ GAME FUNCTIONS ===========================//
export function generateEnemy(){
    roundUpdate()
    increaseEnemyPool(round).then(()=>{

        const randomizer   = Math.floor(Math.random() * enemyPool.length);
        const entity       = enemyPool[randomizer];
        enemy = new Enemy(entity.name, entity.health, entity.damage, entity.skill, entity.category, entity.exp, entity.gold);
    
        for(var i = 1; i <= eStatIncrease; i++){
            if(["basic", "elite"].includes(enemy.category)){
                enemy.maxhealth += (50 + (Math.round(enemy.maxhealth * (player.level/100))));
                enemy.curhealth = enemy.maxhealth;
                enemy.damage += (10 + (Math.round(enemy.damage * (player.level/100))));
                for (const skillName in enemy.skillSet) {
                    if(typeof enemy.skillSet[skillName] === "number"){
                        if(["heal","regeneration"].includes(skillName)){
                            enemy.skillSet[skillName] += Math.round(enemy.maxhealth * 0.05)
                        }else if(["healthSteal","bloodBreak"].includes(skillName)){
                            enemy.skillSet[skillName] += 3;
                        }else if(["critical"].includes(skillName)){
                            enemy.skillSet[skillName] += 0.2;
                        }else{
                            enemy.skillSet[skillName] += (Math.round(enemy.damage * 0.05))
                        }
                    }
                }
            } else if(["boss"].includes(enemy.category)){
                if(round >= 150){
                    enemy.maxhealth += (50 + (Math.round(enemy.maxhealth * (player.level/100))));
                    enemy.curhealth = enemy.maxhealth;
                    enemy.damage += (10 + (Math.round(enemy.damage * (player.level/100))));
                }
            }
        }

        //enemy name style
        const enemyDetails = `
            <div class='text-danger fw-bold'>!ENEMY ENCOUNTERED!</div>
            <div><b>Name:</b> <span class="${enemy.category ?? ''}">${enemy.name}</span></div>
            <div><b>Health:</b> ${enemy.maxhealth}</div>
            <div><b>Damage:</b> ${enemy.damage}</div>
            <hr>`;
        
        log(enemyDetails);
        updateEnemyHealthBar(enemy)
        ename.innerHTML = enemy.name;
        edmg.innerHTML  = enemy.damage;
        window.enemy = enemy;

        if(probability(50)){
            setTimeout(()=>{
                randomBehavior(enemy, player);
                if(enemy.curhealth <= 0){
                    handleDefeatEnemy(enemy, player)
                }
            }, 1000);
        }else{
            toggleButtons();
        }
    });    
}

export function generateItem(){
    let itemDetails;
    const itemPoolKeys = Object.keys(itemPool);
    const typeRand     = Math.floor(Math.random() * itemPoolKeys.length);
    const baseHealth   = player.maxhealth - (player.equipArmor != null ? player.equipArmor.health : 0);
    const baseDamage   = player.damage - (player.equipWeapon != null ? player.equipWeapon.damage : 0);

    itemType   = itemPoolKeys[typeRand];
    const item = itemPool[itemType];

    const itemRand  = Math.floor(Math.random() * item.length);
    equipment = item[itemRand];

    if(["weapon","armor"].includes(itemType)){
        var stats = equipment.health ? equipment.health + 'hp' : equipment.damage + 'dmg';
        if(equipment.health != undefined){
            var bonusHealth = (baseHealth + equipment.health) - player.maxhealth;
            var healthstat = bonusHealth < 0 ? `<span class="negStat">${bonusHealth}hp</span>`:`<span class="posStat">+${bonusHealth}hp</span>`;
        }else if(equipment.damage != undefined){
            var bonusDamage = (baseDamage + equipment.damage) - player.damage;
            var damagestat = bonusDamage < 0 ? `<span class="negStat">${bonusDamage}dmg</span>`:`<span class="posStat">+${bonusDamage}dmg</span>`;
        }

        var effect = equipment.effect;
        var effectLabel = '';
        if(effect){
            const effects = effect.map(eff => eff.desc).join("<br>"); 
            effectLabel = `<div><b>Effect:</b> ${effects}</div>`
        }

        itemDetails = `
            <div class='text-success fw-bold'>!YOU FOUND AN ITEM!</div>
            <div><b>Name:</b> <span class='${equipment.category ?? ''}'>${equipment.name}</span></div>
            <div><b>Item Stat:</b> ${stats}</div>
            <div><b>${itemType == 'weapon' ? `Damage` : `Bonus Health`}:</b> ${damagestat ?? healthstat}</div>
            ${effectLabel}
            <div id='equipButton'>
                <span class='btn btn-sm btn-success' id='equip'>Equip</span> 
                <span class='btn btn-sm btn-primary' id='ignore'>Sell (<b class='gold'>${equipment.gold}g</b>)</span>
            </div>
            <hr>`;
    }else{
        const statsMap = {
            heal: `${equipment.heal} heal`,
            enchant: `${equipment.effect}: +${equipment.amount}`,
        } 
        var stats = statsMap[equipment.type];
        var disabled = (equipment.type == "enchant" && !player.equipWeapon) ? 'disabled' : '';
        itemDetails = `
            <div class='text-success fw-bold'>!YOU FOUND AN ITEM!</div>
            <div><b>Name:</b> <span class='${equipment.category ?? ''}'>${equipment.name}</span></div>
            <div><b>Item Stat:</b> ${stats}</div>
            <div id='equipButton'>
                <span class='btn btn-sm btn-success' id='equip'>Take</span> 
                <span class='btn btn-sm btn-primary ${disabled}' data-itemid='${equipment.id}' id='use'>Use</span>
            </div>
            <hr>`;
    }

    log(itemDetails);
}

function randomEvent(){
    const events = [generateEnemy, generateItem];
    const eventRand = Math.floor(Math.random() * events.length);
    const runEvent = events[eventRand];
    runEvent();
}

function handleClassSelect(e){
    const select = e.target
    if(select.className == "selectClass"){
        const selected = document.getElementsByClassName("selected")[0]
        const classId = select.dataset.id;
        const classDetails = heroClass[classId]
        const skillKey = Object.keys(classDetails.skill)[0]
        const classSkill = classDetails.skill[skillKey]

        if(selected) selected.classList.remove("selected")
        select.classList.add("selected")
        selectClass.value = classId

        classSummary.classList.remove("d-none")
        classSummary.children[0].classList.add("hide")
        setTimeout(() => {
            classSummary.children[0].classList.remove("hide")
            const tableBody = `
                <tbody>
                    <tr>
                        <td class="fw-bold">Class:</td>
                        <td>${classDetails.class}</td>
                        <td class="fw-bold">Skill:</td>
                        <td>${classSkill.name}</td>
                        <td class="fw-bold">Cooldown:</td>
                        <td>${classDetails.skill.cd} Turns</td>
                    </tr>
                    <tr>
                        <td class="fw-bold">Health:</td><td style='color:green'>${classDetails.health}hp</td>
                        <td rowspan="4" colspan="4">
                            ${classSkill.desc}
                        </td>
                    </tr>
                    <tr>
                        <td class="fw-bold">Damage:</td><td style='color:red'>${classDetails.damage}dmg</td>
                    </tr>
                </tbody>
            `;
            tableSummary.innerHTML = tableBody;
        }, 700)
    }
}
//Build Start
selectBox.innerHTML = heroClass.map((hero, index)=>{
    return `<div class="selectClass" data-id=${index}>${hero.class}</div>`
}).join('');

selectBox.addEventListener("click", handleClassSelect)

//Game Start
start.addEventListener('click', ()=>{
    const playerNameInput    = document.getElementById('username');
    const playerClassInput   = document.getElementById('heroClass');
    const playerName    = playerNameInput.value;
    const playerClass   = playerClassInput.value;
    
    if(playerName.trim() == ''){
        playerNameInput.focus()
        return false;
    }
    
    const Class  = heroClass[playerClass];
    player = new Player(playerName, Class.health, Class.damage, Class.class, Class.skill);

    name.innerHTML = player.name;
    hp.innerHTML   = player.curhealth;
    dmg.innerHTML  = player.damage;
    exp.innerHTML  = `${player.exp}/${player.expreq}` 

    playerSet.style.display = "none";
    gamelog.style.display   = "block";
    
    console.log(player)
    window.player = player

    playerHealthChecker();
    randomEvent();
});

//AttackButton
attackBtn.addEventListener('click', ()=>{
    if(!attackBtn.classList.contains("disabled"))
    {
        toggleButtons();
        attackEnemy(enemy, player)
            .then(()=>{ 
                if(enemy.curhealth <= 0){        
                    handleDefeatEnemy(enemy, player);
                }
                else
                {
                    setTimeout(()=>{
                        randomBehavior(enemy, player);
                        if(enemy.curhealth <= 0){
                            handleDefeatEnemy(enemy, player)
                        }
                    }, 1000);
                }
            })
    }
})

//Use Item Button
showInv.addEventListener('click', ()=>{
    if(!attackBtn.classList.contains("disabled")){
        inventory.classList.add("show")
        const inventoryItems = player.inventory.map((item)=>{
            var itemRow;
            if(item.type == "heal"){
                itemRow = `<tr>
                            <td class="text-start">${item.name}</td>
                            <td>${item.heal} Heal</td>
                            <td><button class="btn btn-success btn-sm" data-itemid="${item.id}" id="useItem">Use ${item.qty}x</button></td>
                        </tr>`
            }else if(item.type == "enchant"){
                var disabled = (player.equipWeapon) ? '' : 'disabled';
                itemRow = `<tr>
                            <td class="text-start">${item.name}</td>
                            <td>${item.effect}: +${item.amount}</td>
                            <td><button class="btn btn-success btn-sm ${disabled}" data-itemid="${item.id}" id="useItem">Use ${item.qty}x</button></td>
                        </tr>`
            }
            return itemRow;
        }).join('')
        itemSlot.innerHTML = inventoryItems;
    }
})
closeInv.addEventListener('click', ()=>{
    if(!attackBtn.classList.contains("disabled")){
        inventory.classList.remove("show")
    }
})
inventory.addEventListener('click', (e)=>{
    if(e.target.id === "useItem"){
        const itemId = e.target.dataset.itemid
        inventory.classList.remove("show")
        useItem(player, itemId);
    }
})

//Use Skill Button
skillBtn.addEventListener('click', ()=>{
    if(!attackBtn.classList.contains("disabled")){
        toggleButtons();
        useSkill(enemy, player)
            .then(()=>{ 
                if(enemy.curhealth <= 0){
                    handleDefeatEnemy(enemy, player)
                }
                else
                {
                    setTimeout(()=>{
                        randomBehavior(enemy, player);
                        if(enemy.curhealth <= 0){
                            handleDefeatEnemy(enemy, player)
                        }
                    }, 1000);
                }
            })
    }
})

//Battle log
battleLog.addEventListener('click', function(e){
    const equipButton = document.getElementById('equipButton')
    if(e.target.id === 'equip'){
        equip(player, itemType, equipment)
        equipButton.remove();
        randomEvent();
    }else if(e.target.id === 'use'){
        const itemId = e.target.dataset.itemid
        equip(player, itemType, equipment)
        equipButton.remove();
        useItem(player,itemId);
        randomEvent();
    }else if (e.target.id === 'ignore'){
        player.gold += equipment.gold;
        equipButton.remove();
        randomEvent();
    }
})

//playerSummary
name.addEventListener('click', function(){
    playerSummary.classList.add("show");
    const playerTable = playerSummary.children[2];
    const statusTable = playerSummary.children[4];
    const equipWeaponTable = playerSummary.children[6];
    const equipArmorTable = playerSummary.children[8];
    var tableContent;

    //player table content
    tableContent = `
        <thead>
            <tr><th colspan="3">Class: ${player.heroClass} (Lv.${player.level})</th></tr>
        </thead>
        <tbody>
            <tr><td>Name:</td><td colspan="2">${player.name}</td></tr>
            <tr><td>Health:</td><td colspan="2">${player.curhealth}/${player.maxhealth}</td></tr>
            <tr><td>Damage:</td><td colspan="2">${player.damage}dmg</td></tr>
            <tr><td>Gold:</td><td colspan="2">${player.gold}gold</td></tr>
        </tbody>`;
    playerTable.innerHTML = tableContent;
    
    //player status table content
    tableContent = `
        <thead>
            <tr><th colspan="3">Statuses</th></tr>
        </thead>`;
    tableContent += `<tbody>${
        player.status.length <= 0 ? `<tr><td colspan='2'>No statuses</td></tr>` :
        player.status.map(stat => {
            const name = Object.keys(stat)[0]
            return `<tr><td>${name}</td><td>${stat[name]}dmg</td><td>${stat.duration} turns</td></tr>`
        })
    }</tbody>`;
    statusTable.innerHTML = tableContent;

    tableContent = `
        <thead>
            <tr><th colspan="3">Equiped Weapon</th></tr>
        </thead>`;
    if(player.equipWeapon){
        tableContent += `
            <tbody>
                <tr><td>Name:</td><td colspan="2">${player.equipWeapon.name}</td></tr>
                <tr><td>Stats:</td><td colspan="2">${player.equipWeapon.damage}dmg</td></tr>
                <tr><td>Effects:</td><td colspan="2">${
                    !player.equipWeapon.effect ? `No Effects` : 
                    player.equipWeapon.effect.map(eff => {
                        return `${eff.desc}` 
                    }).join(`<br>`)
                }</td></tr>
            </tbody>`;
    }else{
        tableContent += `<tbody><tr><td colspan='3'>Nothing Equiped</td></tr></tbody>`
    }
    equipWeaponTable.innerHTML = tableContent;


    tableContent = `
        <thead>
            <tr><th colspan="3">Equiped Armor</th></tr>
        </thead>`;
    if(player.equipArmor){
        tableContent += `
            <tbody>
                <tr><td>Name:</td><td colspan="2">${player.equipArmor.name}</td></tr>
                <tr><td>Stats:</td><td colspan="2">${player.equipArmor.health}hp</td></tr>
                <tr><td>Effects:</td><td colspan="2">${
                    !player.equipArmor.effect ? `No Effects` : 
                    player.equipArmor.effect.map(eff => {
                        return `${eff.desc}` 
                    }).join(`<br>`)
                }</td></tr>
            </tbody>`;
    }else{
        tableContent += `<tbody><tr><td colspan='3'>Nothing Equiped</td></tr></tbody>`
    }
    equipArmorTable.innerHTML = tableContent;
    
})
playerSummary.addEventListener("click", function(e){
    if(e.target.id == "closeSummary"){
        this.classList.remove("show")
    }
})
//================ GAME FUNCTIONS ===========================//

//================ UTILITY ===========================//
export function log(msg){
    battleLog.innerHTML += msg;
    battleLog.scrollTop = battleLog.scrollHeight
}

export function toggleButtons(){
    attackBtn.classList.toggle("disabled")
    showInv.classList.toggle("disabled")

    if(player.skillCd == 0){
        cd.classList.add("d-none")
        skillBtn.classList.toggle("disabled")
    }else{
        cd.classList.remove("d-none")
        cd.textContent = `(${player.skillCd})`
    }
}

export function updateHealthBar(player){
    const healthPercent = Math.floor((player.curhealth / player.maxhealth) * 100);
    hp.style.width = `${healthPercent}%`;
    hp.innerHTML = player.curhealth;
}

export function updateEnemyHealthBar(enemy){
    if(enemy.curhealth <= 0) enemy.curhealth = 0;
    const healthPercent = Math.floor((enemy.curhealth / enemy.maxhealth) * 100);
    ehp.style.width = `${healthPercent}%`;
    ehp.innerHTML = enemy.curhealth;
}

export function updatePlayerDmgLabel(player){
    dmg.innerHTML = player.damage
}
export function updateEnemyDmgLabel(enemy){
    edmg.innerHTML = enemy.damage
}
export function updatePlayerStatusLabel(player){
    const statuses = player.status
    var statusIcons = ''
    statuses.forEach(status => {
        statusIcons += `<div data-id="${status.id}" class="status ${status.lbl}">${status.lbl}</div>`
    });
    st.innerHTML = statusIcons
}
export function updateEnemyStatusLabel(enemy){
    const statuses = enemy.status
    var statusIcons = ''
    statuses.forEach(status => {
        statusIcons += `<div data-id="${status.id}" class="status ${status.lbl}">${status.lbl}</div>`
    });
    est.innerHTML = statusIcons
}

export function handleDefeatEnemy(enemy, player){
    attackBtn.classList.add("disabled")
    showInv.classList.add("disabled")
    skillBtn.classList.add("disabled")
    setTimeout(()=>{
        var slainLog = `
        <div><b id="elog">${enemy.name}</b> has been defeated.</div><hr>`;
        score += 1;    
        log(slainLog);
        est.innerHTML = ''
        player.gold += enemy.gold
        updateExp(player, enemy.expval).then(()=>randomEvent())
    }, 1000);
}

export function updateExp(player, experience){
    return new Promise((resolve)=>{
        const bonushealth = 25
        const bonusdamage = 10
        player.exp += experience;
        if(player.exp >= player.expreq){
            player.exp = player.exp % player.expreq
            player.level++;
            player.maxhealth += bonushealth;
            player.damage += bonusdamage;
            player.curhealth = player.maxhealth;
            updatePlayerDmgLabel(player)
    
            const levelLog = `
                <div><b>You</b> Leveled UP!.</div>
                <div><b>Current Level:</b> ${player.level}.</div>
                <div><b>Maxhealth:</b> <span class='posStat'>+${bonushealth}hp</span>.</div>
                <div><b>Damage:</b> <span class='posStat'>+${bonusdamage}dmg</span>.</div>
                <hr>`;
    
            log(levelLog)
            updateHealthBar(player)
            
            //delay expbar visual
            expbar.style.width = `100%`;
            exp.innerHTML  = `${player.expreq}/${player.expreq}`
            setTimeout(()=>{
                expbar.style.width = `0%`;
                setTimeout(()=>{
                    const expPercent = Math.floor((player.exp/player.expreq)*100);
                    expbar.style.width = `${expPercent}%`;
                    exp.innerHTML  = `${player.exp}/${player.expreq}`
                    resolve();
                }, 500)
            }, 500)
        }else{
            const expPercent = Math.floor((player.exp/player.expreq)*100);
            expbar.style.width = `${expPercent}%`;
            exp.innerHTML  = `${player.exp}/${player.expreq}`
            resolve();
        }
    })
}

function playerHealthChecker(){
    const gameTracker = setInterval(()=>{
        setTimeout(()=>{
            if(player.curhealth <= 0){
                gameover.style.display = 'block';
                gamelog.style.display = 'none'
                retry.classList.remove('d-none')
                overMessage.textContent = 'You Lost'
                overSubMsg.textContent = `Died to a ${enemy.name}`
                scoreBoard.textContent = `Score: ${score}`
                clearInterval(gameTracker);
            }
        },2000)
    },100)
}

function roundUpdate(){
    round++
    roundCounter.innerHTML = `Round: ${round}`
    if(round % 25 == 0) eStatIncrease++;
}

//Status tooltip
document.addEventListener("click", function(e){
    const target = e.target;
    if(target.classList.contains("status")){
        const entity = target.parentElement.id == "st" ? player : enemy;
        const statusId = target.dataset.id;
        const status = entity.status.find( stat => stat.id == statusId);
        const statusVal = Object.values(status)[0];  
        var details;

        switch (status.lbl) {
            case "RGN":
                details = `${statusVal}hp (${status.duration} turns)`
                break;

            case "ATK+":
                details = status.percent ? `+(${statusVal}%)dmg (${status.duration+1} turns)` : `+${statusVal}dmg (${status.duration+1} turns)`;
                break;

            case "ATK-":
                details = status.percent ? `-(${statusVal}%)dmg (${status.duration+1} turns)` : `-${statusVal}dmg (${status.duration+1} turns)`;
                break;
        
            default:
                details = `${statusVal}dmg (${status.duration} turns)`
                break;
        }
        statusLabel.innerHTML = details;

        const detailRect = statusLabel.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const x = tRect.left - (detailRect.width/2) + (tRect.width/2);
        const y = tRect.top - detailRect.height - 4;
        statusLabel.classList.add("show")
        statusLabel.style.transform = `translate(${x}px, ${y}px)`;
    }else{
        statusLabel.classList.remove("show")
    }
})

//================ UTILITY ===========================//
