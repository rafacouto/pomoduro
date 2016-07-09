/**
 * Created by eloylp on 8/07/16.
 */


/*
Pomodoro transfer object .
 */
function PomodoroTO (start_time, work_mins, break_mins, warn_mins){

    this.start_time = start_time;
    this.work_mins = work_mins;
    this.break_mins = break_mins;
    this.warn_mins = warn_mins;
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

        index.push(pomodoro);

        this.storageEngine.setItem(this.storageKey, JSON.stringify(index));

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