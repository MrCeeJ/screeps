const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const REFILL_TOWER_CAPACITY = 0.9;
const MINIMUM_ENERGY_TO_PICKUP = 0;

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
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = 'TRANSPORTING';
        return states[creep.memory.state](creep);
    }
    return ai.gatherDroppedEnergy(creep, MINIMUM_ENERGY_TO_PICKUP) || ai.gatherEnergyFromContainers(creep, creep.memory.sourceIds) || ai.harvestEnergy(creep);
};

const STATE_TRANSPORTING = function (creep) {
    if (creep.carry.energy == 0) {
        creep.memory.state = 'GATHERING';
        return states[creep.memory.state](creep);
    }
    return ai.refillExtensions(creep) || ai.refillSpawns(creep) || ai.refillTowers(creep, REFILL_TOWER_CAPACITY) || ai.refillContainersExcept(creep, creep.memory.sourceIds);
};

const states = {
    'INITIALISING': STATE_INITIALISING,
    'GATHERING' : STATE_GATHERING,
    'TRANSPORTING' : STATE_TRANSPORTING
};

const drone = {

    /**
     * Generic blank AI file.
     *
     * @param {Energy} energy **/

    getBody: function (energy) {

        if (energy >= 600) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else if (energy >= 450) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 350) {
            return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (energy >= 250) {
            return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else {
            return [CARRY, CARRY, MOVE];
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