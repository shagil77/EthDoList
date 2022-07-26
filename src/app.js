const { ethers } = require("ethers")

App = {
    loading: false,
    contracts: {},
    
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account=(await web3.eth.getAccounts())[0]
    },
  
    loadContract: async () => {
      // address of contract = 0x5FbDB2315678afecb367f032d93F642f64180aa3
      // contract ABI
      // node = http://127.0.0.1:8545/
      // function to call
      // Create a JavaScript version of the smart contract
      const contractAddress = "0x8f2BEA9e97F6e102B1F734a76921658b883cfb1C"; // Rinkeby Testnet
      const abi = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "name": "TaskCompleted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "name": "TaskCreated",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_content",
              "type": "string"
            }
          ],
          "name": "createTask",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "taskCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "tasks",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            }
          ],
          "name": "toggleCompleted",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      App.contracts.TodoList = new ethers.Contract(contractAddress, abi, signer);
      // const todoList = await $.getJSON('TodoList.sol/TodoList.json')
      // // App.contracts.TodoList = new Contract(todoList, App.account)     // rectify if any error
      // // App.contracts.TodoList.setProvider(App.web3Provider)
      // console.log(todoList)
  
      // Hydrate the smart contract with values from the blockchain
      
      App.todoList = await App.contracts.TodoList.deployed();
      console.log(App.todoList);
    },

    render : async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },
  
    // render: async () => {
    //   // Prevent double render
    //   if (App.loading) {
    //     return
    //   }
  
    //   // Update app loading state
    //   App.setLoading(true)
  
    //   // Render Account
    //   $('#account').html(App.account)
  
    //   // Render Tasks
    //   await App.renderTasks()
  
    //   // Update loading state
    //   App.setLoading(false)
    // },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain
      const taskCount = await App.todoList.taskCount() // taskCount()
      console.log(taskCount.toNumber())
      const $taskTemplate = $('.taskTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const task = await App.todoList.tasks(i)
        const taskId = task.id.toNumber()
        const taskContent = task.content
        const taskCompleted = task.completed
  
        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)
  
        // Put the task in the correct list
        if (taskCompleted) {
          $('#completedTaskList').append($newTaskTemplate)
        } else {
          $('#taskList').append($newTaskTemplate)
        }
  
        // Show the task
        $newTaskTemplate.show()
      }
    },
  
    createTask: async () => {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.todoList.createTask(content)
      
      window.location.reload()
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true)
      const taskId = e.target.name
      await App.todoList.toggleCompleted(taskId)
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })

  module.exports = {
    App
  }