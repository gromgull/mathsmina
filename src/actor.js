
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

    this.defaults = {};
    for(var prop in this.svg) {
      if (!this.svg.hasOwnProperty(prop)) continue;
      var val = this.svg[prop];
      if (val instanceof PIXI.Sprite || val instanceof PIXI.Container) {
        this.defaults[prop] = { rotation: val.rotation,
                                position: new PIXI.Point(val.position.x, val.position.y) }; // transform etc.
      }
    }

  }

  update(t, delta) {
    Object.keys(this.anim).forEach(k => {
      if (!this.svg[k]) return;
      // todo - deeper hierarchy!
      Object.keys(this.anim[k]).forEach(prop => {
        this.svg[k][prop] = this.anim[k][prop](t, delta, this.svg[k][prop], this.defaults[k][prop]);
      });
    });
  }
}

module.exports = { Actor, SVGActor };
