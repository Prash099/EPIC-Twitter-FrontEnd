import React, {useState} from "react";
import {ethers} from 'ethers';
import EpicApp from './artifacts/contracts/EpicApp.sol/EpicApp.json';

const epicappAddress = process.env.REACT_APP_PRIVATE_KEY

function App() {

  const [tweet, setTweetValue] = useState()  
  
  async function getAllTweets() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(epicappAddress, EpicApp.abi, provider)
      try {
        var data = [];
        const tweets = await contract.getAllTweets()

        data.push(tweets)

        console.log('data: ', data[0].length)
        setTweetValue(data[0])
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }


  async function editTweets(i,msg) {
    let text = prompt("Please enter your txt:", msg);
  if (!text) {
    alert("no change")
  } else {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(epicappAddress, EpicApp.abi, signer)
      try {
 
        const tweets = await contract.updateTweet(i,text)
        console.log(tweets)
      } catch (err) {
        alert("You are not allowed to Edit Other Tweets")
        console.log('Error: ', err)
      }
    }
  } 
  }


  async function deleteTweets(i) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(epicappAddress, EpicApp.abi, signer)
      try {
        const tweets = await contract.deleteTweet(i)
        console.log(tweets)      
      } catch (err) {
        alert("You are not allowed to Delete Other Tweets")
        console.log('Error: ', err)
      }
    }
  }


  async function AddTweet(value) {
    if (!value) return;
    if (!typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(epicappAddress, EpicApp.abi, signer)
      const transaction = await contract.createTweet(value)
      await transaction.wait()
      getAllTweets()
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(event.target.Tweet.value);
    await AddTweet(event.target.Tweet.value);
    setTweetValue(event.target.Tweet.value);
    event.target.Tweet.value = ""
    refreshPage();
  }

  function refreshPage() {
    window.location.reload(false);
  }
  
  return (
    <div className="w-full max-w-lg container">
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
          <div className="text-gray-600 font-bold text-lg mb-2">
            EPIC Twitter Dapp
          </div>
          <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
            <div className="text-gray-600 font-bold text-md mb-2">
              Fetch Tweets From Smart Contract
            </div>
            <div className="flex">
              <button className="bg-blue-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded" onClick={getAllTweets}>Get Tweets</button>
            </div>
          </div>      <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
            <div className="text-gray-600 font-bold text-md mb-2">
              Add Your Tweets Here
            </div>
            <form 
              className="flex items-center justify-between"
              onSubmit={event=>handleSubmit(event)}
              >
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                name="Tweet"/>
              <button className="bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">Add Tweets</button>
            </form>
          </div>
          <div className="w-full border-4 p-2 mb-4 rounded border-gray-400 bg-gray-100">
            <div className="text-gray-600 font-bold text-md mb-2">
              Tweets
            </div>
            <p>
              <ul>
                {tweet &&  console.log(tweet)}
                {tweet && tweet.map((d,i) => (<li style={{color: "Black", paddingTop: "10px", textShadow: "0px 1px 1px"}} 
                className="tweet" key={i}>{d[0]}
                <p></p>
                <p>Author :  {d[1]}</p>
                <button style={{background:"yellow", margin: "auto", position: "relative", left: "10px"}} onClick={()=>editTweets(i,d[0])}>Edit</button>
                <button style={{background:"orange", margin: "auto", position: "relative", left: "20px"}} onClick={()=>deleteTweets(i)}>Delete</button></li>))}
              </ul>
            </p>
          </div>
        </div>
      </div>
  );
}

export default App;