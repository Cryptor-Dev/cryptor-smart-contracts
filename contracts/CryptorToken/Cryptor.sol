//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Cryptor is Ownable, ERC20Capped, ERC20Pausable, ERC20Burnable {
    constructor(uint256 cappedSupply) ERC20("Cryptor", "VICI") ERC20Capped(cappedSupply) {

    }

    function decimals() public view virtual override returns (uint8){
        return 9;
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unPause() public onlyOwner {
        _pause();
    }

    function _mint(address to, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        super._mint(to, amount);
    }
    function  _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
}