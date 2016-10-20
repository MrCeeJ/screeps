const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const STATE_INITIALISING = function (creep) {
    utils.logCreep(creep, "Drone starting up!", true);
    creep.memory.state = STATE_GATHERING;
    return states[creep.memory.state](creep);
};

const STATE_GATHERING = function (creep) {
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = 'WORKING';
        return states[creep.memory.state](creep);
    }
    return ai.gatherDroppedEnergy(creep) || ai.gatherContainerEnergy(creep) || ai.harvestEnergy(creep);
};

const STATE_WORKING = function (creep) {
    if (creep.carry.energy == 0) {
        creep.memory.state = 'GATHERING';
        return states[creep.memory.state](creep);
    }
    return ai.refillExtensions(creep) || ai.refillSpawns(creep) || ai.refillTowers(creep) || ai.buildBuildings(creep) || ai.upgradeRoom(creep);
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


        // Working, has energy
        if (creep.memory.working) {


            // Refil Spawn
            if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
            // Build Random Stuff
            else
            }
            // Refil any engery extensions
            else {
                let extensions = _(creep.room.find(FIND_STRUCTURES))
                    .filter(s => s.structureType == STRUCTURE_EXTENSION)
                    .filter(s => s.energy <= s.energyCapacity)
                    .sortBy(s => s.pos.getRangeTo(creep.pos))
                    .value();

                if (extensions.length) {
                    if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extensions[0]);
                    }
                }
                // Upgrade Controller
                else {
                    let towers = _(creep.room.find(FIND_STRUCTURES))
                        .filter(s => s.structureType == STRUCTURE_TOWER)
                        .filter(s => s.energy <= s.energyCapacity * 0.8)
                        .sortBy(s => s.pos.getRangeTo(creep.pos))
                        .value();
                    if (towers.length) {
                        if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(towers[0]);
                        }
                    }

                    else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
        // Gathering energy
        else {

            // Game.rooms['W9S51'].find(FIND_STRUCTURES, {filter: (i) => (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 150) });

            let containers = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType == STRUCTURE_CONTAINER)
                .filter(s => s.store[RESOURCE_ENERGY] >= creep.carryCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (!containers.length) {
                creep.say("No valid containers");
            }
            else if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
            }
        }
    }
};

module.exports = drone;