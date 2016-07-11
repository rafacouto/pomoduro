/**
 * Created by eloylp on 8/07/16.
 */


/*
 Pomodoro transfer object .
 */
function PomodoroTO(start_time, work_mins, break_mins, warn_mins) {

    if (start_time === undefined || work_mins === undefined
        || break_mins === undefined || warn_mins === undefined) {

        throw new Error("Pomodoro transfer object needs al arguments.");
    }

    this.start_time = start_time;
    this.work_mins = work_mins;
    this.break_mins = break_mins;
    this.warn_mins = warn_mins;
};

/*
 Pomodoro bridge to local storage
 */

var PomoDAO = {

    _storageEngine: window.localStorage,
    _storageKey: "mainprogram",

    getStorageKey: function () {

        return this._storageKey;
    },

    setStorageKey: function (storage_key) {

        this._storageKey = storage_key;
        this.checkStorage();
    },

    getStorageKeys: function () {
        this.checkStorage();
        return Object.keys(this._storageEngine);
    },

    // Creating the storage key if not exists.
    checkStorage: function () {
        if (!this._storageEngine.getItem(this._storageKey)) {
            this._storageEngine.setItem(this._storageKey, JSON.stringify([]));
        }
    },

    add: function (pomodoro) {

        this.checkStorage();
        var index = JSON.parse(this._storageEngine.getItem(this._storageKey));

        var new_length = index.push(pomodoro);
        this._storageEngine.setItem(this._storageKey, JSON.stringify(index));
        return new_length - 1;

    },
    getAll: function () {
        this.checkStorage();
        return JSON.parse(this._storageEngine.getItem(this._storageKey));
    },
    getOne: function (index_num) {
        this.checkStorage();
        return this.getAll()[index_num];
    },
    removeOne: function (index_num) {
        this.checkStorage();
        var pomodoros = this.getAll();
        pomodoros.splice(index_num, 1);
        this._storageEngine.setItem(this._storageKey, JSON.stringify(pomodoros));
    },
    removeAll: function () {
        this._storageEngine.setItem(this._storageKey, JSON.stringify([]));
    }
};