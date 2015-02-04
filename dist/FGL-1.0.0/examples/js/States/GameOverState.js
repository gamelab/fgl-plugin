var GameOverState = new Kiwi.State('GameOverState');

/**
* If cross promotion is enabled, add more games button. Also either submit new high score, or play ad (unless premium)
* @method create
* @param score {number}
* @public
*/
GameOverState.create = function (score) {
    if (fgl.crossPromotionEnabled) {
        this.bg = new Kiwi.GameObjects.StaticImage(this, this.textures.end2, 0, 0);
        this.addChild(this.bg);

        this.shareBtn = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 121, 436);
        this.addChild(this.shareBtn);
        this.shareBtn.visible = false;
        this.shareBtn.animation.switchTo(7);
        this.shareBtn.input.onUp.add(this.shareGame, this);

        this.playBtn = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 121, 544);
        this.addChild(this.playBtn);
        this.playBtn.animation.switchTo(7);
        this.playBtn.visible = false;
        this.playBtn.input.onUp.add(this.clickGame, this);

        this.moreBtn = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 121, 660);
        this.addChild(this.moreBtn);
        this.moreBtn.animation.switchTo(7);
        this.moreBtn.visible = false;
        this.moreBtn.input.onUp.add(this.clickMore, this);

        this.moreTF = new Kiwi.HUD.Widget.TextField(this.game, 'More Games', 0, 685);
        this.moreTF.style.width = '100%';
        this.moreTF.style.color = "#FFFFFF";
        this.moreTF.style.fontSize = "40px";
        this.moreTF.style.fontWeight = "bold";
        this.moreTF.style.textAlign = "center";
        this.moreTF.style.fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif";
        this.game.huds.defaultHUD.addWidget(this.moreTF);

    } else {
        this.bg = new Kiwi.GameObjects.StaticImage(this, this.textures.end, 0, 0);
        this.addChild(this.bg);
        this.shareBtn = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 121, 456);
        this.addChild(this.shareBtn);
        this.shareBtn.visible = false;
        this.shareBtn.animation.switchTo(7);
        this.shareBtn.input.onUp.add(this.shareGame, this);

        this.playBtn = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 121, 594);
        this.addChild(this.playBtn);
        this.playBtn.animation.switchTo(7);
        this.playBtn.visible = false;
        this.playBtn.input.onUp.add(this.clickGame, this);
    }

    this.currHighScore = this.game.saveManager.localStorage.getData('negativeNinety');
    if (score > this.currHighScore) {
        this.currHighScore = score;
        this.game.saveManager.localStorage.edit('negativeNinety', score, true);
    }

    this.scoreTF = new Kiwi.HUD.Widget.TextField(this.game, score, 0, 160);
    this.scoreTF.style.width = '100%';
    this.scoreTF.style.color = "#FFFFFF";
    this.scoreTF.style.fontSize = "40px";
    this.scoreTF.style.fontWeight = "bold";
    this.scoreTF.style.textAlign = "center";
    this.scoreTF.style.fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif";
    this.game.huds.defaultHUD.addWidget(this.scoreTF);

    this.bestTF = new Kiwi.HUD.Widget.TextField(this.game, this.currHighScore, 0, 340);
    this.bestTF.style.width = '100%';
    this.bestTF.style.color = "#FFFFFF";
    this.bestTF.style.fontSize = "40px";
    this.bestTF.style.fontWeight = "bold";
    this.bestTF.style.textAlign = "center";
    this.bestTF.style.fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif";
    this.game.huds.defaultHUD.addWidget(this.bestTF);

    this.submitHigh(score);
}

/**
* Post to Twitter
* @method shareGame
* @public
*/
GameOverState.shareGame = function () {
    var myText = "I scored " + this.currHighScore + " points at -90, can you last longer? %20%23negativeNinety via @kiwijsengine"
    var myURL = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fkiwijs.org%2F2048%2F&text="+myText
    window.open(myURL);
}

/**
* Play again
* @method clickGame
* @public
*/
GameOverState.clickGame = function () {
    this.game.huds.defaultHUD.removeWidget(this.scoreTF);
    this.game.huds.defaultHUD.removeWidget(this.bestTF);
    if (this.moreTF != undefined) this.game.huds.defaultHUD.removeWidget(this.moreTF);
    game.states.switchState('PlayState');
}

/**
* Use FGL cross promotion
* @method clickMore
* @public
*/
GameOverState.clickMore = function () {
    fgl.showMoreGames();
}

/**
* An example of an extended custom function.
* Here, in free mode, the leaderboard is automatically updated.
* @method submitHigh
* @param score {number}
* @public
*/
GameOverState.submitHigh = function (score) {
    fgl.submitScore( score );
    console.log("HIGH SUBMISSION");
}