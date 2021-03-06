const utils = require('utils');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, " starting up!", true);

    return states[creep.memory.state](creep);
};

const STATE_ = function (creep) {

};


const states = {
    'INITIALISING': STATE_INITIALISING,

};

function transitionToState(creep, state) {
    creep.memory.state = state;
    return states[creep.memory.state](creep);
}

const drone = {

    /**
     * Generic blank AI file.
     *
     * @param energy **/
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