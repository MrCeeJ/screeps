const settings = require('settings');
const roleDrone = require('ai.drone');
const roleWorker = require('ai.worker');
const roleUpgrader = require('ai.upgrader');
const roleMiner = require('ai.miner');
const roleTransporter = require('ai.transporter');
const roleTower = require('ai.tower');
const roleLink = require('ai.link');
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
    let links;

    activateSafeMode();
    cleanupMemory();
    runCreeps();
    runTowers();
    runLinks();
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
        towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        _.forEach(towers, t => roleTower.run(t));
    }

    function runLinks() {
        links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
        _.forEach(links, l => roleLink.run(l));
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
                if (!m.memory.replaced && m.ticksToLive < (m.memory.ticksToArrive + (m.body.length * 3))) {
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

                    const pos = unusedSources[0];
                    utils.logMessage("Checking source :" + JSON.stringify(pos));
                    const link = _.(currentRoom.find(FIND_MY_STRUCTURES)).filter(s => s.structureType == STRUCTURE_LINK).min(s => pos.getRangeTo(s));
                    utils.logMessage("Checking link :" + JSON.stringify(link));
                    let linkPos;
                    let body = roleMiner.getBody(maxSpawnEnergy);
                    if (link) {
                        utils.logMessage("Checking ids link :" + JSON.stringify(link.id));
                        utils.logMessage("Checking ids source:" + JSON.stringify(settings.rooms[currentRoom.name].linkSourceId));
                        utils.logMessage("Checking ids dest:" + JSON.stringify(settings.rooms[currentRoom.name].linkDestinationId));
                        if (settings.rooms[currentRoom.name].linkSourceId == link.id) {
                            linkPos = 'SOURCE';
                            body = roleMiner.getLinkBody(maxSpawnEnergy);
                        }
                        else if (settings.rooms[currentRoom.name].linkDestinationId == link.id) {
                            linkPos = 'DESTINATION';
                            body = roleMiner.getLinkBody(maxSpawnEnergy);
                        } else {
                            utils.logMessage("WARNING Links found but misconfigured!");
                        }
                    }
                    currentSpawn.createCreep(body, null, {
                        role: 'miner',
                        source: unusedSources[0],
                        linkPosition: linkPos,
                        linkId: link.id
                    });
                    utils.logMessage("Spawning " + linkPos + " miner :" + JSON.stringify(body));
                } else {
                    utils.logMessage("WARNING Too many miners, but unused energy sources found!!");
                }
            }
        }

        function spawnReplacementMiner(oldMiner) {
            const energySource = oldMiner.memory.source;
            const linkPos = oldMiner.memory.linkPosition;
            const body = [];
            for (let part in oldMiner.body) {
                //noinspection JSUnfilteredForInLoop
                body.push(oldMiner.body[part].type);
            }
            currentSpawn.createCreep(body, null, {role: 'miner', source: energySource, linkPosition: linkPos});
            oldMiner.memory.replaced = true;
            utils.logMessage("Spawning replacement miner :" + JSON.stringify(body));
        }

        function spawnTransporter(maxSpawnEnergy) {
            const body = roleTransporter.getBody(maxSpawnEnergy);
            currentSpawn.createCreep(body, null, {
                role: 'transporter',
                sourceIds: settings.rooms[currentRoom.name].sourceContainerIds
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
            utils.logMessage("Miners :" + JSON.stringify(_.map(miners, c => c.name + " (" + ((c.body.length * 3) + c.memory.ticksToArrive) + ")")));
            utils.logMessage("Workers :" + JSON.stringify(_.map(workers, c => c.name + ":" + c.memory.role[0])));
            utils.logMessage("Upgraders :" + JSON.stringify(_.map(upgraders, c => c.name)));
            utils.logMessage("Transporters :" + JSON.stringify(_.map(transporters, c => c.name)));
        }
    }

};
