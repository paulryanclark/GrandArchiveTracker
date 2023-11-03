Array.prototype.asSelector = function() {
    return this.join('_')
};

function Player(number, damage, life, special) {
    this.number = number;
    this.damage = damage;
    this.life = life;
    this.special = special;
};

Player.prototype.lifeLeftIdentifier = "LifeLeft";
Player.prototype.lifeIdentifier = "Life";
Player.prototype.specialIdentifier = "Special";
Player.prototype.incrementIdentifier = "Increment";
Player.prototype.decrementIdentifier = "Decrement";

Player.prototype.lifeLeft = function() {
    return this.life - this.damage;
};

Player.prototype.attachToDocument = function() {
    this.applyToDocument();
    this.createEventListeners();
};

Player.prototype.applyToDocument = function() {
    const lifeLeftElement = this.lifeLeftElement();
    lifeLeftElement.textContent = this.lifeLeft().toString();
    const lifeElement = this.lifeElement();
    lifeElement.textContent = this.life.toString();
    const specialElement = this.specialElement();
    specialElement.textContent = this.special.toString();
};

Player.prototype.createEventListeners = function() {
    var self = this;
    this.lifeLeftIncrementElement().addEventListener('click', function() {
        self.onLifeLeftIncrement();
    });
    this.lifeLeftDecrementElement().addEventListener('click', function() {
        self.onLifeLeftDecrement();
    });
    this.lifeDecrementElement().addEventListener('click', function() {
        self.onLifeDecrement();
    });
    this.lifeIncrementElement().addEventListener('click', function() {
        self.onLifeIncrement();
    });
    this.specialDecrementElement().addEventListener('click', function() { 
        self.onSpecialDecrement();
    });
    this.specialIncrementElement().addEventListener('click', function() {
        self.onSpecialIncrement();
    });
};

Player.prototype.onLifeLeftIncrement = function() {
    if(this.damage > 0) {
        this.damage -= 1;
        this.applyToDocument();
    }
};

Player.prototype.onLifeLeftDecrement = function() {
    this.damage += 1;
    this.applyToDocument();
};

Player.prototype.onLifeIncrement = function() {
    this.life += 1;
    this.applyToDocument();
};

Player.prototype.onLifeDecrement = function() {
    if(this.life > 0) {
        this.life -= 1;
        this.applyToDocument();
    }
};

Player.prototype.onSpecialIncrement = function() {
    this.special += 1;
    this.applyToDocument();
};

Player.prototype.onSpecialDecrement = function() {
    if(this.special > 0) {
        this.special -= 1;
        this.applyToDocument();
    }
};

Player.prototype.playerSelector = function() {
    return "#Player" + this.number;
};

Player.prototype.lifeLeftElement = function() {
    const selector = [this.playerSelector(), this.lifeLeftIdentifier].asSelector();
    console.log(selector)
    return document.querySelector(selector);
};

Player.prototype.lifeLeftIncrementElement = function() {
    const selector = [this.playerSelector(), this.lifeLeftIdentifier, this.incrementIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.lifeLeftDecrementElement = function() {
    const selector = [this.playerSelector(), this.lifeLeftIdentifier, this.decrementIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.lifeElement = function() {
    const selector = [this.playerSelector(), this.lifeIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.lifeIncrementElement = function() {
    const selector = [this.playerSelector(), this.lifeIdentifier, this.incrementIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.lifeDecrementElement = function() {
    const selector = [this.playerSelector(), this.lifeIdentifier, this.decrementIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.specialElement = function() {
    const selector = [this.playerSelector(), this.specialIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.specialIncrementElement = function() {
    const selector = [this.playerSelector(), this.specialIdentifier, this.incrementIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.specialDecrementElement = function() {
    const selector = [this.playerSelector(), this.specialIdentifier, this.decrementIdentifier].asSelector();
    return document.querySelector(selector);
};

const player1 = new Player(1, 0, 15, 0);
const player2 = new Player(2, 0, 15, 0);

function onLoad() {
    player1.attachToDocument()
    player2.attachToDocument()
};

window.onload = function () {
    onLoad();
};


