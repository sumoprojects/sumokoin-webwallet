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
define(["require", "exports", "./Transaction", "./MathUtil", "./Cn"], function (require, exports, Transaction_1, MathUtil_1, Cn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TX_EXTRA_PADDING_MAX_COUNT = 255;
    exports.TX_EXTRA_NONCE_MAX_COUNT = 255;
    exports.TX_EXTRA_TAG_PADDING = 0x00;
    exports.TX_EXTRA_TAG_PUBKEY = 0x01;
    exports.TX_EXTRA_NONCE = 0x02;
    exports.TX_EXTRA_MERGE_MINING_TAG = 0x03;
    exports.TX_EXTRA_TAG_ADDITIONAL_PUBKEYS = 0x04;
    exports.TX_EXTRA_MYSTERIOUS_MINERGATE_TAG = 0xDE;
    exports.TX_EXTRA_NONCE_PAYMENT_ID = 0x00;
    exports.TX_EXTRA_NONCE_ENCRYPTED_PAYMENT_ID = 0x01;
    var TransactionsExplorer = /** @class */ (function () {
        function TransactionsExplorer() {
        }
        TransactionsExplorer.parseExtra = function (oextra) {
            var extra = oextra.slice();
            var extras = [];
            var hasFoundPubKey = false;
            // console.log('extra', oextra);
            while (extra.length > 0) {
                var extraSize = 0;
                var startOffset = 0;
                if (extra[0] === exports.TX_EXTRA_NONCE ||
                    extra[0] === exports.TX_EXTRA_MERGE_MINING_TAG ||
                    extra[0] === exports.TX_EXTRA_MYSTERIOUS_MINERGATE_TAG) {
                    extraSize = extra[1];
                    startOffset = 2;
                }
                else if (extra[0] === exports.TX_EXTRA_TAG_PUBKEY) {
                    extraSize = 32;
                    startOffset = 1;
                    hasFoundPubKey = true;
                }
                else if (extra[0] === exports.TX_EXTRA_TAG_PADDING) {
                    var iExtra = 2;
                    var fextras = {
                        type: extra[0],
                        data: [extra[1]]
                    };
                    while (extra.length > iExtra && extra[iExtra++] == 0) {
                        fextras.data.push(0);
                    }
                    continue;
                }
                else if (extra[0] === exports.TX_EXTRA_TAG_ADDITIONAL_PUBKEYS) {
                    extraSize = extra[1] * 32;
                    startOffset = 2;
                }
                if (extraSize === 0) {
                    if (!hasFoundPubKey)
                        throw 'Invalid extra size' + extra[0];
                    break;
                }
                var data = extra.slice(startOffset, startOffset + extraSize);
                extras.push({
                    type: extra[0],
                    data: data
                });
                extra = extra.slice(startOffset + extraSize);
                // console.log(extra, extras);
            }
            return extras;
        };
        TransactionsExplorer.isMinerTx = function (rawTransaction) {
            if (!Array.isArray(rawTransaction.vout) || rawTransaction.vin.length > 0)
                return false;
            if (!Array.isArray(rawTransaction.vout) || rawTransaction.vout.length === 0) {
                console.error('Weird tx !', rawTransaction);
                return false;
            }
            try {
                return parseInt(rawTransaction.vout[0].amount) !== 0;
            }
            catch (err) {
                return false;
            }
        };
        TransactionsExplorer.parse = function (rawTransaction, wallet) {
            var transaction = null;
            var tx_pub_key = '';
            var paymentId = null;
            var tx_extras = [];
            try {
                tx_extras = this.parseExtra(rawTransaction.extra);
            }
            catch (e) {
                console.error(e);
                console.log('Error when scanning transaction on block ' + rawTransaction.height, rawTransaction);
                return null;
            }
            for (var _i = 0, tx_extras_1 = tx_extras; _i < tx_extras_1.length; _i++) {
                var extra = tx_extras_1[_i];
                if (extra.type === exports.TX_EXTRA_TAG_PUBKEY) {
                    for (var i = 0; i < 32; ++i) {
                        tx_pub_key += String.fromCharCode(extra.data[i]);
                    }
                    break;
                }
            }
            if (tx_pub_key === '') {
                return null;
            }
            tx_pub_key = Cn_1.CnUtils.bintohex(tx_pub_key);
            var encryptedPaymentId = null;
            for (var _a = 0, tx_extras_2 = tx_extras; _a < tx_extras_2.length; _a++) {
                var extra = tx_extras_2[_a];
                if (extra.type === exports.TX_EXTRA_NONCE) {
                    if (extra.data[0] === exports.TX_EXTRA_NONCE_PAYMENT_ID) {
                        paymentId = '';
                        for (var i = 1; i < extra.data.length; ++i) {
                            paymentId += String.fromCharCode(extra.data[i]);
                        }
                        paymentId = Cn_1.CnUtils.bintohex(paymentId);
                        break;
                    }
                    else if (extra.data[0] === exports.TX_EXTRA_NONCE_ENCRYPTED_PAYMENT_ID) {
                        encryptedPaymentId = '';
                        for (var i = 1; i < extra.data.length; ++i) {
                            encryptedPaymentId += String.fromCharCode(extra.data[i]);
                        }
                        encryptedPaymentId = Cn_1.CnUtils.bintohex(encryptedPaymentId);
                        break;
                    }
                }
            }
            var derivation = null;
            try {
                derivation = Cn_1.CnNativeBride.generate_key_derivation(tx_pub_key, wallet.keys.priv.view); //9.7ms
                // derivation = CnUtilNative.generate_key_derivation(tx_pub_key, wallet.keys.priv.view);
            }
            catch (e) {
                console.log('UNABLE TO CREATE DERIVATION', e);
                return null;
            }
            var outs = [];
            var ins = [];
            for (var iOut = 0; iOut < rawTransaction.vout.length; ++iOut) {
                var out = rawTransaction.vout[iOut];
                var txout_k = out.target;
                var amount = 0;
                try {
                    amount = parseInt(out.amount);
                }
                catch (e) {
                    console.error(e);
                    continue;
                }
                var output_idx_in_tx = iOut;
                var generated_tx_pubkey = Cn_1.CnNativeBride.derive_public_key(derivation, output_idx_in_tx, wallet.keys.pub.spend); //5.5ms
                // let generated_tx_pubkey = CnUtilNative.derive_public_key(derivation,output_idx_in_tx,wallet.keys.pub.spend);//5.5ms
                // check if generated public key matches the current output's key
                var mine_output = (txout_k.key == generated_tx_pubkey);
                if (mine_output) {
                    var minerTx = false;
                    if (amount !== 0) { //miner tx
                        minerTx = true;
                    }
                    else {
                        var mask = rawTransaction.rct_signatures.ecdhInfo[output_idx_in_tx].mask;
                        var r = Cn_1.CnTransactions.decode_ringct(rawTransaction.rct_signatures, tx_pub_key, wallet.keys.priv.view, output_idx_in_tx, mask, amount, derivation);
                        if (r === false) {
                            console.error("Cant decode ringCT!");
                            continue;
                        }
                        else
                            amount = r;
                    }
                    var transactionOut = new Transaction_1.TransactionOut();
                    if (typeof rawTransaction.global_index_start !== 'undefined')
                        transactionOut.globalIndex = rawTransaction.global_index_start + output_idx_in_tx;
                    else
                        transactionOut.globalIndex = output_idx_in_tx;
                    transactionOut.amount = amount;
                    transactionOut.pubKey = txout_k.key;
                    transactionOut.outputIdx = output_idx_in_tx;
                    if (!minerTx) {
                        transactionOut.rtcOutPk = rawTransaction.rct_signatures.outPk[output_idx_in_tx];
                        transactionOut.rtcMask = rawTransaction.rct_signatures.ecdhInfo[output_idx_in_tx].mask;
                        transactionOut.rtcAmount = rawTransaction.rct_signatures.ecdhInfo[output_idx_in_tx].amount;
                    }
                    if (wallet.keys.priv.spend !== null && wallet.keys.priv.spend !== '') {
                        var m_key_image = Cn_1.CnTransactions.generate_key_image_helper({
                            view_secret_key: wallet.keys.priv.view,
                            spend_secret_key: wallet.keys.priv.spend,
                            public_spend_key: wallet.keys.pub.spend,
                        }, tx_pub_key, output_idx_in_tx, derivation);
                        transactionOut.keyImage = m_key_image.key_image;
                        transactionOut.ephemeralPub = m_key_image.ephemeral_pub;
                    }
                    outs.push(transactionOut);
                    if (minerTx)
                        break;
                } //  if (mine_output)
            }
            //check if no read only wallet
            if (wallet.keys.priv.spend !== null && wallet.keys.priv.spend !== '') {
                var keyImages = wallet.getTransactionKeyImages();
                for (var iIn = 0; iIn < rawTransaction.vin.length; ++iIn) {
                    var vin = rawTransaction.vin[iIn];
                    if (vin.key && keyImages.indexOf(vin.key.k_image) !== -1) {
                        // console.log('found in', vin);
                        var walletOuts = wallet.getAllOuts();
                        for (var _b = 0, walletOuts_1 = walletOuts; _b < walletOuts_1.length; _b++) {
                            var ut = walletOuts_1[_b];
                            if (ut.keyImage == vin.key.k_image) {
                                // ins.push(vin.key.k_image);
                                // sumIns += ut.amount;
                                var transactionIn = new Transaction_1.TransactionIn();
                                transactionIn.amount = ut.amount;
                                transactionIn.keyImage = ut.keyImage;
                                ins.push(transactionIn);
                                // console.log(ut);
                                break;
                            }
                        }
                    }
                }
            }
            else {
                var txOutIndexes = wallet.getTransactionOutIndexes();
                for (var iIn = 0; iIn < rawTransaction.vin.length; ++iIn) {
                    var vin = rawTransaction.vin[iIn];
                    if (!vin.key)
                        continue;
                    var absoluteOffets = vin.key.key_offsets.slice();
                    for (var i = 1; i < absoluteOffets.length; ++i) {
                        absoluteOffets[i] += absoluteOffets[i - 1];
                    }
                    var ownTx = -1;
                    for (var _c = 0, absoluteOffets_1 = absoluteOffets; _c < absoluteOffets_1.length; _c++) {
                        var index = absoluteOffets_1[_c];
                        if (txOutIndexes.indexOf(index) !== -1) {
                            ownTx = index;
                            break;
                        }
                    }
                    if (ownTx !== -1) {
                        var txOut = wallet.getOutWithGlobalIndex(ownTx);
                        if (txOut !== null) {
                            var transactionIn = new Transaction_1.TransactionIn();
                            transactionIn.amount = -txOut.amount;
                            transactionIn.keyImage = txOut.keyImage;
                            ins.push(transactionIn);
                        }
                    }
                }
            }
            if (outs.length > 0 || ins.length) {
                transaction = new Transaction_1.Transaction();
                if (typeof rawTransaction.height !== 'undefined')
                    transaction.blockHeight = rawTransaction.height;
                if (typeof rawTransaction.ts !== 'undefined')
                    transaction.timestamp = rawTransaction.ts;
                if (typeof rawTransaction.hash !== 'undefined')
                    transaction.hash = rawTransaction.hash;
                transaction.txPubKey = tx_pub_key;
                if (paymentId !== null)
                    transaction.paymentId = paymentId;
                if (encryptedPaymentId !== null) {
                    transaction.paymentId = Cn_1.Cn.decrypt_payment_id(encryptedPaymentId, tx_pub_key, wallet.keys.priv.view);
                }
                transaction.fees = parseInt(rawTransaction.rct_signatures.txnFee);
                transaction.outs = outs;
                transaction.ins = ins;
            }
            return transaction;
        };
        TransactionsExplorer.formatWalletOutsForTx = function (wallet, blockchainHeight) {
            var unspentOuts = [];
            //rct=rct_outpk + rct_mask + rct_amount
            // {"amount"          , out.amount},
            // {"public_key"      , out.out_pub_key},
            // {"index"           , out.out_index},
            // {"global_index"    , out.global_index},
            // {"rct"             , rct},
            // {"tx_id"           , out.tx_id},
            // {"tx_hash"         , tx.hash},
            // {"tx_prefix_hash"  , tx.prefix_hash},
            // {"tx_pub_key"      , tx.tx_pub_key},
            // {"timestamp"       , static_cast<uint64_t>(out.timestamp)},
            // {"height"          , tx.height},
            // {"spend_key_images", json::array()}
            console.log(wallet.getAll());
            for (var _i = 0, _a = wallet.getAll(); _i < _a.length; _i++) {
                var tr = _a[_i];
                //todo improve to take into account miner tx
                //only add outs unlocked
                if (!tr.isConfirmed(blockchainHeight)) {
                    continue;
                }
                for (var _b = 0, _c = tr.outs; _b < _c.length; _b++) {
                    var out = _c[_b];
                    var rct = '';
                    if (out.rtcAmount !== '') {
                        rct = out.rtcOutPk + out.rtcMask + out.rtcAmount;
                    }
                    else {
                        rct = Cn_1.CnTransactions.zeroCommit(Cn_1.CnUtils.d2s(out.amount));
                    }
                    unspentOuts.push({
                        keyImage: out.keyImage,
                        amount: out.amount,
                        public_key: out.pubKey,
                        index: out.outputIdx,
                        global_index: out.globalIndex,
                        rct: rct,
                        tx_pub_key: tr.txPubKey,
                    });
                }
            }
            console.log('outs count before spend:', unspentOuts.length, unspentOuts);
            for (var _d = 0, _e = wallet.getAll().concat(wallet.txsMem); _d < _e.length; _d++) {
                var tr = _e[_d];
                console.log(tr.ins);
                for (var _f = 0, _g = tr.ins; _f < _g.length; _f++) {
                    var i = _g[_f];
                    for (var iOut = 0; iOut < unspentOuts.length; ++iOut) {
                        var out = unspentOuts[iOut];
                        var exist = out.keyImage === i.keyImage;
                        if (exist) {
                            unspentOuts.splice(iOut, 1);
                            break;
                        }
                    }
                }
            }
            return unspentOuts;
        };
        TransactionsExplorer.createRawTx = function (from_dsts, to_dsts, wallet, rct, usingOuts, pid_encrypt, mix_outs, mixin, neededFee, payment_id) {
            if (mix_outs === void 0) { mix_outs = []; }
            return new Promise(function (resolve, reject) {
                try {
                    Cn_1.CnTransactions.create_transaction2({
                        spend: wallet.keys.pub.spend,
                        view: wallet.keys.pub.view
                    }, {
                        spend: wallet.keys.priv.spend,
                        view: wallet.keys.priv.view
                    }, from_dsts, to_dsts, usingOuts, mix_outs, mixin, neededFee, 0, // unlock_time
                    1 // priority
                    ).then(function (rawTx) {
                        resolve({ raw: rawTx, signed: null });
                    });
                }
                catch (e) {
                    reject("Failed to create transaction: " + e);
                }
            });
        };
        TransactionsExplorer.createTx = function (userDestinations, userPaymentId, wallet, blockchainHeight, obtainMixOutsCallback, confirmCallback, mixin) {
            if (userPaymentId === void 0) { userPaymentId = ''; }
            if (mixin === void 0) { mixin = config.defaultMixin; }
            return new Promise(function (resolve, reject) {
                // few multiplayers based on uint64_t wallet2::get_fee_multiplier
                var fee_multiplayers = [1, 2, 4, 20, 166];
                var default_priority = 1;
                var feePerKB = new JSBigInt(config.feePerKB);
                var priority = default_priority;
                var fee_multiplayer = fee_multiplayers[priority - 1];
                var neededFee = JSBigInt(Math.ceil(Cn_1.CnTransactions.estimateRctSizeNew(1, mixin, 2, 256, true) / 1024)).multiply(feePerKB).multiply(fee_multiplayer);
                var pid_encrypt = false; //don't encrypt payment ID unless we find an integrated one
                var totalAmountWithoutFee = new JSBigInt(0);
                var paymentIdIncluded = 0;
                var paymentId = '';
                var from_dsts = [];
                var to_dsts = [];
                for (var _i = 0, userDestinations_1 = userDestinations; _i < userDestinations_1.length; _i++) {
                    var dest = userDestinations_1[_i];
                    totalAmountWithoutFee = totalAmountWithoutFee.add(dest.amount);
                    var target = Cn_1.Cn.decode_address(dest.address);
                    if (target.intPaymentId !== null) {
                        ++paymentIdIncluded;
                        paymentId = target.intPaymentId;
                        pid_encrypt = true;
                    }
                    to_dsts.push({
                        address: dest.address,
                        amount: new JSBigInt(dest.amount)
                    });
                }
                if (paymentIdIncluded > 1) {
                    reject('multiple_payment_ids');
                    return;
                }
                if (paymentId !== '' && userPaymentId !== '') {
                    reject('address_payment_id_conflict_user_payment_id');
                    return;
                }
                if (totalAmountWithoutFee.compare(0) <= 0) {
                    reject('negative_amount');
                    return;
                }
                if (paymentId === '' && userPaymentId !== '') {
                    if (userPaymentId.length <= 16 && /^[0-9a-fA-F]+$/.test(userPaymentId)) {
                        userPaymentId = ('0000000000000000' + userPaymentId).slice(-16);
                    }
                    // now double check if ok
                    if ((userPaymentId.length !== 16 && userPaymentId.length !== 64) ||
                        (!(/^[0-9a-fA-F]{16}$/.test(userPaymentId)) && !(/^[0-9a-fA-F]{64}$/.test(userPaymentId)))) {
                        reject('invalid_payment_id');
                        return;
                    }
                    pid_encrypt = userPaymentId.length === 16;
                    paymentId = userPaymentId;
                }
                var unspentOuts = TransactionsExplorer.formatWalletOutsForTx(wallet, blockchainHeight);
                console.log('outs available:', unspentOuts.length, unspentOuts);
                var usingOuts = [];
                var usingOuts_amount = new JSBigInt(0);
                var unusedOuts = unspentOuts.slice(0);
                var totalAmount = totalAmountWithoutFee.add(neededFee) /*.add(chargeAmount)*/;
                //selecting outputs to fit the desired amount (totalAmount);
                function pop_random_value(list) {
                    var idx = Math.floor(MathUtil_1.MathUtil.randomFloat() * list.length);
                    var val = list[idx];
                    list.splice(idx, 1);
                    return val;
                }
                while (usingOuts_amount.compare(totalAmount) < 0 && unusedOuts.length > 0) {
                    var out = pop_random_value(unusedOuts);
                    usingOuts.push(out);
                    usingOuts_amount = usingOuts_amount.add(out.amount);
                    console.log("Using output: " + out.amount + " - " + JSON.stringify(out));
                }
                var calculateFeeWithBytes = function (fee_per_kb, bytes, fee_multiplier) {
                    var kB = (bytes + 1023) / 1024;
                    return kB * fee_per_kb * fee_multiplier;
                };
                console.log("Selected outs:", usingOuts);
                if (usingOuts.length > 1) {
                    var newNeededFee = JSBigInt(Math.ceil(Cn_1.CnTransactions.estimateRctSizeNew(usingOuts.length, mixin, 2, 256, true) / 1024)).multiply(feePerKB).multiply(fee_multiplayer);
                    totalAmount = totalAmountWithoutFee.add(newNeededFee);
                    //add outputs 1 at a time till we either have them all or can meet the fee
                    while (usingOuts_amount.compare(totalAmount) < 0 && unusedOuts.length > 0) {
                        var out = pop_random_value(unusedOuts);
                        usingOuts.push(out);
                        usingOuts_amount = usingOuts_amount.add(out.amount);
                        console.log("Using output: " + Cn_1.Cn.formatMoney(out.amount) + " - " + JSON.stringify(out));
                        newNeededFee = JSBigInt(Math.ceil(Cn_1.CnTransactions.estimateRctSizeNew(usingOuts.length, mixin, 2, 0, true) / 1024)).multiply(feePerKB).multiply(fee_multiplayer);
                        totalAmount = totalAmountWithoutFee.add(newNeededFee);
                    }
                    console.log("New fee: " + Cn_1.Cn.formatMoneySymbol(newNeededFee) + " for " + usingOuts.length + " inputs");
                    neededFee = newNeededFee;
                }
                // neededFee = neededFee / 3 * 2;
                console.log('using amount of ' + usingOuts_amount + ' for sending ' + totalAmountWithoutFee + ' with fees of ' + (neededFee / Math.pow(10, config.coinUnitPlaces)));
                confirmCallback(totalAmountWithoutFee, neededFee).then(function () {
                    if (usingOuts_amount.compare(totalAmount) < 0) {
                        console.log("Not enough spendable outputs / balance too low (have "
                            + Cn_1.Cn.formatMoneyFull(usingOuts_amount) + " but need "
                            + Cn_1.Cn.formatMoneyFull(totalAmount)
                            + " (estimated fee " + Cn_1.Cn.formatMoneyFull(neededFee) + " included)");
                        // return;
                        reject({ error: 'balance_too_low' });
                        return;
                    }
                    var changeAmount = usingOuts_amount.subtract(totalAmount);
                    //add entire change for rct
                    console.log("1) Sending change of " + Cn_1.Cn.formatMoneySymbol(changeAmount)
                        + " to " + wallet.getPublicAddress());
                    from_dsts.push({
                        address: wallet.getPublicAddress(),
                        amount: changeAmount
                    });
                    console.log('destinations', from_dsts, to_dsts);
                    var amounts = [];
                    for (var l = 0; l < usingOuts.length; l++) {
                        amounts.push(usingOuts[l].rct ? "0" : usingOuts[l].amount.toString());
                    }
                    obtainMixOutsCallback(amounts.length * (mixin + 1)).then(function (lotsMixOuts) {
                        console.log('------------------------------mix_outs', lotsMixOuts);
                        console.log('amounts', amounts);
                        console.log('lots_mix_outs', lotsMixOuts);
                        var mix_outs = [];
                        var iMixOutsIndexes = 0;
                        for (var _i = 0, amounts_1 = amounts; _i < amounts_1.length; _i++) {
                            var amount = amounts_1[_i];
                            var localMixOuts = [];
                            for (var i = 0; i < mixin + 1; ++i) {
                                localMixOuts.push(lotsMixOuts[iMixOutsIndexes]);
                                ++iMixOutsIndexes;
                            }
                            localMixOuts.sort().reverse();
                            mix_outs.push({
                                outputs: localMixOuts.slice(),
                                amount: 0
                            });
                        }
                        console.log('mix_outs', mix_outs);
                        TransactionsExplorer.createRawTx(from_dsts, to_dsts, wallet, true, usingOuts, pid_encrypt, mix_outs, mixin, neededFee, paymentId).then(function (data) {
                            resolve(data);
                        }).catch(function (e) {
                            reject(e);
                        });
                    });
                    //https://github.com/moneroexamples/openmonero/blob/ebf282faa8d385ef3cf97e6561bd1136c01cf210/README.md
                    //https://github.com/moneroexamples/openmonero/blob/95bc207e1dd3881ba0795c02c06493861de8c705/src/YourMoneroRequests.cpp
                });
            });
        };
        return TransactionsExplorer;
    }());
    exports.TransactionsExplorer = TransactionsExplorer;
});
