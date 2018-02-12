const utils = require('utils');

const lattice = [{x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}, {x: 2, y: 0}, {x: 2, y: 2},
    {x: 0, y: 2}, {x: -2, y: 2}, {x: -2, y: 0}, {x: -2, y: -2}, {x: 0, y: -2}, {x: 2, y: -2}, {x: 3, y: -1},
    {x: 3, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}, {x: -1, y: 3}, {x: -3, y: 3}, {x: -3, y: 1}, {x: -3, y: -1},
    {x: -3, y: -3}, {x: -1, y: -3}, {x: 1, y: -3}, {x: 3, y: -3}];

const planUtils = {
    calculateTechLevel(room) {
        if (Memory.rooms[room.name]) {
            if (room.controller.level === 1) {
                return 'Roads';
            } else if (room.controller.level === 2) {
                if (room.energyCapacityAvailable < 550) {
                    return 'Energy_L0'
                }
                const energySites = Memory.rooms[room.name].energySourceIds.length;
                if (planUtils.numberOfPlannedAndRealContainers(room) < energySites) {
                    return 'Containers_L0';
                }
            } else if (room.controller.level === 3) {
                if (room.energyCapacityAvailable < 800) {
                    return 'Energy_L1'
                }
                // Towers

            }
            else if (room.controller.level === 4) {
                if (room.energyCapacityAvailable < 1300) {
                    return 'Energy_L2'
                }
                // Storage
            }
            else if (room.controller.level === 5) {
                if (room.energyCapacityAvailable < 1800) {
                    return 'Energy_L3'
                }
                // Link
                // Tower_L2
            }
            else if (room.controller.level === 6) {
                if (room.energyCapacityAvailable < 2300) {
                    return 'Energy_L4'
                }
                // Link_L2
                // Extractor
                // Labs
                // Terminal
            }
        }
        return 'NONE';
    },

    numberOfPlannedAndRealContainers: function (room) {
        let containers = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
        let sites = _(room.find(FIND_CONSTRUCTION_SITES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
        return containers + sites;
    },
    hasBuildingOrSite: function (locations, structure) {
        for (const loc in locations) {
            let contents = locations[loc].look();
            let structures = contents['structure'];
            for (const s in structures) {
                if (structures[s].structureType === structure)
                    return true;
            }
            let sites = contents['constructionSite'];
            for (const s in sites) {
                if (sites[s].structureType === structure)
                    return true;
            }
        }
        return false;
    },
    nonWallsNextToLocation: function (room, pos) {
        const area = room.lookAtArea((pos.y) - 1, (pos.x) - 1, (pos.y) + 1, (pos.x) + 1, true);
        let spaces = [];
        for (const a in area) {
            if (area[a].type === "terrain" && area[a].terrain !== 'wall' && (pos.x !== area[a].x || pos.y !== area[a].y)) {
                spaces.push(new RoomPosition(area[a].x, area[a].y, room.name));
            }
        }
        return spaces;
    },

    nonWallPositionsNextToCoordinates: function (room, x, y) {
        const area = room.lookAtArea(y - 1, x - 1, y + 1, x + 1, true);
        let spaces = [];
        for (const a in area) {
            if (area[a].type === "terrain" && area[a].terrain !== 'wall' && (x !== area[a].x || y !== area[a].y)) {
                spaces.push(new RoomPosition(area[a].x, area[a].y, room.name));
            }
        }
        return spaces;
    },
    containsNoConstructionSites: function (room) {
        let sites = _(room.find(FIND_CONSTRUCTION_SITES))
            .size();
        return sites === 0;
    },

    findSpacesWithoutBuildingsOrSites: function (room, locations, energySource) {
        const spaces = [];
        for (const l in locations) {
            const structures = room.lookForAt(LOOK_STRUCTURES, locations[l].x, locations[l].y);
            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, locations[l].x, locations[l].y);

            if (_(structures).size() === 0 && _(sites).size() === 0) {
                utils.logObject("Empty space found at [" + locations[l].x + "," + locations[l].y + "]: for ", Game.getObjectById(energySource).pos);
                spaces.push(locations[l]);
            }
        }
        return spaces;
    },

    getPositions: function (room, locations) {
        const positions = [];
        for (const loc in locations) {
            const pos = new RoomPosition(locations[loc].x, locations[loc].y, room.name);
            positions.push(pos);
        }
        return positions;
    },
    getMiningPositions: function (room, currentSpawn, energySources) {
        const positions = [];
        for (const source in energySources) {
            const spaces = planUtils.nonWallPositionsNextToCoordinates(room, Game.getObjectById(energySources[source]).pos.x, Game.getObjectById(energySources[source]).pos.y);
            utils.logObject("spaces :", spaces);
            const target = _(spaces).sortBy(s => _(s.findPathTo(currentSpawn.pos, {
                ignoreCreeps: true,
                ignoreRoads: true
            })).size()).first();
            positions.push(target);
        }
        return positions;
    },
    findEnergySourceIdsInRoom: function (room) {
        const containers = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .value();

        const ids = [];
        for (const c in containers) {
            ids.push(containers[c].id);
        }
        return ids;
    },
    findConstructionSiteIds: function (room, structureType) {
        return _(room.find(FIND_CONSTRUCTION_SITES))
            .filter(s => s.structureType === structureType)
            .map(s => s.id)
            .value();
    },
    buildRoadAlongPath(room, path) {
        for (const p in path) {
            room.createConstructionSite(path[p].x, path[p].y, STRUCTURE_ROAD);
        }
    },
    buildInitialContainers(room) {
        const energyLocationIds = Memory.rooms[room.name].energySourceIds;
        const spawnIds = Memory.rooms[room.name].spawnIds;
        for (const e in energyLocationIds) {
            let locations = planUtils.nonWallsNextToLocation(room, Game.getObjectById(energyLocationIds[e]).pos);
            if (planUtils.hasBuildingOrSite(locations, STRUCTURE_CONTAINER)) {
                break;
            }
            let goodLocations = planUtils.findSpacesWithoutBuildingsOrSites(room, locations, energyLocationIds[e]);

            if (_(goodLocations).size() === 0) {
                utils.logMessage("Warning, unable to find good site for container");
            }
            else {
                let positions = planUtils.getPositions(room, goodLocations);
                const containerLocation = _(positions).sortBy(s => _(s.findPathTo(Game.getObjectById(spawnIds[0]).pos)).size()).first();
                room.createConstructionSite(containerLocation.x, containerLocation.y, STRUCTURE_CONTAINER);
            }
        }
    },
    connectContainersAndSpawns(room) {
        const spawnIds = Memory.rooms[room.name].spawnIds;
        const containerIds = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .map(s => s.id)
            .value();

        Memory.rooms[room.name].sourceContainerIds = containerIds;
        utils.logMessage("Creating spawn paths from:" + JSON.stringify(spawnIds) + " to :" + JSON.stringify(containerIds));
        for (const s in spawnIds) {
            const spawn = Game.getObjectById(spawnIds[s]);
            const start = spawn.pos;
            for (let c in containerIds) {
                const container = Game.getObjectById(containerIds[c]);
                const end = container.pos;
                utils.logMessage("Pathing from " + JSON.stringify(start) + " to " + JSON.stringify(end) + ".");
                const path = room.findPath(start, end, {ignoreCreeps: true, ignoreRoads: true});
                planUtils.buildRoadAlongPath(room, path);
            }
        }
    },
    connectController: function (room) {
        let roadPositions = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_ROAD)
            .map(s => s.pos)
            .value();

        let closest;
        if (roadPositions.length !== 0) {
            closest = room.controller.pos.findClosestByRange(roadPositions);
        } else {
            closest = planUtils.getSpawns(room)[0].pos;
        }
        const path = room.findPath(closest, room.controller.pos, {ignoreCreeps: true, ignoreRoads: true});
        planUtils.buildRoadAlongPath(room, path);
    },
    resetConstructionSites(room) {
        utils.logMessage("Clearing construction sites.");
        Memory.resetConstructionSites = false;
        let sites = _(room.find(FIND_CONSTRUCTION_SITES))
            .value();
        for (const site in sites) {
            sites[site].remove();
        }
    },
    buildExtensions(room, number) {
        let latticePosition = Memory.rooms[room.name].latticePosition;
        const spawnPos = planUtils.getSpawns(room)[0].pos;
        for (let i = 0; i < number; i++) {
            let found = false;
            let position;
            while (!found) {
                position = planUtils.getNextLatticePosition(spawnPos, latticePosition);
                latticePosition++;
                const result = position.createConstructionSite(STRUCTURE_EXTENSION);
                if (result === 0) {
                    found = true;
                } else {
                    utils.logMessage("Error :" + result + " - Unable to build at ", position);
                }
            }
        }
        Memory.rooms[room.name].latticePosition = latticePosition;
    },
    getSpawns(room) {
        return _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_SPAWN)
            .value();
    },
    getNextLatticePosition(pos, index) {
        const offset = lattice[index];
        return new RoomPosition(pos.x + offset.x, pos.y + offset.y, pos.roomName);
    }
};

module.exports = planUtils;