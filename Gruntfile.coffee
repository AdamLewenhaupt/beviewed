module.exports = (grunt) ->

	grunt.initConfig

		pkg: grunt.file.readJSON 'package.json'

		less:
			compile:
				files:
					"client/style/main.css": ["client-src/less/*"]

		mochaTest:
			test:
				options:
					reporter: 'spec'
				src:
					['test/**/*.js']


		coffee:
			compileFront:
				options:
					bare: true
				files:
					'client/js/app.js': ['client-src/coffee/**/*.coffee']

			compileBack:
				options:
					bare: true

				files: grunt.file.expandMapping ['server/**/*.coffee'], ''
			    	rename: (destBase,destPath) -> 
			    		destBase+destPath.replace(/\.coffee$/,".js").replace("server/", "")


			compileTest:
				expand: true
				cwd: 'test'
				src: ['*.coffee']
				dest: 'test'
				ext: '.js'

		watch:
			frontScripts:
				files: ['client-src/coffee/*']
				tasks: ['coffee:compileFront']
				options:
					interrupt: true

			backScripts:
				files: ['server/**/*.coffee']
				tasks: ['coffee:compileBack']
				options:
					interrupt: true

			test:
				files: ['test/**/*.coffee']
				tasks: ['coffee:compileTest', 'mochaTest']
				options:
					interrupt: true

			less:
				files: ['client-src/less/*']
				tasks: ['less:compile']
				options:
					interrupt: true




	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-mocha-test'
	grunt.loadNpmTasks 'grunt-contrib-less'

	grunt.registerTask('default', ['watch'])