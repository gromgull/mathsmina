
class Actor extends PIXI.Container {

  update (t, delta) {
  }
}

const props = [ 'rotation', 'position' ];

class SVGActor extends Actor {
  constructor(Svg, anim, init) {
    super();
    this.svg = new Svg();
    this.svg.pivot.set(this.svg.width/2, this.svg.height/2);
    this.addChild(this.svg);
    this.anim = anim;
    this.changeTo = 'idle';

    if (init) {
      Object.keys(init).forEach( k => this[k] = init[k] ); // assign?
    }

    this.defaults = {
      rotation: this.rotation,
      position: new PIXI.Point(this.x, this.y)
    };
    for(var prop in this.svg) {
      if (!this.svg.hasOwnProperty(prop)) continue;
      var val = this.svg[prop];
      if (val instanceof PIXI.Sprite || val instanceof PIXI.Container) {
        this[prop] = val; // copy to this element
        this.defaults[prop] = { rotation: val.rotation,
                                position: new PIXI.Point(val.position.x, val.position.y) }; // transform etc.
      }
    }

  }

  setState(state) {
    this.changeTo = state;
  }

  update(t, delta) {

    if (this.changeTo) {
      this.state = this.changeTo;
      this.changeTo = undefined;
      this.state_start = t;
    }

    var anim = this.anim[this.state];

    let time_in_state = t-this.state_start;

    if (anim._duration && time_in_state > anim._duration) {
      this.state = anim.next || 'idle';
    }

    function doit(anim, prop, thing, defaults) {
      if (props.indexOf(prop)!==-1) {
        thing[prop] = anim(time_in_state, delta, thing[prop], defaults[prop]);
      } else {
        if (!thing[prop]) {
          console.log("tried to animate "+prop+" of "+thing+" but it has no such part.");
          return;
        }
        Object.keys(anim)
          .forEach(p => doit(anim[p], p, thing[prop], defaults[prop]));
      }
    }
    Object.keys(anim)
      .filter(p => p[0]!='_')
      .forEach(k => {
        doit(anim[k], k, this, this.defaults);
      });
  }
}

module.exports = { Actor, SVGActor };
