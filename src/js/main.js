//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
 
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

Timespan.prototype.add = function(timespan) {
  this._millis += timespan._millis;
  return this;
}

Timespan.prototype.sub = function(timespan) {
  this._millis -= timespan._millis;
  return this;
}

Timespan.prototype.gte = function(other) {
  return (this._millis >= other._millis);
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function Timer(seconds = 0, clockwise = true) {
  this._timespan = Timespan.prototype.fromSeconds(seconds);
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
  if (this.isRunning()) this._running = this._millisNow();
}

Timer.prototype._millisNow = function() {
  return (new Date()).getTime();
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function Pomodoro(work_seconds = 3300, break_seconds = 300, 
    warn_seconds = 0) {
  this._work = work_seconds;
  this._break = break_seconds;
  this._warn = warn_seconds;
  this._phase = Pomodoro.prototype.PHASE_WORK;
  this._timer = new Timer(work_seconds, false);
}

Pomodoro.prototype.PHASE_NONE = 'none';
Pomodoro.prototype.PHASE_WORK = 'work';
Pomodoro.prototype.PHASE_WARN = 'warn';
Pomodoro.prototype.PHASE_BREAK = 'break';

Pomodoro.prototype.getPhase = function() {
  this._update();
  return this._phase;
}

Pomodoro.prototype.start = function() {
  this._timer.start();
}

Pomodoro.prototype.pause = function() {
  this._timer.stop();
}

Pomodoro.prototype.isPaused= function() {
  return !(this._timer.isRunning());
}

Pomodoro.prototype._update = function() {
  var t = this._timer.getTimespan()
  if (t.getTotalMillis() < 0) {
    switch (this._phase) {
      case Pomodoro.prototype.PHASE_WORK:
        this._phase = Pomodoro.prototype.PHASE_WARN;
        t.add(Timespan.prototype.fromSeconds(this._warn));
        this._timer.reset(t);
        this._update();
        break;
      case Pomodoro.prototype.PHASE_WARN:
        this._phase = Pomodoro.prototype.PHASE_BREAK;
        t.add(Timespan.prototype.fromSeconds(this._break));
        this._timer.reset(t);
        this._update();
        break;
      case Pomodoro.prototype.PHASE_BREAK:
        this._phase = Pomodoro.prototype.PHASE_NONE;
        this._timer.stop();
        this._timer.reset();
        break;
    }
  }
}

Pomodoro.prototype.getTimeStr = function() {
  this._update();
  return this._timer.getTimeStr();
}


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// vim: et ts=2 sw=2 ai
