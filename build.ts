import fs from 'fs';
import path from 'path';
import { Parcel, createWorkerFarm } from '@parcel/core';
import { MemoryFS } from '@parcel/fs';
import { globSync } from 'glob';
import TailWindCSS from 'tailwindcss';
import PostCSS from 'postcss';
import autoPreFixer from 'autoprefixer';

const workerFarm = createWorkerFarm();
const outPutFileSystem = new MemoryFS(workerFarm);

const parcel = new Parcel({
	defaultConfig: '@parcel/config-default',
	env: {
		NODE_ENV: 'production'
	},
	mode: 'production',
	workerFarm,
	entries: './src/client/*',
	outputFS: outPutFileSystem
});


parcel.run()
	.then(async bundles => {
		if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');

		for (const bundle of bundles.bundleGraph.getBundles()) {
			const content = await outPutFileSystem.readFile(bundle.filePath, 'utf-8');
			
			if (bundle.type !== 'ico') fs.writeFileSync(bundle.filePath, content);
		};
	})
	.catch(error => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => {workerFarm.end()});

const inPutPath = './src/server/templates/style.css';
const outPutPath = './dist/style.css';
const buildFolder = './dist';
const inPut = fs.readFileSync(inPutPath, 'utf-8');

PostCSS([TailWindCSS, autoPreFixer]).process(inPut, {
	from: inPutPath,
	to: outPutPath
})
	.then(outPut => {
		if (!fs.existsSync(buildFolder)) fs.mkdirSync(buildFolder);

		fs.writeFileSync(outPutPath, outPut.content);
	})
	.catch(console.error);

function copyFiles(pattern: string, destination: string): void {
	const files = globSync(pattern);

	files.forEach(file => {
		const fileName = path.basename(file);
		const destinationPath = path.join(destination, fileName);

		for (let i = 1; i < 3; i++) {
			try {
				fs.copyFileSync(file, destinationPath);
				console.log(`copy: '${file}' -> '${destinationPath}'`);
			} catch (error: any) {
				if (error.code === 'ENOENT') {
					const parent = path.dirname(destinationPath);

					fs.mkdirSync(parent, {recursive: true});

					continue;
				} else {
					console.error(error);

					break;
				};
			};
		};
	});
};

copyFiles('./src/client/favicon.ico', './dist/');
copyFiles('./src/server/dataBase.sqlite', './dist/server/');
copyFiles('./src/server/templates/*.njk', './dist/server/templates/');