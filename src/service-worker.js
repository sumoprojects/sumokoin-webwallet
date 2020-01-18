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
    "revision": "2be099f85bc4cb84deb08830b9e552a0"
  },
  {
    "url": "api.js",
    "revision": "c875535b401e2ae6282e5b9b6b7b5905"
  },
  {
    "url": "assets/css/all.min.css",
    "revision": "cb48443d20b81eb897ecd468a07b9b93"
  },
  {
    "url": "assets/css/font-awesome.css",
    "revision": "4bb3dd721c4652feee0953261d329710"
  },
  {
    "url": "assets/css/fontawesome.min.css",
    "revision": "df34c2c14966c1d8a86393b4598a9390"
  },
  {
    "url": "assets/css/main.css",
    "revision": "1e50369cb3e2af6af18ff3544b6bc81e"
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
    "revision": "2fb836c9cece5d1337e28983f0f10b17"
  },
  {
    "url": "config.js",
    "revision": "51dcc9db9c836dc228fdcda93efdf559"
  },
  {
    "url": "d/vue-i118n.js",
    "revision": "85fd5089c3278f8f544a3691fd38f49b"
  },
  {
    "url": "index.html",
    "revision": "966df1695d9fc9097d0ea68d00b5186a"
  },
  {
    "url": "index.js",
    "revision": "3caf8de168a07900515596440bd5656e"
  },
  {
    "url": "lib/base58.js",
    "revision": "cad61541b48010d7e792f394567995a7"
  },
  {
    "url": "lib/biginteger.js",
    "revision": "530a07476fdc1ca4e90f0696dde85709"
  },
  {
    "url": "lib/cn_utils_native.js",
    "revision": "6f382226c0962599661c49e5b5952d77"
  },
  {
    "url": "lib/crypto.js",
    "revision": "94a47d1cad1e87e779eb29e21225f1e4"
  },
  {
    "url": "lib/decoder.min.js",
    "revision": "87eac23b87a1b14b80563b5fe775bc17"
  },
  {
    "url": "lib/FileSaver.min.js",
    "revision": "d2e0d52146931b50ded6b4a8cadb6f8f"
  },
  {
    "url": "lib/jquery-3.2.1.min.js",
    "revision": "473957cfb255a781b42cb2af51d54a3b"
  },
  {
    "url": "lib/jspdf.min.js",
    "revision": "bcc6f9c8d3b58438d8e8aa24314b41f9"
  },
  {
    "url": "lib/kjua-0.1.1.min.js",
    "revision": "f0ea94e8c4cbc705eaaf8b6cede15389"
  },
  {
    "url": "lib/mnemonic.js",
    "revision": "f81f584bb025513e9544900b0e9d0c31"
  },
  {
    "url": "lib/mymonero_core_js/monero_utils/MyMoneroCoreCpp_ASMJS.asm.js",
    "revision": "8daf2691d66a09662411f94a8d88e19f"
  },
  {
    "url": "lib/mymonero-core.js",
    "revision": "c81d3ef565cd1ef86be34523bc89d9b2"
  },
  {
    "url": "lib/nacl-fast-cn.js",
    "revision": "5a4c4d33ad852ae5cce33dcc2c3d29a3"
  },
  {
    "url": "lib/nacl-fast.js",
    "revision": "b606f76ba3e865fa88487f1f4f174cf4"
  },
  {
    "url": "lib/nacl-fast.min.js",
    "revision": "4e5450d2e030eed0c1b96cccd68ab8db"
  },
  {
    "url": "lib/nacl-util.min.js",
    "revision": "c7b843b9e9b5aad102c855c600c7edc8"
  },
  {
    "url": "lib/nacl.js",
    "revision": "43f0590d1bd0d155c37168eef6375e14"
  },
  {
    "url": "lib/nacl.min.js",
    "revision": "d8eaf281c8890a60ebe82840456edc33"
  },
  {
    "url": "lib/numbersLab/Context.js",
    "revision": "ebb2aae3a749741226613dd291cc2839"
  },
  {
    "url": "lib/numbersLab/DependencyInjector.js",
    "revision": "56b74e4cb0875af2c45a175cdf436ebd"
  },
  {
    "url": "lib/numbersLab/DestructableView.js",
    "revision": "130f58a50d4641ce84928ccbacf1a965"
  },
  {
    "url": "lib/numbersLab/Logger.js",
    "revision": "de9da3f513d18d131cbe7fd783105cd5"
  },
  {
    "url": "lib/numbersLab/Observable.js",
    "revision": "d3bede42dfc41a78b4d50647bdb74646"
  },
  {
    "url": "lib/numbersLab/Router.js",
    "revision": "35a09adb39f912c4ec5aa285c37cca80"
  },
  {
    "url": "lib/numbersLab/VueAnnotate.js",
    "revision": "503a173798ba5bfb0598061b62864920"
  },
  {
    "url": "lib/polyfills/core.min.js",
    "revision": "24ea10196602bef524ef5d66fd817556"
  },
  {
    "url": "lib/polyfills/crypto.js",
    "revision": "3a8031a409f6cc6937a963163b2c5c9b"
  },
  {
    "url": "lib/polyfills/textEncoding/encoding-indexes.js",
    "revision": "23aac331aa32854db80d7fb673353df8"
  },
  {
    "url": "lib/polyfills/textEncoding/encoding.js",
    "revision": "67d0aec3a86eb870aeb5ebb41c5b9150"
  },
  {
    "url": "lib/require.js",
    "revision": "5b08692433e727db32f63db348f4837b"
  },
  {
    "url": "lib/sha3.js",
    "revision": "c38274b1eab5b932269f17bb9cc759b0"
  },
  {
    "url": "lib/sweetalert2.js",
    "revision": "53b14a7b90b850c7876bfb73fe59beb2"
  },
  {
    "url": "lib/vue-i18n.js",
    "revision": "fe8f6691b4ed710c1cb85182ab223a3f"
  },
  {
    "url": "lib/vue.min.js",
    "revision": "3e7fd9458a2147045ce499aa4ccc27f6"
  },
  {
    "url": "manifest.json",
    "revision": "d51399efae86c5ef94dcbc8a0c93546e"
  },
  {
    "url": "model/AppState.js",
    "revision": "166700e727ffe8965ce4104a22dd1f59"
  },
  {
    "url": "model/blockchain/BlockchainExplorer.js",
    "revision": "d6d40c2136d1a323875a08cd9fdf5bd5"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRpc2.js",
    "revision": "fbe61feac64f4d32b9fdd64061408b3b"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRpcDaemon.js",
    "revision": "59876059835c6394d96add53b46a0684"
  },
  {
    "url": "model/Cn.js",
    "revision": "1acde1ce511dbb81c6feffc4c9c20496"
  },
  {
    "url": "model/CoinUri.js",
    "revision": "d3ca69aa111b44eea46926f8b05e3211"
  },
  {
    "url": "model/Constants.js",
    "revision": "cdd693e72400596bd0bf8999b9ec9f46"
  },
  {
    "url": "model/KeysRepository.js",
    "revision": "00ad6288cff36348cfcb421d11756ede"
  },
  {
    "url": "model/MathUtil.js",
    "revision": "abb139f8ad4a6d8d79499d34207a82fa"
  },
  {
    "url": "model/Mnemonic.js",
    "revision": "50b6411e2c532baf7f56cbff7daccd55"
  },
  {
    "url": "model/MnemonicLang.js",
    "revision": "f8d547627a6b4dacdaecbac32a169233"
  },
  {
    "url": "model/Nfc.js",
    "revision": "7e399a97da4ef764b528401d84951474"
  },
  {
    "url": "model/Password.js",
    "revision": "cf55f6790d20972b5932bfe2f49e1790"
  },
  {
    "url": "model/QRReader.js",
    "revision": "4f2000ccdffec3450c3564b7ccad1997"
  },
  {
    "url": "model/Storage.js",
    "revision": "07fc77843e1f7d8f764185ade6cbe82a"
  },
  {
    "url": "model/Transaction.js",
    "revision": "9a299d6bd6bad7c39404a43058ffb67c"
  },
  {
    "url": "model/TransactionsExplorer.js",
    "revision": "e8bd1f647d480f3514274b933472edb0"
  },
  {
    "url": "model/Translations.js",
    "revision": "ab370d008a22c7f15e05ff7a80776746"
  },
  {
    "url": "model/Wallet.js",
    "revision": "72bf711109ea192d648fc3ce9a518a68"
  },
  {
    "url": "model/WalletRepository.js",
    "revision": "8f3f3955ec2b03409818bf68936e6456"
  },
  {
    "url": "model/WalletWatchdog.js",
    "revision": "4cb7dff1034b27df6ce7da1e7c20a304"
  },
  {
    "url": "pages/account.html",
    "revision": "64ce4a1be91ada7be71882a0b78b4b0f"
  },
  {
    "url": "pages/account.js",
    "revision": "c989aab065922e50e0899f68659b7761"
  },
  {
    "url": "pages/changeWalletPassword.html",
    "revision": "c341885c193af90669e24438887f25dd"
  },
  {
    "url": "pages/changeWalletPassword.js",
    "revision": "ad9dc179bf08935fb86d81a6e0c047cb"
  },
  {
    "url": "pages/createWallet.html",
    "revision": "9d5e828ea8c8271c56e997ac7a9f0785"
  },
  {
    "url": "pages/createWallet.js",
    "revision": "ad13a1cef88b89dbc90dde4a6a964df7"
  },
  {
    "url": "pages/disconnect.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "pages/disconnect.js",
    "revision": "a2771001f905e32049f0301329387401"
  },
  {
    "url": "pages/donate.html",
    "revision": "d57d6e4c799c2422ae2e256dff171204"
  },
  {
    "url": "pages/donate.js",
    "revision": "17f263a9cde6cfafadfdb7eb4f3737a3"
  },
  {
    "url": "pages/export.html",
    "revision": "8c9e3537e894af4ef023e4400207a92d"
  },
  {
    "url": "pages/export.js",
    "revision": "a6c35fdc3ec1f756c3619f17657ef7d3"
  },
  {
    "url": "pages/import.html",
    "revision": "d4a20d8ccadf4b0e9038b845c91da684"
  },
  {
    "url": "pages/import.js",
    "revision": "44ea2b901c09a46d4cd5a95e2370ae40"
  },
  {
    "url": "pages/importFromFile.html",
    "revision": "9d5e828ea8c8271c56e997ac7a9f0785"
  },
  {
    "url": "pages/importFromFile.js",
    "revision": "70b26a5096e46302d23a6723308f98a4"
  },
  {
    "url": "pages/importFromKeys.html",
    "revision": "9a056ee5a96f0f80c1a51da662e047ba"
  },
  {
    "url": "pages/importFromKeys.js",
    "revision": "4cbdad812099014cbaa64276ca6fca8d"
  },
  {
    "url": "pages/importFromMnemonic.html",
    "revision": "40ca05b1b751e60f8391fe2412ac7e9d"
  },
  {
    "url": "pages/importFromMnemonic.js",
    "revision": "6af43727d02caabf1a305c3cbf68a8da"
  },
  {
    "url": "pages/importFromQr.html",
    "revision": "d066f402ce1243383d024820920704b0"
  },
  {
    "url": "pages/importFromQr.js",
    "revision": "794529cc55521e6fde514f1f025c66b3"
  },
  {
    "url": "pages/index.html",
    "revision": "8aec1c9b760e84ee5340fae1a4f90ee3"
  },
  {
    "url": "pages/index.js",
    "revision": "377b9b6716de6cd87b25a140027ecebe"
  },
  {
    "url": "pages/network.html",
    "revision": "9003215793a9e23112628a2130b0c19e"
  },
  {
    "url": "pages/network.js",
    "revision": "415eedba078222692dfed2062ffb7509"
  },
  {
    "url": "pages/privacyPolicy.html",
    "revision": "2532a4fc0ebc2f0e86c9c2fb2bb3ad6c"
  },
  {
    "url": "pages/privacyPolicy.js",
    "revision": "2d6c08d5981265293d29bce566ab2bdb"
  },
  {
    "url": "pages/receive.html",
    "revision": "e5a789df0a962752030d3c57627a6745"
  },
  {
    "url": "pages/receive.js",
    "revision": "ce9cef4e1935e24a887a2d04c5faa60f"
  },
  {
    "url": "pages/send.html",
    "revision": "cb59b23ea1a745ae5e4d8db408379630"
  },
  {
    "url": "pages/send.js",
    "revision": "c4963e394336746f04300fda99484053"
  },
  {
    "url": "pages/settings.html",
    "revision": "be8a078d0009f5447089c6d2def272c2"
  },
  {
    "url": "pages/settings.js",
    "revision": "cab861270abad0cdb72ea9c8ce220d34"
  },
  {
    "url": "pages/support.html",
    "revision": "63dc6f6aec66b617745ad85bb72810c7"
  },
  {
    "url": "pages/support.js",
    "revision": "f8135fd2b9c7f8744750ae6520c0fabf"
  },
  {
    "url": "pages/termsOfUse.html",
    "revision": "3eed6fc9b8ef136b25c395c6b9cd79ee"
  },
  {
    "url": "pages/termsOfUse.js",
    "revision": "db3af3ca3c81ead32a62ac01c84a1608"
  },
  {
    "url": "providers/BlockchainExplorerProvider.js",
    "revision": "caf7bbc7dda7b0d9ae45913326a2cf1d"
  },
  {
    "url": "service-worker-raw.js",
    "revision": "47711885594600fb63e07580fa331c04"
  },
  {
    "url": "translations/de.json",
    "revision": "290eefb771691a0686fff0cd5b7be38e"
  },
  {
    "url": "translations/el.json",
    "revision": "8be660dcd0fbd7d86b58129647e8c2d2"
  },
  {
    "url": "translations/en.json",
    "revision": "a8da0387820b99602572c79a75105702"
  },
  {
    "url": "translations/es.json",
    "revision": "088dfd35ff4be8daec17f9a403dc92b5"
  },
  {
    "url": "translations/fr.json",
    "revision": "5feecc7c8f8ba056b2911093faea8209"
  },
  {
    "url": "translations/hu.json",
    "revision": "c9da9352d3e7e742a3b8b132b6798d5b"
  },
  {
    "url": "translations/id.json",
    "revision": "d8c3270c21da2ff10e70ad10e69d571f"
  },
  {
    "url": "translations/it.json",
    "revision": "ac3576b83595c47c0b3332d585d6ee89"
  },
  {
    "url": "translations/nl.json",
    "revision": "219ed9ba3ea3ab8ae477665fd56ce49c"
  },
  {
    "url": "translations/pl.json",
    "revision": "d353059258a8601b42ca5d807a3afcdc"
  },
  {
    "url": "translations/ru.json",
    "revision": "319dde5bb025a32aae8497faa0873103"
  },
  {
    "url": "translations/sr.json",
    "revision": "88bee149ee361667129736f12016e54f"
  },
  {
    "url": "translations/tr.json",
    "revision": "2e5bfa0f73c98d5598bbd9c787399aff"
  },
  {
    "url": "translations/vi.json",
    "revision": "416dd9e5790410904819e172df0e1a87"
  },
  {
    "url": "translations/zh-hk.json",
    "revision": "bf41b6e6a72436da250e097cf1446527"
  },
  {
    "url": "translations/zh.json",
    "revision": "afaac536092fee09cb10ba05b6cc016b"
  },
  {
    "url": "utils/Url.js",
    "revision": "9bc2c6a7dcb4c4340e8f61f845b95e15"
  },
  {
    "url": "workers/TransferProcessing.js",
    "revision": "5a44cd52a9ecfeeb59386211ef92ee24"
  },
  {
    "url": "workers/TransferProcessingEntrypoint.js",
    "revision": "8b4756a48114019f3aa70c2f82cd29d9"
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
