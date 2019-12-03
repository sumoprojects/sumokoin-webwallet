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
	testnetExplorerUrl: "http://explorer.sumokoin.com/",
	testnetExplorerUrlHash: "http://explorer.sumokoin.com/tx/{ID}",
	testnetExplorerUrlBlock: "http://explorer.sumokoin.com/block/{ID}",
	testnet: false,
	coinUnitPlaces: 9,
	txMinConfirms: 10,         // corresponds to CRYPTONOTE_DEFAULT_TX_SPENDABLE_AGE in Monero
	txCoinbaseMinConfirms: 60, // corresponds to CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW in Monero
	addressPrefix: 0x2bb39a,
	integratedAddressPrefix: 0x29339a,
	addressPrefixTestnet: 0x37751a,
	integratedAddressPrefixTestnet: 0x34f51a,
	subAddressPrefix: 0x8319a,
	subAddressPrefixTestnet: 0x1d351a,
	feePerKB: new JSBigInt('500000'),//20^10 - for testnet its not used, as fee is dynamic.
	dustThreshold: new JSBigInt('10000000'),//10^10 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
	defaultMixin: 48, // default value mixin

	idleTimeout: 30,
	idleWarningDuration: 20,

	coinSymbol: 'SUMO',
	openAliasPrefix: "sumo",
	coinName: 'Sumokoin',
	coinUriPrefix: 'sumokoin:',
	avgBlockTime: 240,
	maxBlockNumber: 500000000,

	donationAddresses : [
		
	]
};
