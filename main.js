const settings = require('settings');
const roleDrone = require('ai.drone');
const roleUpgrader = require('ai.upgrader');
const roleMiner = require('ai.miner');
const roleTower = require('ai.tower');
const utils = require('utils');
const maxCreeps = settings.maxCreeps;

module.exports.loop = function () {

    let currentRoom = 'W9S51';

    const enemies = Game.rooms[currentRoom].find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        var username = enemies[0].owner.username;
        Game.notify(`User ${username} spotted in room W9S51`);
        Game.rooms[currentRoom].controller.activateSafeMode()
    }

    // Clear out old creeps from memory
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    const currentCreeps = _(Game.creeps).size();
    let drones = [];
    let upgraders = [];
    let miners = [];

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.memory.role == 'drone') {
            drones.push(creep);
            roleDrone.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            upgraders.push(creep);
            roleUpgrader.run(creep);
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
            const body = roleDrone.getBody((currentCreeps < 2) ? 150 : maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'drone'});
        }
        else if (upgraders.length < settings.maxUpgraders) {
            const body = roleUpgrader.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'upgrader'});
        }
        else if (miners.length < settings.maxMiners) {
            let energySources = settings.rooms[currentRoom].energySources;
            if (miners.length < energySources.length) {
                for (let miner in miners) {
                    if (miner.memory) {
                        energySources = _.reject(energySources, (s) => s == miner.memory.source);
                    }
                }
                if (energySources.length) {
                    const body = roleMiner.getBody(maxSpawnEnergy);
                    Game.spawns['Spawn1'].createCreep(body, null, {role: 'miner', source: energySources[0]});
                }
            }
        }
    }

    if (Game.time % 10 == 0) {
        utils.logMessage("Time is :" + Game.time);
        utils.logMessage("Miners :" + JSON.stringify(_.map(miners, (c) => c.name)));
        utils.logMessage("Drones :" + JSON.stringify(_.map(drones, (c) => c.name)));
        utils.logMessage("Upgraders :" + JSON.stringify(_.map(upgraders, (c) => c.name)));
    }

};
