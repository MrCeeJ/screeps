module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'mrceej@gmail.com',
                password: '',
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