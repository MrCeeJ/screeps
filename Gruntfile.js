module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'mrceej@gmail.com',
                password: 'iSuohM219Sc2',
                branch: 'default',
                ptr: false
            },
            dist: {
                files: [
                    {
                        src: ['*.js'],
                    }
                ]
            }
        }
    });
};