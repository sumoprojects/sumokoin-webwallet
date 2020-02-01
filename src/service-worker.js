"use strict";
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
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
workbox.precaching.precacheAndRoute([
  {
    "url": "api.html",
    "revision": "6e68267e8db11842a67b1e14ed405326"
  },
  {
    "url": "api.js",
    "revision": "dbc90fc2e497a450d640a40d3673460b"
  },
  {
    "url": "assets/css/all.min.css",
    "revision": "500d1a92f875b1d96d37a3a3f8f0438c"
  },
  {
    "url": "assets/css/font-awesome.css",
    "revision": "c495654869785bc3df60216616814ad1"
  },
  {
    "url": "assets/css/fontawesome.min.css",
    "revision": "fc6ece0b999d414f53c25c3999397fee"
  },
  {
    "url": "assets/css/main.css",
    "revision": "702301f28490e23e2cbe27c4df272dc7"
  },
  {
    "url": "assets/img/favicon.ico",
    "revision": "79e58109bcea6eb151111796e21d6f17"
  },
  {
    "url": "assets/img/icons/icon-128x128.png",
    "revision": "c87867ca53fa168651c577604d5a00fd"
  },
  {
    "url": "assets/img/icons/icon-144x144.png",
    "revision": "9d58a3f6e125a498cbc0267f89bb9f75"
  },
  {
    "url": "assets/img/icons/icon-152x152.png",
    "revision": "9f6b801493b07d60de94881cf34dfcf7"
  },
  {
    "url": "assets/img/icons/icon-192x192.png",
    "revision": "e4f459f47db81d5f3d0a6d742d071ca1"
  },
  {
    "url": "assets/img/icons/icon-256x256.png",
    "revision": "d09ff2fa381254712b97a75c30e0d4aa"
  },
  {
    "url": "assets/img/icons/icon-402x402.png",
    "revision": "3f46004846d27ee7f78dbf14ad480397"
  },
  {
    "url": "assets/img/landing/75-usersthink-stock-image.jpg",
    "revision": "504bc6bb021b56d18fcd2a41bea3e0e0"
  },
  {
    "url": "assets/img/logo_white.png",
    "revision": "ab6a482f0d09ee17c32d1797d363d575"
  },
  {
    "url": "assets/img/logo.png",
    "revision": "58962664fc5056aa7a457f9f4a01d65b"
  },
  {
    "url": "assets/img/logoQrCode.png",
    "revision": "7ffd92f358cff93bc3fbc91e2f4ac15b"
  },
  {
    "url": "assets/img/Sumokoin_Vertical.png",
    "revision": "ab6a482f0d09ee17c32d1797d363d575"
  },
  {
    "url": "assets/js/fontawesome.min.js",
    "revision": "eb29d17399d1b21d670f97a72beb8c9a"
  },
  {
    "url": "config.js",
    "revision": "73f2150c64c47dd1e182a37e663aec20"
  },
  {
    "url": "d/vue-i118n.js",
    "revision": "5e60d2e13017ae982538f352d04a961c"
  },
  {
    "url": "index.html",
    "revision": "23ae63a9382fba04bf31431d1342af70"
  },
  {
    "url": "index.js",
    "revision": "5ba1c1991b3f8bb2bfba01f211bf0077"
  },
  {
    "url": "lib/base58.js",
    "revision": "3d523c0162d6911fd675c9ed1b7389a8"
  },
  {
    "url": "lib/biginteger.js",
    "revision": "f5a873c5716a9d3481501cad3f3e5ca7"
  },
  {
    "url": "lib/cn_utils_native.js",
    "revision": "94d65c88ed19007552b6593fa6fc68d1"
  },
  {
    "url": "lib/crypto.js",
    "revision": "d51c76b2e08308f8cca1f68c5c298a6f"
  },
  {
    "url": "lib/decoder.min.js",
    "revision": "889b2bf53f2adc26ca2688e012c4e00b"
  },
  {
    "url": "lib/FileSaver.min.js",
    "revision": "e8fdc5ad52084fa417f1fec6b6de3b29"
  },
  {
    "url": "lib/jquery-3.2.1.min.js",
    "revision": "c9f5aeeca3ad37bf2aa006139b935f0a"
  },
  {
    "url": "lib/jspdf.min.js",
    "revision": "27385efc6fa2eccc9dde7da0081b1a98"
  },
  {
    "url": "lib/kjua-0.1.1.min.js",
    "revision": "ca69d4f40f8c17ff592123dc35c1ea18"
  },
  {
    "url": "lib/mnemonic.js",
    "revision": "f30940176ec1e71b5a5f0c9b784a98b9"
  },
  {
    "url": "lib/mymonero_core_js/monero_utils/MyMoneroCoreCpp_ASMJS.asm.js",
    "revision": "7d4542f0ab07fd8c569b6fbfbbd3a989"
  },
  {
    "url": "lib/mymonero-core.js",
    "revision": "143be26cfe08e8589c5c0b8980a7641f"
  },
  {
    "url": "lib/nacl-fast-cn.js",
    "revision": "1fe1387eb865d9e843697a9d315d95b1"
  },
  {
    "url": "lib/nacl-fast.js",
    "revision": "5a51809c2c6021ce3aa12bfb8ac3a670"
  },
  {
    "url": "lib/nacl-fast.min.js",
    "revision": "72444801c9affc1654ef12860c67e976"
  },
  {
    "url": "lib/nacl-util.min.js",
    "revision": "c7b843b9e9b5aad102c855c600c7edc8"
  },
  {
    "url": "lib/nacl.js",
    "revision": "bf72b0a25fc3edf0c1a638aa43642714"
  },
  {
    "url": "lib/nacl.min.js",
    "revision": "d8eaf281c8890a60ebe82840456edc33"
  },
  {
    "url": "lib/numbersLab/Context.js",
    "revision": "40c29d848d2e19cdff2399a1f4a0ec08"
  },
  {
    "url": "lib/numbersLab/DependencyInjector.js",
    "revision": "3a74b2036a4e4730d2454b96732fb562"
  },
  {
    "url": "lib/numbersLab/DestructableView.js",
    "revision": "c34f21327cd00c4b69dd88f33a60b7fc"
  },
  {
    "url": "lib/numbersLab/Logger.js",
    "revision": "8c2a28644d0112f8934f6ac54ada17ac"
  },
  {
    "url": "lib/numbersLab/Observable.js",
    "revision": "84e5ac65bf05cee513a1fb77801de7b8"
  },
  {
    "url": "lib/numbersLab/Router.js",
    "revision": "a953a6888f51569be1a2d699c4ef986e"
  },
  {
    "url": "lib/numbersLab/VueAnnotate.js",
    "revision": "322eccaecb8cbbfba7b1f7a10ba9cf3b"
  },
  {
    "url": "lib/polyfills/core.min.js",
    "revision": "6ff449122255e7a91fb884ea7016c601"
  },
  {
    "url": "lib/polyfills/crypto.js",
    "revision": "13647291f45a582eee64e000b09d9567"
  },
  {
    "url": "lib/polyfills/textEncoding/encoding-indexes.js",
    "revision": "50f27403be5972eae4831f5b69db1f80"
  },
  {
    "url": "lib/polyfills/textEncoding/encoding.js",
    "revision": "cfc731bd62baec239b2c4daf33b5e810"
  },
  {
    "url": "lib/require.js",
    "revision": "bebd45d1f406bbe61424136b03e50895"
  },
  {
    "url": "lib/sha3.js",
    "revision": "9f298ac7e4ee707645a8d711f3ed916b"
  },
  {
    "url": "lib/sweetalert2.js",
    "revision": "05d0ad9be02eed806a5ab62986c3456b"
  },
  {
    "url": "lib/vue-i18n.js",
    "revision": "e6661e4c9407136f4aca71aaea06b35e"
  },
  {
    "url": "lib/vue.min.js",
    "revision": "5283b86cbf48a538ee3cbebac633ccd4"
  },
  {
    "url": "manifest.json",
    "revision": "7263c536795b711d14ab594536107af5"
  },
  {
    "url": "model/AppState.js",
    "revision": "a4f13154b1fc0d3caa864bc6144f4772"
  },
  {
    "url": "model/blockchain/BlockchainExplorer.js",
    "revision": "f38ab86de3e385035147b61190c1e1ff"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRpc2.js",
    "revision": "7bc3608b756cdbdb1da67635283e50a9"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRpcDaemon.js",
    "revision": "f085f1aba0ec13652c609b3490432e3a"
  },
  {
    "url": "model/Cn.js",
    "revision": "1daca527d006ba1e0d3128e5158ae87a"
  },
  {
    "url": "model/CoinUri.js",
    "revision": "a8d4eea58a272c4af50db832644c4c54"
  },
  {
    "url": "model/Constants.js",
    "revision": "b1cbabd41b94bf64be95526bf46c4f23"
  },
  {
    "url": "model/KeysRepository.js",
    "revision": "1d20a0a5c60b5cf292fd81da981b109d"
  },
  {
    "url": "model/MathUtil.js",
    "revision": "7f559b68c432164e2ad261f162d57335"
  },
  {
    "url": "model/Mnemonic.js",
    "revision": "f4e047d213768bf6ef83d4ca521b7142"
  },
  {
    "url": "model/MnemonicLang.js",
    "revision": "4975ad84e9b2d8b06c587402a1b16486"
  },
  {
    "url": "model/Nfc.js",
    "revision": "5e79dba2eccb2e4a6be22903911ef4d0"
  },
  {
    "url": "model/Password.js",
    "revision": "c0c85c860432cce2a11c6c713d4c4898"
  },
  {
    "url": "model/QRReader.js",
    "revision": "075c42294139c4d342d3dfe3b64ef850"
  },
  {
    "url": "model/Storage.js",
    "revision": "ef81f34a9d7f8db75d2e6bb8709fae5f"
  },
  {
    "url": "model/Transaction.js",
    "revision": "318d8cc97f0c1eadd424136d0df2b85e"
  },
  {
    "url": "model/TransactionsExplorer.js",
    "revision": "4544314e04d2b2d6a6cadc0a3a0639e2"
  },
  {
    "url": "model/Translations.js",
    "revision": "554041f979415c00deb2710211c461fc"
  },
  {
    "url": "model/Wallet.js",
    "revision": "f8aa636e5cd06bed64874c6e998f2d1f"
  },
  {
    "url": "model/WalletRepository.js",
    "revision": "7965681b945458de3c5f019c2aced758"
  },
  {
    "url": "model/WalletWatchdog.js",
    "revision": "03879c71b3d95772be42bd3286434846"
  },
  {
    "url": "pages/account.html",
    "revision": "6976477aa97f5855adef9110d1c6217f"
  },
  {
    "url": "pages/account.js",
    "revision": "daac4162759284a858629ecefcb7f358"
  },
  {
    "url": "pages/changeWalletPassword.html",
    "revision": "1347a045c8b53fc16f08a8c0a377c68e"
  },
  {
    "url": "pages/changeWalletPassword.js",
    "revision": "b62caa4c3ae7d315aff385361cddfc6d"
  },
  {
    "url": "pages/createWallet.html",
    "revision": "2c110ca3a28139a77f9580c588eda250"
  },
  {
    "url": "pages/createWallet.js",
    "revision": "2cf6db6bd7951d6f62a11b2d44367209"
  },
  {
    "url": "pages/disconnect.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "pages/disconnect.js",
    "revision": "3594698740c48755bfb42a88ac737180"
  },
  {
    "url": "pages/donate.html",
    "revision": "79cf1ae5a0210470d50df6581754e0b1"
  },
  {
    "url": "pages/donate.js",
    "revision": "fbd9a3915391c25ee01c7fd7fbe777f2"
  },
  {
    "url": "pages/export.html",
    "revision": "f3a2e99d20142b169a57bee36de6cb16"
  },
  {
    "url": "pages/export.js",
    "revision": "57a0c4fdd814aa24247998ec2a5b7c01"
  },
  {
    "url": "pages/import.html",
    "revision": "5ff2269c7be4b264f7a1776612d51f75"
  },
  {
    "url": "pages/import.js",
    "revision": "16a4b5d6f0489c94418372e05af982d6"
  },
  {
    "url": "pages/importFromFile.html",
    "revision": "2c110ca3a28139a77f9580c588eda250"
  },
  {
    "url": "pages/importFromFile.js",
    "revision": "5a0efe3990cb52e92ef4aca97bae4033"
  },
  {
    "url": "pages/importFromKeys.html",
    "revision": "8e75270f91e8e15c173a57f7ff248680"
  },
  {
    "url": "pages/importFromKeys.js",
    "revision": "9e490de691f19902432534577bc203a5"
  },
  {
    "url": "pages/importFromMnemonic.html",
    "revision": "116174b2379b7c6599aaff2bc9f4a46c"
  },
  {
    "url": "pages/importFromMnemonic.js",
    "revision": "e1fb59a3979e3ff819c1def5fd3f1f0c"
  },
  {
    "url": "pages/importFromQr.html",
    "revision": "172fc490fa9a97ed146895e0f35aeedc"
  },
  {
    "url": "pages/importFromQr.js",
    "revision": "ce4f27af88edaa212bd9e5f80390a254"
  },
  {
    "url": "pages/index.html",
    "revision": "a770dcd5db944113a600d358ae66962c"
  },
  {
    "url": "pages/index.js",
    "revision": "283fadc1adb2ac642ebb55b2c19b6f85"
  },
  {
    "url": "pages/network.html",
    "revision": "e68a7754281fe6c5ed9e2b2bec65927e"
  },
  {
    "url": "pages/network.js",
    "revision": "6b239b68f29215dbad1f49feb6c881f8"
  },
  {
    "url": "pages/privacyPolicy.html",
    "revision": "f5cbd71e83b1dbc6224352622054426e"
  },
  {
    "url": "pages/privacyPolicy.js",
    "revision": "a06e415fe7eaf88807bf25d83989dc1c"
  },
  {
    "url": "pages/receive.html",
    "revision": "418a603dd6c0ff1512724d87f2d50225"
  },
  {
    "url": "pages/receive.js",
    "revision": "f2d8ea6d27b1e9d457bd04fce8a7d921"
  },
  {
    "url": "pages/send.html",
    "revision": "d4bb9bcd27187b9cea32749232141940"
  },
  {
    "url": "pages/send.js",
    "revision": "1631b41a16e99bf77a66b14860d9cadb"
  },
  {
    "url": "pages/settings.html",
    "revision": "61003e3dcb0af598120ef9c57241be09"
  },
  {
    "url": "pages/settings.js",
    "revision": "ac0fa3b4f44b3b3b534f4a2d726b2bc3"
  },
  {
    "url": "pages/support.html",
    "revision": "9bc660a0f02538279c3f24ee15b4a55c"
  },
  {
    "url": "pages/support.js",
    "revision": "b9dc72108aa6602ee5e3eb8614c4913d"
  },
  {
    "url": "pages/termsOfUse.html",
    "revision": "31cf49357939c2505233f2e8d921293b"
  },
  {
    "url": "pages/termsOfUse.js",
    "revision": "1e0462ca4750db68f111cd17bbd9d740"
  },
  {
    "url": "providers/BlockchainExplorerProvider.js",
    "revision": "b8ab1f768b46ccd24ab0eccaecddea6b"
  },
  {
    "url": "service-worker-raw.js",
    "revision": "3f7443e2724e74587330aff15f93149e"
  },
  {
    "url": "translations/de.json",
    "revision": "d38a047f490f5d2c8903d7cd71711408"
  },
  {
    "url": "translations/el.json",
    "revision": "92d8218d37f7324def311d8957de2997"
  },
  {
    "url": "translations/en.json",
    "revision": "d982ed645c0d66ec4413334cc68a60e1"
  },
  {
    "url": "translations/es.json",
    "revision": "8199d29c12800ab037325d4eef4b8f93"
  },
  {
    "url": "translations/fr.json",
    "revision": "ff103f76dfcfb9998784a4fadf18a3b9"
  },
  {
    "url": "translations/hu.json",
    "revision": "20071211495fd68a64c0dba84f08b499"
  },
  {
    "url": "translations/id.json",
    "revision": "d8c3270c21da2ff10e70ad10e69d571f"
  },
  {
    "url": "translations/it.json",
    "revision": "60126f41e19171fbde9b1a17a0a48547"
  },
  {
    "url": "translations/nl.json",
    "revision": "219ed9ba3ea3ab8ae477665fd56ce49c"
  },
  {
    "url": "translations/pl.json",
    "revision": "bf01b78dc119b8ce2246ec82621d8f6d"
  },
  {
    "url": "translations/ru.json",
    "revision": "319dde5bb025a32aae8497faa0873103"
  },
  {
    "url": "translations/sr.json",
    "revision": "23866628da70b7d836e5d0760dd72076"
  },
  {
    "url": "translations/tr.json",
    "revision": "038bfa412f397a3b31df4760ef098f34"
  },
  {
    "url": "translations/vi.json",
    "revision": "216c0140c8e68c7064b597564394b339"
  },
  {
    "url": "translations/zh-hk.json",
    "revision": "4501f5ba09fc498c2551350fc6ab0c2d"
  },
  {
    "url": "translations/zh.json",
    "revision": "70381b05c06b3b80c2ff7cf661ba4d73"
  },
  {
    "url": "utils/Url.js",
    "revision": "bea48b6015e471205293f17c12d76e6c"
  },
  {
    "url": "workers/TransferProcessing.js",
    "revision": "143e683c63d657e58e977a90229cd712"
  },
  {
    "url": "workers/TransferProcessingEntrypoint.js",
    "revision": "461730c620fbdd40eb1882809faa7b49"
  }
]);
self.addEventListener('message', function (event) {
    if (!event.data) {
        return;
    }
    switch (event.data) {
        case 'force-activate':
            self.skipWaiting();
            self.clients.claim();
            self.clients.matchAll().then(function (clients) {
                clients.forEach(function (client) { return client.postMessage('reload-window-update'); });
            });
            break;
        default:
            // NOOP
            break;
    }
});
