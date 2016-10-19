var utils = {
    logMessage: function (message) {
        console.log(message);
    },

    logCreep: function (creep, message) {
        if (creep.memory.log){
            console.log(creep.memory.role + ':' + creep.name + ': ' + message);
        }
    }
};

module.exports = utils;