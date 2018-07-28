pragma solidity ^0.4.24;

contract MockOraclize {

    string public ETHUSD;

    event LogInfo(string description);
    event LogPriceUpdate(string price);
    event LogUpdate(address indexed _owner, uint indexed _balance);

    // Constructor
    constructor() public {
        emit LogUpdate(msg.sender, address(this).balance);
        ETHUSD = "485.25";
    }


    function update()
    payable
    public {
        emit LogInfo("Oraclize query was sent, standing by for the answer..");
    }

    function getRate() public pure returns (uint256 result) {
        result = 48525;
    }
}

