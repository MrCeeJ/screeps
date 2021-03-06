var roleWorker = {

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
            let buildings = _(creep.room.find(FIND_CONSTRUCTION_SITES))
                .sortBy(s => s.pos.getRangeTo(creep.pos)).value();

            // Refil Spawn
            if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
            // Build Random Stuff
            else if (buildings.length) {
                if (creep.build(buildings[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildings[0]);
                }
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
                        .filter(s => s.energy <= s.energyCapacity*0.8)
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

module.exports = roleWorker;