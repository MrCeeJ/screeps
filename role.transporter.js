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
            const nearestExtension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_EXTENSION &&
                i.energy < (i.storeCapacity - creep.carryCapacity)
            });
            if (nearestExtension) {
                if (creep.transfer(nearestExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestExtension);
                }
            }
            else {
                const nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.energy < (i.storeCapacity - creep.carryCapacity) &&
                    i.id != creep.memory.sourceId
                });
                if (nearestContainer) {
                    if (creep.transfer(nearestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(nearestContainer);
                    }
                }
                else {
                    const allExtensions = creep.room.find(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_EXTENSION &&
                        i.energy < (i.storeCapacity - creep.carryCapacity)
                    });
                    if (allExtensions.length) {
                        if (creep.transfer(allExtensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(allExtensions[0]);
                        }
                    }
                    else {
                        const allContainers = creep.room.find(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_EXTENSION &&
                            i.energy < (i.storeCapacity - creep.carryCapacity)
                        });
                        if (allContainers.length) {
                            if (creep.transfer(allContainers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(allContainers[0]);
                            }
                        }
                        else {
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller);
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = transporter;