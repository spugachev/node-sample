'use strict';

let path = require('path');

module.exports = () => {
  	let client = './src/client/';
    let server = './src/server/';
    let source = 'src/';

	let config = {
		client: client,
		server: server,
		source: source,
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