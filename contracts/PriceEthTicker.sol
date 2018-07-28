pragma solidity ^0.4.24;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract PriceEthTicker is usingOraclize {

    string public ETHUSD;

    event LogInfo(string description);
    event LogPriceUpdate(string price);
    event LogUpdate(address indexed _sender, uint indexed _balance);

    // Constructor
    function PriceEthTicker()
    payable
    public {
        emit LogUpdate(msg.sender, address(this).balance);
        update();
    }

    // Fallback function
    function()
    public{
        revert();
    }

    function __callback(bytes32 id, string result, bytes proof)
    public {
        ETHUSD = result;
        emit LogPriceUpdate(ETHUSD);
        update();
    }

    function getBalance()
    public
    returns (uint _balance) {
        return address(this).balance;
    }

    function update()
    payable
    public {
        oraclize_query("URL", "json(https://api.coinbase.com/v2/prices/ETH-USD/spot).data.amount");
        emit LogInfo("Oraclize query was sent, standing by for the answer..");
    }

    function getRate() public view returns (uint result) {
        result = stringToUint(ETHUSD);
    }

    function stringToUint(string _amount) internal pure returns (uint result) {
        bytes memory b = bytes(_amount);
        uint i;
        result = 0;
        bool hasDot = false;

        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);

            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }

            if(c == 46){
                hasDot = true;
                break;
            }
        }

        return result;
    }
}
