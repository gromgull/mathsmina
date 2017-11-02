import { Actor } from './actor';
import { game } from './game';

import { Board2, Board3 } from './numbers';
import { Glade } from './glade';

import { ClockGame } from './clock';

require('pixi-sound');

var WebFont = require('webfontloader');


class Loader extends Actor {

  constructor(mainthing) {
    super();

    var style = {
      fontFamily: 'Encode Sans Expanded',
      fontSize: 32,
      fontWeight: 900,
      fill: 'yellow',
    };


    this.text = new PIXI.Text('Loading', style);
    this.text.x = 384;
    this.text.y = 480;
    this.text.anchor.set(0.5, 0.5);
    this.addChild(this.text);

    const loader = PIXI.loader;

    loader.add("snd_start", "./sounds/322929__rhodesmas__success-04.m4a" ).
      add("snd_win", "./sounds/320653__rhodesmas__success-01.m4a" ).
      add("snd_success", "./sounds/342751__rhodesmas__coins-purchase-3.m4a" ).
      add("snd_alert", "./sounds/380265__rhodesmas__alert-02.m4a" ).
      add("snd_fail", "./sounds/342756__rhodesmas__failure-01.m4a" ).
      add("snd_haha", "./sounds/219110__zyrytsounds__evil-laugh.m4a" ).
      add("snd_horse", "./sounds/59569__3bagbrew__horse.m4a" ).
      add("grass", "images/grass.png").
      add("glade", "images/glade.png").
      add("back", "images/back.png").
      add("mode1", "images/mode1.png").
      add("mode2", "images/mode2.png").
      add("mode3", "images/mode3.png").
      add("mode_glade", "images/mode_glade.png").
      add("logo", "images/logo.png")
      ;


    WebFont.load({
      google: {
        families: ['Encode Sans Expanded:600,900']
      },
      active: start,
    });

    loader.onProgress.add((a) => {
      this.text.text = 'Loading '+a.progress.toFixed(0)+'%';
    });
    function start() {
      loader.load((loader, resources) => {
        game.resources = resources;
        menu = new mainthing();
        game.play(menu);
      });
    }
  }


}

class Menu extends Actor {


  constructor() {
    super();

    this.logo = new PIXI.Sprite(game.resources.logo.texture);
    this.logo.x = 384;
    this.logo.y = 180;
    this.logo.anchor.set(0.5, 0.5);

    this.addChild(this.logo);

    var grass = new PIXI.Sprite(game.resources.grass.texture);
    grass.y = 920;
    this.addChild(grass);


    var btn1 = new PIXI.Sprite(game.resources.mode1.texture);
    btn1.x = 384-16-128;
    btn1.y = 450;
    btn1.anchor.set(0.5, 0.5);

    btn1.interactive = true;
    btn1.on('pointerdown', () => game.play(new Board2()) );

    this.addChild(btn1);

    var btn2 = new PIXI.Sprite(game.resources.mode2.texture);
    btn2.x = 384+16+128;
    btn2.y = 450;
    btn2.anchor.set(0.5, 0.5);

    btn2.interactive = true;
    btn2.on('pointerdown', () => game.play(new Board3()) );

    this.addChild(btn2);

    var btn3 = new PIXI.Sprite(game.resources.mode3.texture);
    btn3.x = 384;
    btn3.y = 450;
    btn3.anchor.set(0.5, 0.5);

    btn3.interactive = true;
    btn3.on('pointerdown', () => game.play(new ClockGame()) );

    this.addChild(btn3);

    var gladebtn = new PIXI.Sprite(game.resources.mode_glade.texture);
    gladebtn.x = 384;
    gladebtn.y = 650;
    gladebtn.anchor.set(0.5, 0.5);

    gladebtn.interactive = true;
    gladebtn.on('pointerdown', () => game.play(new Glade(this)) );

    this.addChild(gladebtn);

  }

  update(t) {
    this.logo.y = 180 + Math.sin(t*0.001)*10;
    this.logo.rotation = Math.sin(t*0.0005)/20;
  }
}



if ('unicorns' in localStorage && localStorage.unicorns[0] == '0') localStorage.unicorns = 4; // fix a bug where we did string-concat +1

var menu = null;
game.update();


//game.play(new Board3());
game.play(new Loader(Menu));
