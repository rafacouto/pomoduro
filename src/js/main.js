 
function Timespan(millis) {
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





function Pomodoro(seconds) {
  this._timespan = new Timespan(seconds * 1000);
  this._consumed = new Timespan(0);
  this._running = null;
  this._autostop = false;
}

Pomodoro.prototype.getTimespan = function() {
  this._updateConsumed();
  var result = new Timespan(this._timespan.getTotalMillis());
  result.subtract(this._consumed);
  return result;
}

Pomodoro.prototype.getTime = function() {
  var time = this.getTimespan().getTotalSeconds();
  var result = ''
  if (time < 0) { time = -time; result += '-'; }
  var s = time % 60;
  time = (time - s) / 60;
  var m = time;
  result += m + (s < 10 ? ':0' : ':') + s;
  return result;
}

Pomodoro.isAutostop = function() {
  return this._autostop;
}

Pomodoro.setAutostop = function(enable) {
  this._autostop = (enable != false);
  return this;
}

Pomodoro.prototype.isRunning = function() {
  return (this._running != null);
}

Pomodoro.prototype.start = function() {
  if (this.isRunning()) return;
  this._running = new Date();
}

Pomodoro.prototype.stop = function() {
  if (!this.isRunning()) return;
  this._updateConsumed();
  this._running = null;
}

Pomodoro.prototype._updateConsumed = function() {
  if (!(this.isRunning())) return;
  var now = new Date();
  var diff = now.getTime() - this._running.getTime();
  this._running = now;
  this._consumed.add(new Timespan(diff));
  if (this._consumed.gte(this._timespan) && this._autostop) {
    this._running = null;
    this._consumed = new Timespan(this._timespan.getTotalMillis());
  }
}



