const settings = require('settings');
const roleMiner = require('role.miner');
const roleTransporter = require('role.transporter');
const roleWorker = require('role.worker');
const roleUpgrader = require('role.upgrader');
const roleStarterMiner = require('role.starterMiner');
const roleStarterUpgrader = require('role.starterUpgrader');

const maxStarterUpgraders = settings.maxStarterUpgraders;
const maxStarterMiners = settings.maxStarterMiners;
const maxCreeps = settings.maxCreeps;
const maxTransporters = settings.maxTransporters;
const maxUpgraders = settings.maxUpgraders;

module.exports.loop = function () {
    const enemies = Game.rooms.W9S51.constructor.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        var username = enemies[0].owner.username;
        Game.notify(`User ${username} spotted in room W9S51`);
        Game.rooms.W9S51.controller.activateSafeMode()
    }

    const currentCreeps = _(Game.creeps).size();
    //Spawning
    let leftMiner = undefined;
    let rightMiner = undefined;
    let leftTransporters = [];
    let rightTransporters = [];
    let starterMiners = [];
    let starterUpgraders = [];
    let workers = [];
    let upgraders = [];

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role == 'starterMiner') {
            starterMiners.push(creep);
            roleStarterMiner.run(creep);
        }
        else if (creep.memory.role == 'starterUpgrader') {
            starterUpgraders.push(creep);
            roleStarterUpgrader.run(creep);
        }
        else if (creep.memory.role == 'leftMiner') {
            leftMiner = creep;
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'rightMiner') {
            rightMiner = creep;
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'leftTransporter'){
            leftTransporters.push(creep);
            roleTransporter.run(creep);
        }
        else if (creep.memory.role == 'rightTransporter'){
            rightTransporters.push(creep);
            roleTransporter.run(creep);
        }
        else if (creep.memory.role == 'worker') {
            workers.push(creep);
            roleWorker.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            upgraders.push(creep);
            roleUpgrader.run(creep);
        }
    }

    const towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    _.forEach(towers, function(tower) {
        towerStructure.run(tower);
    });

    if (currentCreeps < maxCreeps) {
        // Note we might not have this much energy, in which case we will simply wait
        const maxSpawnEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;

        if (_(starterUpgraders).size() < maxStarterUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'starterUpgrader'});
        }
        else if (_(starterMiners).size() < maxStarterMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'starterMiner'});
        }
        else if (leftMiner == undefined) {
            const flag = Game.flags['Flag1'];
            const locationX = flag.pos.x;
            const locationY = flag.pos.y;
            const body = roleMiner.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'leftMiner', home:false, locationX:locationX, locationY:locationY});
        }

        else if (rightMiner = undefined) {
            const flag = Game.flags['Flag2'];
            const locationX = flag.pos.x;
            const locationY = flag.pos.y;
            const body = roleMiner.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'leftMiner', home:false, locationX:locationX, locationY:locationY});
        }
        else if (_(leftTransporters).size() < maxTransporters) {
            const flag = Game.flags['Flag1'];
            const containerId = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
            })[0].id;
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'leftTransporter', sourceId:containerId});
        }
        else if (_(rightTransporters).size() < maxTransporters) {
            const flag = Game.flags['Flag2'];
            const containerId = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
            })[0].id;
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'rightTransporter', sourceId:containerId });
        }
        else if (_(upgraders).size() < maxUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'upgrader'});
        }
        else {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'worker'});
        }
    }
};
