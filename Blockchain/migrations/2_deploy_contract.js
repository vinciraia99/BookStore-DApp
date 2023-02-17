const ES = artifacts.require("EBookStoreToken");

module.exports = function(deployer) {
  deployer.deploy(ES, "EbookToken","ET");
};
