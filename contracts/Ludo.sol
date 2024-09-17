// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleLudo {
    address[4] public players; 
    uint8 public currentPlayer; // Track whose turn it is (0 to 3)
    mapping(address => uint8) public playerPositions;  // Track player positions
    bool public gameStarted;  // To check if the game has started
    uint8 constant boardSize = 54;
    
    constructor() {
        currentPlayer = 0; 
        gameStarted = false;
    }


    function register() public {
        require(!gameStarted, "Game started");
        require(players.length < 4, "Max Player Reached");

        for (uint8 i = 0; i < 4; i++) {
            if (players[i] == address(0)) {
                revert("Invalid Player.");
            }
        }

        // Auto Start Game if up to 4
        if (players.length == 4) {
            gameStarted = true;
        }
    }

    function rollDice() public {
        require(gameStarted, "Game hasn't started");
        require(players[currentPlayer] == msg.sender, "Not your turn");
        
        uint8 diceRoll = random() % 6 + 1; 
        playerPositions[msg.sender] += diceRoll; 
        
        if (playerPositions[msg.sender] > boardSize) {
            playerPositions[msg.sender] = boardSize;
        }

    
        if (playerPositions[msg.sender] == boardSize) {
            gameStarted = false; 
            emit Winner(msg.sender);
        } else {
            nextTurn(); 
        }
    }

    function nextTurn() internal {
        currentPlayer = (currentPlayer + 1) % 4; 
    }

    function random() private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 256);
    }

    // Event to announce the winner
    event Winner(address winner);

    // Check the position of any player
    function getPlayerPosition(address player) public view returns (uint8) {
        return playerPositions[player];
    }
}
