const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const REFILL_TOWER_CAPACITY = 0.9;
const MIN_PICKUP = 0;
const MIN_CONTAINER = 300;
const MIN_STORE = 0;
const MIN_FULLNESS = 0.8;

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, 'Transporter starting up!', true);
    if (creep.memory.sourceIds == undefined) {
        utils.logCreep(creep, 'ALERT! No container ids defined', true);
        creep.say('Need ids!');
    } else {
        creep.memory.state = 'GATHERING';
        utils.logCreep(creep, 'Gathering from locations [' + JSON.stringify(creep.memory.sourceIds) + ']', true);
        return states[creep.memory.state](creep);
    }
};

const STATE_GATHERING = function (creep) {
    let total = _.sum(creep.carry);
    if (total == creep.carryCapacity) {
        creep.memory.state = 'TRANSPORTING';
        return states[creep.memory.state](creep);
    }
    const needed = creep.carryCapacity - total;
    return ai.gatherMostDroppedEnergy(creep, MIN_PICKUP)
        || ai.gatherEnergyFromContainers(creep, creep.memory.sourceIds, needed)
        || ai.gatherEnergyFromContainers(creep, creep.memory.sourceIds, MIN_CONTAINER)
        || ai.gatherStoredEnergy(creep, MIN_STORE);
};

const STATE_TRANSPORTING = function (creep) {
    if (creep.carry.energy == 0) {
        let total = _.sum(creep.carry);
        if (total) {
            ai.dumpMinerals(creep)
        }
        else {
            creep.memory.state = 'GATHERING';
            return states[creep.memory.state](creep);
        }
    } else return ai.refillExtensions(creep)
        || ai.refillSpawns(creep)
        || ai.refillTowers(creep, REFILL_TOWER_CAPACITY)
        || ai.refillContainersExcept(creep, creep.memory.sourceIds, MIN_FULLNESS)
        || ai.refillStorage(creep)
        || ai.goToSpawnOrGather(creep);
};

const states = {
    'INITIALISING': STATE_INITIALISING,
    'GATHERING': STATE_GATHERING,
    'TRANSPORTING': STATE_TRANSPORTING
};

const drone = {

    /**
     * Generic blank AI file.
     *
     * @param energy **/

    getBody: function (energy) {

        if (energy >= 900) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (energy >= 750) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if (energy >= 600) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else if (energy >= 450) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 300) {
            return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
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