var gatherer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Carrying energy
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.gathering = false;
        }
        // Gathering energy
        else if (creep.carry.energy == 0) {
            creep.memory.gathering = true;
        }
        // Pick up
        if (creep.memory.gathering) {
            var sources = creep.room.find(FIND_DROPPED_ENERGY);
            creep.pickup(sources[0]);
        }
        // Drop off
        else {
            var containersNeedingEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                i.store[RESOURCE_ENERGY] < i.storeCapacity
            });

            if (containersNeedingEnergy.length) {
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
    }
};

module.exports = gatherer;