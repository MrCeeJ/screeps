var miner = {

    /** @param {Creep} creep
     * memory.home Set to false to move to
     * memory.locationX The target x coordinate for this miner
     * memory.locationY The target y coordinate for this miner
     * memory.containerId The container to use
     * **/
    run: function (creep) {

        // Gathering energy
        if (creep.memory.home) {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.transfer(Game.getObjectById(creep.memory.containerId), RESOURCE_ENERGY);
            }
            creep.harvest(creep.memory.location);
        }
        // Go to your spot.
        else {
            creep.moveTo(creep.memory.locationX, creep.memory.locationY);
            if (creep.pos.x == creep.memory.locationX && creep.pos.y == creep.memory.locationY) {
                creep.memory.home = true;
            }
        }
    }
};

module.exports = miner;