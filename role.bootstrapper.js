const utils = require('utils');

var roleBootstrapper = {

    /**
     * Build missing buildings
     * Repair stuff
     *
     * @param {Creep} creep **/

    getBody: function (maxEnergy) {

        if (maxEnergy >= 550) {
            return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 450) {
            return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
        }
        else if (maxEnergy >= 350) {
            return [WORK, WORK, CARRY, CARRY, MOVE];
        }
        else if (maxEnergy >= 250) {
            return [WORK, CARRY, CARRY, MOVE];
        }
        else {
            return [WORK, CARRY, MOVE];
        }
    },
    run: function (creep) {

        // Working but ran out of energy
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        // Not working but full of energy
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        // Working, has energy
        if (creep.memory.working) {

            let spawns = _(creep.room.find(FIND_MY_SPAWNS))
                .filter(s => s.energy <= s.energyCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();
            if (spawns.length) {
                if (creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0]);
                }
            }
            else {

                let buildings = _(creep.room.find(FIND_CONSTRUCTION_SITES))
                    .sortBy(s => s.pos.getRangeTo(creep.pos)).value();

                // Build Random Stuff
                if (buildings.length) {
                    if (creep.build(buildings[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(buildings[0]);
                        utils.logCreep(creep, 'Moving to build ' + buildings[0].structureType + ' at ' + buildings[0].pos);
                    }
                    utils.logCreep(creep, 'Building ' + buildings[0].structureType + ' at ' + buildings[0].pos);
                }
                // Refil any engery extensions
                else {
                    let extensions = _(creep.room.find(FIND_STRUCTURES))
                        .filter(s => s.structureType == STRUCTURE_EXTENSION)
                        .filter(s => s.energy < s.energyCapacity)
                        .sortBy(s => s.pos.getRangeTo(creep.pos))
                        .value();

                    if (extensions.length) {
                        if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(extensions[0]);
                        }
                    }
                    // Upgrade Controller
                    else {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
            }
        }
        // Gathering energy
        else {

            // Game.rooms['W9S51'].find(FIND_STRUCTURES, {filter: (i) => (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 150) });

            let energy = _(creep.room.find(FIND_DROPPED_ENERGY))
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (energy.length) {
                if (creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0]);
                    //utils.logMessage("Moving to source");
                    utils.logCreep(creep, 'Moving to source  ' + energy[0].pos);
                } else {
                    // utils.logMessage("Picking up energy");
                    utils.logCreep(creep, 'Picking up energy from ' + energy[0].pos);
                }
            }
        }
    }
};

module.exports = roleBootstrapper;