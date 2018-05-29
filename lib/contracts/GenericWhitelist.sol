pragma solidity ^0.4.17;

contract MockTokenSale {

    mapping(address => uint8) public whitelist;

    event WhitelistUpdated(address indexed _account, uint8 _phase);


    function MockTokenSale() public {}

    function updateWhitelist(address _account, uint8 _phase) external returns (bool) {
        require(_account != address(0));

        whitelist[_account] = _phase;

        WhitelistUpdated(_account, _phase);

        return true;
    }
}
