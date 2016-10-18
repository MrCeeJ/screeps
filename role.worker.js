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
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            const extensionsNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
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

           // Game.rooms['W9S51'].find(FIND_STRUCTURES, {filter: (i) => (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 150) });
           //  const containers = creep.room.find(FIND_STRUCTURES, {
           //      filter: (i) => (i.structureType == STRUCTURE_CONTAINER &&
           //                      i.store[RESOURCE_ENERGY] > creep.carryCapacity)
           //  });
            //
            const containers = _(creep.room.find(FIND_STRUCTURES))
                .filter(c => c.structureType == STRUCTURE_CONTAINER)
                //.filter(c => c.store[RESOURCE_ENERGY] > creep.carryCapacity)
                .sortBy(c => c.pos.getRangeTo(creep));

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