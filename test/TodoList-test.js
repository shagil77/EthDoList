const { expect, assert } = require("chai");
const { artifacts } = require("hardhat");



describe("TodoList", function (accounts) {
    beforeEach(async () => {
        const TodoList = await ethers.getContractFactory("TodoList");
        const tList = await TodoList.deploy()
        this.todoList = await tList.deployed()
      });

      it('deploys successfully', async () => {
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

      it('list tasks', async () => {
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())

        assert.equal(task.content, 'Focus on your goal!')
        assert.equal(task.completed, false)
        assert.equal(taskCount, 1)
      })
  });