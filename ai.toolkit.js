const utils = require('utils');

const RANGE_FACTOR = 10;

const ai = {
        gatherNearestDroppedEnergy: function (creep, minEnergy) {
            utils.logCreep(creep, 'Looking for at least ' + minEnergy + ' dropped energy.');
            let energy = _(creep.room.find(FIND_DROPPED_RESOURCES))
                .filter(e => e.resourceType === RESOURCE_ENERGY)
                .filter(e => e.amount >= minEnergy)
                .sortBy(e => e.pos.getRangeTo(creep.pos))
                .value();

            if (energy.length) {
                if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0]);
                    utils.logCreep(creep, 'Moving to dropped energy  ' + energy[0].pos + ":" + energy[0].amount);
                    return true;
                } else {
                    utils.logCreep(creep, 'Picking up dropped energy from ' + energy[0].pos + ":" + energy[0].amount);
                    if (creep.carry.energy === creep.carryCapacity) {
                        return true;
                    } else {
                        utils.logCreep(creep, 'Insufficient dropped energy found');
                        return false;
                    }
                }
            }
            utils.logCreep(creep, 'No dropped energy found');
            return false;
        },
        gatherMostDroppedEnergy: function (creep, minEnergy) {
            let energy = _(creep.room.find(FIND_DROPPED_RESOURCES))
                .filter(e => e.resourceType === RESOURCE_ENERGY)
                .filter(e => e.amount >= minEnergy)
                .sortBy(e => (e.amount - (RANGE_FACTOR * e.pos.getRangeTo(creep.pos))) * -1)
                .value();

            if (energy.length) {
                if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0]);
                    utils.logCreep(creep, 'Moving to dropped energy  ' + energy[0].pos + ":" + energy[0].amount);
                    return true;
                } else {
                    utils.logCreep(creep, 'Picking up dropped energy from ' + energy[0].pos + ":" + energy[0].amount);
                    if (creep.carry.energy === creep.carryCapacity) {
                        return true;
                    } else {
                        utils.logCreep(creep, 'Insufficient dropped energy found');
                        return false;
                    }
                }
            }
            utils.logCreep(creep, 'No dropped energy found');
            return false;
        },
        goToSpawnOrGather: function (creep) {
            if (creep.carry.energy === creep.carryCapacity) {
                let spawns = _(creep.room.find(FIND_MY_SPAWNS))
                    .sortBy(s => s.pos.getRangeTo(creep.pos))
                    .value();
                creep.moveTo(spawns[0]);
                utils.logCreep(creep, 'No work for transporter, waiting by spawn.');
                return true;
            } else {
                utils.logCreep(creep, 'No work for transporter, topping up energy.');
                creep.memory.state = 'GATHERING';
                return true;
            }
        },

        gatherContainerEnergy: function (creep) {
            let containers = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_CONTAINER)
                .filter(s => s.store[RESOURCE_ENERGY] >= creep.carryCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (containers.length) {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                    utils.logCreep(creep, 'Moving to container with energy ' + containers[0].pos + ":" + containers[0].store[RESOURCE_ENERGY]);
                } else {
                    utils.logCreep(creep, 'Withdrawing energy from container ' + containers[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No containers with energy  found');
            return false;
        },
        gatherStoredEnergy: function (creep, MIN_ENERGY) {
            let store = creep.room.storage;
            if (store && store.store[RESOURCE_ENERGY] > MIN_ENERGY) {
                if (creep.withdraw(store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(store);
                    utils.logCreep(creep, 'Moving to store with energy ' + store.pos + ":" + store.store[RESOURCE_ENERGY]);
                } else {
                    utils.logCreep(creep, 'Withdrawing energy from store ' + store.pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No stores with energy  found');
            return false;
        },
        gatherEnergyFromContainers: function (creep, sourceIds, minEnergy) {
            let containers = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_CONTAINER)
                .filter(s => _.includes(sourceIds, s.id))
                .filter(s => s.store[RESOURCE_ENERGY] >= minEnergy)
                .sortBy(s => (s.store[RESOURCE_ENERGY] - (RANGE_FACTOR * s.pos.getRangeTo(creep.pos))) * -1)
                .value();

            // Check for multiple containers > 50%, sort by distance.
            utils.logCreep(creep, "Checking for energy in containers :" + containers);
            if (containers.length) {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                    utils.logCreep(creep, 'Moving to container with energy ' + containers[0].pos + ":" + containers[0].store[RESOURCE_ENERGY]);
                } else {
                    utils.logCreep(creep, 'Withdrawing energy from container ' + containers[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No container with energy found');
            return false;
        },
        dumpMinerals: function (creep) {
            let store = creep.room.storage;
            if (store) {
                let total = _.sum(creep.room.storage.store);
                let contents = [];
                for (let item in creep.carry) {
                    //noinspection JSUnfilteredForInLoop
                    if (creep.carry[item] > 0) {
                        //noinspection JSUnfilteredForInLoop
                        contents.push(item);
                    }
                }
                if (store.storeCapacity > total) {
                    if (creep.transfer(store, contents[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(store);
                        utils.logCreep(creep, 'Moving to dump ' + contents[0] + ' in store at' + store.pos + "(" + total + ")");
                    }
                    else {
                        utils.logCreep(creep, 'Dumping ' + contents[0] + ' in store at' + store.pos + "(" + total + ")");
                    }
                    return true;
                } else {
                    utils.logCreep(creep, 'Store full :' + store.pos + "(" + total + " / " + store.storeCapacity + ")");
                    return false;
                }
            }
            utils.logCreep(creep, 'No stores found.');
            return false;
        },
        refillContainersExcept: function (creep, sourceIds, fullness) {
            let containers = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_CONTAINER)
                .reject(s => _.includes(sourceIds, s.id))
                .filter(s => s.store[RESOURCE_ENERGY] < s.storeCapacity)
                .filter(s => s.store[RESOURCE_ENERGY] / s.storeCapacity < fullness)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (containers.length) {
                let i = 0;
                while (creep.transfer(containers[i], RESOURCE_ENERGY) === OK && i < containers.length && creep.carry.energy > 50) {
                    utils.logCreep(creep, 'Refilling container ' + containers[i].pos);
                    i++;
                }
                if (i < containers.length && creep.carry.energy > 50) {
                    creep.moveTo(containers[i]);
                    utils.logCreep(creep, 'Moving to refill container ' + containers[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No containers needing energy found.');
            return false;
        },
        harvestEnergy: function (creep) {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
                utils.logCreep(creep, 'Moving to mine from' + sources[1].pos);
            } else {
                utils.logCreep(creep, 'Mining from' + sources[1].pos);
            }
            return true;
        },
        refillStorage: function (creep) {
            let store = creep.room.storage;
            if (store) {
                let total = _.sum(creep.room.storage.store);
                if (store.storeCapacity > total) {
                    if (creep.transfer(store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(store);
                        utils.logCreep(creep, 'Moving to refill store at' + store.pos + "(" + total + ")");
                    }
                    else {
                        utils.logCreep(creep, 'Refilling store at' + store.pos + "(" + total + ")");
                    }
                    return true;
                } else {
                    utils.logCreep(creep, 'Store full :' + store.pos + "(" + total + " / " + store.storeCapacity + ")");
                    return false;
                }
            }
            utils.logCreep(creep, 'No stores found.');
            return false;
        },
        checkForMinerals: function (creep, needed, resource) {
            let stores = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_CONTAINER)
                .filter(s => s.store[resource] >= needed)
                .value();
            return stores.length;
        },
        fetchMinerals: function (creep, needed, resource) {
            let stores = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_CONTAINER)
                .filter(s => s.store[resource] >= needed)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();
            if (stores.length) {
                if (creep.withdraw(stores[0], resource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(stores[0]);
                    utils.logCreep(creep, 'Moving to container ' + stores[0].pos + " with " + resource + " :" + stores[0].store[resource]);
                } else {
                    utils.logCreep(creep, 'Withdrawing ' + resource + ' from container ' + stores[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No containers with ' + resource + ' found.');
            return false;
        },
        refillSpawns: function (creep) {
            let spawns = _(creep.room.find(FIND_MY_SPAWNS))
                .filter(s => s.energy < s.energyCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();
            if (spawns.length) {
                if (creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0]);
                    utils.logCreep(creep, 'Moving to refill spawn ' + spawns[0].pos);
                }
                else {
                    utils.logCreep(creep, 'Refilling spawn ' + spawns[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No spawns needing energy found.');
            return false;
        },
        refillExtensions: function (creep) {
            let extensions = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_EXTENSION)
                .filter(s => s.energy < s.energyCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (extensions.length) {
                if (creep.transfer(extensions[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensions[0]);
                    utils.logCreep(creep, 'Moving to refill extension ' + extensions[0].pos);
                }
                else {
                    utils.logCreep(creep, 'Refilling extension ' + extensions[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No extensions needing energy found.');
            return false;
        },
        refillTowers: function (creep, minCapacity) {
            let towers = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_TOWER)
                .filter(s => s.energy <= s.energyCapacity * minCapacity)
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();
            if (towers.length) {
                if (creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0]);
                    utils.logCreep(creep, 'Moving to refill tower ' + towers[0].pos);
                }
                else {
                    utils.logCreep(creep, 'Refilling tower ' + towers[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No towers needing energy found.');
            return false;
        },
        buildBuildings: function (creep) {
            let buildings = _(creep.room.find(FIND_CONSTRUCTION_SITES))
                .sortBy(s => s.pos.getRangeTo(creep.pos))
                .value();

            if (buildings.length) {
                if (creep.build(buildings[0]) === ERR_NOT_IN_RANGE) {
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
            const structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER];

            let structures = _(creep.room.find(FIND_STRUCTURES))
                .filter(s => s.hits < (s.hitsMax * .7) && _.includes(structureTypes, s.structureType))
                .sortBy(s => s.hits)
                .value();
            //utils.logCreep(creep,"Things to repair :"+JSON.stringify(structures),true);

            if (structures.length) {
                if (creep.repair(structures[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structures[0]);
                    utils.logCreep(creep, 'Moving to repair ' + structures[0].structureType + ' at ' + structures[0].pos);
                }
                else {
                    utils.logCreep(creep, 'Repairing ' + structures[0].structureType + ' at ' + structures[0].pos);
                }
                return true;
            }
            utils.logCreep(creep, 'No buildings to repair.');
            return false;
        },
    repairWalls: function (creep) {
        const structureTypes = [STRUCTURE_WALL, STRUCTURE_RAMPART];

        let structures = _(creep.room.find(FIND_STRUCTURES))
            .filter(s => s.hits < (s.hitsMax * .7) && _.includes(structureTypes, s.structureType))
            .sortBy(s => s.hits)
            .value();
        //utils.logCreep(creep,"Things to repair :"+JSON.stringify(structures),true);

        if (structures.length) {
            if (creep.repair(structures[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structures[0]);
                utils.logCreep(creep, 'Moving to repair ' + structures[0].structureType + ' at ' + structures[0].pos);
            }
            else {
                utils.logCreep(creep, 'Repairing ' + structures[0].structureType + ' at ' + structures[0].pos);
            }
            return true;
        }
        utils.logCreep(creep, 'No buildings to repair.');
        return false;
    },
        upgradeRoom: function (creep) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                utils.logCreep(creep, 'Moving to upgrade room');
            }
            else {
                utils.logCreep(creep, 'Upgrading room');
            }
            return true;
        }
        ,
        claimRoom: function (creep) {
            if (creep.room.controller) {
                const result = creep.claimController(creep.room.controller);
                if (result === ERR_NOT_IN_RANGE) {
                    utils.logCreep(creep, 'Controller out of range');
                    creep.moveTo(creep.room.controller);
                    return false
                } else if (result === OK) {
                    utils.logCreep(creep, 'Controller claimed');
                    return true;
                } else {
                    utils.logCreep(creep, 'Unable to claim controller :' + result);
                    return false;
                }
            }
        }
    }
;

module.exports = ai;