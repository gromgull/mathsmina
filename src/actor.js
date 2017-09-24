
class Actor extends PIXI.Container {

  update (t, delta) {
  }
}

const props = [ 'rotation', 'position', 'x', 'y' ];

class SVGActor extends Actor {

  constructor(Svg, anim, init) {

    /**
     * Anim is a nested object containing functions for animating
     * certain parts.
     *
     * Top level is different states, for instance, running, standing,
     * jumping, etc.  Next levels are either references to attributes
     * to animate (rotation, position, ...), or to child elements.
     *
     * Animation function should return the new value for that
     * property, and are passed an object with the keys:
     *
     * - t (current time in ms)
     * - state_t (time since current state started)
     * - delta (elapsed time since last update)
     * - current (the current value of the property)
     * - original (the original value of the property, useful for relative movement)
     *
     * Example:
     * {
     *   idle: {
     *     head: {
     *       lpupil: {
     *         x: ({t, original}) => original+10*Math.sin(t*0.005)-10
     *       },
     *       y: ({t, original}) => original+10*Math.sin(t*0.003)
     *     },
     *     lleg: {
     *       rotation: ({t}) => 0.2*Math.sin(t*0.01)
     *     },
     *   }
     * }
     *
     * i.e., one idle state, move the head up and down a bit, and the
     * left pupil side to side. Also rotate the left leg.
     **/


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

    let save_defaults = (thing, defaults, top) => {

      for(var prop in thing) {
        if (!thing.hasOwnProperty(prop)) continue;
        if (prop == 'parent') continue;
        var val = thing[prop];
        if (val instanceof PIXI.Sprite || val instanceof PIXI.Container) {
          if (top) this[prop] = val; // copy to this element
          defaults[prop] = { rotation: val.rotation,
                             x: val.position.x,
                             y: val.position.y,
                             position: new PIXI.Point(val.position.x, val.position.y) }; // TODO: transform, scale etc.
          console.log(prop);
          save_defaults(val, defaults[prop]);
        }
      }
    };
    save_defaults(this.svg, this.defaults, true);

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
        thing[prop] = anim({ t, state_t: time_in_state, delta, current: thing[prop], original: defaults[prop]});
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
