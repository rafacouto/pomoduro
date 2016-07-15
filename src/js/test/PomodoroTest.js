
describe('Pomodoro class tests.', function () {

  it('Default constructor (55 min work, 5 min break, no warning).', function() {
    var p = new Pomodoro();
    expect(p.getPhase()).toBe(this._phase = Pomodoro.prototype.PHASE_WORK);
    expect(p.getTotalSeconds()).toBe(60 * 60);
    expect(p.getPhaseSeconds(Pomodoro.prototype.PHASE_WORK)).toBe(55 * 60);
    expect(p.getPhaseSeconds(Pomodoro.prototype.PHASE_BREAK)).toBe(5 * 60);
    expect(p.getPhaseSeconds(Pomodoro.prototype.PHASE_WARN)).toBe(0);
  });

  it('Constructor with specific time intervals.', function() {
    var work_m = 50, warm_m = 3, break_m = 7;
    var p = new Pomodoro(work_m * 60, break_m * 60, warm_m * 60);
    expect(p.getPhase()).toBe(this._phase = Pomodoro.prototype.PHASE_WORK);
    expect(p.getTotalSeconds()).toBe(60 * 60);
    expect(p.getPhaseSeconds(Pomodoro.prototype.PHASE_WORK)).toBe(work_m * 60);
    expect(p.getPhaseSeconds(Pomodoro.prototype.PHASE_BREAK)).toBe(break_m * 60);
    expect(p.getPhaseSeconds(Pomodoro.prototype.PHASE_WARN)).toBe(warm_m * 60);
  });

  it('Current timer.', function() {
    var p = new Pomodoro(53 *60, 5 *60, 2*60);
    expect(p.getTimer().getTimespan().getTotalSeconds()).toBe(53 *60);
    expect(p.getTimeStr()).toBe('53:00');
    expect(p.getTotalSeconds()).toBe(60 *60);
  });

  it('Start and pause.', function() {
    var p = new Pomodoro();
    expect(p.getPhase()).toBe(this._phase = Pomodoro.prototype.PHASE_WORK);
    expect(p.isPaused()).toBe(true);
    p.start();
    expect(p.isPaused()).toBe(false);
    p.pause();
    expect(p.isPaused()).toBe(true);
  });

});
