declare var nacl : {
	ll:{
		ge_scalarmult:(a : Uint8Array, b : Uint8Array)=>Uint8Array,
		ge_double_scalarmult_base_vartime:(a : Uint8Array, b : Uint8Array, c : Uint8Array)=>Uint8Array,
		ge_double_scalarmult_postcomp_vartime:(a : Uint8Array, b : Uint8Array, c : Uint8Array, d : Uint8Array)=>Uint8Array,
		ge_add:(a : Uint8Array, b : Uint8Array)=>Uint8Array,
		ge_scalarmult_base:(a : Uint8Array)=>Uint8Array,
		ge_double_scalarmult_postcomp_vartime_raw_output:(a : Uint8Array, A : Uint8Array, b : Uint8Array, B : Uint8Array)=>Uint8Array,
		ge_scalarmult_raw:(A : Uint8Array, a : Uint8Array)=>string,
		ge_add_raw:(A : string, B : string)=>Uint8Array,
		unpack:(A : Uint8Array)=>string,
		pack:(A : string)=>Uint8Array,
	},
	secretbox:any,
	//open:(encrypted:Uint8Array, nonce:Uint8Array, privKey:Uint8Array)=>Uint8Array;
	util:{
		encodeBase64:(value : Uint8Array)=>string,
	},
	randomBytes:(bits : number) => Uint8Array
};

declare function keccak_256(bin : Uint8Array) : string;