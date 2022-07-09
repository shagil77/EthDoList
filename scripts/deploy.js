async function main() {
    // We get the contract to deploy
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
  
    await todoList.deployed();

    const task = await todoList.tasks(1);
  
    console.log("TodoList deployed to:", todoList.address);
    console.log(task.content);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });