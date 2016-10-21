const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, "Upgrader starting up!", true);
    creep.memory.state = 'GATHERING';
    return states[creep.memory.state](creep);
};

const STATE_GATHERING = function (creep) {
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = 'UPGRADING';
        return states[creep.memory.state](creep);
    }
    return ai.gatherDroppedEnergy(creep) || ai.gatherContainerEnergy(creep) || ai.harvestEnergy(creep);
};

const STATE_UPGRADING = function (creep) {
    if (creep.carry.energy == 0) {
        creep.memory.state = 'GATHERING';
        return states[creep.memory.state](creep);
    }
    return ai.upgradeRoom(creep);
};

const states = {
    'INITIALISING': STATE_INITIALISING,
    'GATHERING': STATE_GATHERING,
    'UPGRADING': STATE_UPGRADING
};

const drone = {

    /**
     * Generic blank AI file.
     *
     * @param {Energy} energy **/

    getBody: function (energy) {

        if (energy >= 650) {
            return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 550) {
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