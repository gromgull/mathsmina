import { Actor, SVGActor } from './actor';
import { game } from './game';

class Board extends Actor {

  constructor() {
    super();

    this.actors = [];

    this.state = 'loading';

    var grass = new PIXI.Sprite(game.resources.grass.texture);
    grass.y = 920;
    this.addChild(grass);

    var evilSVG = require('pixi-svg-loader!../images/evil.svg');
    this.evil = new SVGActor(evilSVG, {
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
    this.fairy = new SVGActor(fairySVG, {
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
    this.unicorn = new SVGActor(unicornSVG, {
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


}

export default Board;
