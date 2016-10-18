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
    },
    getBody: function (maxEnergy) {

        if (maxEnergy >= 550) {
            return [WORK, WORK, WORK, WORK, WORK, MOVE];
        }
        else if (maxEnergy >= 450) {
            return [WORK, WORK, WORK, WORK, MOVE];
        }
        else if (maxEnergy >= 350) {
            return [WORK, WORK, WORK, MOVE];
        }
        else if (maxEnergy >= 250) {
            return [WORK, WORK, MOVE];
        }
        else {
            Game.notify(`Unable to spawn miner using ${maxEnergy} energy! Spawning worker instead`);
            return [WORK, CARRY, MOVE];
        }

    }
};

module.exports = miner;