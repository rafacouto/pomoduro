 
function Timespan(millis = 0) {
  this._millis = millis;
}

Timespan.prototype.fromSeconds = function(seconds) {
  return new Timespan(seconds * 1000);
}

Timespan.prototype.fromMinutes = function(minutes) {
  return new Timespan(minutes * 60000);
}

Timespan.prototype.fromHours = function(hours) {
  return new Timespan(hours * 3600000);
}

Timespan.prototype.fromDays = function(days) {
  return new Timespan(days * 86400000);
}

Timespan.prototype.getTotalMillis = function() {
  return this._millis;
}

Timespan.prototype.getTotalSeconds = function() {
  return Math.ceil(this._millis / 1000);
}

Timespan.prototype.add = function(timestamp) {
  this._millis += timestamp._millis;
  return this;
}

Timespan.prototype.subtract= function(timestamp) {
  this._millis -= timestamp._millis;
  return this;
}

Timespan.prototype.gte = function(other) {
  return (this._millis >= other._millis);
}





function Timer(seconds = 0, clockwise = true) {
  this._timespan = new Timespan(seconds * 1000);
  this._clockwise = clockwise;
  this._running = null;
}

Timer.prototype.getTimespan = function() {
  var result = new Timespan();
  result.add(this._timespan);
  if (this.isRunning()) {
    var diff = this._millisNow() - this._running;
    var lap = new Timespan(this._clockwise ? diff : -diff);
    result.add(lap);
  }
  return result;
}

Timer.prototype.getTimeStr = function() {
  var time = this.getTimespan().getTotalSeconds();
  var result = ''
  if (time < 0) { time = -time; result += '-'; }
  var s = time % 60;
  time = (time - s) / 60;
  var m = time;
  result += m + (s < 10 ? ':0' : ':') + s;
  return result;
}

Timer.prototype.isRunning = function() {
  return (this._running != null);
}

Timer.prototype.start = function() {
  if (this.isRunning()) return;
  this._running = this._millisNow();
}

Timer.prototype.stop = function() {
  if (!this.isRunning()) return;
  this._timespan = this.getTimespan();
  this._running = null;
}

Timer.prototype.reset = function(timespan = null) {
  if (timespan == null) timespan = new Timespan();
  this._timespan = timespan;
}

Timer.prototype._millisNow = function() {
  return (new Date()).getTime();
}


// vim: et ts=2 sw=2
