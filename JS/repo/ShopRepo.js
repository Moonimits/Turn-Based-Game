import { consumables, enchantments, enchantmentsII, enchantmentsIII, statEnhancer } from "../model/Equipment.js";

const itemCollections = [consumables, enchantments, enchantmentsII, enchantmentsIII, statEnhancer];

function generateShopItems(){
    let shopItems = [];
    const shopExclusive = [
        {id: 27, name: "Supreme Healing Potion", category:"exclusive", heal: 5000, price: 70, type:"heal", stock:1, qty:1},
        {id: 28, name: "Persistence",    category:"exclusive", amount: 100, price: 50,  type: "boost", stock:1, boost: "hp",  qty:1},
        {id: 29, name: "Life Blossom",   category:"exclusive", amount: 300, price: 100, type: "boost", stock:1, boost: "hp",  qty:1},
        {id: 30, name: "Eldrich Heart",  category:"exclusive", amount: 1000,price: 400, type: "boost", stock:1, boost: "hp",  qty:1},
        {id: 31, name: "Battle Script",  category:"exclusive", amount: 10,  price: 50,  type: "boost", stock:1, boost: "dmg", qty:1},
        {id: 32, name: "War Sprite",     category:"exclusive", amount: 20,  price: 100, type: "boost", stock:1, boost: "dmg", qty:1},
        {id: 33, name: "Exmachina",      category:"exclusive", amount: 100, price: 300, type: "boost", stock:1, boost: "dmg", qty:1},
        {id: 34, name: "Foly Feather",   category:"exclusive", amount: 10,  price: 100, type: "boost", stock:1, boost: "dmg", percent: true, qty:1},
        {id: 35, name: "Nova Fragment",  category:"exclusive", amount: 10,  price: 100, type: "boost", stock:1, boost: "dmg", percent: true, qty:1},
    ]
 
    for (const items of itemCollections) {
        items.forEach(item => {
            if(item.type == "heal") item.stock = 8;
            if(item.type == "enchant") item.stock = 3;
            if(item.type == "boost") item.stock = 5;
            shopItems.push(structuredClone(item));
        });
    }

    const exclusiveAvail = Math.floor(Math.random() * (5 - 1 + 1))+1;
    for (let index = 1; index <= exclusiveAvail; index++) {
        const rand = Math.floor(Math.random() * shopExclusive.length);
        shopItems.push(shopExclusive[rand]);
        shopExclusive.splice(rand,1);
    }

    return shopItems;
}

function createShopBody(item){
    var label;
    if(item.type == "heal"){
        label = `${item.heal} Heal`
    }else if(item.type == "enchant"){
        label = `${item.effect}: +${item.amount}`
    }else if(item.type == "boost"){
        const labelMap = {
            hp: "MaxHP (Base)",
            dmg: "dmg (Base)",
            weapon: "dmg (Weapon)",
            armor: "hp (Armor)",
        }
        label = `+${item.amount} ${labelMap[item.boost]}`
    }

    return `<tr>
                <td class="text-start ${item.category ?? ''}" colspan="2">${item.name}</td>
                <td>${label}</td>
                <td class="gold fw-bold">${item.price}g</td>
                <td><button data-id="${item.id}" data-price="${item.price}" class="btn btn-success btn-sm buy">(${item.stock}) Buy</button></td>
            </tr>`;
}

export function buildShop(){
    const shopItems = generateShopItems();

    const healingItems = shopItems.filter(item => item.type == 'heal').map(createShopBody).join("");
    const enchantItems = shopItems.filter(item => item.type == 'enchant').map(createShopBody).join("");
    const boostItems = shopItems.filter(item => item.type == 'boost').map(createShopBody).join("");

    return [shopItems, {healing: healingItems, enchant: enchantItems, boost: boostItems}];
}

export function loadPurchasable(shopItems, playerGold){
    const buyButtons = document.getElementsByClassName("buy")
    Array.from(buyButtons).forEach(btn => {
        const itemId = btn.dataset.id;
        const item = shopItems.find(item => item.id == itemId);

        if(item.price > playerGold || item.stock <= 0){
            btn.classList.add("disabled")
            btn.classList.add("btn-danger")
            btn.classList.remove("btn-success");
            btn.innerHTML = `(${item.stock}) Buy`
        }
    })
}