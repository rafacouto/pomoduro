/*
 * Pomoduro
 * https://github.com/rafacouto/pomoduro
 */

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

Timespan.prototype.eq = function(other) {
  return (this._millis == other._millis);
}

Timespan.prototype.ne = function(other) {
  return (this._millis != other._millis);
}

Timespan.prototype.gt = function(other) {
  return (this._millis > other._millis);
}

Timespan.prototype.lt = function(other) {
  return (this._millis < other._millis);
}

Timespan.prototype.gte = function(other) {
  return (this._millis >= other._millis);
}

Timespan.prototype.lte = function(other) {
  return (this._millis <= other._millis);
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

Timer.prototype.isClockwise = function() {
  return (this._clockwise == true);
}

Timer.prototype.getTimeStr = function() {
  var time = this.getTimespan().getTotalSeconds();
  var result = '';
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
  this.reset();
}

Pomodoro.prototype.PHASE_NONE = 'none';
Pomodoro.prototype.PHASE_WORK = 'work';
Pomodoro.prototype.PHASE_WARN = 'warn';
Pomodoro.prototype.PHASE_BREAK = 'break';

Pomodoro.prototype.reset = function() {
  this._phase = Pomodoro.prototype.PHASE_WORK;
  this._timer = new Timer(this._work, false);
}

Pomodoro.prototype.getPhase = function() {
  this._update();
  return this._phase;
}

Pomodoro.prototype.getPhaseSeconds = function(phase) {
  switch (phase) {
    case Pomodoro.prototype.PHASE_WORK:
      return this._work;
    case Pomodoro.prototype.PHASE_WARN:
      return this._warn;
    case Pomodoro.prototype.PHASE_BREAK:
      return this._break;
  }
  return 0;
}

Pomodoro.prototype.getTimer = function() {
  return this._timer;
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

Pomodoro.prototype.isFinished = function() {
  this._update();
  return (this.getPhase() == Pomodoro.prototype.PHASE_NONE);
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

Pomodoro.prototype.getTotalSeconds = function() {
  return this._work + this._warn + this._break;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function WorkDay() {
  this._program= [];
  this._current = -1;
}

WorkDay.prototype.newPomodoro = function(time, 
    work_minutes = 50, break_minutes = 10, warn_minutes = 0) {
  var start = WorkDay.prototype._time2sec(time);
  var pomodoro = new Pomodoro(work_minutes * 60, 
      break_minutes * 60, warn_minutes * 60);
  this._program.push({
    time: time,
    pomodoro: pomodoro,
    _start: start,
    _stop: start + pomodoro.getTotalSeconds()
    });
}

WorkDay.prototype.getProgram = function() {
  return this._program;
}

WorkDay.prototype.getPomodoro = function() {

  // test if program contains pomodoro intervals
  var len = this._program.length;
  if (len > 0) {

    if (this._current >= 0) {

      // current pomodoro
      var pomodoro = this._program[this._current].pomodoro;

      // is active
      if (!pomodoro.isPaused()) return pomodoro;

      // is finished
      if (pomodoro.isFinished()) {

        // reset pomodoro
        pomodoro.reset();
        this._current = -1;
      }
    }

    // current time of the day in seconds
    var date = new Date();
    var now = (date.getHours() * 3600) +
      (date.getMinutes() * 60) + date.getSeconds();

    // for each interval in the program
    for (var p = 0; p < len; p++) {

      // look for the first active interval
      var interval = this._program[p];
      if (now >= interval._start && now < interval._stop) {

        // update the current interval
        this._current = p;
        var pomodoro = interval.pomodoro;

        // test pomodoro has not started yet
        if (pomodoro.isPaused()) { 

          // adjust the difference from the start time
          var diff = Timespan.prototype.fromSeconds(now - interval._start);
          var timer = pomodoro.getTimer();
          timer.reset(timer.getTimespan().sub(diff));

          // start the timer for current pomodoro
          pomodoro.start();
        }

        return pomodoro;
      }
    }

  }

  return null;
}

WorkDay.prototype._time2sec = function(time) {
  var match = (/(\d+):(\d+)/).exec(time);
  if (match) {
    var hour = Number.parseInt(match[1]);
    var minute = Number.parseInt(match[2]);
    return (hour * 3600) + (minute * 60);
  }
}


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// vim: et ts=2 sw=2 ai
