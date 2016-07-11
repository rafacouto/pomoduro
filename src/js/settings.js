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
        this.addProgramAddEvent();
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

        }.bind(this));
    },
    refreshProgramList: function () {

        var program_select = this._element.querySelector('.program-select');
        program_select.innerHTML = '';
        var storage_keys = this._dao.getStorageKeys();
        for (var s in storage_keys) {
            program_select.innerHTML += '<option value="' + storage_keys[s] + '">' + storage_keys[s] + '</option>';
        }
    }

};