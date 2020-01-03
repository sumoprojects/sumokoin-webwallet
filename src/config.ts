let global : any = typeof window !== 'undefined' ? window : self;
global.config = {
	apiUrl:typeof window !== 'undefined' && window.location ? window.location.href.substr(0,window.location.href.lastIndexOf('/')+1)+'api/' : 'https://wallet.sumokoin.com/api/',
	trustedDaemonsAddresses:[
		'https://wallet.sumokoin.com:4444/'
	],
	phpRelay:typeof window !== 'undefined' ? true : false,
	mainnetExplorerUrl: "https://explorer.sumokoin.com/",
	mainnetExplorerUrlHash: "https://explorer.sumokoin.com/tx/{ID}",
	mainnetExplorerUrlBlock: "https://explorer.sumokoin.com/block/{ID}",
	testnetExplorerUrl: "https://testnet-explorer.sumokoin.com/",
	testnetExplorerUrlHash: "https://testnet-explorer.sumokoin.com/tx/{ID}",
	testnetExplorerUrlBlock: "https://testnet-explorer.sumokoin.com/block/{ID}",
	testnet: false,
	coinUnitPlaces: 9,
	txMinConfirms: 10,         // corresponds to CRYPTONOTE_DEFAULT_TX_SPENDABLE_AGE in Sumokoin
	txCoinbaseMinConfirms: 60, // corresponds to CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW in Sumokoin
	addressPrefix: 0x2bb39a,
	integratedAddressPrefix: 0x29339a,
	addressPrefixTestnet: 0x37751a,
	integratedAddressPrefixTestnet: 0x34f51a,
	subAddressPrefix: 0x8319a,
	subAddressPrefixTestnet: 0x1d351a,
	feePerKB: new JSBigInt('1200000'),
	dustThreshold: new JSBigInt('10000000'),
	defaultMixin: 48, // default value mixin

	idleTimeout: 30,
	idleWarningDuration: 20,

	coinSymbol: 'SUMO',
	openAliasPrefix: "sumo",
	coinName: 'Sumokoin',
	coinUriPrefix: 'sumo:',
	avgBlockTime: 240,
	maxBlockNumber: 500000000,

	donationAddresses : []
};
