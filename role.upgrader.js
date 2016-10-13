var roleUpgrader = {

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
            creep.say('upgrading!');
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
            var sources = creep.room.find(FIND_SOURCES);
            var location = creep.memory.location == 0 ? 0 : 1;
            if (creep.harvest(sources[location]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[location]);
            }
        }
    }
};

module.exports = roleUpgrader;