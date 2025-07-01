// name | path | display
export const routes = [
	['main', 		'index',				'Home',				''		],
	['about',	 	'src/about',			'About Me',			'main'	],
	['code', 		'src/code/index',		'Code',				'main'	],
	['moji', 		'src/code/moji-mash',	'Moji Mash',		'code'	],
	['pix_water', 	'src/code/pixel-water',	'Pixel Water',		'code'	],
	['term_game', 	'src/code/term-game',	'Terminal Game',	'code'	],
	['matrix_text', 'src/code/matrix-text',	'Matrix Text',		'code'	],
	['art', 		'src/art',				'Art',				'main'	],
	['kandi', 		'src/kandi',			'Kandi',			'main'	],
	['dev_diary', 	'src/dev-diary',		'Dev Diary',		'main'	],
	['flowers',		'src/flowers/index',	'Flowers',			''		]
];

export const routeObjs = routes.map(e => {
	return {
		name: e[0],
		path: e[1],
		display: e[2],
		parent: e[3]
	}
})

export const routeMap = new Map(routeObjs.map(e => [e.name, e]));