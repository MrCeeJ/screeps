var towerExtensions = {
    register: function () {
        StructureTower.prototype.findClosestHostileCreep = function() {
            return this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        };

        StructureTower.prototype.findWeakestStructureOfType = function(structureTypes) {
            structureTypes = structureTypes || [];

            var structures = this.room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    return s.hits < (s.hitsMax*.7) && _.includes(structureTypes, s.structureType);
                }
            });

            var orderedStructures = _.sortByOrder(structures, ['hits']);

            return _.first(orderedStructures);
        };

        StructureTower.prototype.findClosestInjuredCreep = function() {
            return this.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(c) { return c.hits < c.hitsMax;}
            })
        }

        StructureTower.prototype.findClosestStructureNeedingRepair = function() {
            var reallyWeak = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(s) {
                    switch (s.structureType) {
                        case STRUCTURE_WALL:
                            return s.hits < 100;
                        default:
                            return s.hits < (s.hitsMax*.05);
                    }
                }
            });

            if (!!reallyWeak) return reallyWeak;

            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(s) {
                    switch (s.structureType) {
                        case STRUCTURE_WALL:
                            return 0; // Don't upgrade the walls too much... This needs some adjustments later.
                        default:
                            return s.hits < (s.hitsMax*.7);
                    }
                }
            });
        };
    }
};

module.exports = towerExtensions;