var transporter = {

    getBody: function (maxEnergy) {

        if (maxEnergy >= 550) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 450) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 350) {
            return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 250) {
            return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        else {
            Game.notify(`Unable to spawn miner using ${maxEnergy} energy! Spawning worker instead`);
            return [CARRY, CARRY, MOVE];
        }

    },

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
            let extensions = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType == STRUCTURE_EXTENSION)
                .filter(s => s.store[RESOURCE_ENERGY] <= s.energyCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (extensions.length) {
                if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensions[0]);
                }
            } else {

                let spawns = _(creep.room.find(FIND_MY_SPAWNS))
                    .filter(s => s.store[RESOURCE_ENERGY] <= s.energyCapacity)
                    .sortBy(s => s.pos.getRangeTo(creep.pos))
                    .value();
                if (spawms.length) {
                    if (creep.transfer(spawms[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawms[0]);
                    }
                }
                else {
                    let containers = _(creep.room.find(FIND_STRUCTURES))
                        .filter(s => s.structureType == STRUCTURE_CONTAINER)
                        .filter(s => s.store[RESOURCE_ENERGY] <= s.storeCapacity)
                        .sortBy(s => s.pos.getRangeTo(creep.pos))
                        .value();

                    if (containers.length) {
                        if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0]);
                        }
                    }
                }
            }
        }
    }
};

module.exports = transporter;