var miner = {

    /** @param {Creep} creep
     *
     * Mine and drop energy on the ground. A container will automatically collect it.
     *
     * memory.home Set to false to move to
     * memory.locationX The target x coordinate for this miner
     * memory.locationY The target y coordinate for this miner
     * memory.containerId The container to use
     * **/
    run: function (creep) {
        // Gathering energy
        if (creep.memory.home) {
            creep.harvest(Game.getObjectById(creep.memory.targetId));
            creep.drop(RESOURCE_ENERGY);
        }

        // Go to your spot.
        else {
            creep.moveTo(creep.memory.locationX, creep.memory.locationY);
            if (creep.pos.x == creep.memory.locationX && creep.pos.y == creep.memory.locationY) {
                let target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                const res = creep.harvest(target);
                if (res != ERR_NOT_IN_RANGE) {
                    creep.memory.home = true;
                    creep.say('Arrived, mining from :'+target);
                    creep.memory.targetId = target.id;
                } else {
                    creep.say('Problem :'+res);
                }
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