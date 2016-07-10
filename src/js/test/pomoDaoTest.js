describe('Pomoduro data access object tests. WebStorage.', function () {

    beforeEach(function () {
        window.localStorage.clear();
        pomoDaoTest = Object.assign({}, PomoDAO);
    });

    afterEach(function () {
        window.localStorage.clear();
        pomoDaoTest = null;
    });

    it('Should return the index 0 on pomodoro add.', function () {

        var pomoduro = new PomodoroTO(new Date(), 50, 10, 2);
        expect(pomoDaoTest.add(pomoduro)).toEqual(0);
    });

    it('Should create a new Pomoduro transfer object without params is an exception.', function () {

        var error = "Pomodoro transfer object needs al arguments.";

        expect(function () {
            new PomodoroTO(new Date(), 23, 23)
        }).toThrow(new Error(error));
        expect(function () {
            new PomodoroTO(new Date(), 23)
        }).toThrow(new Error(error));
        expect(function () {
            new PomodoroTO(new Date())
        }).toThrow(new Error(error));
        expect(function () {
            new PomodoroTO()
        }).toThrow(new Error(error));

    });

    it('Should create a new Pomoduro transfer object with no extra fields.', function () {

        var pomoduro = new PomodoroTO(new Date(), 50, 10, 2);

        var expected = [

            'start_time',
            'work_mins',
            'break_mins',
            'warn_mins'
        ];
        expect(Object.keys(pomoduro)).toEqual(expected);

    });

    it('Should get a pomodoro exactly as inserted.', function () {

        var pomoduro = new PomodoroTO("23:34:01", 50, 10, 2);
        pomoDaoTest.add(pomoduro);

        var retrieved_pomoduro = pomoDaoTest.getOne(0);

        expect(retrieved_pomoduro.start_time).toEqual(pomoduro.start_time);
        expect(retrieved_pomoduro.work_mins).toEqual(pomoduro.work_mins);
        expect(retrieved_pomoduro.break_mins).toEqual(pomoduro.break_mins);
        expect(retrieved_pomoduro.warn_mins).toEqual(pomoduro.warn_mins);
        expect(retrieved_pomoduro.finish_time).toEqual(pomoduro.finish_time);

    });

    it('Should return all pomodoros in main program.', function () {

        var pomodoros = [
            new PomodoroTO(2323, 23, 23, 23),
            new PomodoroTO(2323, 23, 23, 23),
            new PomodoroTO(23, 23, 23, 23)
        ];
        window.localStorage.setItem("mainprogram", JSON.stringify(pomodoros));
        expect(pomoDaoTest.getAll().length).toEqual(3);
    });

    it('Should return especified pomodoro in main program.', function () {

        var pomodoros = [
            new PomodoroTO(2323, 23, 23, 23),
            new PomodoroTO("expected", 23, 23, 23),
            new PomodoroTO(23, 23, 23, 23)
        ];
        window.localStorage.setItem("mainprogram", JSON.stringify(pomodoros));
        expect(pomoDaoTest.getOne(1).start_time).toEqual("expected");
    });

    it('Should remove especified pomodoro.', function () {

        var pomodoros = [
            new PomodoroTO(23, 23, 23, 23),
            new PomodoroTO("expected", 23, 23, 23),
            new PomodoroTO(23, 23, 23, 23)
        ];
        window.localStorage.setItem("mainprogram", JSON.stringify(pomodoros));
        pomoDaoTest.removeOne(1);

        var data = JSON.parse(window.localStorage.getItem("mainprogram"));
        expect(data.length).toEqual(2);

    });

    it('Should remove all pomodoros in program.', function () {

        var pomodoros = [
            new PomodoroTO(23, 23, 23, 23),
            new PomodoroTO("expected", 23, 23, 23),
            new PomodoroTO(23, 23, 23, 23)
        ];
        window.localStorage.setItem("mainprogram", JSON.stringify(pomodoros));
        pomoDaoTest.removeAll();

        var data = JSON.parse(window.localStorage.getItem("mainprogram"));
        expect(data.length).toEqual(0);

    });

    it('Should maintain programs isolated each other in operations.', function () {

        pomoDaoTest.setStorageKey("other_program");

        var pomodoros = [
            new PomodoroTO(23, 23, 23, 23),
            new PomodoroTO("expected", 23, 23, 23),
            new PomodoroTO(23, 23, 23, 23)
        ];

        for (var item in pomodoros) {
            pomoDaoTest.add(pomodoros[item]);
        }

        expect(pomoDaoTest.getAll().length).toEqual(3);
        pomoDaoTest.setStorageKey("mainprogram");
        expect(pomoDaoTest.getAll().length).toEqual(0);
        pomoDaoTest.add(pomodoros[1]);
        expect(pomoDaoTest.getAll().length).toEqual(1);
        pomoDaoTest.setStorageKey("other_program");
        pomoDaoTest.removeOne(0);
        expect(pomoDaoTest.getAll().length).toEqual(2);
        pomoDaoTest.removeAll();
        expect(pomoDaoTest.getAll().length).toEqual(0);
        pomoDaoTest.setStorageKey("mainprogram");
        expect(pomoDaoTest.getAll().length).toEqual(1);

    });

    it('Should change storage key.', function () {

        pomoDaoTest.setStorageKey("other_program");
        expect(pomoDaoTest.getStorageKey()).toEqual("other_program");
    });

    it('Should return storage keys.', function () {

        pomoDaoTest.add(new PomodoroTO(23, 23, 23, 23));
        pomoDaoTest.setStorageKey("other_program");
        pomoDaoTest.add(new PomodoroTO(23, 23, 23, 23));
        expect(pomoDaoTest.getStorageKeys().length).toEqual(2);
    });

});