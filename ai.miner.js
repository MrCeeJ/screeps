const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, 'Miner starting up!', true);
    if (creep.memory.flagId == undefined) {
        utils.logCreep(creep, 'ALERT! No location defined', true);
        creep.say('Need Location!');
    } else {
        creep.memory.state = 'MOVING';
        utils.logCreep(creep, 'Moving to location ['+creep.memory.locationX+','+creep.memory.locationY+']', true);
        return states[creep.memory.state](creep);
    }
};

const STATE_MOVING = function (creep) {

    creep.moveTo(creep.memory.flagId);
    if (creep.pos == creep.memory.flagId.pos) {
        let target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        const result = creep.harvest(target);
        if (result != ERR_NOT_IN_RANGE) {
            creep.say('Arrived, mining from :'+target);
            creep.memory.targetId = target.id;
        } else {
            creep.say('Problem :'+result);
        }
    }
};

const STATE_MINING = function (creep) {
    creep.harvest(Game.getObjectById(creep.memory.targetId));
    creep.drop(RESOURCE_ENERGY);
    utils.logCreep(creep, "Just mining. zzz");
};


const states = {
    'INITIALISING': STATE_INITIALISING,
    'MOVING' : STATE_MOVING,
    'MINING' : STATE_MINING
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