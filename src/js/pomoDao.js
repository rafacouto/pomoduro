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
    this.finish_time = this.start_time + this.work_mins * 60000 + this.break_mins * 60000 + this.warn_mins * 60000;
};

/*
 Pomodoro bridge to local storage
 */

var PomoDAO = {

    storageEngine: window.localStorage,
    storageKey: "mainprogram",

    setStorageKey: function (storage_key) {

        this.storageKey = storage_key;
    },

    // Creating the storage key if not exists.
    checkStorage: function () {
        if (!this.storageEngine.getItem(this.storageKey)) {
            this.storageEngine.setItem(this.storageKey, JSON.stringify([]));
        }
    },

    add: function (pomodoro) {

        this.checkStorage();
        var index = JSON.parse(this.storageEngine.getItem(this.storageKey));

        var new_length = index.push(pomodoro);
        this.storageEngine.setItem(this.storageKey, JSON.stringify(index));
        return new_length - 1;

    },
    getAll: function () {
        this.checkStorage();
        return JSON.parse(this.storageEngine.getItem(this.storageKey));
    },
    getOne: function (index_num) {
        this.checkStorage();
        return this.getAll()[index_num];
    },
    removeOne: function (index_num) {
        this.checkStorage();
        var pomodoros = this.getAll();
        pomodoros.splice(index_num, 1);
        this.storageEngine.setItem(this.storageKey, JSON.stringify(pomodoros));
    },
    removeAll: function () {
        this.storageEngine.setItem(this.storageKey, JSON.stringify([]));
    }
};