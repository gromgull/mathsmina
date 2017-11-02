

var particles = require('./particles.js');
var actor = require('./actor.js');

var { Board } = require('./board.js');

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
    if (thing.reset) thing.reset();
    this.actors = [];
    if (thing.actors)
      this.actors = this.actors.concat(thing.actors);
    this.main.removeChildren();
    this.main.addChild(thing);
    this.actors.push(thing);

  }

}

var game = new Game(); // singleton

export { game, Loader, Game };
