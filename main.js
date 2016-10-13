var roleLeftMiner = require('role.leftMiner');
var roleRightMiner = require('role.rightMiner');
var roleWorker = require('role.worker');
var roleUpgrader = require('role.upgrader');

var maxCreeps = 15;
var maxUpgraders = 2;
var maxLeftMiners = 1;
var maxRightMiners = 1;
var currentCreeps = 0;

module.exports.loop = function () {

    currentCreeps = _(Game.creeps).size();
    //Spawning
    var leftMiner = [];
    var rightMiner = [];
    var workers = [];
    var upgraders = [];

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role = 'leftMiner') {
            leftMiner.push(creep);
            roleLeftMiner.run(creep);
        }
        else if (creep.memory.role = 'rightMiner') {
            rightMiner.push(creep);
            roleRightMiner.run(creep);
        }
        else if (creep.memory.role = 'worker') {
            workers.push(creep);
            roleWorker.run(creep);
        }
        else if (creep.memory.role = 'upgrader') {
            upgraders.push(creep);
            roleUpgrader.run(creep);
        }
    }

    if (currentCreeps < maxCreeps) {

        if (_(leftMiner).size() < maxLeftMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'leftMiner', foundEnergy:false});
        }

        else if (_(rightMiner).size() < maxRightMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'rightMiner', foundEnergy:false});
        }
        else if (_(upgraders).size() < maxUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'upgrader'});
        }
        else {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'worker'});
        }
    }

};