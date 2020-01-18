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
define(["require", "exports", "../MathUtil", "../Cn", "../WalletWatchdog"], function (require, exports, MathUtil_1, Cn_1, WalletWatchdog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlockchainExplorerRpc2 = /** @class */ (function () {
        function BlockchainExplorerRpc2() {
            // testnet : boolean = true;
            this.serverAddress = config.apiUrl;
            this.heightCache = 0;
            this.heightLastTimeRetrieve = 0;
            // getDaemonUrl(){
            // 	return this.testnet ? 'http://localhost:48081/' : 'http://localhost:38081/';
            // }
            this.scannedHeight = 0;
            this.nonRandomBlockConsumed = false;
            this.existingOuts = [];
        }
        BlockchainExplorerRpc2.prototype.getHeight = function () {
            if (Date.now() - this.heightLastTimeRetrieve < 20 * 1000 && this.heightCache !== 0) {
                return Promise.resolve(this.heightCache);
            }
            var self = this;
            this.heightLastTimeRetrieve = Date.now();
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: self.serverAddress + 'getheight.php',
                    method: 'POST',
                    data: JSON.stringify({})
                }).done(function (raw) {
                    // self.heightCache = raw.height;
                    // resolve(raw.height);
                    self.heightCache = parseInt(raw);
                    resolve(self.heightCache);
                }).fail(function (data) {
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.getScannedHeight = function () {
            return this.scannedHeight;
        };
        BlockchainExplorerRpc2.prototype.watchdog = function (wallet) {
            var watchdog = new WalletWatchdog_1.WalletWatchdog(wallet, this);
            watchdog.loadHistory();
            return watchdog;
        };
        BlockchainExplorerRpc2.prototype.getTransactionsForBlocks = function (startBlock) {
            var self = this;
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: self.serverAddress + 'blockchain.php?height=' + startBlock,
                    method: 'GET',
                    data: JSON.stringify({})
                }).done(function (transactions) {
                    resolve(transactions);
                }).fail(function (data) {
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.getTransactionPool = function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: self.serverAddress + 'getTransactionPool.php',
                    method: 'GET',
                }).done(function (transactions) {
                    if (transactions !== null)
                        resolve(transactions);
                }).fail(function (data) {
                    console.log('REJECT');
                    try {
                        console.log(JSON.parse(data.responseText));
                    }
                    catch (e) {
                        console.log(e);
                    }
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.getRandomOuts = function (nbOutsNeeded, initialCall) {
            if (initialCall === void 0) { initialCall = true; }
            var self = this;
            if (initialCall) {
                self.existingOuts = [];
            }
            return this.getHeight().then(function (height) {
                var txs = [];
                var promiseGetCompressedBlocks = Promise.resolve();
                var randomBlocksIndexesToGet = [];
                var numOuts = height;
                var compressedBlocksToGet = {};
                console.log('Requires ' + nbOutsNeeded + ' outs');
                //select blocks for the final mixin. selection is made with a triangular selection
                for (var i = 0; i < nbOutsNeeded; ++i) {
                    var selectedIndex = -1;
                    do {
                        selectedIndex = MathUtil_1.MathUtil.randomTriangularSimplified(numOuts);
                        if (selectedIndex >= height - config.txCoinbaseMinConfirms)
                            selectedIndex = -1;
                    } while (selectedIndex === -1 || randomBlocksIndexesToGet.indexOf(selectedIndex) !== -1);
                    randomBlocksIndexesToGet.push(selectedIndex);
                    compressedBlocksToGet[Math.floor(selectedIndex / 100) * 100] = true;
                }
                console.log('Random blocks required: ', randomBlocksIndexesToGet);
                console.log('Blocks to get for outputs selections:', compressedBlocksToGet);
                var _loop_1 = function (compressedBlock) {
                    promiseGetCompressedBlocks = promiseGetCompressedBlocks.then(function () {
                        return self.getTransactionsForBlocks(parseInt(compressedBlock)).then(function (rawTransactions) {
                            txs.push.apply(txs, rawTransactions);
                        });
                    });
                };
                //load compressed blocks (100 blocks) containing the blocks referred by their index
                for (var compressedBlock in compressedBlocksToGet) {
                    _loop_1(compressedBlock);
                }
                return promiseGetCompressedBlocks.then(function () {
                    console.log('txs selected for outputs: ', txs);
                    var txCandidates = {};
                    for (var iOut = 0; iOut < txs.length; ++iOut) {
                        var tx = txs[iOut];
                        if ((typeof tx.height !== 'undefined' && randomBlocksIndexesToGet.indexOf(tx.height) === -1) ||
                            typeof tx.height === 'undefined') {
                            continue;
                        }
                        // let output_idx_in_tx = Math.floor(Math.random()*out.vout.length);
                        /*let extras = TransactionsExplorer.parseExtra(tx.extra);
                        let publicKey = '';
                        for(let extra of extras)
                            if(extra.type === TX_EXTRA_TAG_PUBKEY){
                                for (let i = 0; i < 32; ++i) {
                                    publicKey += String.fromCharCode(extra.data[i]);
                                }
                                publicKey = CryptoUtils.bintohex(publicKey);
                                break;
                            }*/
                        for (var output_idx_in_tx = 0; output_idx_in_tx < tx.vout.length; ++output_idx_in_tx) {
                            var rct = null;
                            var globalIndex = output_idx_in_tx;
                            if (typeof tx.global_index_start !== 'undefined')
                                globalIndex += tx.global_index_start;
                            if (parseInt(tx.vout[output_idx_in_tx].amount) !== 0) { //check if miner tx
                                rct = Cn_1.CnTransactions.zeroCommit(Cn_1.CnUtils.d2s(tx.vout[output_idx_in_tx].amount));
                            }
                            else {
                                var rtcOutPk = tx.rct_signatures.outPk[output_idx_in_tx];
                                var rtcMask = tx.rct_signatures.ecdhInfo[output_idx_in_tx].mask;
                                var rtcAmount = tx.rct_signatures.ecdhInfo[output_idx_in_tx].amount;
                                rct = rtcOutPk + rtcMask + rtcAmount;
                            }
                            /*let checkExit = false;
                            for (let fo of self.existingOuts) {
                                if (
                                    fo.globalIndex === globalIndex
                                ) {
                                    checkExit = true;
                                    break;
                                }
                            }
    
                            if (!checkExit) {*/
                            var newOut = {
                                rct: rct,
                                public_key: tx.vout[output_idx_in_tx].target.key,
                                global_index: globalIndex,
                            };
                            if (typeof txCandidates[tx.height] === 'undefined')
                                txCandidates[tx.height] = [];
                            txCandidates[tx.height].push(newOut);
                            //}
                        }
                    }
                    console.log(txCandidates);
                    var selectedOuts = [];
                    for (var txsOutsHeight in txCandidates) {
                        var outIndexSelect = MathUtil_1.MathUtil.getRandomInt(0, txCandidates[txsOutsHeight].length - 1);
                        console.log('select ' + outIndexSelect + ' for ' + txsOutsHeight + ' with length of ' + txCandidates[txsOutsHeight].length);
                        selectedOuts.push(txCandidates[txsOutsHeight][outIndexSelect]);
                    }
                    console.log(selectedOuts);
                    return selectedOuts;
                });
            });
        };
        BlockchainExplorerRpc2.prototype.sendRawTx = function (rawTx) {
            var self = this;
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: self.serverAddress + 'sendrawtransaction.php',
                    method: 'POST',
                    data: JSON.stringify({
                        tx_as_hex: rawTx,
                        do_not_relay: false
                    })
                }).done(function (transactions) {
                    if (transactions.status && transactions.status == 'OK') {
                        resolve(transactions);
                    }
                    else
                        reject(transactions);
                }).fail(function (data) {
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.resolveOpenAlias = function (domain) {
            var self = this;
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: self.serverAddress + 'openAlias.php?domain=' + domain,
                    method: 'GET',
                }).done(function (response) {
                    resolve(response);
                }).fail(function (data) {
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.getNetworkInfo = function () {
            return Promise.reject('not_implemented');
        };
        return BlockchainExplorerRpc2;
    }());
    exports.BlockchainExplorerRpc2 = BlockchainExplorerRpc2;
});
