class Microphone {
  constructor() {
    this.initialized = false;
    // mediaDevices is only read only property
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(
        function (stream) {
          // this object used to manipulate audio data in browswer
          this.audioContext = new AudioContext();
          this.microphone = this.audioContext.createMediaStreamSource(stream);
          this.analyser = this.audioContext.createAnalyser();
          // media stream count we see in music player bars count is fftSize
          this.analyser.fftSize = 512;
          const bufferLenght = this.analyser.frequencyBinCount;
          this.dataArray = new Uint8Array(bufferLenght);
          this.microphone.connect(this.analyser);
          this.initialized = true;
        }.bind(this)
      )
      .catch((e) => {
        this.initialized = false;
        console.log(e.message);
        alert(e.message);
      });
  }
  getSample(){
    this.analyser.getByteTimeDomainData(this.dataArray);
    // converting all bits into range -1 to 1 to normalize around 0
    let normSample=[...this.dataArray].map((e)=>e/128-1)
    return normSample;
  }
  getVolume(){
    this.analyser.getByteTimeDomainData(this.dataArray);
    let normSample=[...this.dataArray].map((e)=>e/128-1)
    let sum=0;

    // taking rms value to calculate total volume
    for(let i=0;i<normSample.length;i++){
        sum+=normSample[i]*normSample[i];
    }
    let volume=Math.sqrt(sum/normSample.length);
    return volume;
  }
}

