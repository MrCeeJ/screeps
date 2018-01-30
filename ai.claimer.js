const utils = require('utils');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, " starting up!", true);
    if (!creep.memory.destination) {
        utils.logCreep(creep, "Warning, no destination set!", true);
    } else {
        transitionToState('MOVING');
    }
};

const STATE_MOVING = function (creep) {
    if (creep.room !== creep.memory.destination.room) {
        creep.moveTo(creep.memory.destination);
    } else {
        transitionToState('CLAIMING');
    }
};

const STATE_CLAIMING = function (creep) {
    if (!creep.memory.claimed) {
        if (ai.claimRoom(creep)) {
            creep.memory.claimed = true;
            utils.logCreep(creep, "Room claimed!");
        }
        utils.logCreep(creep, "Room not yet claimed, moving to position");
    }
    utils.logCreep(creep, "Room already claimed, nothing to do.");
};


const states = {
    'INITIALISING': STATE_INITIALISING,
    'CLAIMING': STATE_CLAIMING,
    'MOVING': STATE_MOVING
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

        if (energy >= 650) {
            return [CLAIM, MOVE];
        }
    },

    run: function (creep) {
        if (creep.memory.state === undefined) {
            creep.memory.state = 'INITIALISING';
        }
        states[creep.memory.state](creep);
    }
};
module.exports = drone;