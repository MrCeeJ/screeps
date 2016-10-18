var settings = require('settings');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter')
var roleWorker = require('role.worker');
var roleUpgrader = require('role.upgrader');
var roleStarterMiner = require('role.starterMiner');
var roleStarterUpgrader = require('role.starterUpgrader');

var maxStarterUpgraders = settings.maxStarterUpgraders;
var maxStarterMiners = settings.maxStarterMiners;

var maxCreeps = settings.maxCreeps;
var maxTransporters = settings.maxTransporters;
var maxUpgraders = settings.maxUpgraders;
var currentCreeps = settings.currentCreeps;
var spawnMaxEnergy = settings.spawnMaxEnergy;

module.exports.loop = function () {
    var enemies = Game.rooms['W9S51'].find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        var username = enemies[0].owner.username;
        Game.notify(`User ${username} spotted in room W9S51`);
        Game.rooms.W9S51.controller.activateSafeMode()
    }

    currentCreeps = _(Game.creeps).size();
    //Spawning
    var leftMiner = undefined;
    var rightMiner = undefined;
    var leftTransporters = [];
    var rightTransporters = [];
    var starterMiners = [];
    var starterUpgraders = [];
    var workers = [];
    var upgraders = [];

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
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

    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    _.forEach(towers, function(tower) {
        towerStructure.run(tower);
    });

    if (currentCreeps < maxCreeps) {

        if (_(starterUpgraders).size() < maxStarterUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'starterUpgrader'});
        }
        else if (_(starterMiners).size() < maxStarterMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'starterMiner'});
        }
        else if (leftMiner == undefined) {
            var flag = Game.flags['Flag1'];
            var locationX = flag.pos.x;
            var locationY = flag.pos.y;
            var container = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
                });
            var containerId = container[0] ? container[0].id : undefined;
            if (spawnMaxEnergy >= 550) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'leftMiner', home:false, locationX:locationX, locationY:locationY, containerId:containerId});
            }
        }

        else if (rightMiner = undefined) {
            flag = Game.flags['Flag2'];
            locationX = flag.pos.x;
            locationY = flag.pos.y;
            container = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
            });
            containerId = container[0] ? container[0].id : undefined ;

            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'rightMiner', home:false, locationX:locationX, locationY:locationY, containerId:containerId});
        }
        else if (_(leftTransporters).size() < maxTransporters) {
            flag = Game.flags['Flag1'];
            containerId = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
            })[0].id;
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'leftTransporter', sourceId:containerId});
        }
        else if (_(rightTransporters).size() < maxTransporters) {
            flag = Game.flags['Flag2'];
            containerId = flag.pos.findInRange(FIND_STRUCTURES, 1, {
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
}
