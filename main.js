const settings = require('settings');
const roleDrone = require('ai.drone');
const roleMiner = require('ai.miner');
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
    let drones = [];
    let miners = [];
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.memory.role == 'drone') {
            drones.push(creep);
            roleDrone.run(creep);
        }
        else if (creep.memory.role == 'miner') {
            miners.push(creep);
            roleMiner.run(creep);
        }
    }

    const towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    _.forEach(towers, function (tower) {
        roleTower.run(tower);
    });

    if (currentCreeps < maxCreeps) {
        // Note we might not have this much energy, in which case we will simply wait
        const maxSpawnEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;
        if (drones.length < settings.maxDrones) {
            const body = roleDrone.getBody(150);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'drone'});
        }
        else if (miners.length < settings.maxMiners) {
            const flags = _.filter(Game.flags, (flag) => flag.color == COLOR_GREEN && flag.secondaryColor == COLOR_GREEN);
            const minedFlags = _.filter(Game.creeps, (creep) => creep.memory.role =='miner');
        }
    }
};
