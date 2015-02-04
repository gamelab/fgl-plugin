
/**
* The containing Breakout blueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 
var game = new Kiwi.Game('content', 'NegativeNinety', null, { width: 600, height: 800, plugins: ['FGL', 'SaveGame'], renderer: Kiwi.RENDERER_WEBGL });
//Add all the States we are going to use.
game.states.addState(LoadingState);
game.states.addState(IntroState);
game.states.addState(PlayState);
game.states.addState(GameOverState);

//Switch to/use the Preloader state. 
game.states.switchState("LoadingState");