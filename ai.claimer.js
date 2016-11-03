const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, " starting up!", true);
    if (!creep.memory.destination) {
        utils.logCreep(creep, "Warning, no destination set!", true);
    } else {
        creep.memory.state='MOVING';
        return states[creep.memory.state](creep);
    }
};

const STATE_MOVING = function (creep) {
    if (creep.room.location == creep.memory.destination){

    }
};

const STATE_CLAIMING = function (creep) {

};


const states = {
    'INITIALISING': STATE_INITIALISING,
    'CLAIMING': STATE_CLAIMING,
    'MOVING' : STATE_MOVING
};

const drone = {

    /**
     * Generic blank AI file.
     *
     * @param {Creep} creep **/

    getBody: function (energy) {

        if (energy >= 550) {
            return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 450) {
            return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
        }
        else if (energy >= 350) {
            return [WORK, WORK, CARRY, CARRY, MOVE];
        }
        else if (energy >= 250) {
            return [WORK, CARRY, CARRY, MOVE];
        }
        else {
            return [WORK, CARRY, MOVE];
        }

    },

    run: function (creep) {
        if (creep.memory.state == undefined) {
            creep.memory.state = 'INITIALISING';
        }
        states[creep.memory.state](creep);
    }
};
module.exports = drone;