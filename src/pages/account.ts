/*
 * Copyright (c) 2018, Gnock
 * Copyright (c) 2018, The Masari Project
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

import {VueClass, VueRequireFilter, VueVar} from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Constants} from "../model/Constants";
import {AppState} from "../model/AppState";
import {Transaction, TransactionIn} from "../model/Transaction";
import {Cn} from "../model/Cn";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);
(<any>window).wallet = wallet;

class AccountView extends DestructableView{
	@VueVar([]) transactions !: Transaction[];
	@VueVar(0) walletAmount !: number;
	@VueVar(0) unlockedWalletAmount !: number;

	@VueVar(0) currentScanBlock !: number;
	@VueVar(0) blockchainHeight !: number;
	@VueVar(Math.pow(10, config.coinUnitPlaces)) currencyDivider !: number;

	intervalRefresh : number = 0;
	sumotimeout : number = 0;

	constructor(container : string){
		super(container);
		let self = this;
		AppState.enableLeftMenu();
		this.intervalRefresh = setInterval(function(){
			self.refresh();
		}, 1*1000);
		this.sumotimeout = setTimeout(function(){
			self.sumobtc();
		}, 500)
		this.refresh();
	}

	destruct(): Promise<void> {
		clearInterval(this.intervalRefresh);
		return super.destruct();
	}

	refresh(){
		let self = this;
		blockchainExplorer.getHeight().then(function(height : number){
			self.blockchainHeight = height;
		});

		this.refreshWallet();
	}

	sumobtc(){
		$.getJSON('https://api.coingecko.com/api/v3/coins/sumokoin', function(data: any) {
		
		//Now I'm gonna print the object got from coingecko
		console.log("Sumo-BTC Object: " + data);

		//position of comma and relative prints more in depth from the object got before
		var amnt: any = (wallet.amount / 10000000000).toFixed(6);
		console.log("Sumo to BTC is: " + data.market_data.current_price.btc);
		console.log("Sumo to USD is: " + data.market_data.current_price.usd);

		//printing wallet amount
		console.log("This account has " + wallet.amount + " SUMO");
		//sumo to btc conversion
		console.log("Conversion SUMO > BTC is: " + data.market_data.current_price.btc * amnt);
		
		//send the values to html div "sumobtc"
		document.getElementById('sumobtc')!.innerHTML = "<small>BTC " + (data.market_data.current_price.btc * amnt).toFixed(7) + " - USD " + (data.market_data.current_price.usd * amnt).toFixed(2) +  "$</small>";
		});
	}

	moreInfoOnTx(transaction : Transaction){
		let explorerUrlHash = config.testnet ? config.testnetExplorerUrlHash : config.mainnetExplorerUrlHash;
		let explorerUrlBlock = config.testnet ? config.testnetExplorerUrlBlock : config.mainnetExplorerUrlBlock;
		let feesHtml = '';
		if(transaction.getAmount() < 0)
			feesHtml = `<div><strong>`+i18n.t('accountPage.txDetails.feesOnTx')+`</strong>: `+Cn.formatMoneySymbol(transaction.fees)+`</a></div>`;

		let paymentId = '';
		if(transaction.paymentId !== ''){
			paymentId = `<div><strong>`+i18n.t('accountPage.txDetails.paymentId')+`</strong>: `+transaction.paymentId+`</a></div>`;
		}

		let txPrivKeyMessage = '';
		let txPrivKey = wallet.findTxPrivateKeyWithHash(transaction.hash);
		if(txPrivKey !== null){
			txPrivKeyMessage = `<div><strong>`+i18n.t('accountPage.txDetails.txPrivKey')+`</strong>: `+txPrivKey+`</a></div>`;
		}

		let blockHeight = '';
		if(transaction.blockHeight > 0){
			blockHeight = `<div><strong>`+i18n.t('accountPage.txDetails.blockHeight')+`</strong>: <a href="`+explorerUrlBlock.replace('{ID}', ''+transaction.blockHeight)+`" target="_blank">`+transaction.blockHeight+`</a></div>`;
		}
		swal({
			title:i18n.t('accountPage.txDetails.title'),
			html:`
<div class="tl" >
	<div><strong>`+i18n.t('accountPage.txDetails.txHash')+`</strong>: <a href="`+explorerUrlHash.replace('{ID}', transaction.hash)+`" target="_blank">`+transaction.hash+`</a></div>
	`+paymentId+`
	`+feesHtml+`
	`+txPrivKeyMessage+`
	`+blockHeight+`	
</div>`
		});
	}

	refreshWallet(){
		this.currentScanBlock = wallet.lastHeight;
		this.walletAmount = wallet.amount;
		this.unlockedWalletAmount = wallet.unlockedAmount(this.currentScanBlock);
		if(wallet.getAll().length+wallet.txsMem.length !== this.transactions.length) {
			this.transactions = wallet.txsMem.concat(wallet.getTransactionsCopy().reverse());
		}
	}
}

if(wallet !== null && blockchainExplorer !== null)
	new AccountView('#app');
else
	window.location.href = '#index';