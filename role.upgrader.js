var roleUpgrader = {

    /**
     * Take Energy from nearest Container and upgrade the room
     *
     * @param maxEnergy
     * @returns {*[]}
     */

    getBody: function (maxEnergy) {

        if (maxEnergy >= 550) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 450) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 350) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE];
        }
        else if (maxEnergy >= 250) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE];
        }
        else {
            Game.notify(`Unable to spawn miner using ${maxEnergy} energy! Spawning worker instead`);
            return [CARRY, CARRY, MOVE];
        }

    },
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
            let containers = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType == STRUCTURE_CONTAINER)
                .filter(s => s.store[RESOURCE_ENERGY] >= creep.carryCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();
            if (containers.length) {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
            } else {
                creep.say("El Problemo");
            }

        }
    }
};

module.exports = roleUpgrader;