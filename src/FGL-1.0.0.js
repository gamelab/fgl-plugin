/**
* The basic FGL integration Object. Contains name and version number. 
* 
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class FGL
*/
Kiwi.Plugins.FGL = {

    name: 'FGL',
    version: '1.0.0',

    minimumKiwiVersion: '1.0.0',

    pluginDependencies: [
    
    ]
};
//Register with Kiwi's built-in Plugin Manager 
Kiwi.PluginManager.register(Kiwi.Plugins.FGL);

//USING FGL SDK
/**
* A Kiwi Plugin that hooks into and can extend the FGL SDK.
*
* You will need the fgl.js file from https://www.fgl.com/other/html5opportunities/ to implement this correctly. Load the fgl.js BEFORE this plugin in your html document.
*
* You can call any inbuilt FGL function by targeting "fgl" or "this.game.FGL.fgl" anywhere within your game, and any function within this plugin by targeting "this.game.FGL".
*
* Consult the FGL SDK for the full list of FGL functions.
*
* @class FGL
* @extends Entity
* @namespace Kiwi.Plugins.FGL
* @constructor
*/


//Create reference for our game and fgl
Kiwi.Plugins.FGL.create = function (game) {
    game.FGL = new Kiwi.Plugins.FGL.mainFGL(game);
    return game.FGL;
}
Kiwi.Plugins.FGL.mainFGL = function (game) {
    this.game = game;
}
Kiwi.Plugins.FGL.mainFGL.prototype.boot = function () {
    
    fgl.create(this.game.stage.container);

    fgl.onReady(function () {
        
    });

    this.fgl = fgl;
}


/**
 * Add a Branding Logo button to the state. The button is a sprite with a 250*100 hitbox. If the user clicks this box, it calls "fgl.handleBrandingClick()".
 *
 * This method transfers the logo into a new 256*128 canvas. Kiwi.js WebGL rendering strongly recommends power-of-two texture sizes for device compatibility.
 *
 * The canvas is added to a texture atlas called "fglBrandingLogo". This atlas is not persistent and will have to be recreated if you switch states. Ordinarily this should not be a problem: it is created as part of the button.
 *
 * Because the Branding Logo is not always enabled in FGL games, this method may return "null". In this case, your game will not display a Branding Logo. Ensure that your content will display correctly in both cases.
 *
 * @method addBrandingLogo
 * @param state {Kiwi.State} The state within which the button is added.
 * @param x {number} X-coordinate
 * @param y {number} Y-coordinate
 * @return {Kiwi.GameObjects.Sprite} A sprite which can be clicked. Returns "null" if branding is not enabled.
 * @public
 */
Kiwi.Plugins.FGL.mainFGL.prototype.addBrandingLogo = function( state, x, y ) {
    if( fgl.brandingEnabled ) {
        // Create texture

        // Create canvas
        var fglCanvas = document.createElement("canvas");
        fglCanvas.width = 256;
        fglCanvas.height = 128;
        var fglCanvasContext = fglCanvas.getContext("2d");

        // Create atlas
        var genAtlas = new Kiwi.Textures.SingleImage("fglBrandingLogo", fglCanvas);
        state.textureLibrary.add(genAtlas);

        // Get logo source
        var fglBrandingLogo = fgl.getBrandingLogo();
        var fglSource = new Image();
        fglSource.crossOrigin = "anonymous";
        fglSource.src = fglBrandingLogo;
        fglSource.addEventListener("load", function(){
            // Draw logo source onto canvas
            fglCanvasContext.drawImage( fglSource, 0, 0, 250, 100 );
            genAtlas.dirty = true;
        });


        // Create sprite
        var brandSprite = new Kiwi.GameObjects.Sprite( state, state.textures.fglBrandingLogo, x, y, true );
        brandSprite.box.hitbox = new Kiwi.Geom.Rectangle( 0, 0, 250, 100 );
        state.addChild( brandSprite );

        // Allow sprite click
        brandSprite.input.onUp.add( fgl.handleBrandingClick, state );


        return( brandSprite );
    }
    return( null );
}