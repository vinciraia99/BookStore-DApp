const eBookStore = artifacts.require("EBookStore");

module.exports = function(deployer) {
  deployer.deploy(eBookStore);
};
