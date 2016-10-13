var leftMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Gathering energy
        if (creep.memory.foundEnergy) {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.drop(RESOURCE_ENERGY);
            }
            creep.harvest(creep.memory.location);
        }
        // Looking for energy
        else {
            var sources = creep.room.find(FIND_SOURCES);
            var response = creep.harvest(sources[0]);
            if (response === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            } else if (response === OK) {
                creep.memory.foundEnergy = true;
                creep.memory.location = sources[0];
            }
        }
    }
};

module.exports = leftMiner;