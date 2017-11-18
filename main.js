$(document).ready(function () {
  let cards = [
    "images/pic-1.jpg",
    "images/pic-2.jpg",
    "images/pic-3.jpg",
    "images/pic-4.jpg",
    "images/pic-5.jpg",
    "images/pic-6.jpg",
    "images/pic-7.jpg",
    "images/pic-8.jpg"
  ];
  let canPlay = false;
  let canFlip = false;
  let counter = 0;
  let tries = 0;
  let matches = 0;
  let firstCard;
  let secondCard;
  let firstCardValue;
  let secondCardValue;
  let playBtn = `<button class = "playBtn">PLAY</button>`;
  let progressBar = `
    <div class="progressContainer">
      <div class="progressBar"> </div> 
    </div>
  `;
  let victoryGif = "https://media.giphy.com/media/3o7bukBPud08aWF5V6/giphy.gif";
  let defeatGif = "https://media.giphy.com/media/cf4SWpYddvQLm/giphy.gif";
  let facePalmGif = "https://media.giphy.com/media/ToMjGpjUl5ufFGlrk2Y/giphy.gif";

  cards.forEach(element => cards.push(element)); // expand cards array to 16

  function shuffle(array) { // Shuffle cards into different indexes
    let counter = array.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  function setCards() { // Set background styles for back part of card
    $(".back").each(function (i, obj) {
      let styles = {
          "background-image": 'url(' + cards[i] + ')',
          "background-repeat": "no-repeat",
          "background-size": "cover",
          "background-position": "bottom"
      }
      $(this).css(styles);
    });
  }

  function messageUser(message, gif) { // Create an overlay and message
    $("body").append("<div id='overlay'><div class='message'><a class='closeBtn'>&times;</a><img src='"+gif+"'/><p>"+message+"</p></div></div>");
    console.log(gif);
  }

  shuffle(cards);
  setCards();

  $(document).on('click touch', '.playBtn', function() {
    canPlay = true;
    $(this).remove();
    $("#btmContainer").append(progressBar);
    let timeLimit = 60000;
    canFlip = true;
    window.myTimer = setInterval(function() {
      counter += 1000
      let percent = counter/timeLimit * 100;
      $(".progressBar").css("width", percent +"%");
    }, 1000);
    window.timeOut = setTimeout(function () {
      messageUser("Defeat", defeatGif);
      resetGame();
    }, timeLimit + 1000);
  });

  $(document).on('click touch', '.card', function () {
    !canPlay ? messageUser("Click the play button.", facePalmGif) : null;
    let card = $(this);
    let cardValue = card.find(".back").css("background-image");
    if (canFlip && !$(this).hasClass("flipped")) {
      tries++
      card.addClass('flipped');
      if (tries % 2 != 0) { // IF FIRST TRY
        firstCard = card;
        firstCardValue = cardValue;
      } else {
        secondCard = card;
        secondCardValue = cardValue;
        canFlip = false;
        if (firstCardValue != secondCardValue) { // IF NO MATCH
          setTimeout(function () {
            firstCard.removeClass('flipped');
            secondCard.removeClass('flipped');
            canFlip = true;
          }, 1000);
        } else {
          matches++;
          canFlip = true;
          if (matches == 8) {
            setTimeout(function () {
              messageUser("Victory", victoryGif);
              resetGame();
            }, 1000);
          }
        }
      }
    }
  });

  $(document).on('click touch', '.closeBtn', function () {
    $("#overlay").remove();
  });

  function resetGame() {
    canPlay = false;
    canFlip = false;
    counter = 0;
    matches = 0;
    tries = 0;
    clearInterval(window.myTimer);
    clearTimeout(window.timeOut);
    $(".progressContainer").replaceWith(playBtn);
    $(".card").each(function (obj, i) {
      $(this).removeClass("flipped");
      $(this).find(".back").removeAttr("style");
    });
    shuffle(cards);
    setCards();
  }
});