const eBookStore = artifacts.require("EBookStoreFinal");

module.exports = function(deployer) {
  deployer.deploy(eBookStore);
};
