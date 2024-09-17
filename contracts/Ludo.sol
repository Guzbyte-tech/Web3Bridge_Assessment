// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleLudo {
    uint8 public currentPlayer;
    uint8[4] public positions;
    uint256 public seed;

    uint8 constant boardSize = 52;

    constructor() {
        currentPlayer = 0; // Player 0 starts
        positions = [0, 0, 0, 0]; // All players start at position 0
    }

    function throwDice() public {
        uint8 diceRoll = randomDiceRoll();
        positions[currentPlayer] += diceRoll;

        if (positions[currentPlayer] > boardSize) {
            positions[currentPlayer] = boardSize;
        }

        currentPlayer = (currentPlayer + 1) % 4;
    }

    function randomDiceRoll() internal returns (uint8) {
        seed = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, seed))
        );
        return uint8(seed % 6) + 1;
    }

    function getPositions() public view returns (uint8[4] memory) {
        return positions;
    }

    function getCurrentPlayer() public view returns (uint8) {
        return currentPlayer;
    }
}
