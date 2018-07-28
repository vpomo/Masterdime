const MockOraclize = artifacts.require('./MockOraclize.sol');

module.exports = (deployer) => {
    deployer.deploy(MockOraclize);
};
