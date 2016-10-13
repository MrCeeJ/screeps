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
            var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY,1);
            if (energy.length) {
                console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos);
                if (creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0]);       
                }
            }
        }
    }
};

module.exports = roleUpgrader;