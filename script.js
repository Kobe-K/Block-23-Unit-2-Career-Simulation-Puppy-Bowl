// script.js
const playerContainer = document.getElementById('all-players-container')
const newPlayerFormContainer = document.getElementById('new-player-form')


const cohortName = '2306-FTB-ET-WEB-FT'
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + 'players')
    const result = await response.json()
    return result.data.players
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err)
  }
}

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + 'players/' + playerId)
    const result = await response.json()
    return result.data.player
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err)
  }
}

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL + 'players/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    })
    const result = await response.json()
    return result.data.newPlayer
  } catch (err) {
    console.error('Oops, something went wrong with adding that player!', err)
  }
}

const removePlayer = async (playerId) => {
  try {
    await fetch(APIURL + 'players/' + playerId, {
      method: 'DELETE',
    })
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    )
  }
}

const renderAllPlayers = (playerList) => {
  try {
    let playerContainerHTML = ''
    playerList.forEach((player) => {
      playerContainerHTML += `
        <div class="player-card">
          <img src="${player.imageUrl}" alt="${player.name}">
          <h3>${player.name}</h3>
          <p>Breed: ${player.breed}</p>
          <p>Status: ${player.status}</p>
          <button onclick="viewPlayerDetails(${player.id})">See details</button>
          <button onclick="removePlayer(${player.id})">Remove from roster</button>
        </div>
      `
    })
    playerContainer.innerHTML = playerContainerHTML
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err)
  }
}

const renderNewPlayerForm = () => {
  try {
    newPlayerFormContainer.innerHTML = `
      <label for="playerName">Name:</label>
      <input type="text" id="playerName" required>
      <label for="playerBreed">Breed:</label>
      <input type="text" id="playerBreed" required>
      <label for="playerStatus">Status:</label>
      <select id="playerStatus" required>
        <option value="bench">Bench</option>
        <option value="field">Field</option>
      </select>
      <label for="playerImageUrl">Image URL:</label>
      <input type="text" id="playerImageUrl" required>
      <button onclick="addPlayer()">Add Player</button>
    `
  } catch (err) {
    console.error('Whoops, trouble rendering the new player form!', err)
  }
}

const init = async () => {
  try {
    const allPlayers = await fetchAllPlayers()
    renderAllPlayers(allPlayers)
    renderNewPlayerForm()
  } catch (err) {
    console.error('Uh oh, something went wrong during initialization!', err)
  }
}

const viewPlayerDetails = async (playerId) => {
  try {
    const player = await fetchSinglePlayer(playerId)
    // Do something with the player details, e.g., display them in a modal
    console.log(player)
  } catch (err) {
    console.error('Oops, trouble fetching player details!', err)
  }
}

const addPlayer = async () => {
  try {
    const playerNameInput = document.getElementById('playerName')
    const playerBreedInput = document.getElementById('playerBreed')
    const playerStatusInput = document.getElementById('playerStatus')
    const playerImageUrlInput = document.getElementById('playerImageUrl')

    const newPlayer = {
      name: playerNameInput.value,
      breed: playerBreedInput.value,
      status: playerStatusInput.value,
      imageUrl: playerImageUrlInput.value,
    }

    const addedPlayer = await addNewPlayer(newPlayer)
    console.log('New player added:', addedPlayer)

    // After adding the player, re-fetch all players and re-render the roster
    const updatedPlayers = await fetchAllPlayers()
    renderAllPlayers(updatedPlayers)

    // Reset the form inputs
    playerNameInput.value = ''
    playerBreedInput.value = ''
    playerStatusInput.value = 'bench'
    playerImageUrlInput.value = ''
  } catch (err) {
    console.error('Uh oh, trouble adding the player!', err)
  }
}

// Initialize the page
init()