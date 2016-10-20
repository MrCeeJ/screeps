const utils = require('utils');

var ai = {

    gatherDroppedEnergy: function (creep) {
        let energy = _(creep.room.find(FIND_DROPPED_ENERGY))
            .sortBy(s => s.pos.getRangeTo(creep.pos))
            .value();

        if (energy.length) {
            if (creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energy[0]);
                utils.logCreep(creep, 'Moving to dropped energy  ' + energy[0].pos);
            } else {
                utils.logCreep(creep, 'Picking up dropped energy from ' + energy[0].pos);
            }
            return true;
        }
        utils.logCreep(creep, 'No dropped energy  found');
        return false;
    },
    gatherContainerEnergy: function (creep) {
        let containers = _(creep.room.find(FIND_STRUCTURES))
            .filter(s => s.structureType == STRUCTURE_CONTAINER)
            .filter(s => s.store[RESOURCE_ENERGY] >= creep.carryCapacity)
            .sortBy(s => s.pos.getRangeTo(creep.pos))
            .value();

        if (containers.length) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
                utils.logCreep(creep, 'Moving to container with energy ' + containers[0].pos);
            } else {
                utils.logCreep(creep, 'Withdrawing energy from container ' + containers[0].pos);
            }
            return true;
        }
        utils.logCreep(creep, 'No containers with energy  found');
        return false;
    },
    harvestEnergy: function (creep) {
        let sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1]);
        }
        return true;
    },
    refillSpawns: function (creep) {
        let spawns = _(creep.room.find(FIND_MY_SPAWNS))
            .filter(s => s.energy < s.energyCapacity)
            .sortBy(s => s.pos.getRangeTo(creep.pos))
            .value();
        if (spawns.length) {
            if (creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
                utils.logCreep(creep, 'Moving to refill spawn ' + spawns[0].pos);
            }
            else {
                utils.logCreep(creep, 'Refilling spawn ' + spawns[0].pos);
            }
            return true;
        }
        utils.logCreep(creep, 'No spawns neededing energy found.');
        return false;
    },
    refillExtensions: function (creep) {
        let extensions = _(creep.room.find(FIND_STRUCTURES))
            .filter(s => s.structureType == STRUCTURE_EXTENSION)
            .filter(s => s.energy < s.energyCapacity)
            .sortBy(s => s.pos.getRangeTo(creep.pos))
            .value();

        if (extensions.length) {
            if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(extensions[0]);
                utils.logCreep(creep, 'Moving to refill extension ' + extensions[0].pos);
            }
            else {
                utils.logCreep(creep, 'Refilling extension ' + extensions[0].pos);
            }
            return true;
        }
        return false;
    },
    refillTowers: function (creep) {
        let towers = _(creep.room.find(FIND_STRUCTURES))
            .filter(s => s.structureType == STRUCTURE_TOWER)
            .filter(s => s.energy <= s.energyCapacity*0.8)
            .sortBy(s => s.pos.getRangeTo(creep.pos))
            .value();
        if (towers.length) {
            if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(towers[0]);
                utils.logCreep(creep, 'Moving to refill tower ' + towers[0].pos);
            }
            else {
                utils.logCreep(creep, 'Refilling tower ' + towers[0].pos);
            }
            return true;
        }
        return false;
    },
    buildBuildings: function (creep) {
        let buildings = _(creep.room.find(FIND_CONSTRUCTION_SITES))
            .sortBy(s => s.pos.getRangeTo(creep.pos)).value();

        if (buildings.length) {
            if (creep.build(buildings[0]) == ERR_NOT_IN_RANGE) {
                utils.logCreep(creep, 'Moving to build ' + buildings[0].structureType + ' at ' + buildings[0].pos);
                creep.moveTo(buildings[0]);
            }
            utils.logCreep(creep, 'Building ' + buildings[0].structureType + ' at ' + buildings[0].pos);
            return true;
        }
        utils.logCreep(creep, 'No buildings to build #sadface');
        return false;
    },
    repairBuildings: function (creep) {
        const structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART];
        let structures = _(creep.room.find(FIND_STRUCTURES))
            .filter(s =>  s.hits < (s.hitsMax*.7) && _.includes(structureTypes, s.structureType))
            .sortBy(s => s.hits);

        if(structures.length) {
            if (creep.repair(structures[0] == ERR_NOT_IN_RANGE)) {
                creep.moveTo(structures[0]);
                utils.logCreep(creep, 'Moving to repair ' + structures[0].structureType + ' at ' + structures[0].pos);
            }
            else {
                utils.logCreep(creep, 'Repairing ' + structures[0].structureType + ' at ' + structures[0].pos);
            }
            return true;
        }
        return false;
    },
    upgradeRoom: function (creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            utils.logCreep(creep, 'Moving to upgrade room');
        }
        else {
            utils.logCreep(creep, 'Upgrading room');
        }
        return true;
    },


};

module.exports = ai;