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

            // var priorityTargets = [STRUCTURE_CONTAINER];
            // var priorityFound = false;
            // for (var t in targets) {
            // 	if (!priorityFound && priorityTargets.indexOf(t.structureType)) {
            // 		priorityFound = true;
            // 		if (creep.transfer(t) == ERR_NOT_IN_RANGE) {
            //            	creep.moveTo(t);
            //                creep.say('On a priority mission!');
            //        	}
            // 	}
            // }
            // if (priorityFound) {
            // 	// we found a priority target, no need to do anything else.
            // }

            // Refil Spawn
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