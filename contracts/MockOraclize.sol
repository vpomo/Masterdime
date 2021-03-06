pragma solidity ^0.4.24;

contract MockOraclize {

    string public ETHUSD;

    event LogInfo(string description);
    event LogUpdate(address indexed _owner, uint indexed _balance);

    // Constructor
    constructor() public {
        emit LogUpdate(msg.sender, address(this).balance);
        ETHUSD = "462.05";
    }


    function update()
    payable
    public {
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


