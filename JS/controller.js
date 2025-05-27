import { enemyPool, Enemy, specialEnemy, increaseEnemyPool } from "./model/Entity.js";
import { heroClass, Player } from "./model/Player.js";
import { attackEnemy, useItem, equip, useSkill } from "./repo/PlayerRepo.js";
import { randomBehavior } from "./repo/EntityRepo.js";
import { itemPool, weapons, armors } from "./model/Equipment.js";
//================ HTML ELEMENTS ===========================//
const battleLog = document.getElementById('battleLog');
const selectClass = document.getElementById('heroClass');
const gameover = document.getElementById('gameover');
const scoreBoard = document.getElementById('scoreBoard');
const overMessage = document.getElementById('overMessage');
const overSubMsg = document.getElementById('overSubMsg');
const playerSet = document.getElementById('start');
const gamelog = document.getElementById('game');
const start = document.getElementById('submit');
//player info
const attackBtn = document.getElementById('attack');
const itemBtn = document.getElementById('item');
const skillBtn = document.getElementById('skill');
const cd = document.getElementById('CD');

const name  = document.getElementById('name');
const hp    = document.getElementById('hp');
const dmg   = document.getElementById('dmg');
const exp   = document.getElementById('exp');
const expbar= document.getElementById('expbar');

//enemy info
const ename = document.getElementById('ename');
const ehp   = document.getElementById('ehp');
const edmg  = document.getElementById('edmg');
var score   = 0;
var round = 0;
var enemy, player, equipment, itemType;
//================ HTML ELEMENTS ===========================//

//================ GAME FUNCTIONS ===========================//
export function generateEnemy(){
    round++
    increaseEnemyPool(round);

    const randomizer   = Math.floor(Math.random() * enemyPool.length);
    const entity       = enemyPool[randomizer];
    enemy = new Enemy(entity.name, entity.health, entity.damage, entity.skill, entity.category, entity.exp);
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

    toggleButtons();
}

export function generateItem(){
    const itemPoolKeys = Object.keys(itemPool);
    const typeRand     = Math.floor(Math.random() * itemPoolKeys.length);
    const baseHealth   = player.maxhealth - (player.equipArmor != null ? player.equipArmor.health : 0);
    const baseDamage   = player.damage - (player.equipWeapon != null ? player.equipWeapon.damage : 0);

    itemType   = itemPoolKeys[typeRand];
    const item = itemPool[itemType];

    const itemRand  = Math.floor(Math.random() * item.length);
    equipment = item[itemRand];

    var stats = equipment.health ? equipment.health + 'hp' : equipment.damage + 'dmg';
    if(equipment.health != undefined){
        var bonusHealth = (baseHealth + equipment.health) - player.maxhealth;
        var healthstat = bonusHealth < 0 ? `<span class="negStat">${bonusHealth}hp</span>`:`<span class="posStat">+${bonusHealth}hp</span>`;
    }else{
        var bonusDamage = (baseDamage + equipment.damage) - player.damage;
        var damagestat = bonusDamage < 0 ? `<span class="negStat">${bonusDamage}dmg</span>`:`<span class="posStat">+${bonusDamage}dmg</span>`;
    }

    const itemDetails = `
        <div class='text-success fw-bold'>!YOU FOUND AN ITEM!</div>
        <div><b>Name:</b> <span class='${equipment.category ?? ''}'>${equipment.name}</span></div>
        <div><b>Item Stat:</b> ${stats}</div>
        <div><b>${itemType == 'weapon' ? `Damage` : `Bonus Health`}:</b> ${damagestat ?? healthstat}</div>
        <div id='equipButton'>
            <span class='btn btn-sm btn-success' id='equip'>Equip</span> 
            <span class='btn btn-sm btn-danger' id='ignore'>Ignore</span>
        </div>
        <hr>`;
    
    log(itemDetails);
}

function randomEvent(){
    const events = [generateEnemy, generateItem];
    const eventRand = Math.floor(Math.random() * events.length);
    const runEvent = events[eventRand];
    runEvent();
}

//Game Start
start.addEventListener('click', ()=>{
    const playerName    = document.getElementById('username').value;
    const playerClass   = document.getElementById('heroClass').value;
    
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
                    setTimeout(()=>{
                        var slainLog = `
                        <div><b id="elog">${enemy.name}</b> has been defeated.</div><hr>`;
                        score += 1;    
                        log(slainLog);
                        updateExp(player, enemy.expval).then(()=>randomEvent())
                    }, 1000);
                }
                else
                {
                    setTimeout(()=>{
                        randomBehavior(enemy, player);
                    }, 1000);
                }
            })
    }
})

//Use Item Button
itemBtn.addEventListener('click', ()=>{
    if(!attackBtn.classList.contains("disabled")){
        toggleButtons();
        useItem(player).then(()=>{
            setTimeout(()=>{
                randomBehavior(enemy, player);
            },1000)
        });
    }
})

//Use Item Button
skillBtn.addEventListener('click', ()=>{
    if(!attackBtn.classList.contains("disabled")){
        toggleButtons();
        useSkill(enemy, player)
            .then(()=>{ 
                if(enemy.curhealth <= 0){
                    setTimeout(()=>{
                        var slainLog = `
                        <div><b id="elog">${enemy.name}</b> has been defeated.</div><hr>`;
                        score += 1;    
                        log(slainLog);
                        updateExp(player, enemy.expval).then(()=>randomEvent())
                    }, 1000);
                }
                else
                {
                    setTimeout(()=>{
                        randomBehavior(enemy, player);
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
    }else if (e.target.id === 'ignore'){
        equipButton.remove();
        randomEvent();
    }
})

//create options in the class
const options = heroClass.map((hero, index) => {
    return`<option value = '${index}'>${hero.class}</option>`
}).join()
selectClass.innerHTML += options;
//================ GAME FUNCTIONS ===========================//

//================ UTILITY ===========================//
export function log(msg){
    battleLog.innerHTML += msg;
    battleLog.scrollTop = battleLog.scrollHeight
}

export function toggleButtons(){
    attackBtn.classList.toggle("disabled")
    itemBtn.classList.toggle("disabled")

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

export function updateExp(player, experience){
    return new Promise((resolve)=>{

        player.exp += experience;
        if(player.exp >= player.expreq){
            player.exp = player.exp % player.expreq
            player.level++;
            player.maxhealth += 10;
            player.damage += 5;
            player.curhealth = player.maxhealth;
            updatePlayerDmgLabel(player)
    
            const levelLog = `
                <div><b>You</b> Leveled UP!.</div>
                <div><b>Current Level:</b> ${player.level}.</div>
                <div><b>Maxhealth:</b> <span class='posStat'>+10hp</span>.</div>
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



//================ UTILITY ===========================//
