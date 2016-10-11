var roleWorker = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Working but ran out of energy
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('empty :(');
        }
        // Not working but full of energy
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            if (creep.memory.location >= 2) {
                creep.memory.location = 0;
            } else {
                creep.memory.location++;
            }
            creep.say('full :)');
        }

        // Working, has energy
        if (creep.memory.working) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            var extensionsNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
            	filter: (i) => (i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_SPAWN) &&
                   		i.energy < i.energyCapacity
            });

            var towersNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => (i.structureType == STRUCTURE_TOWER) && i.energy < i.energyCapacity
            });

            var containersNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
    				filter: (i) => i.structureType == STRUCTURE_CONTAINER && 
                   		i.store[RESOURCE_ENERGY] < i.storeCapacity
			});

            // Refill Spawn
            if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
            // Build Random Stuff
            else if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }

            // Refill any engery extensions
            else if (extensionsNeedingEnergy.length) {
				if (creep.transferEnergy(extensionsNeedingEnergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensionsNeedingEnergy[0]);
                }
            }

            // Refill any towers
            else if (towersNeedingEnergy.length) {
                if (creep.transfer(towersNeedingEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towersNeedingEnergy[0]);
                }
            }

            // Refill any engery containers
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