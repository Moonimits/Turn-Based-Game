import { enemyPool, Enemy, specialEnemy, increaseEnemyPool } from "./model/Entity.js";
import { heroClass, Player } from "./model/Player.js";
import { attackEnemy, useItem, equip, useSkill } from "./repo/PlayerRepo.js";
import { randomBehavior } from "./repo/EntityRepo.js";
import { itemPool, weapons, armors } from "./model/Equipment.js";
import { probability } from "./repo/AbilityRepo.js";
//================ HTML ELEMENTS ===========================//
const classSummary = document.getElementById("classSummary");
const tableSummary = document.getElementById("tableSummary");
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
var enemyAttr = 0;
var enemy, player, equipment, itemType;
//================ HTML ELEMENTS ===========================//

//================ GAME FUNCTIONS ===========================//
export function generateEnemy(){
    roundUpdate()
    if(round % 25 == 0) enemyAttr++;   
    increaseEnemyPool(round).then(()=>{

        const randomizer   = Math.floor(Math.random() * enemyPool.length);
        const entity       = enemyPool[randomizer];
        enemy = new Enemy(entity.name, entity.health, entity.damage, entity.skill, entity.category, entity.exp);
        
        //if round > 50 increase enemy attributes
        const additionalHealth = 50 * enemyAttr
        const additionalDamage = 10 * enemyAttr
        if(["basic", "elite"].includes(enemy.category)){
            enemy.maxhealth += additionalHealth
            enemy.curhealth += additionalHealth
            enemy.damage += additionalDamage
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
        itemDetails = `
            <div class='text-success fw-bold'>!YOU FOUND AN ITEM!</div>
            <div><b>Name:</b> <span class='${equipment.category ?? ''}'>${equipment.name}</span></div>
            <div><b>Item Stat:</b> ${stats}</div>
            <div><b>${itemType == 'weapon' ? `Damage` : `Bonus Health`}:</b> ${damagestat ?? healthstat}</div>
            <div id='equipButton'>
                <span class='btn btn-sm btn-success' id='equip'>Equip</span> 
                <span class='btn btn-sm btn-danger' id='ignore'>Ignore</span>
            </div>
            <hr>`;
    }else{
        const statsMap = {
            heal: `${equipment.heal} heal`,
        } 
        var stats = statsMap[equipment.type];
        itemDetails = `
            <div class='text-success fw-bold'>!YOU FOUND AN ITEM!</div>
            <div><b>Name:</b> <span class='${equipment.category ?? ''}'>${equipment.name}</span></div>
            <div><b>Item Stat:</b> ${stats}</div>
            <div id='equipButton'>
                <span class='btn btn-sm btn-success' id='equip'>Take</span> 
                <span class='btn btn-sm btn-primary' data-itemid='${equipment.id}' id='use'>Use</span>
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
    
    if(playerName == ''){
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
        console.log(player.inventory)
        const inventoryItems = player.inventory.map((item)=>{
            var itemEffect = item.type == "heal" ? `${item.heal} heal` : '';
            return `<tr>
                        <td class="text-start">${item.name}</td>
                        <td>${itemEffect}</td>
                        <td><button class="btn btn-success btn-sm" data-itemid="${item.id}" id="useItem">Use ${item.qty}x</button></td>
                    </tr>`
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
        toggleButtons();
        inventory.classList.remove("show")
        useItem(player, itemId).then(()=>{
            setTimeout(()=>{
                randomBehavior(enemy, player);
                if(enemy.curhealth <= 0){
                    handleDefeatEnemy(enemy, player)
                }
            },1000)
        });
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
        console.log(player.inventory)
        equipButton.remove();
        useItem(player,itemId);
        randomEvent();
    }else if (e.target.id === 'ignore'){
        equipButton.remove();
        randomEvent();
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
        statusIcons += `<div class="status ${status.lbl}">${status.lbl}</div>`
    });
    st.innerHTML = statusIcons
}
export function updateEnemyStatusLabel(enemy){
    const statuses = enemy.status
    var statusIcons = ''
    statuses.forEach(status => {
        statusIcons += `<div class="status ${status.lbl}">${status.lbl}</div>`
    });
    est.innerHTML = statusIcons
}

export function handleDefeatEnemy(enemy, player){
    attackBtn.classList.add("disabled")
    showInv.classList.add("disabled")
    setTimeout(()=>{
        var slainLog = `
        <div><b id="elog">${enemy.name}</b> has been defeated.</div><hr>`;
        score += 1;    
        log(slainLog);
        est.innerHTML = ''
        updateExp(player, enemy.expval).then(()=>randomEvent())
    }, 1000);
}

export function updateExp(player, experience){
    return new Promise((resolve)=>{

        player.exp += experience;
        if(player.exp >= player.expreq){
            player.exp = player.exp % player.expreq
            player.level++;
            player.maxhealth += 25;
            player.damage += 5;
            player.curhealth = player.maxhealth;
            updatePlayerDmgLabel(player)
    
            const levelLog = `
                <div><b>You</b> Leveled UP!.</div>
                <div><b>Current Level:</b> ${player.level}.</div>
                <div><b>Maxhealth:</b> <span class='posStat'>+25hp</span>.</div>
                <div><b>Damage:</b> <span class='posStat'>+5dmg</span>.</div>
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
}



//================ UTILITY ===========================//
