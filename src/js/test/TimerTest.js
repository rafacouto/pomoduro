
describe('Timer class tests.', function () {

  it('Default constructor with 0 seconds and clockwise.', function() {
    var t = new Timer();
    expect(t.isRunning()).toBe(false);
    expect(t.getTimespan().getTotalSeconds()).toBe(0);
    expect(t.isClockwise()).toBe(true);
  });

  it('Constructor with initial time.', function() {
    var t = new Timer(45);
    expect(t.isRunning()).toBe(false);
    expect(t.getTimespan().getTotalSeconds()).toBe(45);
    expect(t.isClockwise()).toBe(true);
  });

  it('Constructor with initial time and counter-clockwise.', function() {
    var t = new Timer(120, false);
    expect(t.isRunning()).toBe(false);
    expect(t.getTimespan().getTotalSeconds()).toBe(120);
    expect(t.isClockwise()).toBe(false);
  });

  it('Timer start and stop.', function() {
    var t = new Timer();
    expect(t.isRunning()).toBe(false);
    t.start();
    expect(t.isRunning()).toBe(true);
    t.stop();
    expect(t.isRunning()).toBe(false);
  });

  it('Timer reset.', function() {
    var t = new Timer();
    t.reset(Timespan.fromMinutes(2));
    expect(t.isRunning()).toBe(false);
    expect(t.getTimespan().getTotalSeconds()).toBe(120);
  });

  it('Timer as string (mm:SS).', function() {
    var t = new Timer();
    expect(t.getTimeStr()).toBe('0:00');
    t.reset(Timespan.fromSeconds(10));
    expect(t.getTimeStr()).toBe('0:10');
    t.reset(Timespan.fromMinutes(3));
    expect(t.getTimeStr()).toBe('3:00');
    t.reset(Timespan.fromHours(4));
    expect(t.getTimeStr()).toBe('240:00');
  });

});

// vim: et ts=2 sw=2 ai
