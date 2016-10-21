const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, 'Transporter starting up!', true);
    if (creep.memory.flag == undefined) {
        utils.logCreep(creep, 'ALERT! No location defined', true);
        creep.say('Need Location!');
    } else {
        creep.memory.state = 'MOVING';
        utils.logCreep(creep, 'Moving to location [' + creep.memory.flag.pos.x + ',' + creep.memory.flag.pos.y + ']', true);
        return states[creep.memory.state](creep);
    }
};

const STATE_GATHERING = function (creep) {
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = 'TRANSPORTING';
        return states[creep.memory.state](creep);
    }
    return ai.gatherDroppedEnergy(creep) || ai.gatherEnergyFromContainers(creep, creep.memory.sources) || ai.harvestEnergy(creep);
};


const STATE_TRANSPORTING = function (creep) {
    if (creep.carry.energy == 0) {
        creep.memory.state = 'GATHERING';
        return states[creep.memory.state](creep);
    }
    return ai.refillExtensions(creep) || ai.refillSpawns(creep) || ai.refillTowers(creep) || ai.refillContainers(creep, creep.memory.sources);
};

const states = {
    'INITIALISING': STATE_INITIALISING,
    'GATHERING' : STATE_GATHERING,
    TRANSPORTING : STATE_TRANSPORTING
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