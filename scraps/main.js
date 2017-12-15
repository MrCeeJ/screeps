const settings = require('settings');
const roleDrone = require('role.drone');
const maxCreeps = settings.maxCreeps;

module.exports.loop = function () {
    const enemies = Game.rooms['W9S51'].find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        let username = enemies[0].owner.username;
        Game.notify(`User ${username} spotted in room W9S51`);
        Game.rooms['W9S51'].controller.activateSafeMode()
    }

    const currentCreeps = _(Game.creeps).size();
    //Spawning
    let drones = [];

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role === 'drone') {
            drones.push(creep);
            roleDrone.run(creep);
        }
    }

    const towers =  _.(Game.structures)

        _.filter(s => structure.structureType == STRUCTURE_TOWER);

    _.forEach(towers, function(tower) {
        towerStructure.run(tower);
    });

    if (currentCreeps < maxCreeps) {
        // Note we might not have this much energy, in which case we will simply wait
        const maxSpawnEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;

        if (allowStarters && _(starterUpgraders).size() < maxStarterUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'starterUpgrader'});
        }
        else if (allowStarters && _(starterMiners).size() < maxStarterMiners) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'starterMiner'});
        }
        else if (false && leftMiner == undefined) {
            const flag = Game.flags['Flag1'];
            const locationX = flag.pos.x;
            const locationY = flag.pos.y;
            const body = roleMiner.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'leftMiner', home:false, locationX:locationX, locationY:locationY});
        }
        else if (rightMiner == undefined) {
            const flag = Game.flags['Flag2'];
            const locationX = flag.pos.x;
            const locationY = flag.pos.y;
            const body = roleMiner.getBody(maxSpawnEnergy);
            Game.spawns['Spawn1'].createCreep(body, null, {role: 'rightMiner', home:false, locationX:locationX, locationY:locationY});
        }
        else if (_(bootstrappers).size() < maxBootstrappers) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], null, {role: 'bootstrapper'});
        }
        else if (_(upgraders).size() < maxUpgraders) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'upgrader'});
        }
        else if (_(leftTransporters).size() < maxTransporters) {
            const container = _(Game.flags['Flag1'].pos.findInRange(FIND_STRUCTURES, 1))
                                .filter(s => s.structureType == STRUCTURE_CONTAINER);
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'leftTransporter', sourceId:container.id});
        }
        else if (false && _(rightTransporters).size() < maxTransporters) {
            const container = _(Game.flags['Flag2'].pos.findInRange(FIND_STRUCTURES, 1))
                .filter(s => s.structureType == STRUCTURE_CONTAINER);
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'rightTransporter', sourceId:container.id });
        }
        else {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: 'worker'});
        }
    }
};
