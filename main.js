const data = require('data');
const roleDrone = require('ai.drone');
const roleWorker = require('ai.worker');
const roleUpgrader = require('ai.upgrader');
const roleMiner = require('ai.miner');
const roleTransporter = require('ai.transporter');
const roleTower = require('ai.tower');
const roleLink = require('ai.link');
const utils = require('utils');
const planUtils = require('planUtils');
const plans = require('plans');
const roomToolkit = require('planUtils');

module.exports.loop = function () {

    utils.logHeartbeat();

    let spawnIds, currentRoom, roomData, currentSpawn;
    if (Memory.resetData === undefined || Memory.resetData === true || Memory.resetData === 'true' || Memory.rooms === undefined || Memory.rooms === []) {
        data.reset();
    }
    else {
        for (const i in Memory.rooms) {
            //noinspection ES6ModulesDependencies,JSUnresolvedVariable
            roomData = Memory.rooms[i];
            currentRoom = Game.rooms[roomData.name];
            spawnIds = roomData.spawnIds;

            let currentCreeps = _(Game.creeps).size();
            let totalLivingCreeps = currentCreeps;
            const maxCreeps = roomData.maxCreeps;
            let workers = [];
            let upgraders = [];
            let miners = [];
            let transporters = [];
            let towers;
            let links;

            if (Memory.resetConstructionSites === true || Memory.resetConstructionSites === 'true') {
                planUtils.resetConstructionSites(currentRoom);
            }
            activateSafeMode();
            removeDeadScreepsFromMemory();
            runCreeps();
            runTowers();
            runLinks();
            for (const i in spawnIds) {
                //noinspection JSUnfilteredForInLoop
                currentSpawn = Game.getObjectById(spawnIds[i]);
                spawnCreeps(currentSpawn);
            }
            planRoom(currentRoom);
            logGameState();
            logMarket();

            function activateSafeMode() {
                const enemies = currentRoom.find(FIND_HOSTILE_CREEPS);
                if (enemies.length > 3) {
                    let username = enemies[0].owner.username;
                    Game.notify(`User ${username} spotted in room :` + currentRoom);
                    currentRoom.controller.activateSafeMode()
                }
            }

            function removeDeadScreepsFromMemory() {
                for (let i in Memory.creeps) {
                    //noinspection JSUnfilteredForInLoop
                    if (!Game.creeps[i]) {
                        //noinspection JSUnfilteredForInLoop
                        delete Memory.creeps[i];
                    }
                }
            }

            function planRoom(room) {
                if (Game.time % 10 === 0) {
                    utils.logMessage("planning room : " + room.name);
                    plans.planRoom(room)
                }
            }

            function runCreeps() {
                for (const name in Game.creeps) {
                    //noinspection JSUnfilteredForInLoop
                    const creep = Game.creeps[name];

                    if (creep.memory.role === 'drone') {
                        workers.push(creep);
                        roleDrone.run(creep);
                    }
                    else if (creep.memory.role === 'worker') {
                        workers.push(creep);
                        roleWorker.run(creep);
                    }
                    else if (creep.memory.role === 'upgrader') {
                        upgraders.push(creep);
                        roleUpgrader.run(creep);
                    }
                    else if (creep.memory.role === 'miner') {
                        miners.push(creep);
                        roleMiner.run(creep);
                        if (creep.memory.replaced) {
                            totalLivingCreeps--;
                        }
                    } else if (creep.memory.role === 'transporter') {
                        transporters.push(creep);
                        roleTransporter.run(creep);
                    }
                }
            }

            function runTowers() {
                towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
                _.forEach(towers, t => roleTower.run(t));
            }

            function runLinks() {
                links = _.filter(Game.structures, s => s.structureType === STRUCTURE_LINK);
                _.forEach(links, l => roleLink.run(l));
            }

            function spawnCreeps(currentSpawn) {
                if (!currentSpawn.spawning && totalLivingCreeps < maxCreeps) {
                    const maxSpawnEnergy = currentRoom.energyCapacityAvailable;
                    if (currentCreeps < 2) {
                        utils.logMessage("Need more drones " + currentCreeps + " /2");
                        spawnDrone();
                    }
                    else if (miners.length < 1) {
                        utils.logMessage("Need a miner! " + miners.length + " /1");
                        spawnMiner(maxSpawnEnergy);
                    }
                    else if (upgraders.length < 1) {
                        utils.logMessage("Need an upgrader! " + upgraders.length + " /1");
                        spawnUpgrader(maxSpawnEnergy);
                    }
                    else if (miners.length < roomData.maxMiners) {
                        utils.logMessage("Need more miners :(" + miners.length + " / " + roomData.maxMiners + ')');
                        spawnMiner(maxSpawnEnergy);
                    }
                    else if (upgraders.length < roomData.maxUpgraders) {
                        utils.logMessage("Need more upgraders :(" + upgraders.length + " / " + roomData.maxUpgraders + ')');
                        spawnUpgrader(maxSpawnEnergy);
                    }
                    else if (transporters.length < roomData.maxTransporters) {
                        utils.logMessage("Need more transporters :(" + transporters.length + " / " + roomData.maxTransporters + ')');
                        spawnTransporter(maxSpawnEnergy, roomData);
                    }
                    else if (workers.length < roomData.maxWorkers) {
                        utils.logMessage("Need more workers :(" + workers.length + " / " + roomData.maxWorkers + ')');
                        spawnWorker(maxSpawnEnergy);
                    }
                }
                else if (miners.length === roomData.maxMiners) {
                    let dyingMiners = [];
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
                    const energy = maxSpawnEnergy > 1000 ? 1000 : maxSpawnEnergy;
                    const body = roleUpgrader.getBody(energy);
                    currentSpawn.createCreep(body, null, {role: 'upgrader'});
                    utils.logMessage("Spawning upgrader :" + JSON.stringify(body));
                }

                function spawnMiner(maxSpawnEnergy) {
                    let energySourceIds = roomData.energySourceIds;
                    let miningPositions = roomToolkit.getMiningPositions(currentRoom, currentSpawn, energySourceIds);
                    let usedSourceIds = [];
                    let usedPositions = [];
                    for (let m in miners) {
                        if (miners[m].memory && miners[m].memory.sourceId) {
                            //const obj = Game.getObjectById(miners[m].memory.sourceId);
                            //const pos = new RoomPosition(obj.pos.x, obj.pos.y, obj.room.name);
                            usedSourceIds.push(miners[m].memory.sourceId);
                            if (miners[m].memory.position) {
                                usedPositions.push(miners[m].memory.position);
                            }
                        }
                    }
                    const unusedSources = _.reject(energySourceIds, s => _.some(usedSourceIds, s));
                    const unusedPositions = _.reject(miningPositions, s => _.some(usedPositions, s));
                    utils.logMessage("Unused sources :",unusedSources);
                    utils.logMessage("Unused positions :",unusedPositions);

                    if (miners.length < energySourceIds.length) {
                        if (unusedPositions.length) {
                            let body = roleMiner.getBody(maxSpawnEnergy);

                            const pos = unusedPositions[0];
                            // const link = _(currentRoom.find(FIND_MY_STRUCTURES)).filter(s => s.structureType === STRUCTURE_LINK).min(s => pos.getRangeTo(s));
                            // utils.logObject("Links :", JSON.stringify(link));
                            // let linkPos;
                            // if (link !== null) {
                            //     if (roomData.linkSourceId === link.id) {
                            //         linkPos = 'SOURCE';
                            //         body = roleMiner.getLinkBody(maxSpawnEnergy);
                            //     }
                            //     else if (roomData.linkDestinationId === link.id) {
                            //         linkPos = 'DESTINATION';
                            //         body = roleMiner.getLinkBody(maxSpawnEnergy);
                            //     } else {
                            //         utils.logObject("WARNING Links found but misconfigured! :", link);
                            //     }
                            // }
                            currentSpawn.createCreep(body, null, {
                                role: 'miner',
                                sourceId: unusedSources[0],
                                position: pos,
                                log: false,
                      //          linkPosition: linkPos,
                      //          linkId: link.id
                            });
                            utils.logMessage("Spawning miner :" + JSON.stringify(pos) +" - "+ JSON.stringify(body));
                        } else {
                            utils.logMessage("WARNING Too many miners, but unused energy sources found!!");
                        }
                    }
                }

                function spawnReplacementMiner(oldMiner) {
                    const energySource = oldMiner.memory.sourceId;
                    const linkPos = oldMiner.memory.linkPosition;
                    const linkId = oldMiner.memory.linkId;
                    const pos = oldMiner.memory.position;
                    const body = [];
                    for (let part in oldMiner.body) {
                        //noinspection JSUnfilteredForInLoop
                        body.push(oldMiner.body[part].type);
                    }
                    currentSpawn.createCreep(body, null, {
                        role: 'miner',
                        sourceId: energySource,
                        position: pos,
                        linkPosition: linkPos,
                        linkId: linkId
                    });
                    oldMiner.memory.replaced = true;
                    utils.logObject("Spawning replacement miner for :", pos);
                }

                function spawnTransporter(maxSpawnEnergy, roomData) {
                    const body = roleTransporter.getBody(maxSpawnEnergy);
                    currentSpawn.createCreep(body, null, {
                        role: 'transporter',
                        sourceIds: roomData.sourceContainerIds
                    });
                    utils.logMessage("Spawning transporter :" + JSON.stringify(body));
                }

                function spawnWorker(maxSpawnEnergy) {
                    const energy = maxSpawnEnergy > 1000 ? 1000 : maxSpawnEnergy;
                    const body = roleWorker.getBody(energy);
                    currentSpawn.createCreep(body, null, {role: 'worker'});
                    utils.logMessage("Spawning worker :" + JSON.stringify(body));
                }
            }

            function logGameState() {
                if (Game.time % 10 === 0) {
                    utils.logMessage("::::  " + currentRoom.name + "  ::::");
                    utils.logMessage("Time is :" + Game.time);
                    utils.logMessage("Miners :" + JSON.stringify(_.map(miners, c => c.name + "[" + c.memory.position.x + "," + c.memory.position.y + "] (" + c.ticksToLive + "/" + ((c.body.length * 3) + c.memory.ticksToArrive) + ")")));
                    utils.logMessage("Workers :" + JSON.stringify(_.map(workers, c => c.name + ":" + c.memory.role[0] + " (" + c.ticksToLive + ")")));
                    utils.logMessage("Upgraders :" + JSON.stringify(_.map(upgraders, c => c.name + " (" + c.ticksToLive + ")")));
                    utils.logMessage("Transporters :" + JSON.stringify(_.map(transporters, c => c.name + " (" + c.ticksToLive + ")")));
                }
            }

            function logMarket() {
                const resources = ['KO', 'ZH', 'GO'];
                if (Game.time % 5 === 0) {
                    const orders = _(Game.market.getAllOrders())
                        .filter(o => o.type === 'buy')
                        .filter(o => _.some(resources, o => o.resourceType))
                        .sortBy(o => -1 * o.price)
                        .value();

                    for (let i in orders) {
                        //noinspection JSUnfilteredForInLoop
                        utils.logMessage(i + ":" + JSON.stringify(orders[i]));
                        if (i > 100) {
                            break;
                        }
                    }
                }
            }
        }
    }
};
