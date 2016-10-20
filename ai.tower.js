const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, "Tower starting up!", true);
    creep.memory.state = 'REPAIRING';
    return states[creep.memory.state](creep);
};

const STATE_REPAIRING = function (creep) {
    return ai.repairBuildings(creep);
};

const states = {
    'INITIALISING': STATE_INITIALISING,
    'REPAIRING': STATE_REPAIRING
};

const tower = {

    /**
     * A Repair only tower.
     *
     * @param {Creep} creep **/

    run: function (creep) {
        if (creep.memory.state == undefined) {
            creep.memory.state = 'INITIALISING';
        }
        states[creep.memory.state](creep);
    }
};
module.exports = tower;