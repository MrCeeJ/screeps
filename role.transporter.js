var transporter = {

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
        // Pick up from designated source
        if (creep.memory.gathering) {
            var source = Game.getObjectById(creep.memory.sourceId);
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        // Drop off
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) =>  i.structureType == STRUCTURE_CONTAINER &&
                                i.energy < (i.storeCapacity-creep.carryCapacity) &&
                                i.id != creep.memory.sourceId
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
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

module.exports = transporter;