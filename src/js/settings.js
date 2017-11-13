/// TODO. 1- clear programs, delete program. Main program always exist. only clear.


var pomoSettings = {

    _dao: PomoDAO,
    _selector: "#pomoduro-settings-table",
    _element: null,

    setSelector: function (selector) {
        this._selector = selector;
    },
    getSelector: function () {
        return this._selector;
    },
    init: function () {

        this._element = document.querySelector(this.getSelector());

        this.refreshProgramList();
        this.refreshPomoduroList();
        this.addProgramAddEvent();
        this.addProgramClearEvent();
        this.addProgramDelEvent();
        this.addProgramSwitchEvent();
        this.addPomoduroAddEvent();
    },
    addProgramAddEvent: function () {
        var button = this._element.querySelector('.program-add-button');
        button.addEventListener('click', function () {

            var input = this._element.querySelector('.program-name');

            if (input.value == '') {
                alert('Set a program name.');
                return false;
            }

            this._dao.setStorageKey(input.value);
            this.refreshProgramList();
            this.refreshPomoduroList();
            input.value = '';

        }.bind(this));
    },
    addProgramDelEvent: function () {

        var button = document.querySelector('.program-delete-button');
        button.addEventListener('click', function () {

            this._dao.removeStorageKey();
            this.refreshProgramList();
            this.refreshPomoduroList();
        }.bind(this));
    },
    addProgramClearEvent: function () {

        var button = document.querySelector('.program-clear-button');
        button.addEventListener('click', function () {

            this._dao.clearStorageKey();
            this.refreshPomoduroList();

        }.bind(this));
    },
    addProgramSwitchEvent: function () {

        var program_select = this._element.querySelector('.program-select');
        program_select.addEventListener('change', function (evt) {
            this._dao.setStorageKey(evt.target.value);
            this.refreshPomoduroList();

        }.bind(this));
    },


    refreshProgramList: function () {

        var program_select = this._element.querySelector('.program-select');
        program_select.innerHTML = '';
        var storage_keys = this._dao.getStorageKeys();
        var selected = '';
        for (var s in storage_keys) {

            if (this._dao.getStorageKey() == storage_keys[s]) {
                selected = 'selected';
            }
            program_select.innerHTML += '<option ' + selected + ' value="' + storage_keys[s] + '">' + storage_keys[s] + '</option>';
            selected = '';
        }
    },
    refreshPomoduroList: function () {
        var tbody = this._element.querySelector('tbody');
        var pomodoros = this._dao.getAll();

        tbody.innerHTML = '';

        for (var p in pomodoros) {

            var pd = pomodoros[p];
            var number = parseInt(p) + 1;

            tbody.innerHTML += '<tr><td class="align-center">' + number + '</td><td class="align-center">'
                + pd.start_time + '</td><td class="align-center">'
                + pd.work_mins + '</td><td class="align-center">'
                + pd.break_mins + '</td><td class="align-center">'
                + pd.warn_mins + '</td><td colspan="2" class="align-center">' +
                '<button class="cancel" data-id="' + p + '">Del</button></td>' +
                '</tr>';
        }
        var cancelations = tbody.querySelectorAll('.cancel');
        [].forEach.call(cancelations, function (item) {

            item.addEventListener('click', function (evt) {
                this._dao.removeOne(parseInt(evt.target.dataset.id));
                this.refreshPomoduroList();
            }.bind(this));
        }.bind(this));
    },
    addPomoduroAddEvent: function () {

        var add_button = this._element.querySelector('.pomodoro-add-button');
        var start_time = this._element.querySelector('.pomo-add-start');
        var work_minutes = this._element.querySelector('.pomo-add-work');
        var break_minutes = this._element.querySelector('.pomo-add-break');
        var warn_minutes = this._element.querySelector('.pomo-add-warn');

        var elems = [start_time, work_minutes, break_minutes, warn_minutes];

        add_button.addEventListener('click', function () {

            for (var e in elems) {
                if (elems[e].value.length == 0) {
                    alert('Pomoduro need all data.');
                    return false;
                }
            }

            if(!start_time.value.match(/^\d\d:\d\d$/)){

                alert('Start Time doesn seems a valid hh:mm time.');
                return false;
            }

            /// TODO . Pomoduro time collision check ??????.

            var pomoduro = new PomodoroTO(start_time.value, work_minutes.value, break_minutes.value, warn_minutes.value);
            this._dao.add(pomoduro);

            for (var e in elems) {
                elems[e].value == '';
            }

            this.refreshPomoduroList();

        }.bind(this));
    }
};