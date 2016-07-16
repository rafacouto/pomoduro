
describe('WorkDay class tests.', function () {

  it('Default constructor (empty).', function() {
    var wd  = new WorkDay();
    expect(wd.getProgram().length).toBe(0);
  });

  it('Create new pomodoros.', function() {
    var wd  = new WorkDay();
    expect(wd.getProgram().length).toBe(0);
    wd.newPomodoro('10:00'); // default is (50,10,0)
    wd.newPomodoro('11:00', 55, 5);
    wd.newPomodoro('12:00', 50, 5, 5);
    expect(wd.getProgram().length).toBe(3);
    for (var p = 0; p < 3; p++) {
      var pomodoro = wd.getProgram()[p].pomodoro;
      expect(pomodoro.getTotalSeconds()).toBe(60 *60);
    }
  });

});
