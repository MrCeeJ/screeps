var roleWorker = require('role.worker');
var maxCreeps = 15;
var currentCreeps = 0;

module.exports.loop = function () {

    currentCreeps = _(Game.creeps).size();
    //Spawning
    if (currentCreeps < maxCreeps) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {location: 1, working: false});
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleWorker.run(creep);
    }
}