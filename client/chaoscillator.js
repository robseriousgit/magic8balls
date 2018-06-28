var playing = false
var crossfadePixels = 100
document.addEventListener('mousemove', function(e){
  handleMouseMove(e);
})

document.addEventListener('click', function(e){
  handleMouseClick(e);
})

function startAll() {
  bass1.play()
  bass2.play()
  drums1.play()
  drums2.play()
}

function stopAll() {
  bass1.stop()
  bass2.stop()
  drums1.stop()
  drums2.stop()
}

function initAll() {
  bass1.changeGain({offsetX:0, offsetY:0});
  bass2.changeGain({offsetX:0, offsetY:0});
  drums1.changeGain({offsetX:0, offsetY:0});
  drums2.changeGain({offsetX:0, offsetY:0});


  bass1.changeFrequency({offsetX:0, offsetY:0});
  bass2.changeFrequency({offsetX:0, offsetY:0});
  drums1.changeFrequency({offsetX:0, offsetY:0});
  drums2.changeFrequency({offsetX:0, offsetY:0});
}


function handleMouseClick(e) {
  
  if (playing) {
    console.log('pause')
    stopAll()
    playing = false;
  } else {
    console.log('play')
    startAll();
    initAll();
    playing = true;
  }
}

function getCenterOffset(mouseX,mouseY) {
  var windowHeight = document.documentElement.clientHeight;
  var windowWidth = document.documentElement.clientWidth;
  offsetX = ((windowWidth / 2) - mouseX) * -1
  offsetY = ((windowHeight / 2) - mouseY) 
  return {offsetY, offsetX}
}


function handleMouseMove(e) {
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  var offsets = getCenterOffset(mouseX,mouseY);
  bass1.changeGain(offsets);
  bass2.changeGain(offsets);
  drums1.changeGain(offsets);
  drums2.changeGain(offsets);
 
  bass1.changeFrequency(offsets);
  bass2.changeFrequency(offsets);
  drums1.changeFrequency(offsets);
  drums2.changeFrequency(offsets);

  bass1.changeQuality(offsets);
  bass2.changeQuality(offsets);
  drums1.changeQuality(offsets);
  drums2.changeQuality(offsets);

}

/* filters */

createLowPassFilter = function(source) {
  var filter = context.createBiquadFilter();
  filter.type = (typeof filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
  filter.frequency.value = 5000;
  source.connect(filter);
  return filter;
}

/* Gain node */

createGainNode = function(source) {
  var gainNode = context.createGain ? context.createGain() : context.createGainNode();
  source.connect(gainNode);
  gainNode.connect(context.destination);
  return gainNode
}

/* Sampley bits Bass 1  */

var bass1 = {
  FREQ_MUL: 7000,
  QUAL_MUL: 50,
  playing: false
};

bass1.play = function() {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = BUFFERS.bass1;
  
  source.start(0);
  source.loop = true;
  // Save source and filterNode for later access.
  this.source = source;
  this.filter = createLowPassFilter(source);
  this.gainNode = createGainNode(this.filter);
};

bass1.stop = function() {
  this.source.stop(0);
};

bass1.changeGain = function(offsets, max = 100) {
  if( offsets.offsetX <= crossfadePixels && offsets.offsetY >= -crossfadePixels && offsets.offsetX <=0 && offsets.offsetY <= 0) {
    // bottom left
    var value = (Math.abs(offsets.offsetX ) < Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if( offsets.offsetX <= crossfadePixels && offsets.offsetY <= crossfadePixels && offsets.offsetX >=0 && offsets.offsetY >= 0) {
    // top right
    var value = (Math.abs(offsets.offsetX ) > Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if (offsets.offsetX < 0 && offsets.offsetY > 0) {
    this.gainNode.gain.value = 1;
  } else {
    this.gainNode.gain.value = 0;
  } 
}

bass1.changeFrequency = function(offsets) {
  var windowWidth = document.documentElement.clientWidth;
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * (-(offsets.offsetX / (windowWidth / 2)) -1));
  // Get back to the frequency value between min and max.
  this.filter.frequency.value = maxValue * multiplier;
};

bass1.changeQuality = function(offsets) {
  var windowHeight = document.documentElement.clientHeight;
  val = offsets.offsetY / (windowHeight / 2);
  this.filter.Q.value = val * this.QUAL_MUL;
};

/* Sampley bits Bass 2  */

var bass2 = {
  FREQ_MUL: 7000,
  QUAL_MUL: 50,
  playing: false
};

bass2.changeGain = function(offsets, max = 100) {
  if( offsets.offsetX >= -crossfadePixels && offsets.offsetY >= -crossfadePixels && offsets.offsetX >=0 && offsets.offsetY <= 0) {
    // bottom right
    var value = (Math.abs(offsets.offsetX ) < Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if( offsets.offsetX >= -crossfadePixels && offsets.offsetY <= crossfadePixels && offsets.offsetX <=0 && offsets.offsetY >= 0) {
    // top left
    var value = (Math.abs(offsets.offsetX ) > Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if (offsets.offsetX > 0 && offsets.offsetY > 0) {
    this.gainNode.gain.value = 1;
  } else {
    this.gainNode.gain.value = 0;
  } 
}



bass2.play = function() {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = BUFFERS.bass2;
  
  source.start(0);
  source.loop = true;
  // Save source and filterNode for later access.
  this.source = source;
  this.filter = createLowPassFilter(source);
  this.gainNode = createGainNode(this.filter);
};

bass2.stop = function() {
  this.source.stop(0);
};


bass2.changeFrequency = function(offsets) {
  var windowWidth = document.documentElement.clientWidth;
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * ((offsets.offsetX / (windowWidth / 2)) -1));
  // Get back to the frequency value between min and max.
  this.filter.frequency.value = maxValue * multiplier;
};

bass2.changeQuality = function(offsets) {
  var windowHeight = document.documentElement.clientHeight;
  val = offsets.offsetY / (windowHeight / 2);
  this.filter.Q.value = val * this.QUAL_MUL;
};

/* Sampley bits Drums 1  */

var drums1 = {
  FREQ_MUL: 7000,
  QUAL_MUL: 50,
  playing: false
};

drums1.changeGain = function(offsets, max = 100) {
  if( offsets.offsetX <= crossfadePixels && offsets.offsetY <= crossfadePixels && offsets.offsetX <=0 && offsets.offsetY >= 0) {
    // top left
    var value = (Math.abs(offsets.offsetX ) < Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if( offsets.offsetX <= crossfadePixels && offsets.offsetY >= -crossfadePixels && offsets.offsetX >=0 && offsets.offsetY <= 0) {
    // bottom right
    var value = (Math.abs(offsets.offsetX ) > Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if (offsets.offsetX < 0 && offsets.offsetY < 0) {
    this.gainNode.gain.value = 1;
  } else {
    this.gainNode.gain.value = 0;
  } 
}

drums1.play = function() {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = BUFFERS.drums1;
  
  source.start(0);
  source.loop = true;
  // Save source and filterNode for later access.
  this.source = source;
  this.filter = createLowPassFilter(source);
  this.gainNode = createGainNode(this.filter);
};

drums1.stop = function() {
  // if (!this.source.stop)
  //   this.source.stop = source.noteOff;
  this.source.stop(0);
  //this.source.noteOff(0);
};

drums1.changeFrequency = function(offsets) {
  var windowWidth = document.documentElement.clientWidth;
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * (-(offsets.offsetX / (windowWidth / 2)) -1));
  // Get back to the frequency value between min and max.
  this.filter.frequency.value = maxValue * multiplier;
};

drums1.changeQuality = function(offsets) {
  var windowHeight = document.documentElement.clientHeight;
  val = offsets.offsetY / (windowHeight / 2);
  this.filter.Q.value = -val * this.QUAL_MUL;
};


/* Sampley bits Drums 2  */

var drums2 = {
  FREQ_MUL: 7000,
  QUAL_MUL: 50,
  playing: false
};

drums2.changeGain = function(offsets, max = 100) {
  if( offsets.offsetX > crossfadePixels && offsets.offsetY <= crossfadePixels && offsets.offsetX >=0 && offsets.offsetY >= 0) {
    // top right
    var value = (Math.abs(offsets.offsetX ) < Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if( offsets.offsetX >= -crossfadePixels && offsets.offsetY >= -crossfadePixels && offsets.offsetX <=0 && offsets.offsetY <= 0) {
    // bottom left
    var value = (Math.abs(offsets.offsetX ) > Math.abs(offsets.offsetY) )? Math.abs(offsets.offsetX) :  Math.abs(offsets.offsetY);
    var fraction = parseInt(value) / parseInt(max);
    this.gainNode.gain.value = 1-fraction;
  } else if (offsets.offsetX > 0 && offsets.offsetY < 0) {
    this.gainNode.gain.value = 1;
  } else {
    this.gainNode.gain.value = 0;
  } 
}


drums2.play = function() {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = BUFFERS.drums2;
  // Create the filter.
  source.start(0);
  source.loop = true;
  // Save source and filterNode for later access.
  this.source = source;
  this.filter = createLowPassFilter(source);
  this.gainNode = createGainNode(this.filter);
};

drums2.stop = function() {
  // if (!this.source.stop)
  //   this.source.stop = source.noteOff;
  this.source.stop(0);
  //this.source.noteOff(0);
};

drums2.changeFrequency = function(offsets) {
  var windowWidth = document.documentElement.clientWidth;
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * ((offsets.offsetX / (windowWidth / 2)) -1));
  // Get back to the frequency value between min and max.
  this.filter.frequency.value = maxValue * multiplier;
};

drums2.changeQuality = function(offsets) {
  var windowHeight = document.documentElement.clientHeight;
  val = offsets.offsetY / (windowHeight / 2);
  this.filter.Q.value = -val * this.QUAL_MUL;
};
