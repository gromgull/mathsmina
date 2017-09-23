
PIXI[ "default" ] = PIXI;

require('pixi-audio');
require('pixi-particles');


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

class Actor extends PIXI.Container {

  update (t, delta) {
  }
}

class SVGActor extends Actor {
  constructor(Svg, anim) {
    super();
    this.svg = new Svg();
    this.addChild(this.svg);
    this.anim = anim;
  }

  update(t, delta) {
    Object.keys(this.anim).forEach(k => {
      if (!this.svg[k]) return;
      Object.keys(this.anim[k]).forEach(prop => {
        this.svg[k][prop] = this.anim[k][prop](t, delta, this.svg[k][prop]);
      });
    });
  }
}



class Stars extends Actor {
  constructor(x,y) {
    super();
    this.emitter = new PIXI.particles.Emitter(
      this,
      [ PIXI.Texture.fromImage('images/star.png') ],
      {
		"alpha": {
		  "start": 1,
		  "end": 0.5
		},
		"scale": {
		  "start": 1,
		  "end": 0.3
		},
		"color": {
		  "start": "ffffff",
		  "end": "f5b830"
		},
		"speed": {
		  "start": 200,
		  "end": 100
		},
		"startRotation": {
		  "min": 0,
		  "max": 360
		},
		"rotationSpeed": {
		  "min": 0,
		  "max": 0
		},
		"lifetime": {
		  "min": 0.5,
		  "max": 0.5
		},
        "acceleration": {
		  "x":0,
		  "y": 400
		},
		"frequency": 0.008,
		"emitterLifetime": 0.31,
		"maxParticles": 1000,
		"pos": {
		  "x": x,
		  "y": y
		},
		"addAtBack": false,
		"spawnType": "circle",
		"spawnCircle": {
		  "x": 0,
		  "y": 0,
		  "r": 10
		}
      });
    this.emitter.playOnceAndDestroy();
  }

}

class Board extends PIXI.Container {

  constructor() {
    super();
    var board = this;
    var i;
    this.numbers = [];

    var style = {
      fontFamily: 'Encode Sans Expanded',
      fontSize: 32,
      fontWeight: 900,
      fill: 'white',
    };

    var onTextDown = function () { board.onTextDown(this); };
    var onTextUp = function () { board.onTextUp(this); };
    var onTextOver = function () { board.onTextOver(this); };
    var onTextOut = function () { board.onTextOut(this); };

    // width is 768
    // x margin is 34/34, grid is 700

    for ( i = 0 ; i<100 ; i++ ) {
      var t = new PIXI.Text(''+(1+i), style); //Object.assign({}, style));
      t.resolution = 2;
      t.num = i;
      this.addChild(t);
      this.numbers[i] = t;
      t.hitArea = new PIXI.Rectangle(-35, -35, 70, 70);
      t.x = 0+70*(1+i%10);
      t.y = 15+70*Math.floor(1+i/10);
      t.anchor.set(0.5,0.5);
      t.interactive = true;
      t.on('pointerdown', onTextDown )
        .on('pointerup', onTextUp)
        .on('pointerupoutside', onTextUp)
        .on('pointerover', onTextOver)
        .on('pointerout', onTextOut);
    }

    var gfx = new PIXI.Graphics();

    gfx.lineStyle(4, 0xffffff, 1);

    for ( i = 0 ; i < 11 ; i++) {
      var y = 50+70*i;
      gfx.moveTo(34, y);
      gfx.lineTo(734, y);
    }
    for ( i = 0 ; i < 11 ; i++) {
      var x = 34+70*i;
      gfx.moveTo(x, 50);
      gfx.lineTo(x, 750);
    }

    this.addChild(gfx);
  }


  onTextOut(t) {
  }
  onTextOver(t) {
  }
  onTextUp(t) {
  }
  onTextDown(t) {
  }


}

class Board1 extends Board {
  onTextOut(t) {
    t.style.fill='white';
  }
  onTextOver(t) {
    t.style.fill='red';
  }
  onTextUp(t) {
  }
  onTextDown(t) {
    game.stars(t.x, t.y);
    if (game.sounds.success) game.sounds.success.play();
  }
}


class Board2 extends Board {
  constructor() {
    super();
    this.numbers.forEach( n => n.style.fill = null );

    this.targets = Array.from(Array(100).keys());
    shuffle(this.targets);

    for (var i=0 ; i<10 ; i++) {
      var x = this.targets.pop();
      this.numbers[x].style.fill = 'white';
    }

    var style = {
      fontFamily: 'Encode Sans Expanded',
      fontSize: 32,
      fontWeight: 900,
      fill: 'yellow',
    };


    this.text = new PIXI.Text('Wo ist ?', style);
    this.text.x = 400;
    this.text.y = 780;
    this.text.anchor.set(0.5, 0.5);
    this.addChild(this.text);

    this.next();

  }

  next() {
    this.target = this.targets.pop();
    this.text.text = 'Wo ist '+(this.target+1)+'?';
  }

  onTextOut(t) {
    //this.style.fill='white';
  }
  onTextOver(t) {
    //this.style.fill='red';
  }
  onTextUp(t) {
  }
  onTextDown(t) {
    if (this.target == t.num) {
      t.style.fill='white';
      game.stars(t.x, t.y);
      if (game.sounds.success)
        game.sounds.success.play();
      this.target = this.targets.pop();
      this.next();
    } else {
      if (game.sounds.fail)
        game.sounds.fail.play();
    }

  }
}


class Game {


  load() {
    var sounds = [
      {name:"start", url:"./sounds/322929__rhodesmas__success-04.wav" },
      {name:"success", url:"./sounds/342751__rhodesmas__coins-purchase-3.wav" },
      {name:"alert", url:"./sounds/380265__rhodesmas__alert-02.wav" },
      {name:"fail", url:"./sounds/342756__rhodesmas__failure-01.wav" },
    ];
    PIXI.loader.add(sounds).load(() => {
      this.sounds = {};
      sounds.forEach( s => this.sounds[s.name] = PIXI.audioManager.getAudio(s.name) );
    });
  }

  constructor() {
    this.load();

    var targetWidth = 768;
    var targetHeight = 1024;


    var rendererResize = () => {
      var width = window.innerWidth,
          height = window.innerHeight,
          canvas = this.app.view;

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      this.app.renderer.resize(canvas.width, canvas.height);

      if (height / targetHeight > width / targetWidth) {
        this.main.scale.x = this.main.scale.y = height / targetHeight;
      } else {
        this.main.scale.x = this.main.scale.y = width / targetWidth;
      }

      this.main.x = ( width ) /2 - (1/window.devicePixelRatio)*this.main.width/2;
      this.main.y = (height ) /2 - (1/window.devicePixelRatio)*this.main.height/2;

      window.scrollTo(0, 0);
    };

    window.addEventListener('resize', rendererResize);
    window.addEventListener('deviceOrientation', rendererResize);

    this.app = new PIXI.Application({backgroundColor: 0x1099bb, antialias: true});

    document.body.appendChild(this.app.view);

    this.main = new PIXI.Container();

    this.app.stage.addChild(this.main);

    setTimeout(rendererResize, 200);

    this.main.addChild(new Board2());


    this.last_time = 0;

    this.actors = [];


    var fairy = require('pixi-svg-loader!../images/fairy.svg');
    this.add(new SVGActor(fairy, {
          lwing: {
            rotation: t => 0.3*Math.sin(t*0.01)
          },
          rwing: {
            rotation: t => 0.3*Math.cos(t*0.01)
          },
    }));

  }

  add(actor) {
    this.main.addChild(actor);
    this.actors.push(actor);
  }

  stars(x,y) {
    this.main.addChild(new Stars(x, y));
  }

  update(t) {

	// Update the next frame
	requestAnimationFrame((t) => this.update(t));

    if (!this.last_time) {
      this.last_time = t;
      return;
    }

    var delta = (t - this.last_time);
    this.last_time = t;

    this.actors.forEach(actor => actor.update(t, delta*0.001));
	// this.app.renderer.render(this.main);
  }

}
PIXI.loaders.Resource.setExtensionLoadType("wav", PIXI.loaders.Resource.LOAD_TYPE.XHR);

var game;
document.fonts.ready.then( () => setTimeout( () => {
  game = new Game();
  game.update();
}, 200));
