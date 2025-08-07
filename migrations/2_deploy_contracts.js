const ElectionSystem = artifacts.require("ElectionSystem");

module.exports = function (deployer) {
  deployer.deploy(ElectionSystem);
};
