/**
 * Created by eloylp on 8/07/16.
 */


/*
Pomodoro transfer object .
 */
var Pomodoro = {

    start_time: new Date(),
    work_mins: 23,
    break_mins: 23,
    warn_mins: 23
};

/*
Pomodoro bridge to local storage
 */

var PomoDAO = {

    storageEngine: window.localStorage,
    storageKey: "pomodoro",

    // Creating the storage key if not exists.
    checkStorage: function () {
        if (!this.storageEngine.getItem(this.storageKey)) {
            this.storageEngine.setItem("pomodoro", JSON.stringify([]));
        }
    },
    // TODO. Must return the index in success. undefined on fail.
    addPomodoro: function (pomodoro) {

        this.checkStorage();
        var index = JSON.parse(this.storageEngine.getItem(this.storageKey));

        for(var i=0, length=index.length; i < length; i++){

            // TODO . Check pomodoro time collision. May call another function.
        }

    },
    getAllPomodoros: function () {
        this.checkStorage();
        return JSON.parse(this.storageEngine.getItem(this.storageKey));
    },
    getPomodoro:function(index_num){
        this.checkStorage();
        return this.getAllPomodoros()[index_num];
    },
    
    deletePomodoro: function(index_num){
        this.checkStorage();
        var pomodoros = this.getAllPomodoros();
        delete pomodoros[index_num];
        this.storageEngine.setItem(this.storageKey, JSON.stringify(pomodoros));
    }
};