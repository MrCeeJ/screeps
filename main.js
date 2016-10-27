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

    let currentRoom = Game.rooms[settings.startingRoom];
    let currentSpawn = Game.spawns[settings.startingSpawn];
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
        const enemies = currentRoom.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 1) {
            var username = enemies[0].owner.username;
            Game.notify(`User ${username} spotted in room :` + currentRoom);
            currentRoom.controller.activateSafeMode()
        }
    }

    function cleanupMemory() {
        for (var i in Memory.creeps) {
            //noinspection JSUnfilteredForInLoop
            if (!Game.creeps[i]) {
                //noinspection JSUnfilteredForInLoop
                delete Memory.creeps[i];
            }
        }
    }

    function runCreeps() {
        for (const name in Game.creeps) {
            //noinspection JSUnfilteredForInLoop
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
        _.forEach(towers, t => roleTower.run(t));
    }

    function spawnCreeps() {
        if (!currentSpawn.spawning && currentCreeps < maxCreeps) {
            const maxSpawnEnergy = currentRoom.energyCapacityAvailable;
            if (currentCreeps < 2) {
                spawnDrone();
            }
            else if (miners.length < 1) {
                spawnMiner(maxSpawnEnergy);
            }
            else if (upgraders.length < 1) {
                spawnUpgrader(maxSpawnEnergy);
            }
            else if (miners.length < settings.maxMiners) {
                spawnMiner(maxSpawnEnergy);
            }
            else if (upgraders.length < settings.maxUpgraders) {
                spawnUpgrader(maxSpawnEnergy);
            }
            else if (transporters.length < settings.maxTransporters) {
                spawnTransporter(maxSpawnEnergy);
            }
            else if (workers.length < settings.maxWorkers) {
                spawnWorker(maxSpawnEnergy);
            }
        }
        else if (miners.length == settings.maxMiners) {
            let dyingMiners = [];
            if (Game.time % 10 == 0) {
                    utils.logMessage("Checking for dying miners..");
            }
            _.forEach(miners, m => {
                if (Game.time % 10 == 0) {
                    utils.logMessage(m.name + " time left :" + m.ticksToLive);
                    utils.logMessage("body cost:" + m.body.length * 3);
                    utils.logMessage("time:" + m.memory.ticksToArrive);
                }
                if (m.ticksToLive < m.memory.ticksToArrive + (m.body.length * 3)) {
                    dyingMiners.push(m);
                }
            });
            if (dyingMiners.length) {
                utils.logMessage("Spawning replacement for :" + dyingMiners[0]);
                spawnReplacementMiner(dyingMiners[0]);
            }
        }

        function spawnDrone() {
            const body = roleDrone.getBody(150);
            currentSpawn.createCreep(body, null, {role: 'drone'});
        }

        function spawnUpgrader(maxSpawnEnergy) {
            const body = roleUpgrader.getBody(maxSpawnEnergy);
            currentSpawn.createCreep(body, null, {role: 'upgrader'});
            utils.logMessage("Spawning upgrader :" + JSON.stringify(body));
        }

        function spawnMiner(maxSpawnEnergy) {
            let energySources = settings.rooms[currentRoom.name].energySources;
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
                    currentSpawn.createCreep(body, null, {role: 'miner', source: unusedSources[0]});
                    utils.logMessage("Spawning miner :" + JSON.stringify(body));
                }
            }
        }

        function spawnReplacementMiner(oldMiner) {
            const energySource = oldMiner.memory.source;
            const body = oldMiner.body;
            currentSpawn.createCreep(body, null, {role: 'miner', source: energySource});
            utils.logMessage("Spawning replacement miner :" + JSON.stringify(body));
        }

        function spawnTransporter(maxSpawnEnergy) {
            const body = roleTransporter.getBody(maxSpawnEnergy);
            currentSpawn.createCreep(body, null, {
                role: 'transporter',
                sourceIds: settings.rooms[currentRoom.name].sourceContainerIDs
            });
            utils.logMessage("Spawning transporter :" + JSON.stringify(body));
        }

        function spawnWorker(maxSpawnEnergy) {
            const body = roleWorker.getBody(maxSpawnEnergy);
            currentSpawn.createCreep(body, null, {role: 'worker'});
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
