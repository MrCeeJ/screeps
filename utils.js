const utils = {
    logMessage: function (message) {
        console.log(message);
    },

    logObject: function(object) {
        console.log('object', JSON.stringify(object));
    },

    logCreep: function (creep, message, override) {
        if (override || creep.memory.log){
            console.log(creep.memory.role + ':' + creep.name + ': ' + message);
        }
    },

    logSettings: function (rooms) {
        for (const i in rooms) {
            //noinspection JSUnfilteredForInLoop
            console.log(":: Debugging room :" + i);
            if (rooms[i]!==undefined) {
                console.log("spawns :" + rooms[i].spawns);
                console.log("energySources :" + rooms[i].energySources);
                console.log("mineralSources :" + rooms[i].mineralSources);
                console.log("maxCreeps :" + rooms[i].maxCreeps);
                console.log("maxWorkers :" + rooms[i].maxWorkers);
                console.log("maxMiners :" + rooms[i].maxMiners);
                console.log("maxUpgraders :" + rooms[i].maxUpgraders);
                console.log("maxTransporters :" + rooms[i].maxTransporters);
            }

        }

    }
};

module.exports = utils;