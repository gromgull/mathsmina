require('pixi-particles');

class ParticleEffect extends PIXI.Container {
  constructor(texture, config) {
    super();
    this.emitter = new PIXI.particles.Emitter(this, [ texture ], config);
    this.emitter.playOnceAndDestroy();
  }
}

class Rain extends ParticleEffect {
  constructor(x,y) {
    super(PIXI.Texture.fromImage('images/droplet.png'),
          {
	        "alpha": {
		      "start": 1,
		      "end": 0
	        },
	        "scale": {
		      "start": 1,
		      "end": 1,
		      "minimumScaleMultiplier": 1
	        },
	        "color": {
		      "start": "#006685",
		      "end": "#bddfff"
	        },
	        "speed": {
		      "start": 0,
		      "end": 50,
		      "minimumSpeedMultiplier": 1
	        },
	        "acceleration": {
		      "x": 0,
		      "y": 250
	        },
	        "maxSpeed": 0,
	        "startRotation": {
		      "min": 0,
		      "max": 0
	        },
	        "noRotation": false,
	        "rotationSpeed": {
		      "min": 0,
		      "max": 1
	        },
	        "lifetime": {
		      "min": 0.2,
		      "max": 4
	        },
	        "blendMode": "normal",
	        "frequency": 0.01,
	        "emitterLifetime": 5,
	        "maxParticles": 200,
	        "pos": {
		      "x": 0,
		      "y": 0
	        },
	        "addAtBack": false,
	        "spawnType": "rect",
	        "spawnRect": {
		      "x": 1,
		      "y": 0,
		      "w": 768,
		      "h": 0
	        }
          });
  }

}

class Hearts extends ParticleEffect {
  constructor(x,y) {
    super(PIXI.Texture.fromImage('images/heart.png'),

          {
	        "alpha": {
		      "start": 0.5,
		      "end": 0
	        },
	        "scale": {
		      "start": 1,
		      "end": 0.1,
		      "minimumScaleMultiplier": 1
	        },
	        "color": {
		      "start": "#e4f9ff",
		      "end": "#40ff43"
	        },
	        "speed": {
		      "start": 200,
		      "end": 50,
		      "minimumSpeedMultiplier": 1
	        },
	        "acceleration": {
		      "x": 0,
		      "y": 250
	        },
	        "maxSpeed": 0,
	        "startRotation": {
		      "min": 0,
		      "max": 360
	        },
	        "noRotation": false,
	        "rotationSpeed": {
		      "min": 10,
		      "max": 20
	        },
	        "lifetime": {
		      "min": 0.2,
		      "max": 2
	        },
	        "blendMode": "normal",
	        "frequency": 0.01,
	        "emitterLifetime": 5,
	        "maxParticles": 200,
	        "pos": {
		      "x": x,
		      "y": y
	        },
	        "addAtBack": false,
	        "spawnType": "circle",
	        "spawnCircle": {
		      "x": 4,
		      "y": 4,
		      "r": 20
	        }
          });
  }

}

class Stars extends ParticleEffect {
  constructor(x,y) {
    super(PIXI.Texture.fromImage('images/star.png'),
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
  }
}

module.exports = {
  Rain: Rain,
  Hearts: Hearts,
  Stars: Stars
};
