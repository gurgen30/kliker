/* ================== СОСТОЯНИЕ ИГРЫ ================== */

let gold = 0;

let enemy = {
  level: 1,
  hp: 100,
  maxHp: 100
};

let clickDamage = 1;

let heroes = [
  { name: "Alexa", level: 0, baseCost: 100, damage: 2 },
  { name: "Natalia", level: 0, baseCost: 150, damage: 4 },
  { name: "Mercedes", level: 0, baseCost: 250, damage: 8 }
];

let upgrades = [
  { name: "Меч", level: 0, baseCost: 50, power: 1 },
  { name: "Топор", level: 0, baseCost: 100, power: 2 },
  { name: "Посох", level: 0, baseCost: 200, power: 5 }
];

/* ================== СОХРАНЕНИЕ ================== */

function save() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("enemy", JSON.stringify(enemy));
  localStorage.setItem("heroes", JSON.stringify(heroes));
}

function load() {
  const g = localStorage.getItem("gold");
  const e = localStorage.getItem("enemy");
  const h = localStorage.getItem("heroes");

  if (g !== null) gold = Number(g);
  if (e) enemy = JSON.parse(e);
  if (h) heroes = JSON.parse(h);

  upgrades = JSON.parse(localStorage.getItem("upgrades")) || upgrades;
}
/* ===== ФИКС СТАРЫХ СОХРАНЕНИЙ (NaN) ===== */

function fixHeroes() {
  heroes.forEach(hero => {
    if (typeof hero.baseCost !== "number" || isNaN(hero.baseCost)) {
      hero.baseCost = 100;
    }
    if (typeof hero.level !== "number" || isNaN(hero.level)) {
      hero.level = 0;
    }
  });
}
/* ================== ЛОГИКА ================== */

function getHeroCost(hero) {
  return Math.floor(hero.baseCost * Math.pow(1.25, hero.level));
}

function getTotalDamage() {
  let dmg = clickDamage;
  heroes.forEach(h => {
    dmg += h.level * h.damage;
  });
  return dmg;
}

function hitEnemy() {
  enemy.hp -= getTotalDamage();

  if (enemy.hp <= 0) {
    killEnemy();
  }

  updateUI();
  save();
}

function killEnemy() {
  gold += Math.floor(enemy.maxHp / 10);

  enemy.level++;
  enemy.maxHp = Math.floor(enemy.maxHp * 1.3);
  enemy.hp = enemy.maxHp;
}

/* ================== ПОКУПКА ГЕРОЕВ ================== */

function buyHero(index) {
  const hero = heroes[index];
  const cost = getHeroCost(hero);

  if (gold >= cost) {
    gold -= cost;
    hero.level++;
    updateUI();
    save();
  }
}

/* ================== UI ================== */

function updateUI() {
  document.getElementById("gold").textContent = gold;
  document.getElementById("dragonLevel").textContent = enemy.level;

  document.getElementById("hp").textContent = enemy.hp;
  document.getElementById("maxHp").textContent = enemy.maxHp;

  const hpFill = document.getElementById("hpFill");
  hpFill.style.width = (enemy.hp / enemy.maxHp * 100) + "%";

  const heroesDiv = document.getElementById("heroes");
  heroesDiv.innerHTML = "";

  heroes.forEach((hero, i) => {
    const cost = getHeroCost(hero);

    const div = document.createElement("div");
    div.className = "hero-card";
    div.innerHTML = `
      <b>${hero.name}</b><br>
      Уровень: ${hero.level}<br>
      Цена: ${cost} 💰<br>
      <button onclick="buyHero(${i})">HIRE</button>
    `;
    heroesDiv.appendChild(div);
  });
}

/* ================== ИНИЦИАЛИЗАЦИЯ ================== */

load();
fixHeroes();
updateUI();

/* ================== КЛИК ПО ДРАКОНУ ================== */

document.getElementById("enemy").addEventListener("click", hitEnemy);
