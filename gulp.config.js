'use strict';

let path = require('path');

module.exports = () => {
  	let client = './src/client/';
    let server = './src/server/';
    let build = './build/';
    let temp = './.tmp/';
    let source = './src/';

	let config = {
		client: client,
		server: server,
		source: source,
		build: build,
		temp: temp,
		nodeServer:  path.join(server, 'app.js'),
		defaultPort: '3488',
		browserSyncPort: 3000,

		/**
         * browser sync
         */
        browserReloadDelay: 1000,
	};

	return config;
};