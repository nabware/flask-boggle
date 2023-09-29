"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

let gameId;


/** Start */

async function start() {
  const response = await fetch(`/api/new-game`, {
    method: "POST",
  });
  const gameData = await response.json();
  gameId = gameData.game_id;
  let board = gameData.board;

  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  $table.empty();
  // loop over board and create the DOM tr/td structure

  for (const row of board) {
    const $row = $("<tr>").appendTo($table);

    for (const letter of row) {
      $("<td>").text(letter).appendTo($row);
    }
  }
}

/**
 * Gets user inputted word, scores the word, and displays
 * the word or error message
 */

async function handleWordSubmit(evt) {
  evt.preventDefault(); // prevent page refresh
  const word = $wordInput.val();
  $wordInput.val("");

  const { result } = await scoreWord(gameId, word)
  displayScoredWord(result, word)
}

/**
 * Takes gameID and word, communicates with API to validate word
 * returns response of Ok if word is valid or appropriate error if not
 */
async function scoreWord(gameId, word){
  const response = await fetch("/api/score-word", {
    method: "POST",
    body: JSON.stringify({ game_id: gameId, word: word.toUpperCase() }),
    headers: { "Content-Type": "application/json" }
  });

  return await response.json();
}

/** Takes result of API call and word,
 * displays result in DOM
 */
function displayScoredWord(result, word){

  if (result === "ok") {
    $("<li>").text(word).appendTo($playedWords);
  } else if (result === "not-word") {
    $message.text(`${word} is not a valid word!`);
  } else {
    $message.text(`${word} is not on the board!`);
  }

}

$form.on("submit", handleWordSubmit);

start();