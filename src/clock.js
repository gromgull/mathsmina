
import utils from './utils';

import { Actor } from './actor';
import Board from './board';
import { game } from './game';


class Clock extends Actor {

  constructor(time, position) {
    super();

    this.time = time;
    if (position) this.position.copy(position);

    var style = {
      fontFamily: 'Encode Sans Expanded',
      fontSize: 16,
      fontWeight: 500,
      fill: 'white',
    };

    var r = 60;

    this.face = new PIXI.Graphics();

    this.face.lineStyle(6, 0xffe400, 1).
      beginFill(0,0).
      drawCircle(0,0,r).
      endFill();

    this.addChild(this.face);

    this.hourHand = new PIXI.Graphics();
    this.hourHand.beginFill().
      lineStyle(6, 0, 1).
      moveTo(0,0).
      lineTo(0, -0.5*r).
      endFill();

    this.addChild(this.hourHand);
      // this.hourhand.lineTo(0.5*r*Math.sin(2*Math.PI*h/12),
    //          -0.5*r*Math.cos(2*Math.PI*h/12)).

    this.minuteHand = new PIXI.Graphics();
    this.minuteHand.beginFill().
      lineStyle(3, 0xffffff, 1).
      moveTo(0,0).
      lineTo(0, -0.65*r).
      endFill();
      // lineTo(0.65*r*Math.sin(2*Math.PI*m),
      //          -0.65*r*Math.cos(2*Math.PI*m)).

    this.addChild(this.minuteHand);

    this.setTime(time);

    for (let i = 0; i<12; i ++) {
      let t = new PIXI.Text(i || '12', style);
      t.anchor.set(0.5,0.5);
      t.x = 0.75*r*Math.sin(2*Math.PI*i/12);
      t.y = - 0.75*r*Math.cos(2*Math.PI*i/12);
      this.addChild(t);
    }


  }

  setTime(time) {

    var h = time % 12;
    var m = time - Math.floor(time);

    this.hourHand.rotation = Math.PI*2*h/12;
    this.minuteHand.rotation = Math.PI*2*m;
  }

  update(t) {
    this.setTime(this.time+t/1000);
  }

}

class ClockGame extends Board {

  constructor() {
    super();

    this.clocks = [];
    let board = this;

    let click = function () { if (board.state == 'playing') board.click(this); };

    for ( let i = 0 ; i < 9 ; i ++ ) {

      var clock = new Clock(0,
                            {x: 184+200*(i%3),y: 100+200*Math.floor(i/3)});
      clock.interactive = true;
      clock.on('pointerdown', click);
      this.addChild(clock);
      this.clocks.push(clock);
    }

    var style = {
      fontFamily: 'Encode Sans Expanded',
      fontSize: 32,
      fontWeight: 900,
      fill: 'white',
    };

    this.text = new PIXI.Text('Welches Uhr ist ?', style);
    this.text.x = 400;
    this.text.y = 780;
    this.text.anchor.set(0.5, 0.5);
    this.addChild(this.text);

    //this.actors = clocks;
  }

  click(clock) {
    if (this.target == clock) {
      game.stars(clock.x, clock.y);
      this.correct();
      this.next();
    } else {
      this.wrong();
    }

  }

  format_time(h,m) {

    h = h || 12;
    let h1 = ((h+1) % 12) || 12;

    if (m===0) return h+' Uhr';
    if (m<15) return m+' nach '+h;
    if (m==15) return ' viertel nach '+h;
    if (m<30) return (30-m) + ' vor halb '+h1;
    if (m==30) return 'halb '+h1;
    if (m<45) return (m-30) + ' nach halb '+h1;
    if (m==45) return 'viertel vor '+h1;
    return (60-m)+' vor '+h1;
  }

  reset() {
    super.reset();
    this.next();
  }

  next() {
    for ( let i = 0 ; i < 9 ; i ++ ) {
      let h = Math.floor(Math.random()*12);
      let m = Math.floor(Math.random()*12)*5;
      let t = h+m/60;
      console.log(h,m, this.format_time(h,m));
      this.clocks[i].time = t;
      this.clocks[i].h = h;
      this.clocks[i].m = m;
      this.clocks[i].update(0);
    }
    this.target = utils.choice(this.clocks);
    let t = this.format_time(this.target.h, this.target.m);
    this.text.text = 'Welches Uhr ist '+t+'?';
    game.speak(t);
  }


}

export { ClockGame };
