//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TodoList {
    uint public taskCount=0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    // run for the first time when the smart contract is deployed
    constructor() { 
        createTask("Focus on your goal!");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount]=Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    
}