var roleSingleMiner = require('role.singleMiner');
var roleTrippleMiner = require('role.trippleMiner');
var roleUpgrader = require('role.upgrader');
var roleWorker = require('role.worker');
var maxCreeps = 15;
var maxSingleMiners = 1;
var maxTrippleMiners = 3;
var maxUpgraders = 2;
var currentCreeps = 0;

module.exports.loop = function () {

    currentCreeps = _(Game.creeps).size();
    //Spawning
    var singleMiners = [];
    var trippleMiners = [];
    var upgraders = [];
    var workers = [];

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role = 'singleMiner') {
            singleMiners.push(creep);
            roleSingleMiner.run(creep);
        }
        else if (creep.memory.role = 'trippleMiner') {
            trippleMiners.push(creep);
            roleTrippleMiner.run(creep);
        }
        else if (creep.memory.role = 'upgrader') {
            upgraders.push(creep);
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role = 'worker') {
            workers.push(creep);
            roleWorker.run(creep);
        }
    }

    if (currentCreeps < maxCreeps) {

        if (_(singleMiners).size() < maxSingleMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'singleMiner', foundEnergy:false});
        }

        else if (_(trippleMiners).size() < maxTrippleMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'trippleMiner'});
        }
        else if (_(upgraders).size() < maxUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'upgrader'});
        }
        else {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'worker'});
        }
    }

};