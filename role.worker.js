var roleWorker = {

    /** @param {Creep} creep **/
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
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            var extensionsNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
            	filter: (i) => i.structureType == STRUCTURE_EXTENSION &&
                   		i.energy < i.energyCapacity
                });

            // Refil Spawn
            if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
            // Build Random Stuff
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }

            // Refil any engery extensions
            else if (extensionsNeedingEnergy.length) {
				if (creep.transfer(extensionsNeedingEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensionsNeedingEnergy[0]);
                }
            }
            // Upgrade Controller
            else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }

        }
        // Gathering energy
        else {
            var source = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) =>  i.structureType == STRUCTURE_CONTAINER &&
                    i.energy > i.energyCapacity*.25 &&
                    i.energy > creep.carryCapacity
                }
            );
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleWorker;