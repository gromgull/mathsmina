
require('pixi-sound');

var WebFont = require('webfontloader');

var particles = require('./particles.js');
var utils = require('./utils.js');
var actor = require('./actor.js');

WebFont.load({
  google: {
    families: ['Encode Sans Expanded:900']
  }
});


class Board extends actor.Actor {

  constructor() {
    super();

    this.actors = [];
    var board = this;
    var i;
    this.numbers = [];

    this.state = 'loading';

    var style = {
      fontFamily: 'Encode Sans Expanded',
      fontSize: 32,
      fontWeight: 900,
      fill: 'white',
    };

    var onTextDown = function () { board.state == 'playing' && board.onTextDown(this); };
    var onTextUp = function () { board.state == 'playing' && board.onTextUp(this); };
    var onTextOver = function () { board.state == 'playing' && board.onTextOver(this); };
    var onTextOut = function () { board.state == 'playing' && board.onTextOut(this); };

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

    var grass = new PIXI.Sprite(game.resources.grass.texture);
    grass.y = 920;
    this.addChild(grass);


    var evilSVG = require('pixi-svg-loader!../images/evil.svg');
    this.evil = new actor.SVGActor(evilSVG, {
      idle: {
        head: {
          rotation: ({t}) => 0.1*Math.sin(t*0.001)
        },
        lowerbody: {
          rotation: ({t}) => 0.1*Math.sin(t*0.0012),
          y: ({t, original}) => original+10*Math.sin(t*0.003)
        }
      },
      jump: {
        _duration: 500,
        _next: 'idle',
        rotation: ({state_t}) => 0.2*Math.sin(0.001*state_t*5*Math.PI/0.5),
        position: ({state_t, delta, current, original}) => new PIXI.Point(current.x+delta*60/0.5,
                                                                          original.y-10*Math.sin(10*Math.PI*state_t/500))
      }
    }, {
      scale: new PIXI.Point(0.4, 0.4),
      y: 880,
      x: 50,
    });
    this.addChild(this.evil);
    this.actors.push(this.evil);

    var fairySVG = require('pixi-svg-loader!../images/fairy.svg');
    this.fairy = new actor.SVGActor(fairySVG, {
      idle: {
        lwing: {
          rotation: ({t}) => 0.3*Math.sin(t*0.01)
        },
        rwing: {
          rotation: ({t}) => 0.3*Math.cos(t*0.01)
        },
      },
      jump: {
        _duration: 500,
        _next: 'idle',
        rotation: ({state_t}) => 0.001*state_t*2*Math.PI/0.5,
        position: ({state_t, delta, current, original}) => new PIXI.Point(current.x+delta*60/0.5,
                                                                          original.y-100*Math.sin(Math.PI*state_t/500))
      },

    }, {
      scale: new PIXI.Point(-0.4, 0.4),
      y: 880,
      x: 80,
    });

    this.addChild(this.fairy);
    this.actors.push(this.fairy);

    var unicornSVG = require('pixi-svg-loader!../images/unicorn.svg');
    this.unicorn = new actor.SVGActor(unicornSVG, {
      idle: {
        tail: {
          rotation: ({t}) => 0.3*Math.sin(t*0.001)
        },
        head: {
          rotation: ({t}) => 0.2*Math.sin(t*0.0003)
        }
      }
    });
    this.unicorn.scale.x = 0.4;
    this.unicorn.scale.y = 0.4;
    this.unicorn.y = 880;
    this.unicorn.x = 768-this.unicorn.width/2;
    this.addChild(this.unicorn);
    this.actors.push(this.unicorn);

    this.reset();
  }

  reset() {
    this.fairy.position.x = 80;
    this.evil.x = 50;
    if (game.resources.snd_start)
      game.resources.snd_start.sound.play();
    this.state = 'playing';
  }

  update() {
    if (this.state != 'playing') return;
    if (this.evil.x > this.unicorn.x-this.unicorn.width/2) this.fail();
    if (this.fairy.x > this.unicorn.x-this.unicorn.width/2) this.win();
  }

  correct() {
    if (game.resources.snd_success)
      game.resources.snd_success.sound.play();
    this.fairy.setState('jump');
    this.state = 'anim';
    setTimeout(() => this.state = 'playing', 500);
  }
  wrong() {
    if (game.resources.snd_fail)
      game.resources.snd_fail.sound.play();
    this.evil.setState('jump');
    this.state = 'anim';
    setTimeout(() => this.state = 'playing', 500);
  }



  win() {
    this.state = 'finished';
    if (game.resources.snd_win)
      game.resources.snd_win.sound.play();
    if (game.resources.snd_horse)
      game.resources.snd_horse.sound.play();

    if (!localStorage.unicorns) localStorage.unicorns = 0;
    localStorage.unicorns = parseInt(localStorage.unicorns,10) + 1;

    game.hearts(768/2, 800/3);
    setTimeout(() => game.play(menu), 5000);
  }

  fail() {
    this.state = 'finished';
    if (game.resources.snd_alert)
      game.resources.snd_alert.sound.play();
    if (game.resources.snd_haha)
      game.resources.snd_haha.sound.play();

    game.rain();
    setTimeout(() => this.reset(), 7000);
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
    this.success();
  }
}


class Board2 extends Board {
  constructor() {
    super();

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

  reset() {
    super.reset();
    this.numbers.forEach( n => n.style.fill = null );

    this.targets = Array.from(Array(100).keys());
    utils.shuffle(this.targets);

    for (var i=0 ; i<10 ; i++) {
      var x = this.targets.pop();
      this.numbers[x].style.fill = 'white';
    }
    if (this.text) this.next(); // initially not created yet!

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
      this.correct();
      this.next();
    } else {
      this.wrong();
    }

  }
}


class Board3 extends Board2 {
  constructor() {
    super();

    this.Y = utils.choice([-10,-9,-8,-3,-2,-1,
                            10, 9, 8, 3, 2, 1]);

    console.log(this.Y);
    this.next();
  }

  next() {
    if (!this.Y) return;

    let Xs = this.numbers.filter(n => n.style.fill == 'white').map(n => n.num);
    utils.shuffle(Xs);
    let x = null;
    while ( true ) {
      x = Xs.pop();
      this.target = x + this.Y;
      let i = this.targets.indexOf( this.target );
      if ( i != -1 ) {
        this.targets.splice(i, 1);
        break;
      }
    }
    console.log('x', x, 'Y', this.Y);
    this.text.text = 'Wo ist '+(1+x)+' '+(this.Y>0?('+ '+this.Y):('- '+(-this.Y)))+'?';

    game.speak(''+(1+x)+ (this.Y>0 ? ' pluss ' : ' minus ') + '' + Math.abs(this.Y) );

  }

}




class Menu extends actor.Actor {


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

    var btn3 = new PIXI.Sprite(game.resources.mode_glade.texture);
    btn3.x = 384;
    btn3.y = 650;
    btn3.anchor.set(0.5, 0.5);

    btn3.interactive = true;
    btn3.on('pointerdown', () => game.play(new Glade()) );

    this.addChild(btn3);

  }

  update(t) {
    this.logo.y = 180 + Math.sin(t*0.001)*10;
    this.logo.rotation = Math.sin(t*0.0005)/20;
  }
}

class Glade extends actor.Actor {

  constructor() {
    super();

    this.actors = [];

    var glade = new PIXI.Sprite(game.resources.glade.texture);
    this.addChild(glade);

    var back = new PIXI.Sprite(game.resources.back.texture);
    back.interactive = true;
    back.on('pointerdown', () => game.play(new Menu()));
    this.addChild(back);

    var unicornSVG = require('pixi-svg-loader!../images/unicorn.svg');
    console.log('unicorns', localStorage.unicorns);


    for (var i=0; i< parseInt(localStorage.unicorns, 10) ; i++) {
      let unicorn = new actor.SVGActor(unicornSVG, {
        idle: {
          tail: {
            rotation: ({t, thing}) => 0.3*Math.sin(thing.toffset+t*0.001)
          },
          head: {
            rotation: ({t, thing}) => 0.2*Math.sin(thing.toffset+t*0.0003)
          }
        }
      });
      unicorn.toffset = Math.random()*2*Math.PI;
      unicorn.y = 600+Math.random()*300;
      var scale = (unicorn.y - 600)/300;
      unicorn.scale.x = ( Math.random()>0.5?-1:1 ) * ( 0.2+0.2*scale );
      unicorn.scale.y = 0.2+0.3*scale;

      unicorn.x = 59+Math.random()*650-unicorn.width/2;
      this.actors.push(unicorn);
    }

    this.actors.sort((a,b) => a.y - b.y);
    this.actors.forEach(u => this.addChild(u));




  }
}

class Loader extends actor.Actor {

  constructor() {
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

    // TODO: no real need to reassign these? Just use loader?

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
      add("mode_glade", "images/mode_glade.png").
      add("logo", "images/logo.png")


      ;

    loader.onProgress.add((a) => {
      this.text.text = 'Loading '+a.progress.toFixed(0)+'%';
    });
    loader.load((loader, resources) => {
      game.resources = resources;
      menu = new Menu();
      game.play(menu);
    });
  }


}

class Game {

  speak(text) {
    if (!this.voice) return;
    var utt = new SpeechSynthesisUtterance(text);
    utt.voiceURI = this.voice.voiceURI;
    utt.lang = this.voice.lang;
    speechSynthesis.speak(utt);
  }

  constructor() {
    if (window.speechSynthesis)
      speechSynthesis.onvoiceschanged = () => {
        game.voice = speechSynthesis.getVoices().filter(v => v.lang == 'de-DE' || v.lang == 'de_DE')[0];
        //alert('voice ' + game.voice.name + '/' + game.voice.lang );
      };


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

      if (height / targetHeight < width / targetWidth) {
        this.main.scale.x = this.main.scale.y = window.devicePixelRatio * height / targetHeight;

      } else {
        this.main.scale.x = this.main.scale.y = window.devicePixelRatio * width / targetWidth;
      }

      this.main.y = canvas.height /2 - (this.main.scale.x)*targetHeight/2;
      this.main.x = canvas.width /2 - (this.main.scale.x)*targetWidth/2;

      console.log('canvas wh sw sh', canvas.width, canvas.height, canvas.style.width, canvas.style.height);
      console.log('stage xys', this.main.x, this.main.y, this.main.scale.x);
      console.log('renderer wh', this.app.renderer.width, this.app.renderer.height);

      window.scrollTo(0, 0);
    };

    window.addEventListener('resize', rendererResize);
    window.addEventListener('deviceOrientation', rendererResize);

    this.app = new PIXI.Application({backgroundColor: 0x1099bb, antialias: true});

    document.body.appendChild(this.app.view);

    this.main = new PIXI.Container();

    this.app.stage.addChild(this.main);

    setTimeout(rendererResize, 200);

    this.last_time = 0;

    this.actors = [];


  }

  stars(x,y) {
    this.main.addChild(new particles.Stars(x, y));
  }
  rain() {
    this.main.addChild(new particles.Rain());
  }
  hearts(x,y) {
    this.main.addChild(new particles.Hearts(x, y));
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

  play(thing) {
    this.actors = [];
    if (thing.actors)
      this.actors = this.actors.concat(thing.actors);
    this.main.removeChildren();
    this.main.addChild(thing);
    this.actors.push(thing);

  }

}

if ('unicorns' in localStorage && localStorage.unicorns[0] == '0') localStorage.unicorns = 4; // fix a bug where we did string-concat +1

var game = new Game();
var menu = null;
game.update();


//game.play(new Board3());
game.play(new Loader());
