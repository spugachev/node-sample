'use strict';

let path = require('path');

module.exports = () => {
	const dist = './dist/';
    const temp = './.tmp/';
    const src = './src/';
  	const srcClient = './src/client/';
    const srcServer = './src/server/';
    const distClient = './dist/client/';
    const distServer = './dist/server/';

	let config = {
		src: src,
		dist: dist,
		temp: temp,
		srcClient: srcClient,
		srcServer: srcServer,
		distClient: distClient,
		distServer: distServer,
		
		typings: './typings/index.d.ts',
		tsconfig: 'tsconfig.json',

		nodeServer:  path.join(distServer, 'app.js'),
		defaultPort: '3488',
		

		/**
         * browser sync
         */
        browserSyncPort: 3000,
        browserReloadDelay: 1000,
	};

	return config;
};