const settings = require('settings');
const roleDrone = require('ai.drone');
const roleTower = require('ai.tower');

const maxCreeps = settings.maxCreeps;

module.exports.loop = function () {
    const enemies = Game.rooms['W9S51'].find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        var username = enemies[0].owner.username;
        Game.notify(`User ${username} spotted in room W9S51`);
        Game.rooms['W9S51'].controller.activateSafeMode()
    }

    const currentCreeps = _(Game.creeps).size();
    //Spawning
    let drones = [];

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.memory.role == 'drone') {
            drones.push(creep);
            roleDrone.run(creep);
        }
    }

    const towers =  _.(Game.structures)
        .filter(s => s.structureType == STRUCTURE_TOWER);

    _.forEach(towers, function(tower) {
       roleTower.run(tower);
    });

    if (currentCreeps < maxCreeps) {
        // Note we might not have this much energy, in which case we will simply wait
        // const maxSpawnEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;
        const maxSpawnEnergy = 150;
        const body = roleDrone.getBody(maxSpawnEnergy);
        Game.spawns['Spawn1'].createCreep(body, null, {role: 'drone'});

    }
};
