var roleUpgrader = {

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
            // Upgrade Controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        // Gathering energy
        else {
            var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
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

module.exports = roleUpgrader;