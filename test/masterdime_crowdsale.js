var MasterdimeCrowdsale = artifacts.require("./MasterdimeCrowdsale.sol");
var MockOraclize = artifacts.require("./MockOraclize.sol");
var contractMockOraclize;

contract('MockOraclize', (accounts) => {
    it('should deployed contract MockOraclize', async ()  => {
        assert.equal(undefined, contractMockOraclize);
        contractMockOraclize = await MockOraclize.deployed();
        assert.notEqual(undefined, contractMockOraclize);
    });

    it('get address contract MockOraclize', async ()  => {
        assert.notEqual(undefined, contractMockOraclize.address);
        var rate = await contractMockOraclize.getRate();
        //console.log("rate = " + rate);
    });
});

contract('MasterdimeCrowdsale', (accounts) => {
    var contract;
    //var owner = "0x6d2Faf6A5706bCC104E9C001f0Af585c11F72437";
    var owner = accounts[0];
    var rate = 9240;
    var buyWei = 1 * 10**18;
    var rateNew = 9240;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**16;

    var period = 0;

    var fundForSale = Number(325 * 10**24);
    var tokenAllocated = Number(175 * 10**24);


it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await MasterdimeCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
        await contract.setOraclizeContract(contractMockOraclize.address, {from:accounts[0]});
        await contract.updatePrice({from:accounts[0]});
    });


    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        assert.equal(fundForSale, balanceOwner);
    });

    it('verification of receiving Ether', async ()  => {
        await contract.addToWhitelist(accounts[2], {from:accounts[0]});
        await contract.addToWhitelist(accounts[3], {from:accounts[0]});
        var isWhiteList = await contract.whitelist.call(accounts[2]);
        assert.equal(true, isWhiteList);

        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + Number(numberToken/10**18));

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);

        assert.isTrue(Number(tokenAllocatedBefore) < Number(tokenAllocatedAfter));
        //assert.equal(rate*buyWei, tokenAllocatedAfter - tokenAllocatedBefore);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.deposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);
    });

    it('verification define ICO period', async ()  => {
        currentDate = 1534766400; // Aug, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1537444800; // Sep, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(1, period);

        currentDate = 1542715200; // Nov, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);
    });

    it('check vesting period', async ()  => {
        var currentDate = 1550664000; // Feb, 20, 2019
        var vestingPeriod = await contract.checkVesting(buyWeiMin, currentDate);
        assert.equal(0, vestingPeriod);

        var currentDate = 1566302400; // Aug, 20, 2019
        var vestingPeriod = await contract.checkVesting(buyWeiMin, currentDate);
        assert.equal(1, vestingPeriod);

        var currentDate = 1582200000; // Feb, 20, 2020
        var vestingPeriod = await contract.checkVesting(buyWeiMin, currentDate);
        assert.equal(2, vestingPeriod);
    });

    it('verification tokens cap reached', async ()  => {
            var tokenAllocated = await contract.tokenAllocated.call();
            //console.log("tokenAllocated = " + Number(tokenAllocated/1e18));
            var numberTokensNormal = await contract.validPurchaseTokens.call(buyWei);
            //console.log("numberTokensNormal = " + numberTokensNormal);
            assert.equal(rate*buyWei, numberTokensNormal);
    });
});



