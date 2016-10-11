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

            // Refil any engery containers
            else if (containersNeedingEnergy.length) {
				if (creep.transfer(containersNeedingEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containersNeedingEnergy[0]);
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
            var sources = creep.room.find(FIND_SOURCES);
            var location = creep.memory.location == 0 ? 0 : 1;
            if (creep.harvest(sources[location]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[location]);
            }
        }
    }
};

module.exports = roleWorker;