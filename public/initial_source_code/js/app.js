// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var isProcessing = false;
var startTime = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 5;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');

var recurringUser = false;
var userName = localStorage.getItem('userName');
var bestCompletionTime = parseFloat(localStorage.getItem('score')) || null;

if (bestCompletionTime) {
  document.querySelector('#best-time').textContent = bestCompletionTime;  
}

if (!userName) {
  userName = promptForUserName();
  localStorage.setItem('userName', userName);
} else {
  recurringUser = true;
}

setWelcomeMessage(userName, recurringUser);
resetBoard();


// This function is called whenever the user click a card
function cardClicked(elCard) {
  // in milliseconds
  if (!startTime) startTime = Date.now();
  
  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains('flipped') || isProcessing) {
      return;
  }

  // Flip it
  elCard.classList.add('flipped');

  // This is a first card, only keep it in the global variable
  if (elPreviousCard === null) {
    elPreviousCard = elCard; 
  } else {
    // get the data-card attribute's value from both cards
    var card1 = elPreviousCard.getAttribute('data-card');
    var card2 = elCard.getAttribute('data-card');

    // No match, schedule to flip them back in 1 second
    if (card1 !== card2){
      isProcessing = true;
      setTimeout(function () {
          elCard.classList.remove('flipped');
          elPreviousCard.classList.remove('flipped');
          elPreviousCard = null;
          isProcessing = false;
      }, 1000)
    } else {
      // Yes! a match!
      flippedCouplesCount++;
      elPreviousCard = null;

      // All cards flipped!
      if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
        flippedCouplesCount = 0
        audioWin.play();
        
        var completionTime = ((Date.now() - startTime) / 1000);
        startTime = null;

        if (!bestCompletionTime || (completionTime < bestCompletionTime)) {
          bestCompletionTime = completionTime;
          localStorage.setItem('score', bestCompletionTime);          
          document.querySelector('#best-time').textContent = bestCompletionTime;          
        }
        toggleVisibility('.btn-playagain');
      }
    }
  }
}

// create range starting from 1
function range(a, b) {
  while(a--) b[a] = a + 1;
  return b
}

function resetBoard() {
  var currentCards = document.querySelectorAll('.board .card');
  if(currentCards.length) {
    currentCards.forEach(function(card) {
      card.parentNode.removeChild(card);
    })
  }
  var arr = range(TOTAL_COUPLES_COUNT,[]);
  var randomCardNumbers = [].concat(arr, arr).sort(function() {
    return .5 - Math.random();
  });
  
  var template = document.querySelector('#card-template')
  var cards = document.querySelector('.board')
  
  for(var i=0;i<randomCardNumbers.length;i++) {
    var content = document.importNode(template.content, true);
    content.querySelectorAll('img')[0].setAttribute('src', 'img/cards/' + randomCardNumbers[i] +  '.png');
    content.querySelector('.card').setAttribute('data-card', randomCardNumbers[i])
    cards.appendChild(content);
  }  
}

function promptForUserName() {
  var userName = '';
  do {
    userName = prompt('What is your name?');
    if (userName === null) return null;
  } while(!userName.trim());
  return userName;
}

function notYou() {
  var userName = promptForUserName();
  if (userName) {
    localStorage.setItem('userName', userName);
    localStorage.removeItem('score');    
    setWelcomeMessage(userName, false);
    document.querySelector('#best-time').textContent = '';
  }
}

function setWelcomeMessage(userName, recurringUser) {
  var welcomeMessage = "Welcome " + ((recurringUser) ? "back " : "") + userName + '!';
  document.querySelector('#welcome-message').textContent = welcomeMessage;  
}

function toggleVisibility(selector) {
  var e = document.querySelector(selector);
  if(e.style.display == 'block')
     e.style.display = 'none';
  else
     e.style.display = 'block';
}
