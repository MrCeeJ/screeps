const planUtils = require('planUtils');
const utils = require('utils');

const plans = {
    planRoom: function (room) {
        if (planUtils.containsNoConstructionSites(room)) {
            techPlans[Memory.rooms[room.name].techLevel](room);
        } else {
            utils.logMessage("Room: " + room.name + " still under construction.");
        }
    }
};

const BUILD_CONTAINERS = function (room) {
    if (Memory.rooms[room.name].techLevel === 'NONE') {
        utils.logMessage("Constructing containers for room: " + JSON.stringify(room));
        planUtils.buildInitialContainers(room);
        Memory.rooms[room.name].techLevel = 'CONTAINERS';
    } else
        utils.logMessage("Warning, attempted to construct containers room in incorrect state :", Memory[room.name].techLevel);
};

const CONNECT_CONTAINERS = function (room) {
    if (Memory.rooms[room.name].techLevel === 'CONTAINERS') {
        planUtils.connectContainersAndSpawns(room);
        Memory.rooms[room.name].techLevel = 'CONNECTED_CONTAINERS';
    } else
        utils.logMessage("Warning, attempted to connect containers in incorrect state :", Memory[room.name].techLevel);
};

const CONNECT_CONTROLLER = function(room) {
    if (Memory.rooms[room.name].techLevel === 'CONNECTED_CONTAINERS') {
        planUtils.connectController(room);
        Memory.rooms[room.name].techLevel = 'CONNECT';
    } else
        utils.logMessage("Warning, attempted to connect controller in incorrect state :", Memory[room.name].techLevel);
};

const BUILD_L1_STORES = function (room) {
    if (Memory.rooms[room.name].techLevel === 'CONNECT') {
        utils.logMessage("Attempted to build storage in room:", room.name);
        // TODO: Write function
        //Memory.rooms[room.name].techLevel = 'L1_STORES';
    }
    else
        utils.logMessage("Warning, attempted to build storage in incorrect state :", Memory[room.name].techLevel);
};

const BUILD_LINK = function (room) {
    if (Memory.rooms[room.name].techLevel === 'L1_STORES') {
        utils.logMessage("Attempted to build link in room:", room.name);
        // TODO: Write function
        //Memory.rooms[room.name].techLevel = 'LINKS';
    }
    else
        utils.logMessage("Warning, attempted to build links in incorrect state :", Memory[room.name].techLevel);
};

const BUILD_TOWERS = function (room) {
    if (Memory.rooms[room.name].techLevel === 'LINKS') {
        utils.logMessage("Attempted to build towers in room:", room.name);
        // TODO: Write function
        //Memory.rooms[room.name].techLevel = 'TOWERS';
    }
    else
        utils.logMessage("Warning, attempted to build towers in incorrect state :", Memory[room.name].techLevel);
};

/**
 A map from current room tech level to actions to move to the next one.
 */
const techPlans = {
    'NONE': BUILD_CONTAINERS,
    'CONTAINERS': CONNECT_CONTAINERS,
    'CONNECTED_CONTAINERS': CONNECT_CONTROLLER,
    'CONNECTED_CONTROLLERS': BUILD_L1_STORES,
    'L1_STORES' : BUILD_LINK,
    'LINKS' : BUILD_TOWERS,
    'TOWERS' : undefined
};

module.exports = plans;
