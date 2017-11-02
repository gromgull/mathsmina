
import { Actor, SVGActor } from './actor';

import { game } from './game';

class Glade extends Actor {

  constructor(menu) {
    super();

    this.actors = [];

    var glade = new PIXI.Sprite(game.resources.glade.texture);
    this.addChild(glade);

    var back = new PIXI.Sprite(game.resources.back.texture);
    back.interactive = true;
    back.on('pointerdown', () => game.play(menu));
    this.addChild(back);

    var unicornSVG = require('pixi-svg-loader!../images/unicorn.svg');
    console.log('unicorns', localStorage.unicorns);


    for (var i=0; i< parseInt(localStorage.unicorns, 10) ; i++) {
      let unicorn = new SVGActor(unicornSVG, {
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

export { Glade };
