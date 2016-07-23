
describe('Timespan class tests.', function () {

  it('Default contructor initializes an empty span.', function() {
    var ts = new Timespan();
    expect(ts.getTotalMillis()).toBe(0);
  });

  it('Contructor initialized with milliseconds.', function() {
    var ts = new Timespan(1000);
    expect(ts.getTotalMillis()).toBe(1000);
  });

  it('A new instance of Timespan from second units.', function() {
    var ts = Timespan.fromSeconds(5);
    expect(ts.getTotalMillis()).toBe(5 * 1000);
  });

  it('A new instance of Timespan from minute units.', function() {
    var ts = Timespan.fromMinutes(2);
    expect(ts.getTotalMillis()).toBe(2 * 60 * 1000);
  });

  it('A new instance of Timespan from hour units.', function() {
    var ts = Timespan.fromHours(3);
    expect(ts.getTotalMillis()).toBe(3 * 60 * 60 * 1000);
  });

  it('A new instance of Timespan from day units.', function() {
    var ts = Timespan.fromDays(4);
    expect(ts.getTotalMillis()).toBe(4 * 24 * 60 * 60 * 1000);
  });

  it('The greater nearest second to the timespan.', function() {
    expect(new Timespan(0).getTotalSeconds()).toBe(0);
    expect(new Timespan(1).getTotalSeconds()).toBe(1);
    expect(new Timespan(999).getTotalSeconds()).toBe(1);
    expect(new Timespan(1000).getTotalSeconds()).toBe(1);
    expect(new Timespan(1001).getTotalSeconds()).toBe(2);
  });

  it('Addition of 2 Timespan instances.', function() {
    var half_second = new Timespan(500);
    var one_second = Timespan.fromSeconds(1);
    var ts = new Timespan();
    expect(ts.getTotalMillis()).toBe(0);
    expect(ts.add(one_second).getTotalMillis()).toBe(1000);
    expect(ts.add(one_second).getTotalMillis()).toBe(2000);
    expect(ts.add(half_second).getTotalMillis()).toBe(2500);
  });

  it('Substration of 2 Timespan instances.', function() {
    var half_second = new Timespan(500);
    var one_second = Timespan.fromSeconds(1);
    var ts = Timespan.fromSeconds(1);
    expect(ts.getTotalMillis()).toBe(1000);
    expect(ts.sub(half_second).getTotalMillis()).toBe(500);
    expect(ts.sub(one_second).getTotalMillis()).toBe(-500);
  });

  it('Comparison of 2 Timespan instances', function() {
    var ts1 = Timespan.fromSeconds(1);
    var ts2 = Timespan.fromSeconds(2);
    // equals
    expect(ts1.eq(ts1)).toBe(true);
    expect(ts1.eq(ts2)).toBe(false);
    // not equals
    expect(ts1.ne(ts1)).toBe(false);
    expect(ts1.ne(ts2)).toBe(true);
    // less than
    expect(ts1.lt(ts2)).toBe(true);
    expect(ts2.lt(ts1)).toBe(false);
    expect(ts1.lt(ts1)).toBe(false);
    // greater than
    expect(ts2.gt(ts1)).toBe(true);
    expect(ts1.gt(ts2)).toBe(false);
    expect(ts1.gt(ts1)).toBe(false);
    // less than or equals
    expect(ts1.lte(ts2)).toBe(true);
    expect(ts2.lte(ts1)).toBe(false);
    expect(ts1.lte(ts1)).toBe(true);
    // greater than or equals
    expect(ts2.gte(ts1)).toBe(true);
    expect(ts1.gte(ts2)).toBe(false);
    expect(ts1.gte(ts1)).toBe(true);
  });

});

// vim: et ts=2 sw=2 ai
