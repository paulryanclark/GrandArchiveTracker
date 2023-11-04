Array.prototype.asSelector = function() {
    return this.join('_')
};

function Player(number) {
    this.number = number;
    const stateJSON = localStorage.getItem("Player"+number);
    if(stateJSON) {
        const state = JSON.parse(stateJSON);
        this.damage = state.damage ? state.damage : 0;
        this.life = state.life ? state.life : 15;
        this.special = state.special ? state.special : 0;
    } else {
        this.damage = 0;
        this.life = 15;
        this.special = 0;
    }
};

Player.prototype.lifeLeftIdentifier = "LifeLeft";
Player.prototype.lifeIdentifier = "Life";
Player.prototype.specialIdentifier = "Special";
Player.prototype.damageIdentifier = "Damage";
Player.prototype.damageChangedIdentifier = "DamageChanged";
Player.prototype.incrementIdentifier = "Increment";
Player.prototype.decrementIdentifier = "Decrement";
Player.prototype.selectorIdentifier = "Selector";
Player.prototype.selectionContainerIdentifier = "Selection_Container";

Player.prototype.damageTakenTTL = 2000;
Player.prototype.lastDamageChangeDate = null;
Player.prototype.anchorDamageChange = null;

Player.prototype.resetDamageChange = function() {
    this.lastDamageChangeTime = null;
    this.anchorDamageChange = null;
    this.applyDamageChangeToDocument();    
};

Player.prototype.reset = function() {
    this.resetDamageChange();
    this.damage = 0;
    this.life = 15;
    this.special = 0;
    this.applyToDocument();
};

Player.prototype.lifeLeft = function() {
    return this.life - this.damage;
};

Player.prototype.onDamageChangedTimerTick = function() {
    if(this.lastDamageChangeDate !== null) {
        // If too much time has passed since last damage change, reset damage change
        if(Date.now() - this.lastDamageChangeDate > this.damageTakenTTL) {
            this.resetDamageChange();
        }
    }
};

Player.prototype.trackDamageChange = function() {
    if(this.anchorDamageChange === null) {
        this.anchorDamageChange = this.damage;
    }
    this.lastDamageChangeDate = Date.now();
};

Player.prototype.damageChanged = function() {
    if(this.anchorDamageChange !== null) {
        if(this.anchorDamageChange - this.damage > 0) {
            return "(+" + (this.anchorDamageChange - this.damage) + ")";
        }
        return "(" + (this.anchorDamageChange - this.damage) + ")";
    }
};

Player.prototype.applyDamageChangeToDocument = function() {
    const damageChangedElement = this.damageChangedElement();
    damageChangedElement.textContent = this.damageChanged();
};

Player.prototype.storeStateToLocalStorage = function() {
    const state = {
        damage: this.damage,
        life: this.life,
        special: this.special
    };
    localStorage.setItem("Player"+this.number, JSON.stringify(state));
};

Player.prototype.attachToDocument = function() {
    this.applyToDocument();
    this.createEventListeners();
    var self = this;
    setInterval(function() {
        self.onDamageChangedTimerTick();
    }, 1000)
};

Player.prototype.applyToDocument = function() {
    const lifeLeftElement = this.lifeLeftElement();
    lifeLeftElement.textContent = this.lifeLeft().toString();
    const lifeElement = this.lifeElement();
    lifeElement.textContent = this.life.toString();
    const specialElement = this.specialElement();
    specialElement.textContent = this.special.toString();
    const damageElement = this.damageElement();
    damageElement.textContent = this.damage.toString();
    this.applyDamageChangeToDocument();
    this.storeStateToLocalStorage();
    this.setLifeSelectionStyle();
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
    this.lifeSelectorElement().addEventListener('click', function() {
        self.onLifeSelector();
    });

    this.lifeSelectionElements().forEach((element) => {
        element.addEventListener('click', function() {
            self.life = Number(element.dataset.life);
            self.applyToDocument();
            const lifeSelectionContainerElement = self.lifeSelectionContainerElement();
            lifeSelectionContainerElement.style.display = "none";
        });
    });
};

Player.prototype.onLifeLeftIncrement = function() {
    if(this.damage > 0) {
        this.trackDamageChange();
        this.damage -= 1;
        this.applyToDocument();
    }
};

Player.prototype.onLifeLeftDecrement = function() {
    this.trackDamageChange();
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

Player.prototype.onLifeSelector = function() {
    const lifeSelectionContainerElement = this.lifeSelectionContainerElement();
    if (lifeSelectionContainerElement.style.display == "flex") {
        lifeSelectionContainerElement.style.display = "none";
    } else {
        lifeSelectionContainerElement.style.display = "flex";
    }
};

Player.prototype.setLifeSelectionStyle = function() {
    this.lifeSelectionElements().forEach((element) => {
        const elementLife = Number(element.dataset.life);
        if(elementLife == this.life) {
            element.style["text-decoration"] = "underline";
        } else {
            element.style["text-decoration"] = null;
        }
    });
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

Player.prototype.lifeSelectorElement = function() {
    const selector = [this.playerSelector(), this.lifeIdentifier, this.selectorIdentifier].asSelector();
    return document.querySelector(selector);
}; 

Player.prototype.lifeSelectionContainerElement = function() {
    const selector = [this.playerSelector(), this.lifeIdentifier, this.selectionContainerIdentifier].asSelector();
    return document.querySelector(selector);
}; 

Player.prototype.lifeSelectionElements = function() {
    const lifeSelectionContainerSelector = [this.playerSelector(), this.lifeIdentifier, this.selectionContainerIdentifier].asSelector();
    const lifeSelectionsSelector = lifeSelectionContainerSelector + " .life_selection";
    return document.querySelectorAll(lifeSelectionsSelector)
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

Player.prototype.damageChangedElement = function() {
    const selector = [this.playerSelector(), this.damageChangedIdentifier].asSelector();
    return document.querySelector(selector);
};

Player.prototype.damageElement = function() {
    const selector = [this.playerSelector(), this.damageIdentifier].asSelector();
    return document.querySelector(selector);
};

const player1 = new Player(1);
const player2 = new Player(2);

function onLoad() {
    player1.attachToDocument();
    player2.attachToDocument();
    attachToGlobalControls();
};

function attachToGlobalControls() {
    const resetElement = document.querySelector("#Player_Reset");
    resetElement.addEventListener('click', function() {
        onReset();
    });

    const resetConfirmElement = document.querySelector("#Player_Reset_Confirm");
    resetConfirmElement.addEventListener('click', function() {
        onResetConfirmed();
    });
};

function onReset() {
    const resetConfirmElement = document.querySelector("#Player_Reset_Confirm");
    if (resetConfirmElement.style.display == "block") {
        resetConfirmElement.style.display = "none";
    } else {
     resetConfirmElement.style.display = "block";
    }
};

function onResetConfirmed() {
    player1.reset();
    player2.reset();
    const resetConfirmElement = document.querySelector("#Player_Reset_Confirm");
    resetConfirmElement.style.display = "none";
};

window.onload = function () {
    onLoad();
};


