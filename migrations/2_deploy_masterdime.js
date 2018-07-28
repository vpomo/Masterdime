const MasterdimeCrowdsale = artifacts.require('./MasterdimeCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =  "0x9e1E1F39aA43bd6ea6FAA8717F289daB81c04eC0";
    deployer.deploy(MasterdimeCrowdsale, owner);
};
