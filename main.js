var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter')
var roleWorker = require('role.worker');
var roleUpgrader = require('role.upgrader');

var maxCreeps = 6;
var maxTransporters = 1;
var maxUpgraders = 1;
var currentCreeps = 0;

module.exports.loop = function () {

    currentCreeps = _(Game.creeps).size();
    //Spawning
    var leftMiner = undefined;
    var rightMiner = undefined;
    var leftTransporters = [];
    var rightTransporters = [];
    var workers = [];
    var upgraders = [];

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'leftMiner') {
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

        if (leftMiner == undefined) {
            var flag = Game.flags['Flag1'];
            var locationX = flag.pos.x;
            var locationY = flag.pos.y;
            var containerId = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
                })[0].id;
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'leftMiner', home:false, locationX:locationX, locationY:locationY, containerId:containerId});
        }

        else if (rightMiner = undefined) {
            flag = Game.flags['Flag2'];
            locationX = flag.pos.x;
            locationY = flag.pos.y;
            containerId = flag.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
            })[0].id;
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

};