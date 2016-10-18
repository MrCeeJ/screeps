var  starterUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Working but ran out of energy
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        // Not working but full of energy
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            if (creep.memory.location > 3) {
                creep.memory.location = 0;
            }
            else {
                creep.memory.location++;
            }
            creep.memory.working = true;
        }

        // Working, has energy
        if (creep.memory.working) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }           
        }
        // Gathering energy
        else {
            var location = creep.memory.location == 0 ? 1 : 1;
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[location]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[location]);
            }
        }
    }
};

module.exports = starterUpgrader;