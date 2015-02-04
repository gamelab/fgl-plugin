/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint there is only a single "BreakOut" section we are going to load in all of 
* the assets at this point.
*
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobbing kiwi/html5 logo and everything. We need to extend the KiwiLoadingScreen State.  
* The KiwiLoadingScreen State is an extentsion of a normal State but it has some custom code to handle the loading/bobbing/fading of all the items, so if you override a method (like the preload) for example just make sure you call the super method.
*/
var LoadingState = new KiwiLoadingScreen('LoadingState', 'IntroState', 'assets/img/loading/', { width: 600, height: 800 } );

/**
* This preload method is responsible for preloading all your in game assets.
* @method preload
* @private
*/
LoadingState.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    this.addTextureAtlas('tiles', 'assets/img/tiles.png', 'tileJSON', 'assets/tiles.json');
    this.addImage('bg', 'assets/img/bg.png');
    this.addImage('start', 'assets/img/start.png');
    this.addImage('end', 'assets/img/end.png');
    this.addImage('end2', 'assets/img/end2.png');
    this.addImage('moreGames', 'assets/img/moreGames.png');
    this.addImage('premiumActive', 'assets/img/premiumActive.png');
    this.addImage('premiumUnlock', 'assets/img/premiumUnlock.png');
    this.addSpriteSheet('startButton', 'assets/img/start-clicked.png', 591, 140);
    this.game.stage.canvas.style.cssText = "idtkscale:ScaleAspectFit";
};