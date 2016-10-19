var utils = {
    logMessage : function(message) {

    },

    logCreep : function (creep, message) {
        console.log('[${creep.memory.role}:{$creep.name}:${message}' );
    }

};

module.exports = utils;