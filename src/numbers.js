import Board from './board';
import utils from './utils';
import { game } from './game';

class NumberBoard extends Board {
  constructor() {
    super();

    var board = this;

    this.numbers = [];

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

    for ( let i = 0 ; i<100 ; i++ ) {
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

    for ( let i = 0 ; i < 11 ; i++) {
      var y = 50+70*i;
      gfx.moveTo(34, y);
      gfx.lineTo(734, y);
    }
    for ( let i = 0 ; i < 11 ; i++) {
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

class Board1 extends NumberBoard {
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


class Board2 extends NumberBoard {
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

export { Board1, Board2, Board3 };
