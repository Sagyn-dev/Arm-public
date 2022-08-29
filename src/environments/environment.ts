// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	apiUrl: 'https://test:4002',
	//apiUrl:  'http://localhost:4002',
	authUrl: 'https://test:4000',
	//authUrl: 'http://localhost:4000',
	uploadUrl: 'https://test:4003',
	statementUrl: 'https://test:4004',
	//statementUrl:  'http://localhost:4004',
	fastReportUrl: 'https://test:4005',
	//fastReportUrl: 'http://localhost:4005',
	demandUrl: 'https://test:4006',
	// demandUrl: 'http://localhost:4006'
	apiCN:'https://test:4007',
	//apiCN:'http://localhost:4007',
	//apiQueue:'https://test:4008'
	apiQueue:'http://localhost:4008'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
