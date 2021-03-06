const utils = require('utils');
const ai = require('ai.toolkit');

const REFILL_TOWER_CAPACITY = 0.75;

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, "Drone starting up!", true);
    creep.memory.state = 'GATHERING';
    return states[creep.memory.state](creep);
};

const STATE_GATHERING = function (creep) {
    const MIN_ENERGY = creep.carryCapacity;
    if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.state = 'WORKING';
        return states[creep.memory.state](creep);
    }
    return ai.gatherNearestDroppedEnergy(creep, MIN_ENERGY) || ai.gatherContainerEnergy(creep) || ai.harvestEnergy(creep);
};

const STATE_WORKING = function (creep) {
    if (creep.carry.energy === 0) {
        creep.memory.state = 'GATHERING';
        return states[creep.memory.state](creep);
    }
    return ai.refillExtensions(creep) || ai.refillSpawns(creep) || ai.refillTowers(creep, REFILL_TOWER_CAPACITY) || ai.buildBuildings(creep) || ai.repairBuildings(creep) || ai.upgradeRoom(creep);
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
        if (creep.memory.state === undefined) {
            creep.memory.state = 'INITIALISING';
        }
        states[creep.memory.state](creep);
    }
};
module.exports = drone;