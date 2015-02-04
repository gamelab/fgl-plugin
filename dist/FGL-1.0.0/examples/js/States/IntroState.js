var IntroState = new Kiwi.State('IntroState');

IntroState.create = function () {
    this.bg = new Kiwi.GameObjects.StaticImage(this, this.textures.start, 0, 0);
    this.addChild(this.bg);
    this.startButton = new Kiwi.GameObjects.Sprite(this, this.textures.startButton, 4, 603);
    this.addChild(this.startButton);
    this.startButton.visible = false;
    this.startButton.input.onDown.add(this.pressGame, this);
    this.startButton.input.onUp.add(this.clickGame, this);

    this.game.stage.color = "EEEEEE";

    // Implement premium content
    if( fgl.unlockEnabled ) {
        this.premiumUnlockButton = new Kiwi.GameObjects.Sprite( this, this.textures.premiumUnlock, 20, 312 );
        this.premiumActive = new Kiwi.GameObjects.Sprite( this, this.textures.premiumActive, 20, 312 );
        this.premiumUnlockButton.box.hitbox = new Kiwi.Geom.Rectangle(0,0, 268,268);
        this.premiumActive.box.hitbox = new Kiwi.Geom.Rectangle(0,0, 268,268);
        this.premiumUnlockButton.visible = false;
        this.premiumActive.visible = false;
        this.addChild( this.premiumUnlockButton );
        this.addChild( this.premiumActive );
        if( fgl.isPremium() ) {
            this.premiumActive.visible = true;
        }
        else {
            this.premiumUnlockButton.visible = true;
            this.premiumUnlockButton.input.onUp.add( this.attemptUnlock, this);
        }
    }

    // Implement more games
    if( fgl.crossPromotionEnabled ) {
        this.moreGamesButton = new Kiwi.GameObjects.Sprite( this, this.textures.moreGames, 310, 312 );
        this.moreGamesButton.box.hitbox = new Kiwi.Geom.Rectangle(0,0, 268,268);
        this.moreGamesButton.input.onUp.add( fgl.showMoreGames, this );
        this.addChild( this.moreGamesButton );
    }

    // Implement FGL sponsor branding
    this.sponsor = this.game.FGL.addBrandingLogo( this, 335, 15 );

    // Implement FGL interstitial advertising
    fgl.showAd();
}

//start button pressed
IntroState.pressGame = function () {
    this.startButton.visible = true;
}

//start game button
IntroState.clickGame = function () {
    this.startButton.input.onDown.remove(this.pressGame, this);
    this.startButton.input.onUp.remove(this.clickGame, this);
    game.states.switchState('PlayState');
}

IntroState.attemptUnlock = function() {
    
    var self = this;

    var unlockSucceeded = function() {
        if( fgl.isPremium() ) {
            // Disable unlock button
            self.premiumUnlockButton.visible = false;
            self.premiumUnlockButton.input.onUp.removeAll();
            // Display premium active button
            self.premiumActive.visible = true;
        }
    }

    var unlockFailed = function() {
        self.premiumActive.visible = false;
        self.premiumUnlockButton.visible = true;
    }

    fgl.inApp.initiateUnlockFunction( unlockSucceeded, unlockFailed );
}