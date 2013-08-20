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


		jasmine:
			pivotal:
				src: [
					'client/libs/jquery/jquery.min.js',
					'client/libs/angular/angular.min.js',
					'client/libs/angular-animate/angular-animate.min.js',
					'client/libs/angular-mocks/angular-mocks.js',
					'client/libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'client/js/app.js',
					'client/libs/underscore.min.js'
					]
				options:
					specs: "client-test/main.js"


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


			compileFrontTest:
				options:
					bare: true
				files: 'client-test/main.js': ['client-src/test/**/*.coffee'] 

		watch:
			frontScripts:
				files: ['client-src/coffee/*']
				tasks: ['coffee:compileFront', 'jasmine:pivotal']
				options:
					interrupt: true

			backScripts:
				files: ['server/**/*.coffee']
				tasks: ['coffee:compileBack', 'mochaTest']
				options:
					interrupt: true

			test:
				files: ['test/**/*.coffee']
				tasks: ['coffee:compileTest']
				options:
					interrupt: true

			frontTest:
				files: ['client-src/test/**/*.coffee']
				tasks: ['coffee:compileFrontTest', 'jasmine:pivotal']

			less:
				files: ['client-src/less/*']
				tasks: ['less:compile']
				options:
					interrupt: true




	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-mocha-test'
	grunt.loadNpmTasks 'grunt-contrib-less'
	grunt.loadNpmTasks 'grunt-contrib-jasmine'

	grunt.registerTask('default', ['watch'])