const settings = require('settings');
const roleDrone = require('ai.drone');
const roleWorker = require('ai.worker');
const roleUpgrader = require('ai.upgrader');
const roleMiner = require('ai.miner');
const roleTransporter = require('ai.transporter');
const roleTower = require('ai.tower');
const utils = require('utils');
const maxCreeps = settings.maxCreeps;

module.exports.loop = function () {

    const currentRoom = settings.startingRoom;
    const currentCreeps = _(Game.creeps).size();
    let workers = [];
    let upgraders = [];
    let miners = [];
    let transporters = [];
    let towers;

    activateSafeMode();
    cleanupMemory();
    runCreeps();
    runTowers();
    spawnCreeps();
    logGameState();

    function activateSafeMode() {
        const enemies = Game.rooms[currentRoom].find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 1) {
            var username = enemies[0].owner.username;
            Game.notify(`User ${username} spotted in room :` + currentRoom);
            Game.rooms[currentRoom].controller.activateSafeMode()
        }
    }

    function cleanupMemory() {
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    }

    function runCreeps() {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];

            if (creep.memory.role == 'drone') {
                workers.push(creep);
                roleDrone.run(creep);
            }
            else if (creep.memory.role == 'worker') {
                workers.push(creep);
                roleWorker.run(creep);
            }
            else if (creep.memory.role == 'upgrader') {
                upgraders.push(creep);
                roleUpgrader.run(creep);
            }
            else if (creep.memory.role == 'miner') {
                miners.push(creep);
                roleMiner.run(creep);
            } else if (creep.memory.role == 'transporter') {
                transporters.push(creep);
                roleTransporter.run(creep);
            }
        }
    }

    function runTowers() {
        towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

        _.forEach(towers, function (tower) {
            roleTower.run(tower);
        });
    }

    function spawnCreeps() {

        if (currentCreeps < maxCreeps) {
            // Note we might not have this much energy, in which case we will simply wait
            const maxSpawnEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;
            if (workers.length < 2) {
                spawnDrone();
            }
            else if (miners.length < 1) {
                spawnMiner(maxSpawnEnergy);
            }
            else if (upgraders.length < settings.maxUpgraders) {
                spawnUpgrader(maxSpawnEnergy);
            }
            else if (miners.length < settings.maxMiners) {
                spawnMiner(maxSpawnEnergy);
            }
            else if (transporters.length < settings.maxTransporters) {
                spawnTransporter(maxSpawnEnergy);

            }
            else if (workers.length < settings.maxWorkers) {
                spawnWorker(maxSpawnEnergy);
            }
        }

        function spawnDrone() {
            const body = roleDrone.getBody(150);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'drone'});
            utils.logMessage("Spawning drone :" + JSON.stringify(body));
        }

        function spawnUpgrader(maxSpawnEnergy) {
            const body = roleUpgrader.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'upgrader'});
            utils.logMessage("Spawning upgrader :" + JSON.stringify(body));
        }

        function spawnMiner(maxSpawnEnergy) {
            let energySources = settings.rooms[currentRoom].energySources;
            let usedSources = [];
            for (let m in miners) {
                if (miners[m].memory && miners[m].memory.source) {
                    const obj = miners[m].memory.source;
                    const pos = new RoomPosition(obj.x, obj.y, obj.roomName);
                    usedSources.push(pos);
                }
            }
            let unusedSources = _.reject(energySources, s => _.some(usedSources, s));
            if (miners.length < energySources.length) {
                if (unusedSources.length) {
                    const body = roleMiner.getBody(maxSpawnEnergy);
                    Game.spawns['Spawn1'].createCreep(body, null, {role: 'miner', source: unusedSources[0]});
                    utils.logMessage("Spawning miner :" + JSON.stringify(body));
                }
            }
        }

        function spawnTransporter(maxSpawnEnergy) {
            const body = roleTransporter.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {
                role: 'transporter',
                sourceIds: settings.rooms[currentRoom].sourceContainerIDs
            });
            utils.logMessage("Spawning transporter :" + JSON.stringify(body));
        }

        function spawnWorker(maxSpawnEnergy) {
            const body = roleWorker.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'worker'});
            utils.logMessage("Spawning worker :" + JSON.stringify(body));
        }
    }

    function logGameState() {
        if (Game.time % 10 == 0) {
            utils.logMessage("Time is :" + Game.time);
            utils.logMessage("Miners :" + JSON.stringify(_.map(miners, c => c.name)));
            utils.logMessage("Workers :" + JSON.stringify(_.map(workers, c => c.name + ":" + c.memory.role[0])));
            utils.logMessage("Upgraders :" + JSON.stringify(_.map(upgraders, c => c.name)));
            utils.logMessage("Transporters :" + JSON.stringify(_.map(transporters, c => c.name)));
        }
    }

};
