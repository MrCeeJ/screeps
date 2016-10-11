var _ = require("../ScreepsAutocomplete-master/lodash.js");
var towerStructure = require('structure.tower');
var creepExtensions = require('creep.extensions');
var towerExtensions = require('tower.extensions');

var roleWorker = require('role.worker');
var maxCreeps = 13;
var currentCreeps = 0;

module.exports.loop = function () {

    creepExtensions.register();
    towerExtensions.register();

    currentCreeps = _(Game.creeps).size();
    //Spawning
    if (currentCreeps < maxCreeps) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {location: 1, working: false});
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleWorker.run(creep);
    }
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    _.forEach(towers, function(tower) {
        towerStructure.run(tower);
    })
};