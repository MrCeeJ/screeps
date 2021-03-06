let lastLogTime;
const delay = 5;

const utils = {

    getIds: function(array) {
        const ids = [];
        for (const a in array) {
            ids.push(array[a].id);
        }
        return ids;
    },
    logMessage: function (message) {
        console.log(message);
        lastLogTime = Game.time;
    },

    logObject: function (message, object) {
        console.log(message ? message : 'object', JSON.stringify(object));
        lastLogTime = Game.time;

    },

    logCreep: function (creep, message, override) {
        if (override || creep.memory.log) {
            console.log(creep.memory.role + ':' + creep.name + ': ' + message);
            lastLogTime = Game.time;
        }
    },

    logHeartbeat : function () {
      const currentTime = Game.time;
      if (currentTime - lastLogTime > delay) {
          console.log("Nothing much happening, another "+ delay +" ticks go by.");
          lastLogTime = Game.time;
      }
    },
    logSettings: function (rooms) {
        for (const i in rooms) {
            //noinspection JSUnfilteredForInLoop
            console.log(":: Debugging room :" + i);
            if (rooms[i] !== undefined) {
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