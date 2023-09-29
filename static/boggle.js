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

async function checkWord(evt) {
  evt.preventDefault(); // prevent page refresh

  const response = await fetch("/api/score-word", {
    method: "POST",
    body: JSON.stringify({ game_id: gameId, word: $wordInput.val().toUpperCase() }),
    headers: { "Content-Type": "application/json" }
  });

  const _data = await response.json();

  $wordInput.val("");
}

$form.on("submit", checkWord);

start();