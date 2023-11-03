function Player(number, damage, life, special) {
    this.number = number;
    this.damage = damage;
    this.life = life;
    this.special = special;
};

Player.prototype.incrementDamange = function () {
    this.damage += 1;
};

Player.prototype.applyPlayerModel = function() {
    const playerSelector = "#Player" + this.number;
    const damageElement = document.querySelector(playerSelector + "_Damage");
    damageElement.textContent = this.damage.toString();
    const lifeElement = document.querySelector(playerSelector + "_Life");
    lifeElement.textContent = this.life.toString();
};

const player1 = new Player(1, 0, 15, 0);
const player2 = new Player(2, 0, 15, 0);

function applyDataModel() {
    player1.applyPlayerModel()
    player2.applyPlayerModel()
};

function applyPlayerModel(playerNumber) {
    const player = dataModel.player[playerNumber];
    const playerSelector = "#Player" + playerNumber;

    const damageElement = document.querySelector(playerSelector + "_Damage");
    damageElement.textContent = player.damage.toString();
    const lifeElement = document.querySelector(playerSelector + "_Life");
    lifeElement.textContent = player.life.toString();
};

function createEventListeners() {
    self.createPlayerEventListener(1);
    self.createPlayerEventListener(2);
};

function createPlayerEventListener(playerNumber) {

};

window.onload = function () {
    applyDataModel();
};


