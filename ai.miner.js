const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, 'Miner starting up!', true);
    if (creep.memory.source == undefined) {
        utils.logCreep(creep, 'ALERT! No location defined', true);
        creep.say('Need Location!');
    } else {
        creep.memory.state = 'MOVING';
        utils.logCreep(creep, 'Moving to location [' + creep.memory.source.x + ',' + creep.memory.source.y + ']', true);
        return states[creep.memory.state](creep);
    }
};

const STATE_MOVING = function (creep) {
    if (creep.memory.source) {
        if (creep.pos.x == creep.memory.source.x && creep.pos.y == creep.memory.source.y) {
            let target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            const result = creep.harvest(target);
            if (result != ERR_NOT_IN_RANGE) {
                utils.logCreep(creep, 'Arrived, mining from :' + target);
                creep.memory.state = 'MINING';
                creep.memory.targetId = target.id;
                creep.memory.ticksToArrive = 1500 - creep.ticksToLive;
            } else {
                utils.logCreep(creep, 'Problem :' + result);
            }
        } else {
            utils.logCreep(creep, 'Moving to :' + JSON.stringify(creep.memory.source));
            creep.moveTo(creep.memory.source.x, creep.memory.source.y);
        }
    }
};

const STATE_MINING = function (creep) {
    creep.harvest(Game.getObjectById(creep.memory.targetId));
    utils.logCreep(creep, "Just mining. zzz");
};


const states = {
    'INITIALISING': STATE_INITIALISING,
    'MOVING': STATE_MOVING,
    'MINING': STATE_MINING
};

const drone = {

    /**
     * Generic blank AI file.
     *
     * @param {Energy} energy **/

    getBody: function (energy) {

        if (energy >= 550) {
            return [WORK, WORK, WORK, WORK, WORK, MOVE];
        }
        else if (energy >= 450) {
            return [WORK, WORK, WORK, WORK, MOVE];
        }
        else if (energy >= 350) {
            return [WORK, WORK, WORK, MOVE];
        }
        else if (energy >= 250) {
            return [WORK, WORK, MOVE];
        }
        else {
            return [WORK, MOVE];
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