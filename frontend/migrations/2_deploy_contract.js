// eslint-disable-next-line no-undef
const HRMContract = artifacts.require('MyContract');

module.exports = function (deployer) {
  deployer.deploy(HRMContract);
};
