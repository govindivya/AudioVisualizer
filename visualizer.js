function main(params) {
  var canvas = /** @type {HTMLCanvasElement}*/ (
    document.getElementById("myCanvas")
  );
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Bar {
    constructor(x, y, width, height, color, i) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.index = i;
    }
    update(micInput) {
      //this.height=micInput
      const sound = micInput * 1000;

      if (sound > this.height) {
        this.height = sound;
      } else {
        this.height -= this.height * 0.03;
      }
    }
    draw(context) {
      context.fillRect(this.x, this.y, this.width, this.height);

      // new things added here

      context.save();
      context.beginPath();
      context.strokeStyle="red"
      context.arc(canvas.width/2,canvas.height/2,50,0,2*Math.PI);
      context.stroke();
      context.restore();

      // ends here
      context.strokeStyle = this.color;
      context.beginPath();
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      // context.rotate(this.index);
      // context.moveTo(this.x,this.y);
      // context.lineTo(this.y, this.height);

      // #added new lines 

      context.rotate(this.index*360/256);
      context.moveTo(0,-50);
      context.lineTo(0, -this.height-50);

      //

      context.stroke();
      context.restore();
    }
  }

  let bars = [];
  let barWidth = window.innerWidth / 256;

  window.onresize = (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let barWidth = window.innerWidth / 256;
    bars.forEach((bar, i) => (bar.x = i * barWidth));
  };

  
  function createBars() {
    for (let i = 0; i < 256; i++) {
      let hue = Math.random() * 360;
      let color = `hsl(${i * 2},100%,50%)`;
      bars.push(new Bar(0, i*1.2, 1, 20, color, i));
    }
  }
  const microphone = new Microphone();
  createBars();
  console.log(bars);
  function animate() {
    if (microphone.initialized) {
      const samples = microphone.getSample();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // generate audio sample from microphone
      // animate bars based on frequency

      bars.forEach((bar, i) => {
        bar.draw(ctx);
        bar.update(samples[i]);
      });
    }
    requestAnimationFrame(animate);
  }
  animate();
}
