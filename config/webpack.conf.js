'use strict';

let
	path = require('path'),
	webpack = require('webpack'),

	assets = require(path.resolve('./config/assets.js'));

module.exports = (mode) => {

	/**
	 * Flags to determine the mode in which we're invoking webpack
	 *
	 *  'build' - Building the production JS
	 *  'develop' - Running webpack dev middleware for development
	 */
	let build = (mode === 'build');
	let develop = (mode === 'develop');


	// The main webpack config object to return
	let wpConfig = {};


	/**
	 * Source map configuration
	 */
	if(build) {
		// Disable sourcemaps for prod build since they don't work anyways
		wpConfig.devtool = false;
	}
	else {
		// Eval source maps for development (provides trace back to original TS)
		wpConfig.devtool = 'eval-source-map';
	}


	/**
	 * Entry points for the program
	 *
	 *   'vendor' - All third-party dependencies of the application
	 *   'application' - Application code
	 */
	wpConfig.entry = (test)? {} : {
		application: path.resolve('./src/client/main.ts'),
		vendor: path.resolve('./src/client/vendor.ts')
	};


	/**
	 * Bundle output definitions
	 *   Defines how output bundles are generated and named
	 */
	wpConfig.output = {};

	// If build mode set up for static loading of resources with cache busting
	if(build) {
		wpConfig.output.path = path.resolve('./public');
		wpConfig.output.publicPath = '/';
		wpConfig.output.filename = '[name].[chunkhash].js';
		wpConfig.output.chunkFilename = '[id].[chunkhash].chunk.js';
	}
	// If develop mode, set up for dev middleware
	else if(develop) {
		wpConfig.output.path = path.resolve('./public');
		wpConfig.output.publicPath = 'http://localhost:' + config.port + '/dev';
		wpConfig.output.filename = '[name].js';
		wpConfig.output.chunkFilename = '[name].js';
	}


	/**
	 * List of extensions that webpack should try to resolve
	 */
	wpConfig.resolve = {
		extensions: [
			'.ts', '.js','.json',
			'.woff', '.woff2', '.ttf', '.eot', '.svg',
			'.css', '.scss',
			'.html'
		]
	};

	/**
	 * Module Loaders for webpack
	 *   Teach webpack how to read various types of referenced dependencies
	 */
	wpConfig.module = {

		// Configured loaders
		loaders: [

			// Typescript loader
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					configFileName: path.resolve('./config/build/tsconfig.json')
				}
			},

			{
				test: /\.ts$/,
				loader: 'angular2-template-loader'
			},

			// CSS loader
			{ test: /\.css$/, loaders: [ 'style', 'css' ] },

			// SCSS loader
			{ test: /\.scss$/, loaders: [ 'style', 'css', 'sass' ] },

			// Image file loader
			{ test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png' },
			{ test: /\.(gif|jpg|jpeg)$/, loader: 'file' },

			// Font file loader (mostly for bootstrap/font-awesome)
			{ test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },

			// Font file loader (mostly for bootstrap/font-awesome)
			{ test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/, loader: 'file' },

			// HTML file loader (for angular2 templates)
			{ test: /\.html$/, loader: 'html' }
		]

	};


	/**
	 * Webpack plugins
	 */
	wpConfig.plugins = [];

	if(build) {
		// Minify if we're in build mode
		wpConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				minimize: true,
				sourceMap: false,
				output: {
					// Only comments matching this regex will be preserved
					comments: /@license/
				},
				compress: {
					// Don't show js warnings
					warnings: false
				}
			})
		);

		// Add a banner if we're in build mode
		wpConfig.plugins.push(new webpack.BannerPlugin(
			{ banner: assets.bannerString, raw: true, entryOnly: false }
		));
	}

	// Chunk common code if we're not running in test mode
	wpConfig.plugins.push(
		new webpack.optimize.CommonsChunkPlugin({
			name: [ 'app', 'vendor' ],
			filename: '[name].js'
		}),
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/
		)
	);

	return wpConfig;
};