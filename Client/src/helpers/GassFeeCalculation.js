const Web3 = require('web3');
const web3 = new Web3(window.ethereum);
export function GassFeeCalculation(config) {
    return new Promise(async (resolve, reject) => {
        try {
            const tokenInst = new web3.eth.Contract(config.contractABI, config.contractAddress);

            var resGasMethod = 0;
            if (config.methodName == "airdropByOwner") {
                tokenInst.methods.airdropByOwner(config.addressList, config.amountList)
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });

            } else if (config.methodName == "mint") {
                tokenInst.methods.mint(config.address, config.amount)
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });
            } else if (config.methodName == "burn") {
                tokenInst.methods.burn(config.address, config.amount)
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');

                            resolve(finalGasInEther);
                        }

                    });

            } else if (config.methodName == "changeowner") {

                tokenInst.methods.transferOwnership(config.address)
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });

            } else if (config.methodName == "renounceownership") {
                tokenInst.methods.renounceOwnership()
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });

            } else if (config.methodName == "Pause") {
                tokenInst.methods.pause()
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });

            } else if (config.methodName == "UnPause") {
                tokenInst.methods.unpause()
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });

            } else if (config.methodName == "blacklistaddress") {
                tokenInst.methods.addBlackList(config.address)
                    .estimateGas({ from: config.account }, async (err, res) => {
                        if (err) {

                            reject(err);
                        } else {
                            resGasMethod = res;

                            const latestBlock = await web3.eth.getBlock('latest');
                            const blockGas = latestBlock.gasLimit;

                            const finalGas = (blockGas * resGasMethod);
                            const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');


                            resolve(finalGasInEther);
                        }

                    });

            }


        } catch (ex) {
            reject("ex");
        }

    });

}