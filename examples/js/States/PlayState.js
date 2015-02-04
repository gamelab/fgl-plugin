/*
Game state. There is no FGL functionality on this page
*/

var PlayState = new Kiwi.State('PlayState');

PlayState.create = function () {
    this.bg = new Kiwi.GameObjects.StaticImage(this, this.textures.bg, 0, 0);
    this.addChild(this.bg);
    this.game.stage.color = "#fbfcec";

    this.playing = true;
    this.setMaps();
    this.level = 0;
    this.levelTot = 0;
    this.levelMax = 6;

    this.tileX = 20;
    this.tileY = 145;
    this.tileGap = 15;
    this.mw = 5;
    this.mh = 5;
    this.ts = 100;
    this.speedIncrement = 1;
    this.ps = 48;

    this.leftBounds = 5//this.tileX;
    this.upBounds = this.tileY - 15;
    this.rightBounds = this.game.stage.width-5;
    this.downBounds = this.tileY + (this.tileGap * 4) + (this.mh * this.ts) + 15;

    for (var j = 0; j < this.mw; j++) {
        this['tx' + j] = j * this.ts + this.tileX + (this.tileGap * j);
    }

    for (var i = 0; i < this.mh; i++) {
        this['ty' + i] = i * this.ts + this.tileY + (this.tileGap * i);
        for (var j = 0; j < this.mw; j++) {
            var t = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, j*this.ts + this.tileX + (this.tileGap*j), i*this.ts + this.tileY + (this.tileGap*i));
            t.name = 't' + i + '_' + j;
            this.addChild(t);
        }
    }

    var barX = 20;
    var barY = 750;
    var barW = 28;
    var barCount = 20;

    for (var i = 0; i < barCount; i++) {
        this['diff' + i] = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, (i * barW) + barX, barY);
        if (i == 0) {
            this['diff' + i].animation.switchTo(4);
        } else if (i == barCount - 1) {
            this['diff' + i].animation.switchTo(6);
        } else {
            this['diff' + i].animation.switchTo(5);
        }
        this.addChild(this['diff' + i]);
    }
    this.clicks = 0;

    this.clickMax = this.returnClickMax();

    var px = 3;
    var py = 3;
    this.player = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, px * this.ts + this.tileX + (this.tileGap * px) + 26, py * this.ts + this.tileY + (this.tileGap * py) + 26);
    this.addChild(this.player);
    this.player.animation.switchTo(3);

    this.dir = 1;
    this.speed = 2;

    this.preview();

    this.updateDifficultyBar();

    this.startTime = this.game.time.clock.elapsed();

    var currHighScore = 0;
    if (this.game.saveManager.localStorage.exists('negativeNinety')) {
        var currHighScore = this.game.saveManager.localStorage.getData('negativeNinety');
    } else {
        this.game.saveManager.localStorage.add('negativeNinety', 0, true);
        this.game.saveManager.localStorage.edit('negativeNinety', 0, true);
    }

    this.bestTF = new Kiwi.HUD.Widget.TextField(this.game, "Best: " + currHighScore, 230, 86);
    this.bestTF.style.color = "#FFFFFF";
    this.bestTF.style.webkitUserSelect = 'none';
    this.bestTF.style.MozUserSelect = 'none';
    this.bestTF.style.userSelect = 'none';
    this.bestTF.style.fontSize = "18px";
    this.bestTF.style.fontWeight = "bold";
    this.bestTF.style.fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif";

    this.game.huds.defaultHUD.addWidget(this.bestTF);

    this.timeTF = new Kiwi.HUD.Widget.TextField(this.game, "0", 360, 86);
    this.timeTF.style.color = "#FFFFFF";
    this.timeTF.style.webkitUserSelect = 'none';
    this.timeTF.style.MozUserSelect = 'none';
    this.timeTF.style.userSelect = 'none';
    this.timeTF.style.fontSize = "18px";
    this.timeTF.style.fontWeight = "bold";
    this.timeTF.style.fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif";
    this.game.huds.defaultHUD.addWidget(this.timeTF);

    this.diffTF = new Kiwi.HUD.Widget.TextField(this.game, "Difficulty: 0", 490, 86);
    this.diffTF.style.color = "#FFFFFF";
    this.diffTF.style.webkitUserSelect = 'none';
    this.diffTF.style.MozUserSelect = 'none';
    this.diffTF.style.userSelect = 'none';
    this.diffTF.style.fontSize = "18px";
    this.diffTF.style.fontWeight = "bold";
    this.diffTF.style.fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif"
    this.game.huds.defaultHUD.addWidget(this.diffTF);

    this.game.input.onDown.add(this.clickGame, this);
    
}

PlayState.setMaps = function(){
    this.maps = [
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1],
            [0, 1, 0, 0, 0]
        ],
        [
            [0, 1, 1, 0, 0],
            [0, 0, 0, 1, 0],
            [1, 1, 0, 1, 0],
            [0, 0, 1, 0, 1],
            [0, 1, 0, 0, 0]
        ],
        [
            [0, 1, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 1, 0, 1, 0],
            [0, 0, 1, 0, 1],
            [0, 1, 0, 1, 0]
        ]
    ]
}

PlayState.returnClickMax = function () {
    return this.level + 2;
    /*switch (this.level) {
        default:
            return 5;
    }*/
}

PlayState.clickGame = function () {
    this.rotatePlayer();
    this.clicks++;
    if (this.clicks >= this.clickMax) {
        this.increaseDifficulty();
    }
    this.updateDifficultyBar();
}

PlayState.rotatePlayer = function () {
    if (this.dir == 0) {
        this.dir = 3;
    } else {
        this.dir--;
    }
}

PlayState.updateDifficultyBar = function () {
    var count = 20;
    var prog = Math.floor((this.clicks / this.clickMax) * 20);
    for (var i = 0; i < 20; i++) {
        if (prog >= i) {
            this['diff' + i].visible = true;
        } else {
            this['diff' + i].visible = false;
        }
    }
    for (var i = 0; i < this.nextLevel.length; i++) {
        var t = this.getChildByName('t' + this.nextLevel[i][1] + '_' + this.nextLevel[i][0]);
        t.transform.scale = 0.2 + (this.clicks / this.clickMax);
        if (t.transform.scale > 1) t.transform.scale = 1;
    }
}

PlayState.increaseDifficulty = function () {
    this.level++;
    if (this.level >= this.levelMax) this.level = 0;
    this.levelTot++;
    this.diffTF.text = 'Difficulty: ' + this.levelTot;
    this.clicks = 0;
    this.clickMax = this.returnClickMax();

    if (this.level == 0) {
        this.speed += this.speedIncrement;
        this.clearLevel();
    } else {
        //turn previews into blocks!
        this.buildLevel();
    }

    if (this.level < this.levelMax - 1) {
        this.preview();
    } else {
        this.nextLevel.length = 0;
    }
}

PlayState.preview = function () {
    this.nextLevel = [];
    this.nextLength = 4;
    this.selectNextBoxes();
}

PlayState.selectNextBoxes = function () {
    this.selectBox();
    if (this.nextLevel.length < this.nextLength) {
        this.selectNextBoxes();
    }
}

PlayState.selectBox = function () {
    var rx = Math.floor(Math.random() * this.mw);
    var ry = Math.floor(Math.random() * this.mh);
    var t = this.getChildByName('t' + ry + '_' + rx);
    if (t.animation.frameIndex == 1) return;
    if (this.player.x + this.player.width > t.x) {
        if (this.player.x < t.x + t.width) {
            if (this.player.y + this.player.height > t.y) {
                if (this.player.y < t.y + t.height) {
                    return;
                }
            }
        }
    }
    //if already in array
    for (var i = 0; i < this.nextLength.length; i++) {
        var cell = this.nextLevel[i];
        if (rx == cell[0] && ry == cell[1]) return;
    }

    t.animation.switchTo(2);
    this.nextLevel.push([rx, ry]);
}

PlayState.update = function () {
    Kiwi.State.prototype.update.call(this);

    if (!this.playing) return;

    this.timeTF.text = Math.floor((this.game.time.clock.elapsed() - this.startTime)*10)/10;

    //move player
    for (var i = 0; i < this.speed; i++) {
        switch (this.dir) {
            case 0:
                this.player.y--;
                if (this.solid(this.player.x, this.player.y) || this.solid(this.player.x + this.player.width, this.player.y)) {
                    this.gameOver();
                }
                break;
            case 1:
                this.player.x++;
                if (this.solid(this.player.x + this.player.width, this.player.y) || this.solid(this.player.x + this.player.width, this.player.y + this.player.height)) {
                    this.gameOver();
                }
                break;
            case 2:
                this.player.y++;
                if (this.solid(this.player.x, this.player.y + this.player.height) || this.solid(this.player.x + this.player.width, this.player.y + this.player.height)) {
                    this.gameOver();
                }
                break;
            case 3:
                this.player.x--;
                if (this.solid(this.player.x, this.player.y) || this.solid(this.player.x, this.player.y + this.player.height)) {
                    this.gameOver();
                }
                break;
        }
    }

}

PlayState.solid = function (px, py) {
    var tx = this.returnTileX(px);
    var ty = this.returnTileY(py);
    var t = this.getChildByName('t' + ty + '_' + tx);
    if (t != undefined) {
        if (t.animation.frameIndex == 1) {
            console.log(tx, ty, t)
            return true;
        }
    }
    if (px < this.leftBounds) return true;
    if (py < this.upBounds) return true;
    if (px > this.rightBounds) return true;
    if (py > this.downBounds) return true;
    return false;
}

PlayState.returnTileX = function (px) {
    for (var j = 0; j < this.mw; j++) {
        if (px >= this['tx' + j]) {
            if (px <= this['tx' + j] + this.ts) {
                //console.log('within tile x: ',px, this['tx'+j], j)
                return j;
            }
        }
    }
    return -1;
}

PlayState.returnTileY = function (py) {
    for (var j = 0; j < this.mh; j++) {
        if (py >= this['ty' + j]) {
            if (py <= this['ty' + j] + this.ts) {
                //console.log('within tile: ', py, this['ty' + j], j)
                return j;
            }
        }
    }
    return -1;
}

PlayState.buildLevel = function () {
    //turn preview into blocks
    for (var i = 0; i < this.nextLevel.length; i++) {
        var t = this.getChildByName('t' + this.nextLevel[i][1] + '_' + this.nextLevel[i][0]);
        t.transform.scale = 1;
        t.animation.switchTo(1);
    }
}

PlayState.clearLevel = function () {
    for (var i = 0; i < this.mh; i++) {
        for (var j = 0; j < this.mw; j++) {
            var t = this.getChildByName('t' + i + '_' + j);
            t.animation.switchTo(0);
        }
    }
}

PlayState.gameOver = function () {
    var myScore = this.timeTF.text;

    this.game.huds.defaultHUD.removeWidget(this.bestTF);
    this.game.huds.defaultHUD.removeWidget(this.timeTF);
    this.game.huds.defaultHUD.removeWidget(this.diffTF);

    this.playing = false;
    this.game.input.onDown.remove(this.clickGame, this);
    game.states.switchState('GameOverState', GameOverState, null, { score: myScore });
}