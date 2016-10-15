var  starterMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Working but ran out of energy
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        // Not working but full of energy
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            if (creep.memory.location > 2) {
                creep.memory.location = 0;
            }
            else {
                creep.memory.location++;
            }
            creep.memory.working = true;
        }

        // Working, has energy
        if (creep.memory.working) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

            var extensionsNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
            	filter: (i) => i.structureType == STRUCTURE_EXTENSION &&
                   		i.energy < i.energyCapacity
            });

            // Refil Spawn
            // if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
            //     if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(Game.spawns['Spawn1']);
            //     }
            // }
            // Build Random Stuff
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
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
            var location = creep.memory.location == 0 ? 0 : 1;
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[location]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[location]);
            }
        }
    }
};

module.exports = starterMiner;