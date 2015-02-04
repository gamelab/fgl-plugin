FGL SDK
=======================================

Name: FGL SDK

Version: 1.0.0

Type: Marketplace Plugin

Author: Kiwi.js Team

Website: www.kiwijs.org

KiwiJS last version tested: 1.1.0

## Version Release Notes

1.0.0

- Initial build using -90 game as an example.

## Description:

The FGL SDK plugin lets you manage, use and extend the FGL SDK.
If you have any problems then feel free to contact us via the http://www.kiwijs.org/help

## Dependencies

- Kiwi.js version 1.0.0 or greater

## How to Include: 

First Step:
- Copy either the `FGL-1.0.0.js` or the `FGL-1.0.0.min.js` file into your project directory. We recommend that you save the files under a plugin directory that lives inside of your project directory so that you can easily manage all of the plugins but that is not required.

Second Step:
- Download the FGL SDK from `https://www.fgl.com/other/html5opportunities/` and copy the `fgl.js` file into your project directory.

Third Step:
- Link in the JavaScript file `fgl.js` into your HTML file. Make sure you link it in before the link to the main Kiwi.js file.
- Link in the JavaScript file `FGL-1.0.0.js` (or the min version) into your HTML file. Make sure you link it in underneath the link to the main Kiwi.js file AND underneath the Cocoon files if you are using Cocoon.

You're ready to roll!

## How to use

Consult the FGL SDK documentation for a full list of FGL commands. These may all be activated as usual, e.g. `fgl.showAd()` will display an advertisement.

To quickly create a Branding Logo, call `game.FGL.addBrandingLogo( state, x, y )` (where game is the Game, state is the current State, and x and y are the coordinates for the logo). This will create a game object, allowing you to integrate branded content directly into your scenes.

Read the API docs found in the "docs" folder of this repository for more information.

We have created a full-featured demo of proper FGL integration. View the source code to see how it's done.

Any questions, feel free to ask!

## Technical Addenda

When using `FGL.addBrandingLogo()`, it will actually redraw the image into a new buffer. This is necessary because Kiwi.js prefers to use WebGL rendering, and the Branding Logo may not be of a resolution compatible with all WebGL devices. We transfer it into a POT (power-of-two) texture to guarantee compatibility. Be aware that this means the texture itself has invisible edges. The auto-created branding sprite has its hitbox adjusted automatically. If you want to reuse the texture on other game objects, you will have to adjust the hitboxes yourself.