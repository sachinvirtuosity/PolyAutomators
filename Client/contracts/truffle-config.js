// module.exports = {
//   networks: {
//     development: {
//       host: "localhost",
//       port: 8555,
//       network_id: "*", // Match any network id
//       gas: 0xfffffffffff
//     }
//   },
//   compilers: {
//     solc: {
//       settings: {
//         optimizer: {
//           enabled: true, // Default: false
//           runs: 200      // Default: 200
//         },
//       }
//     }
//   }
// };
module.exports = {
  networks: {
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
  },
  compilers: {
    solc: {
      version: '^0.8.0',
    },
  },
};
