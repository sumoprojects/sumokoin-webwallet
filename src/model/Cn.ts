/*
 * Copyright (c) 2021, Sumokoin.org
 * Copyright (c) 2018, Gnock
 * Copyright (c) 2018, The Masari Project
 * Copyright (c) 2014-2018, MyMonero.com
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {Mnemonic} from "./Mnemonic";
// import {CnUtilNative} from "../CnUtilNative";

declare let Module : any;

let HASH_SIZE = 32;
let ADDRESS_CHECKSUM_SIZE = 4;
let INTEGRATED_ID_SIZE = 8;
let ENCRYPTED_PAYMENT_ID_TAIL = 141;
let CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = config.addressPrefix;
let CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = config.integratedAddressPrefix;
let CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX = config.subAddressPrefix;
if (config.testnet === true)
{
	CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = config.addressPrefixTestnet;
	CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = config.integratedAddressPrefixTestnet;
	CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX = config.subAddressPrefixTestnet;
}
let UINT64_MAX = new JSBigInt(2).pow(64);

let KEY_SIZE = 32;
let STRUCT_SIZES = {
	GE_P3: 160,
	GE_P2: 120,
	GE_P1P1: 160,
	GE_CACHED: 160,
	EC_SCALAR: 32,
	EC_POINT: 32,
	KEY_IMAGE: 32,
	GE_DSMP: 160 * 8, // ge_cached * 8
	SIGNATURE: 64 // ec_scalar * 2
};

export namespace CnVars{

	export let H = "8b655970153799af2aeadc9ff1add0ea6c7251d54154cfa92c173a0dd39c1f94"; //base H for amounts
	export let l = JSBigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"); //curve order (not RCT specific)
	export let lminus2 = l.subtract(2);
	export let I = "0100000000000000000000000000000000000000000000000000000000000000"; //identity element
	export let Z = "0000000000000000000000000000000000000000000000000000000000000000"; //zero scalar
	//H2 object to speed up some operations
	export let H2 = ["8b655970153799af2aeadc9ff1add0ea6c7251d54154cfa92c173a0dd39c1f94", "8faa448ae4b3e2bb3d4d130909f55fcd79711c1c83cdbccadd42cbe1515e8712",
		"12a7d62c7791654a57f3e67694ed50b49a7d9e3fc1e4c7a0bde29d187e9cc71d", "789ab9934b49c4f9e6785c6d57a498b3ead443f04f13df110c5427b4f214c739",
		"771e9299d94f02ac72e38e44de568ac1dcb2edc6edb61f83ca418e1077ce3de8", "73b96db43039819bdaf5680e5c32d741488884d18d93866d4074a849182a8a64",
		"8d458e1c2f68ebebccd2fd5d379f5e58f8134df3e0e88cad3d46701063a8d412", "09551edbe494418e81284455d64b35ee8ac093068a5f161fa6637559177ef404",
		"d05a8866f4df8cee1e268b1d23a4c58c92e760309786cdac0feda1d247a9c9a7", "55cdaad518bd871dd1eb7bc7023e1dc0fdf3339864f88fdd2de269fe9ee1832d",
		"e7697e951a98cfd5712b84bbe5f34ed733e9473fcb68eda66e3788df1958c306", "f92a970bae72782989bfc83adfaa92a4f49c7e95918b3bba3cdc7fe88acc8d47",
		"1f66c2d491d75af915c8db6a6d1cb0cd4f7ddcd5e63d3ba9b83c866c39ef3a2b", "3eec9884b43f58e93ef8deea260004efea2a46344fc5965b1a7dd5d18997efa7",
		"b29f8f0ccb96977fe777d489d6be9e7ebc19c409b5103568f277611d7ea84894", "56b1f51265b9559876d58d249d0c146d69a103636699874d3f90473550fe3f2c",
		"1d7a36575e22f5d139ff9cc510fa138505576b63815a94e4b012bfd457caaada", "d0ac507a864ecd0593fa67be7d23134392d00e4007e2534878d9b242e10d7620",
		"f6c6840b9cf145bb2dccf86e940be0fc098e32e31099d56f7fe087bd5deb5094", "28831a3340070eb1db87c12e05980d5f33e9ef90f83a4817c9f4a0a33227e197",
		"87632273d629ccb7e1ed1a768fa2ebd51760f32e1c0b867a5d368d5271055c6e", "5c7b29424347964d04275517c5ae14b6b5ea2798b573fc94e6e44a5321600cfb",
		"e6945042d78bc2c3bd6ec58c511a9fe859c0ad63fde494f5039e0e8232612bd5", "36d56907e2ec745db6e54f0b2e1b2300abcb422e712da588a40d3f1ebbbe02f6",
		"34db6ee4d0608e5f783650495a3b2f5273c5134e5284e4fdf96627bb16e31e6b", "8e7659fb45a3787d674ae86731faa2538ec0fdf442ab26e9c791fada089467e9",
		"3006cf198b24f31bb4c7e6346000abc701e827cfbb5df52dcfa42e9ca9ff0802", "f5fd403cb6e8be21472e377ffd805a8c6083ea4803b8485389cc3ebc215f002a",
		"3731b260eb3f9482e45f1c3f3b9dcf834b75e6eef8c40f461ea27e8b6ed9473d", "9f9dab09c3f5e42855c2de971b659328a2dbc454845f396ffc053f0bb192f8c3",
		"5e055d25f85fdb98f273e4afe08464c003b70f1ef0677bb5e25706400be620a5", "868bcf3679cb6b500b94418c0b8925f9865530303ae4e4b262591865666a4590",
		"b3db6bd3897afbd1df3f9644ab21c8050e1f0038a52f7ca95ac0c3de7558cb7a", "8119b3a059ff2cac483e69bcd41d6d27149447914288bbeaee3413e6dcc6d1eb",
		"10fc58f35fc7fe7ae875524bb5850003005b7f978c0c65e2a965464b6d00819c", "5acd94eb3c578379c1ea58a343ec4fcff962776fe35521e475a0e06d887b2db9",
		"33daf3a214d6e0d42d2300a7b44b39290db8989b427974cd865db011055a2901", "cfc6572f29afd164a494e64e6f1aeb820c3e7da355144e5124a391d06e9f95ea",
		"d5312a4b0ef615a331f6352c2ed21dac9e7c36398b939aec901c257f6cbc9e8e", "551d67fefc7b5b9f9fdbf6af57c96c8a74d7e45a002078a7b5ba45c6fde93e33",
		"d50ac7bd5ca593c656928f38428017fc7ba502854c43d8414950e96ecb405dc3", "0773e18ea1be44fe1a97e239573cfae3e4e95ef9aa9faabeac1274d3ad261604",
		"e9af0e7ca89330d2b8615d1b4137ca617e21297f2f0ded8e31b7d2ead8714660", "7b124583097f1029a0c74191fe7378c9105acc706695ed1493bb76034226a57b",
		"ec40057b995476650b3db98e9db75738a8cd2f94d863b906150c56aac19caa6b", "01d9ff729efd39d83784c0fe59c4ae81a67034cb53c943fb818b9d8ae7fc33e5",
		"00dfb3c696328c76424519a7befe8e0f6c76f947b52767916d24823f735baf2e", "461b799b4d9ceea8d580dcb76d11150d535e1639d16003c3fb7e9d1fd13083a8",
		"ee03039479e5228fdc551cbde7079d3412ea186a517ccc63e46e9fcce4fe3a6c", "a8cfb543524e7f02b9f045acd543c21c373b4c9b98ac20cec417a6ddb5744e94",
		"932b794bf89c6edaf5d0650c7c4bad9242b25626e37ead5aa75ec8c64e09dd4f", "16b10c779ce5cfef59c7710d2e68441ea6facb68e9b5f7d533ae0bb78e28bf57",
		"0f77c76743e7396f9910139f4937d837ae54e21038ac5c0b3fd6ef171a28a7e4", "d7e574b7b952f293e80dde905eb509373f3f6cd109a02208b3c1e924080a20ca",
		"45666f8c381e3da675563ff8ba23f83bfac30c34abdde6e5c0975ef9fd700cb9", "b24612e454607eb1aba447f816d1a4551ef95fa7247fb7c1f503020a7177f0dd",
		"7e208861856da42c8bb46a7567f8121362d9fb2496f131a4aa9017cf366cdfce", "5b646bff6ad1100165037a055601ea02358c0f41050f9dfe3c95dccbd3087be0",
		"746d1dccfed2f0ff1e13c51e2d50d5324375fbd5bf7ca82a8931828d801d43ab", "cb98110d4a6bb97d22feadbc6c0d8930c5f8fc508b2fc5b35328d26b88db19ae",
		"60b626a033b55f27d7676c4095eababc7a2c7ede2624b472e97f64f96b8cfc0e", "e5b52bc927468df71893eb8197ef820cf76cb0aaf6e8e4fe93ad62d803983104",
		"056541ae5da9961be2b0a5e895e5c5ba153cbb62dd561a427bad0ffd41923199", "f8fef05a3fa5c9f3eba41638b247b711a99f960fe73aa2f90136aeb20329b888"];

	//yay bulletproofs
	//begin bulletproof vars
	export let maxN = 64;
	export let BULLETPROOF_MAX_OUTPUTS = 16;
	export let maxM = BULLETPROOF_MAX_OUTPUTS;
	export let INV_EIGHT = "792fdce229e50661d0da1c7db39dd30700000000000000000000000000000006";
	export let Hi = [], Gi = []; //consider precomputing -- takes approximately 500ms to generate
}

export namespace CnRandom{
	// Generate a 256-bit / 64-char / 32-byte crypto random
	export function rand_32() {
		return Mnemonic.mn_random(256);
	}

	// Generate a 128-bit / 32-char / 16-byte crypto random
	export function rand_16() {
		return Mnemonic.mn_random(128);
	}

	// Generate a 64-bit / 16-char / 8-byte crypto random
	export function rand_8() {
		return Mnemonic.mn_random(64);
	}

	export function random_scalar() {
		return CnNativeBride.sc_reduce32(CnRandom.rand_32());
	}
}

export namespace CnUtils{

	export function hextobin(hex : string) : Uint8Array{
		if (hex.length % 2 !== 0) throw "Hex string has invalid length!";
		let res = new Uint8Array(hex.length / 2);
		for (let i = 0; i < hex.length / 2; ++i) {
			res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
		}
		return res;
	}

	export function bintohex(bin : Uint8Array|string) : string {
		let out = [];
		if(typeof bin === 'string'){
			for (let i = 0; i < bin.length; ++i) {
				out.push(("0" + bin[i].charCodeAt(0).toString(16)).slice(-2));
			}
		}else {
			for (let i = 0; i < bin.length; ++i) {
				out.push(("0" + bin[i].toString(16)).slice(-2));
			}
		}
		return out.join("");
	}

	//switch byte order for hex string
	export function swapEndian(hex : string){
		if (hex.length % 2 !== 0){return "length must be a multiple of 2!";}
		let data = "";
		for (let i=1; i <= hex.length / 2; i++){
			data += hex.substr(0 - 2 * i, 2);
		}
		return data;
	}

	//switch byte order charwise
	export function swapEndianC(string : string) : string{
		let data = "";
		for (let i=1; i <= string.length; i++){
			data += string.substr(0 - i, 1);
		}
		return data;
	}

//for most uses you'll also want to swapEndian after conversion
	//mainly to convert integer "scalars" to usable hexadecimal strings
	export function d2h(integer : number|string){
		if (typeof integer !== "string" && integer.toString().length > 15){throw "integer should be entered as a string for precision";}
		let padding = "";
		for (let i = 0; i < 63; i++){
			padding += "0";
		}
		return (padding + JSBigInt(integer).toString(16).toLowerCase()).slice(-64);
	}

	//integer (string) to scalar
	export function d2s(integer : number|string){
		return CnUtils.swapEndian(CnUtils.d2h(integer));
	}

	// hexadecimal to integer
	export function h2d(hex : any) {
		let vali = 0;
		for (let j = 7; j >= 0; j--) {
			// console.log(vali,vali*256,bytes[j]);
			vali = (vali * 256 + parseInt(hex.slice(j*2, j*2+2), 16));
		}
		return vali;
	}

	export function d2b(integer : string) : string{
		let integerStr = integer.toString();
		if (typeof integer !== "string" && integerStr.length > 15){throw "integer should be entered as a string for precision";}
		let padding = "";
		for (let i = 0; i < 63; i++){
			padding += "0";
		}
		let a = new JSBigInt(integerStr);
		if (a.toString(2).length > 64){throw "amount overflows uint64!";}
		return CnUtils.swapEndianC((padding + a.toString(2)).slice(-64));
	}

	//scalar to integer (string)
	export function s2d(scalar : any){
		return JSBigInt.parse(CnUtils.swapEndian(scalar), 16).toString();
	}

	export function invert(a : any) {
		return CnUtils.d2s(JSBigInt(CnUtils.s2d(a)).modPow(CnVars.lminus2, CnVars.l).toString());
	}

	export function ge_scalarmult(pub : string, sec : string) {
		if (pub.length !== 64 || sec.length !== 64) {
			throw "Invalid input length";
		}
		return CnUtils.bintohex(nacl.ll.ge_scalarmult(CnUtils.hextobin(pub), CnUtils.hextobin(sec)));
	}

	export function ge_add(p1 : string, p2 : string) {
		if (p1.length !== 64 || p2.length !== 64) {
			throw "Invalid input length!";
		}
		return CnUtils.bintohex(nacl.ll.ge_add(hextobin(p1), hextobin(p2)));
	}

	//curve and scalar functions; split out to make their host functions cleaner and more readable
	//inverts X coordinate -- this seems correct ^_^ -luigi1111
	export function ge_neg(point : string) {
		if (point.length !== 64){
			throw "expected 64 char hex string";
		}
		return point.slice(0,62) + ((parseInt(point.slice(62,63), 16) + 8) % 16).toString(16) + point.slice(63,64);
	}

	//order matters
	export function ge_sub(point1 : string, point2 : string) {
		let point2n = CnUtils.ge_neg(point2);
		return CnUtils.ge_add(point1, point2n);
	}

	export function sec_key_to_pub(sec : string) : string {
		if (sec.length !== 64) {
			throw "Invalid sec length";
		}
		return CnUtils.bintohex(nacl.ll.ge_scalarmult_base(hextobin(sec)));
	}

	export function valid_hex(hex : string) {
		let exp = new RegExp("[0-9a-fA-F]{" + hex.length + "}");
		return exp.test(hex);
	}

	export function ge_scalarmult_base(sec : string) : string{
		return CnUtils.sec_key_to_pub(sec);
	}

	export function derivation_to_scalar(derivation : string, output_index : number) {
		let buf = "";
		if (derivation.length !== (STRUCT_SIZES.EC_POINT * 2)) {
			throw "Invalid derivation length!";
		}
		buf += derivation;
		let enc = CnUtils.encode_varint(output_index);
		if (enc.length > 10 * 2) {
			throw "output_index didn't fit in 64-bit varint";
		}
		buf += enc;
		return Cn.hash_to_scalar(buf);
	}

	export function encode_varint(i : number|string) {
		let j = new JSBigInt(i);
		let out = '';
		// While i >= b10000000
		while (j.compare(0x80) >= 0) {
			// out.append i & b01111111 | b10000000
			out += ("0" + ((j.lowVal() & 0x7f) | 0x80).toString(16)).slice(-2);
			j = j.divide(new JSBigInt(2).pow(7));
		}
		out += ("0" + j.toJSValue().toString(16)).slice(-2);
		return out;
	}

	export function cn_fast_hash(input : string) {
		if (input.length % 2 !== 0 || !CnUtils.valid_hex(input)) {
			throw "Input invalid";
		}
		return keccak_256(CnUtils.hextobin(input));
	}

	export function hex_xor(hex1 : string, hex2 : string) {
		if (!hex1 || !hex2 || hex1.length !== hex2.length || hex1.length % 2 !== 0 || hex2.length % 2 !== 0){throw "Hex string(s) is/are invalid!";}
		let bin1 = hextobin(hex1);
		let bin2 = hextobin(hex2);
		let xor = new Uint8Array(bin1.length);
		for (let i = 0; i < xor.length; i++){
			xor[i] = bin1[i] ^ bin2[i];
		}
		return bintohex(xor);
	}

	export function trimRight(str : string, char : string) {
		while (str[str.length - 1] == char) str = str.slice(0, -1);
		return str;
	}

	export function padLeft(str : string, len : number, char : string) {
		while (str.length < len) {
			str = char + str;
		}
		return str;
	}

	export function ge_double_scalarmult_base_vartime(c : string, P : string, r : string) : string{
		if (c.length !== 64 || P.length !== 64 || r.length !== 64) {
			throw "Invalid input length!";
		}
		return bintohex(nacl.ll.ge_double_scalarmult_base_vartime(hextobin(c), hextobin(P), hextobin(r)));
	}

	export function ge_double_scalarmult_postcomp_vartime(r : string, P : string, c : string, I : string) {
		if (c.length !== 64 || P.length !== 64 || r.length !== 64 || I.length !== 64) {
			throw "Invalid input length!";
		}
		let Pb = CnNativeBride.hash_to_ec_2(P);
		return bintohex(nacl.ll.ge_double_scalarmult_postcomp_vartime(hextobin(r), hextobin(Pb), hextobin(c), hextobin(I)));
	}

	export function decompose_amount_into_digits(amount : number|string) {
		let amountStr = amount.toString();
		let ret = [];
		while (amountStr.length > 0) {
			if (amountStr[0] !== "0"){
				let digit = amountStr[0];
				while (digit.length < amountStr.length) {
					digit += "0";
				}
				ret.push(new JSBigInt(digit));
			}
			amount = amountStr.slice(1);
		}
		return ret;
	}

	export function decode_rct_ecdh(ecdh : {mask:string, amount:string}, key : string) {
		if (ecdh.amount.length !== 16) {
			let first = Cn.hash_to_scalar(key);
			let second = Cn.hash_to_scalar(first);
			return {
				mask: CnNativeBride.sc_sub(ecdh.mask, first),
				amount: CnNativeBride.sc_sub(ecdh.amount, second),
			};
		}
		else{
			//v2, with deterministic mask
			let mask = Cn.hash_to_scalar("636f6d6d69746d656e745f6d61736b" + key); //"commitment_mask"
			let amtkey = CnUtils.cn_fast_hash("616d6f756e74" + key); //"amount"
			let amount = CnUtils.hex_xor(ecdh.amount, amtkey.slice(0,16));
			amount += "000000000000000000000000000000000000000000000000"; //pad to 64 chars
			return {
				mask: mask,
				amount: amount
			};
		}
	}

	export function encode_rct_ecdh(ecdh : {mask:string, amount:string}, key : string, v2 : boolean) {
		if(v2){
			let mask = CnVars.Z;
			let amtkey = CnUtils.cn_fast_hash("616d6f756e74" + key); //"amount"
			let amount = CnUtils.hex_xor(ecdh.amount.slice(0, 16), amtkey.slice(0, 16));
			amount += "000000000000000000000000000000000000000000000000"; //pad to 64 chars
			return {
				mask: mask,
				amount: amount
			};
		}
		else{
			let first = Cn.hash_to_scalar(key);
			let second = Cn.hash_to_scalar(first);
			return {
				mask: CnNativeBride.sc_add(ecdh.mask, first),
				amount: CnNativeBride.sc_add(ecdh.amount, second),
			};
		}
	}

	//fun mul function
	export function sc_mul (scalar1 : any, scalar2 : any) {
		if (scalar1.length !== 64 || scalar2.length !== 64) {
			throw "sc_mul: Invalid scalar1 or scalar2 input lengths!";
		}
		return CnUtils.d2s(JSBigInt(CnUtils.s2d(scalar1)).multiply(JSBigInt(CnUtils.s2d(scalar2))).remainder(CnVars.l).toString());
	}

	export function sc_muladd(a : any, b : any, c : any) {
		if (a.length !== KEY_SIZE * 2 || b.length !== KEY_SIZE * 2 || c.length !== KEY_SIZE * 2 || !CnUtils.valid_hex(a) || !CnUtils.valid_hex(b) || !CnUtils.valid_hex(c)) {
			throw "bad scalar";
		}
		return CnUtils.swapEndian(("0000000000000000000000000000000000000000000000000000000000000000" + (JSBigInt.parse(CnUtils.swapEndian(a), 16).multiply(JSBigInt.parse(CnUtils.swapEndian(b), 16)).add(JSBigInt.parse(CnUtils.swapEndian(c), 16)).remainder(	CnVars.l).toString(16))).toLowerCase().slice(-64));
		//return d2s(JSBigInt(s2d(a)).multiply(JSBigInt(s2d(b))).add(JSBigInt(s2d(c))).remainder(l).toString());
	}
}

export namespace CnNativeBride{
	export function sc_reduce32(hex : string) {
		let input = CnUtils.hextobin(hex);
		if (input.length !== 32) {
			throw "Invalid input length";
		}
		let mem = Module._malloc(32);
		Module.HEAPU8.set(input, mem);
		Module.ccall('sc_reduce32', 'void', ['number'], [mem]);
		let output = Module.HEAPU8.subarray(mem, mem + 32);
		Module._free(mem);
		return CnUtils.bintohex(output);
	}

	export function derive_secret_key(derivation : string, out_index : number, sec : string) {
		if (derivation.length !== 64 || sec.length !== 64) {
			throw "Invalid input length!";
		}
		let scalar_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		let scalar_b = CnUtils.hextobin(CnUtils.derivation_to_scalar(derivation, out_index));
		Module.HEAPU8.set(scalar_b, scalar_m);
		let base_m = Module._malloc(KEY_SIZE);
		Module.HEAPU8.set(CnUtils.hextobin(sec), base_m);
		let derived_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		Module.ccall("sc_add", "void", ["number", "number", "number"], [derived_m, base_m, scalar_m]);
		let res = Module.HEAPU8.subarray(derived_m, derived_m + STRUCT_SIZES.EC_SCALAR);
		Module._free(scalar_m);
		Module._free(base_m);
		Module._free(derived_m);
		return CnUtils.bintohex(res);
	}

	export function hash_to_ec(key : string) {
		if (key.length !== (KEY_SIZE * 2)) {
			throw "Invalid input length";
		}
		let h_m = Module._malloc(HASH_SIZE);
		let point_m = Module._malloc(STRUCT_SIZES.GE_P2);
		let point2_m = Module._malloc(STRUCT_SIZES.GE_P1P1);
		let res_m = Module._malloc(STRUCT_SIZES.GE_P3);
		let hash = CnUtils.hextobin(CnUtils.cn_fast_hash(key));
		Module.HEAPU8.set(hash, h_m);
		Module.ccall("ge_fromfe_frombytes_vartime", "void", ["number", "number"], [point_m, h_m]);
		Module.ccall("ge_mul8", "void", ["number", "number"], [point2_m, point_m]);
		Module.ccall("ge_p1p1_to_p3", "void", ["number", "number"], [res_m, point2_m]);
		let res = Module.HEAPU8.subarray(res_m, res_m + STRUCT_SIZES.GE_P3);
		Module._free(h_m);
		Module._free(point_m);
		Module._free(point2_m);
		Module._free(res_m);
		return CnUtils.bintohex(res);
	}

	//returns a 32 byte point via "ge_p3_tobytes" rather than a 160 byte "p3", otherwise same as above;
	export function hash_to_ec_2(key : string) {
		if (key.length !== (KEY_SIZE * 2)) {
			throw "Invalid input length";
		}
		let h_m = Module._malloc(HASH_SIZE);
		let point_m = Module._malloc(STRUCT_SIZES.GE_P2);
		let point2_m = Module._malloc(STRUCT_SIZES.GE_P1P1);
		let res_m = Module._malloc(STRUCT_SIZES.GE_P3);
		let hash = CnUtils.hextobin(CnUtils.cn_fast_hash(key));
		let res2_m = Module._malloc(KEY_SIZE);
		Module.HEAPU8.set(hash, h_m);
		Module.ccall("ge_fromfe_frombytes_vartime", "void", ["number", "number"], [point_m, h_m]);
		Module.ccall("ge_mul8", "void", ["number", "number"], [point2_m, point_m]);
		Module.ccall("ge_p1p1_to_p3", "void", ["number", "number"], [res_m, point2_m]);
		Module.ccall("ge_p3_tobytes", "void", ["number", "number"], [res2_m, res_m]);
		let res = Module.HEAPU8.subarray(res2_m, res2_m + KEY_SIZE);
		Module._free(h_m);
		Module._free(point_m);
		Module._free(point2_m);
		Module._free(res_m);
		Module._free(res2_m);
		return CnUtils.bintohex(res);
	}

	export function generate_key_image_2(pub : string, sec : string) {
		if (!pub || !sec || pub.length !== 64 || sec.length !== 64) {
			throw "Invalid input length";
		}
		let pub_m = Module._malloc(KEY_SIZE);
		let sec_m = Module._malloc(KEY_SIZE);
		Module.HEAPU8.set(CnUtils.hextobin(pub), pub_m);
		Module.HEAPU8.set(CnUtils.hextobin(sec), sec_m);
		if (Module.ccall("sc_check", "number", ["number"], [sec_m]) !== 0) {
			throw "sc_check(sec) != 0";
		}
		let point_m = Module._malloc(STRUCT_SIZES.GE_P3);
		let point2_m = Module._malloc(STRUCT_SIZES.GE_P2);
		let point_b = CnUtils.hextobin(CnNativeBride.hash_to_ec(pub));
		Module.HEAPU8.set(point_b, point_m);
		let image_m = Module._malloc(STRUCT_SIZES.KEY_IMAGE);
		Module.ccall("ge_scalarmult", "void", ["number", "number", "number"], [point2_m, sec_m, point_m]);
		Module.ccall("ge_tobytes", "void", ["number", "number"], [image_m, point2_m]);
		let res = Module.HEAPU8.subarray(image_m, image_m + STRUCT_SIZES.KEY_IMAGE);
		Module._free(pub_m);
		Module._free(sec_m);
		Module._free(point_m);
		Module._free(point2_m);
		Module._free(image_m);
		return CnUtils.bintohex(res);
	}

	//adds two scalars together
	export function sc_add(scalar1 : string, scalar2 : string) {
		if (scalar1.length !== 64 || scalar2.length !== 64) {
			throw "Invalid input length!";
		}
		let scalar1_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		let scalar2_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		Module.HEAPU8.set(CnUtils.hextobin(scalar1), scalar1_m);
		Module.HEAPU8.set(CnUtils.hextobin(scalar2), scalar2_m);
		let derived_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		Module.ccall("sc_add", "void", ["number", "number", "number"], [derived_m, scalar1_m, scalar2_m]);
		let res = Module.HEAPU8.subarray(derived_m, derived_m + STRUCT_SIZES.EC_SCALAR);
		Module._free(scalar1_m);
		Module._free(scalar2_m);
		Module._free(derived_m);
		return CnUtils.bintohex(res);
	}

	//subtracts one scalar from another
	export function sc_sub(scalar1 : string, scalar2 : string) {
		if (scalar1.length !== 64 || scalar2.length !== 64) {
			throw "Invalid input length!";
		}
		let scalar1_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		let scalar2_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		Module.HEAPU8.set(CnUtils.hextobin(scalar1), scalar1_m);
		Module.HEAPU8.set(CnUtils.hextobin(scalar2), scalar2_m);
		let derived_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
		Module.ccall("sc_sub", "void", ["number", "number", "number"], [derived_m, scalar1_m, scalar2_m]);
		let res = Module.HEAPU8.subarray(derived_m, derived_m + STRUCT_SIZES.EC_SCALAR);
		Module._free(scalar1_m);
		Module._free(scalar2_m);
		Module._free(derived_m);
		return CnUtils.bintohex(res);
	}

	//res = c - (ab) mod l; argument names copied from the signature implementation
	export function sc_mulsub(sigc : string, sec : string, k : string) {
		if (k.length !== KEY_SIZE * 2 || sigc.length !== KEY_SIZE * 2 || sec.length !== KEY_SIZE * 2 || !CnUtils.valid_hex(k) || !CnUtils.valid_hex(sigc) || !CnUtils.valid_hex(sec)) {
			throw "bad scalar";
		}
		let sec_m = Module._malloc(KEY_SIZE);
		Module.HEAPU8.set(CnUtils.hextobin(sec), sec_m);
		let sigc_m = Module._malloc(KEY_SIZE);
		Module.HEAPU8.set(CnUtils.hextobin(sigc), sigc_m);
		let k_m = Module._malloc(KEY_SIZE);
		Module.HEAPU8.set(CnUtils.hextobin(k), k_m);
		let res_m = Module._malloc(KEY_SIZE);

		Module.ccall("sc_mulsub", "void", ["number", "number", "number", "number"], [res_m, sigc_m, sec_m, k_m]);
		let res = Module.HEAPU8.subarray(res_m, res_m + KEY_SIZE);
		Module._free(k_m);
		Module._free(sec_m);
		Module._free(sigc_m);
		Module._free(res_m);
		return CnUtils.bintohex(res);
	}

	export function generate_key_derivation(pub : any, sec : any){
		let generate_key_derivation_bind = (<any>self).Module_native.cwrap('generate_key_derivation', null, ['number', 'number', 'number']);

		let pub_b = CnUtils.hextobin(pub);
		let sec_b = CnUtils.hextobin(sec);
		let Module_native = (<any>self).Module_native;

		let pub_m = Module_native._malloc(KEY_SIZE);
		Module_native.HEAPU8.set(pub_b, pub_m);

		let sec_m = Module_native._malloc(KEY_SIZE);
		Module_native.HEAPU8.set(sec_b, sec_m);

		let derivation_m = Module_native._malloc(KEY_SIZE);
		let r = generate_key_derivation_bind(pub_m,sec_m,derivation_m);

		Module_native._free(pub_m);
		Module_native._free(sec_m);

		let res = Module_native.HEAPU8.subarray(derivation_m, derivation_m + KEY_SIZE);
		Module_native._free(derivation_m);

		return CnUtils.bintohex(res);
	}

	export function derive_public_key(derivation : string,
		output_idx_in_tx : number,
		pubSpend : string){
		let derive_public_key_bind = (<any>self).Module_native.cwrap('derive_public_key', null, ['number', 'number', 'number', 'number']);

		let derivation_b = CnUtils.hextobin(derivation);
		let pub_spend_b = CnUtils.hextobin(pubSpend);


		let Module_native = (<any>self).Module_native;

		let derivation_m = Module_native._malloc(KEY_SIZE);
		Module_native.HEAPU8.set(derivation_b, derivation_m);

		let pub_spend_m = Module_native._malloc(KEY_SIZE);
		Module_native.HEAPU8.set(pub_spend_b, pub_spend_m);

		let derived_key_m = Module_native._malloc(KEY_SIZE);
		let r = derive_public_key_bind(derivation_m, output_idx_in_tx, pub_spend_m, derived_key_m);

		Module_native._free(derivation_m);
		Module_native._free(pub_spend_m);

		let res = Module_native.HEAPU8.subarray(derived_key_m, derived_key_m + KEY_SIZE);
		Module_native._free(derived_key_m);

		return CnUtils.bintohex(res);
	}
}

export namespace Cn{

	export function hash_to_scalar(buf : string) : string{
		let hash = CnUtils.cn_fast_hash(buf);
		let scalar = CnNativeBride.sc_reduce32(hash);
		return scalar;
	}

	export function array_hash_to_scalar(array : string[]) : string{
		let buf = "";
		for (let i = 0; i < array.length; i++){
			if (typeof array[i] !== "string"){throw "unexpected array element";}
			buf += array[i];
		}
		return hash_to_scalar(buf);
	}

	/**
	 * @deprecated CnNativeBride has a much faster version
	 * @param derivation
	 * @param out_index
	 * @param pub
	 */
	export function derive_public_key(derivation : string, out_index : number, pub : string) {
		if (derivation.length !== 64 || pub.length !== 64) {
			throw "Invalid input length!";
		}
		let s = CnUtils.derivation_to_scalar(derivation, out_index);
		return CnUtils.bintohex(nacl.ll.ge_add(CnUtils.hextobin(pub), CnUtils.hextobin(CnUtils.ge_scalarmult_base(s))));
	}

	export function generate_keys(seed : string) : {sec:string, pub:string}{
		if (seed.length !== 64) throw "Invalid input length!";
		let sec = CnNativeBride.sc_reduce32(seed);
		let pub = CnUtils.sec_key_to_pub(sec);
		return {
			sec: sec,
			pub: pub
		};
	}

	export function random_keypair() {
		return Cn.generate_keys(CnRandom.rand_32());
	}

	export function pubkeys_to_string(spend : string, view : string) {
		let prefix = CnUtils.encode_varint(CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX);
		let data = prefix + spend + view;
		let checksum = CnUtils.cn_fast_hash(data);
		return cnBase58.encode(data + checksum.slice(0, ADDRESS_CHECKSUM_SIZE * 2));
	}

	export function create_address(seed : string) : {
		spend:{
			sec:string,
			pub:string
		},
		view:{
			sec:string,
			pub:string
		},
		public_addr:string
	}{
		let keys = {
			spend:{
				sec:'',
				pub:''
			},
			view:{
				sec:'',
				pub:''
			},
			public_addr:''
		};
		let first;
		if (seed.length !== 64) {
			first = CnUtils.cn_fast_hash(seed);
		} else {
			first = seed; //only input reduced seeds or this will not give you the result you want
		}

		keys.spend = Cn.generate_keys(first);
		let second = seed.length !== 64 ? CnUtils.cn_fast_hash(first) : CnUtils.cn_fast_hash(keys.spend.sec);
		keys.view = Cn.generate_keys(second);
		keys.public_addr = Cn.pubkeys_to_string(keys.spend.pub, keys.view.pub);
		return keys;
	}

	export function decode_address(address : string) : {
		spend: string,
		view: string,
		intPaymentId: string|null
	}{
		let dec = cnBase58.decode(address);
		console.log(dec,CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX,CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX);
		let expectedPrefix = CnUtils.encode_varint(CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX);
		let expectedPrefixInt = CnUtils.encode_varint(CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX);
		let expectedPrefixSub = CnUtils.encode_varint(CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX);
		let prefix = dec.slice(0, expectedPrefix.length);
		var prefix_subaddr = dec.slice(0, expectedPrefixSub.length);
		var is_subaddr = prefix_subaddr === expectedPrefixSub; // is a sub-address?
		console.log("addr/iaddr:", prefix, expectedPrefixInt, expectedPrefix, "subaddrr:", prefix_subaddr, expectedPrefixSub);
		if (prefix !== expectedPrefix && prefix !== expectedPrefixInt && !is_subaddr) {
			throw "Invalid address prefix";
		}
		dec = is_subaddr ? dec.slice(expectedPrefixSub.length) : dec.slice(expectedPrefix.length);
		let spend = dec.slice(0, 64);
		let view = dec.slice(64, 128);
		let checksum : string|null = null;
		let expectedChecksum : string|null = null;
		let intPaymentId : string|null = null;
		if (prefix === expectedPrefixInt){
			intPaymentId = dec.slice(128, 128 + (INTEGRATED_ID_SIZE * 2));
			checksum = dec.slice(128 + (INTEGRATED_ID_SIZE * 2), 128 + (INTEGRATED_ID_SIZE * 2) + (ADDRESS_CHECKSUM_SIZE * 2));
			expectedChecksum = CnUtils.cn_fast_hash(prefix + spend + view + intPaymentId).slice(0, ADDRESS_CHECKSUM_SIZE * 2);
		} else {
			checksum = dec.slice(128, 128 + (ADDRESS_CHECKSUM_SIZE * 2));
			expectedChecksum = CnUtils.cn_fast_hash((is_subaddr ? prefix_subaddr : prefix) + spend + view).slice(0, ADDRESS_CHECKSUM_SIZE * 2);
		}
		if (checksum !== expectedChecksum) {
			throw "Invalid checksum";
		}

		return {
			spend: spend,
			view: view,
			intPaymentId: intPaymentId
		};
	}

	export function is_subaddress(addr : string) {
		let decoded = cnBase58.decode(addr);
		let subaddressPrefix = CnUtils.encode_varint(CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX);
		let prefix = decoded.slice(0, subaddressPrefix.length);

		return (prefix === subaddressPrefix);
	}

	export function valid_keys(view_pub : string, view_sec : string, spend_pub : string, spend_sec : string) {
		let expected_view_pub = CnUtils.sec_key_to_pub(view_sec);
		let expected_spend_pub = CnUtils.sec_key_to_pub(spend_sec);
		return (expected_spend_pub === spend_pub) && (expected_view_pub === view_pub);
	}

	export function decrypt_payment_id(payment_id8 : string, tx_public_key : string, acc_prv_view_key : string) {
		if (payment_id8.length !== 16) throw "Invalid input length2!";

		let key_derivation = CnNativeBride.generate_key_derivation(tx_public_key, acc_prv_view_key);

		let pid_key = CnUtils.cn_fast_hash(key_derivation + ENCRYPTED_PAYMENT_ID_TAIL.toString(16)).slice(0, INTEGRATED_ID_SIZE * 2);

		let decrypted_payment_id = CnUtils.hex_xor(payment_id8, pid_key);

		return decrypted_payment_id;
	}

	export function get_account_integrated_address(address : string, payment_id8 : string) {
		let decoded_address = decode_address(address);

		let prefix = CnUtils.encode_varint(CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX);
		let data = prefix + decoded_address.spend  + decoded_address.view + payment_id8;

		let checksum = CnUtils.cn_fast_hash(data);

		return cnBase58.encode(data + checksum.slice(0, ADDRESS_CHECKSUM_SIZE * 2));
	}

	export function formatMoneyFull(units : number|string) {
		let unitsStr = (units).toString();
		let symbol = unitsStr[0] === '-' ? '-' : '';
		if (symbol === '-') {
			unitsStr = unitsStr.slice(1);
		}
		let decimal;
		if (unitsStr.length >= config.coinUnitPlaces) {
			decimal = unitsStr.substr(unitsStr.length - config.coinUnitPlaces, config.coinUnitPlaces);
		} else {
			decimal = CnUtils.padLeft(unitsStr, config.coinUnitPlaces, '0');
		}
		return symbol + (unitsStr.substr(0, unitsStr.length - config.coinUnitPlaces) || '0') + '.' + decimal;
	}

	export function formatMoneyFullSymbol(units : number|string) {
		return Cn.formatMoneyFull(units) + ' ' + config.coinSymbol;
	}

	export function formatMoney(units : number|string) {
		let f = CnUtils.trimRight(Cn.formatMoneyFull(units), '0');
		if (f[f.length - 1] === '.') {
			return f.slice(0, f.length - 1);
		}
		return f;
	}

	export function formatMoneySymbol(units : number|string) {
		return Cn.formatMoney(units) + ' ' + config.coinSymbol;
	}

}

export namespace CnTransactions{

	export function commit(amount : string, mask : string){
		if (!CnUtils.valid_hex(mask) || mask.length !== 64 || !CnUtils.valid_hex(amount) || amount.length !== 64){
			throw "invalid amount or mask!";
		}
		let C = CnUtils.ge_double_scalarmult_base_vartime(amount, CnVars.H, mask);
		return C;
	}

	export function zeroCommit(amount : string){
		if (!CnUtils.valid_hex(amount) || amount.length !== 64){
			throw "invalid amount!";
		}
		let C = CnUtils.ge_double_scalarmult_base_vartime(amount, CnVars.H, CnVars.I);
		return C;
	}

	export function decodeRctSimple(rv : any, sk  :any, i : number, mask : any, hwdev : any=null) {
		//mask amount and mask
		let ecdh_info = CnUtils.decode_rct_ecdh(rv.ecdhInfo[i], sk);
		let amount = ecdh_info.amount;
		let C = rv.outPk[i].mask;

		return CnUtils.h2d(amount);
	}

	export function decode_ringct(rv:any,
		pub : any,
		sec : any,
		i : number,
		mask : any,
		amount : any,
		derivation : string|null) : number|false
	{
		if(derivation===null)
			derivation = CnNativeBride.generate_key_derivation(pub, sec);//[10;11]ms

		let scalar1 = CnUtils.derivation_to_scalar(derivation, i);//[0.2ms;1ms]

		try
		{
			amount = CnTransactions.decodeRctSimple(rv,
        scalar1,
        i,
        mask);
		}
		catch (e)
		{
			console.error(e);
			console.log("Failed to decode input " +i);
			return false;
		}

		return amount;
	}

	export function generate_key_image_helper(ack:{view_secret_key:any,spend_secret_key:string, public_spend_key:string}, tx_public_key:any, real_output_index:any,recv_derivation:string|null)
	{
		if(recv_derivation === null)
		recv_derivation = CnNativeBride.generate_key_derivation(tx_public_key, ack.view_secret_key);

    let in_ephemeral_pub = CnNativeBride.derive_public_key(recv_derivation, real_output_index, ack.public_spend_key);
		let in_ephemeral_sec = CnNativeBride.derive_secret_key(recv_derivation, real_output_index, ack.spend_secret_key);
		let ki = CnNativeBride.generate_key_image_2(in_ephemeral_pub, in_ephemeral_sec);

    return {
			ephemeral_pub:in_ephemeral_pub,
			ephemeral_sec:in_ephemeral_sec,
			key_image:ki
		};
	}

	export function estimateRctSize(inputs : number, mixin : number, outputs : number) {
		let size = 0;
		size += outputs * 6306;
		size += ((mixin + 1) * 4 + 32 + 8) * inputs; //key offsets + key image + amount
		size += 64 * (mixin + 1) * inputs + 64 * inputs; //signature + pseudoOuts/cc
		size += 74; //extra + whatever, assume long payment ID
		return size;
	}

	export function estimateRctSizeNew(inputs : number, mixin : number, outputs : number, extra_size : number, bulletproof : boolean) {
		let size = 0;
		size += 1 + 6;
		size += inputs * (1+6+(mixin+1)*2+32);
		size += outputs * (6+32);
		size += extra_size;
		size += 1;

		if (bulletproof)
		{
			let log_padded_outputs = 0;
			while ((1<<log_padded_outputs) < outputs)
			  ++log_padded_outputs;
			size += (2 * (6 + log_padded_outputs) + 4 + 5) * 32 + 3;
		}
		else
			size += (2*64*32+32+64*32) * outputs;


		size += inputs * (64 * (mixin+1) + 32);

		size += 32 * inputs;

		size += 2 * 32 * outputs;
		size += 32 * outputs;
		size += 4;

		return size;
	}

	export function decompose_tx_destinations(dsts : {address:string, amount:number}[], rct : boolean) : {address:string, amount:number}[] {
		let out = [];
		if (rct) {
			for (let i = 0; i < dsts.length; i++) {
				out.push({
					address: dsts[i].address,
					amount: dsts[i].amount
				});
			}
		} else {
			for (let i = 0; i < dsts.length; i++) {
				let digits = CnUtils.decompose_amount_into_digits(dsts[i].amount);
				for (let j = 0; j < digits.length; j++) {
					if (digits[j].compare(0) > 0) {
						out.push({
							address: dsts[i].address,
							amount: digits[j]
						});
					}
				}
			}
		}
		return out.sort(function(a,b){
			return a["amount"] - b["amount"];
		});
	}

	export type Ephemeral = {
		pub: string,
		sec: string,
		mask: string
	};

	export type Output = {
		index:string,
		key:string,
		commit:string,
	};

	export type Source = {
		outputs:CnTransactions.Output[],
		amount:'',
		real_out_tx_key:string,
		real_out:number,
		real_out_in_tx:number,
		mask:string|null,
		key_image:string,
		in_ephemeral:CnTransactions.Ephemeral,
	};

	export type Destination = {
		address:string,
		amount:number,
		keys? : {
			view: string,
			spend: string
		}
	};

	export type Vin = {
		type:string,
		amount:string,
		k_image:string,
		key_offsets:any[]
	};

	export type Vout = {
		amount: string,
		target:{
			type: string,
			key: string
		}
	};

	export type EcdhInfo = {
		mask: string,
		amount: string
	}

	export type RangeProveSignature = {
		Ci:string[],
		bsig:{
			s: string[][],
			ee:string
		}
	};

	export type key = string;//32characters
	export type keyV = key[]; //vector of keys
	export type keyM = keyV[]; //matrix of keys (indexed by column first)

	export type RangeProveBulletproofSignature = {
		V : CnTransactions.keyV,

		A : CnTransactions.key,
		S : CnTransactions.key,
		T1 : CnTransactions.key,
		T2 : CnTransactions.key,

		taux : CnTransactions.key,
		mu : CnTransactions.key,

		L : CnTransactions.keyV,
		R : CnTransactions.keyV,

		a : CnTransactions.key,
		b : CnTransactions.key,
		t : CnTransactions.key;
	};

	export type MG_Signature = {
		ss: string[][],
		cc: string
	};

	export type RctSignature = {
		ecdhInfo:EcdhInfo[]
		outPk:string[],
		pseudoOuts:string[],
		txnFee:string,
		type:number,
		message?: string,
		p?: {
			rangeSigs: RangeProveSignature[],
			bp: RangeProveBulletproofSignature[],
			MGs: MG_Signature[],
			pseudoOuts:string[]
		},
	}

	export type Transaction = {
		unlock_time: number,
		version: number,
		extra: string,
		prvkey: string,
		vin: Vin[],
		vout: Vout[],
		rct_signatures:RctSignature,
		signatures?:any[],
	};

	export function create_transaction(pub_keys:{spend:string,view:string},
										sec_keys:{spend:string,view:string},
										from_dsts:CnTransactions.Destination[],
										to_dsts:CnTransactions.Destination[],
										outputs:{
											amount:number,
											public_key:string,
											index:number,
											global_index:number,
											rct:string,
											tx_pub_key:string,
										}[],
										mix_outs:{
											outputs:{
												rct: string,
												public_key:string,
												global_index:number
											}[],
											amount:0
										}[] = [],
										fake_outputs_count:number,
										fee_amount: any/*JSBigInt*/,
										unlock_time:number=0,
										priority:number=1) : any {
		let i, j;
		if (from_dsts.length === 0 || to_dsts.length === 0) {
			throw 'Destinations empty';
		}
		if (mix_outs.length !== outputs.length && fake_outputs_count !== 0) {
			throw 'Wrong number of mix outs provided (' + outputs.length + ' outputs, ' + mix_outs.length + ' mix outs)';
		}
		for (i = 0; i < mix_outs.length; i++) {
			if ((mix_outs[i].outputs || []).length < fake_outputs_count) {
				throw 'Not enough outputs to mix with';
			}
		}
		let keys = {
			view: {
				pub: pub_keys.view,
				sec: sec_keys.view
			},
			spend: {
				pub: pub_keys.spend,
				sec: sec_keys.spend
			}
		};
		if (!Cn.valid_keys(keys.view.pub, keys.view.sec, keys.spend.pub, keys.spend.sec)) {
			throw "Invalid secret keys!";
		}
		let needed_money = JSBigInt.ZERO;
		for (i = 0; i < from_dsts.length; ++i) {
			needed_money = needed_money.add(from_dsts[i].amount);
			if (needed_money.compare(UINT64_MAX) !== -1) {
				throw "Output overflow!";
			}
		}
		for (i = 0; i < to_dsts.length; ++i) {
			needed_money = needed_money.add(to_dsts[i].amount);
			if (needed_money.compare(UINT64_MAX) !== -1) {
				throw "Output overflow!";
			}
		}

		let found_money = JSBigInt.ZERO;
		let my_mix_outs:{
			"amount": string,
			"outputs":{
				"global_index": string,
				"public_key": string,
				"rct": string
			}[],
		}[] = [];
		let using_outs:{
			"amount": string,
			"public_key": string,
			"rct": string,
			"global_index": string,
			"index": string,
			"tx_pub_key": string
		}[] = [];
		for (i = 0; i < outputs.length; ++i) {
			found_money = found_money.add(outputs[i].amount);
			if (found_money.compare(UINT64_MAX) !== -1) {
				throw "Input overflow!";
			}

			if (mix_outs.length !== 0) {
				// Sort fake outputs by global index
				// console.log('mix outs before sort', mix_outs[i].outputs);
				mix_outs[i].outputs.sort(function (a, b) {
					return new JSBigInt(a.global_index).compare(b.global_index);
				});
				j = 0;

				my_mix_outs.push({
					"amount":"0",
					"outputs":[]
				});
				while ((my_mix_outs[i].outputs.length < fake_outputs_count) && (j < mix_outs[i].outputs.length)) {
					let out = mix_outs[i].outputs[j];
					if (out.global_index === outputs[i].global_index) {
						j++;
						continue;
					}
					my_mix_outs[i].outputs.push({"global_index": out.global_index.toString(), "public_key": out.public_key, "rct": out.rct });
					j++;
				}

				using_outs.push({
					"amount": "" + outputs[i].amount,
					"public_key": outputs[i].public_key,
					"rct": outputs[i].rct,
					"global_index": "" + outputs[i].global_index,
					"index": "" + outputs[i].index,
					"tx_pub_key": outputs[i].tx_pub_key
				});
			}
		}

		let fee:{"amount":any} = {
			"amount": JSBigInt.ZERO
		};
		let cmp = needed_money.compare(found_money);
		if (cmp < 0) {
			fee.amount = found_money.subtract(needed_money);
			if (fee.amount.compare(fee_amount) !== 0) {
				throw "early fee calculation != later";
			}
		}
		else if (cmp > 0) {
			throw "Need more money than found! (have: " + Cn.formatMoney(found_money) + " need: " + Cn.formatMoney(needed_money) + ")";
		}

		let change_amount:number = Number(from_dsts[0].amount);
		let final_total_wo_fee:string = "" + (Number(needed_money) - change_amount);

		return	mymonero_core_js.monero_utils_promise.catch(function(e:any)
		{
			console.log("mymonero_core_js error:", e)
		}).then(function(monero_utils:any)
		{
			const ret = monero_utils.send_step2__try_create_transaction(
				from_dsts[0].address, // from_address_string,
				sec_keys, // sec keys
				to_dsts[0].address, // to_address_string,
				using_outs, // using_outs,
				my_mix_outs, // mix_outs,
				fake_outputs_count, // fake_outputs_count,
				final_total_wo_fee, // final sending_amount
				change_amount.toString(), // change_amount,
				Number(fee_amount).toString(), // fee_amount,
				null, // payment_id,
				priority, // priority,
				"1200", // fee_per_b,
				"1", // fee_mask,
				unlock_time, // unlock_time,
				mymonero_core_js.nettype_utils.network_type.MAINNET, // nettype
				10 // fork version
			)
			// console.log("ret", JSON.stringify(ret, null, '  '))

			return ( {"raw": ret.signed_serialized_tx, "hash": ret.tx_hash, "prvkey": ret.tx_key} );
		});
	}
}
