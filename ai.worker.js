const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, "Worker starting up!", true);
    creep.memory.state = 'GATHERING';
    return states[creep.memory.state](creep);
};

const STATE_GATHERING = function (creep) {
    const MIN_ENERGY = creep.carryCapacity;
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = 'WORKING';
        return states[creep.memory.state](creep);
    }
    return  ai.gatherContainerEnergy(creep) || ai.gatherNearestDroppedEnergy(creep, MIN_ENERGY);
};

const STATE_WORKING = function (creep) {
    if (creep.carry.energy == 0) {
        creep.memory.state = 'GATHERING';
        return states[creep.memory.state](creep);
    }
    return ai.buildBuildings(creep) || ai.repairBuildings(creep) || ai.upgradeRoom(creep);
};

const states = {
    'INITIALISING': STATE_INITIALISING,
    'GATHERING': STATE_GATHERING,
    'WORKING': STATE_WORKING
};

const drone = {

    /**
     * Generic Do everything drone.
     *
     * @param energy **/

    getBody: function (energy) {

        if (energy >= 800) {
            return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else if (energy >= 700) {
            return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else if (energy >= 600) {
            return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 550) {
            return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 500) {
            return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 400) {
            return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        else if (energy >= 300) {
            return [WORK, CARRY, CARRY, MOVE, MOVE];
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