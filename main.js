let controlBtns = document.querySelector(".control-buttons");
let Name = document.querySelector("#name");

// Check if the user's name is stored in local storage "For Refresh"
const storedName = localStorage.getItem("userName");
if (storedName) {
  Name.innerText = storedName;
} else {
  Name.innerText = "Guest";
}

controlBtns.addEventListener("click", function showPrompt() {
  Swal.fire({
    title: "Please Enter Your Name",
    input: "text",
    inputPlaceholder: "Enter Your Name...",
    inputValue: storedName || "", // Set the input value to the stored name
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
  })
    .then((result) => {
      if (result.isConfirmed) {
        const val = result.value;
        if (val !== "" && val !== null) {
          Name.innerText = val;
          // Welcome the user Alert
          Swal.fire({
            title: `Welcome ${val}!`,
            icon: "success",
          });
          // Save the user's name to local storage
          localStorage.setItem("userName", val);
        } else {
          Swal.fire({
            title: "Please enter a non-empty value.",
            icon: "warning",
          }).then(() => {
            showPrompt();
          });
        }
      }
      controlBtns.remove();
      // Start the timer when the game begins
      startTimer();
    }).then(() => {
      // Start Showing All Blocks After Welcome Message Then Hide All Of Them
      setTimeout(() => {
        blocksChildren.forEach((block) => {
          block.classList.add("is-flipped");
          setTimeout(() => {
            block.classList.remove("is-flipped");
          }, 1500);
        });
      }, 1500);
      // End Showing All Blocks After Welcome Message Then Hide All Of Them
    });
});

/*Note: querySelectorAll method returns a (NodeList), which is similar to an array but doesn't have a keys() method. To convert it into an array use Array.from(). */
let blocksChildren = document.querySelectorAll(".memory-game-blocks .game-block");

// Select Blocks Container
let blocksContainer = document.querySelector(".memory-game-blocks");

// Get Range Of Keys
let orderRange = Array.from(blocksChildren, (_, index) => index);

// Toggle Shuffle | the orderRange now is random
shuffle(orderRange);
console.log(orderRange);

// Add Order CSS Property To Blocks
blocksChildren.forEach((block, index) => {
  block.style.order = orderRange[index];
  // block.style.order = Math.floor(Math.random() * orderRange.length)

  // Add Click Event Listener
  block.addEventListener("click", () => {
    flipBlock(block);
  });
});

// Shuffle Function
/*
  [1] Save Current Element in Stash
  [2] Current Element = Random Element
  [3] Random Element = Get Element From Stash
*/
function shuffle(array) {
  // setting Variable
  let currentIndex = array.length,
    randomIndex;
  // looping through array
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex],array[currentIndex]];
  }
  return array;
}

// Flip Block Function
function flipBlock(selectedBlock) {
  document.getElementById("flip").play();
  // Add Class is-flipped
  selectedBlock.classList.add("is-flipped");
  // Collect All Flipped Blocks
  let allFlippedBlocks = Array.from(blocksChildren).filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
  // If There's Two Selected Blocks
  if (allFlippedBlocks.length === 2) {
    // Stop Clicking
    stopClicking();
    // Check Matched Block Function
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

let duration = 1000;

// Stop Clicking Function
function stopClicking() {
  // Add Class No Clicking To Main Container
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    // Remove Class No Clicking After The Duration
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Check Match Block Function
let tries = document.getElementById("tries");
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    setTimeout(() => {
      document.getElementById("success").play();
    }, 300);

    setTimeout(() => {
      checkForWin();
    }, duration);
  } else {
    tries.innerText = parseInt(tries.innerText) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
  }
}

const backgroundMusic = document.getElementById("background-music");
// Function to play the background music
function playBackgroundMusic() {
  backgroundMusic.play();
}

// Function to pause the background music
function pauseBackgroundMusic() {
  backgroundMusic.pause();
}
// Function to toggle the background music
function toggleBackgroundMusic() {
  const toggleButton = document.querySelector("#toggle-music img");
  if (backgroundMusic.paused) {
    playBackgroundMusic();
    toggleButton.src = "./Images/unmute.png";
  } else {
    pauseBackgroundMusic();
    toggleButton.src = "./Images/mute.png";
  }
}
// Initialize the toggle button click event handler
const toggleButton = document.getElementById("toggle-music");
toggleButton.addEventListener("click", toggleBackgroundMusic);

// Timer Function
let timer = document.getElementById("timer");
let seconds = 0;
function startTimer() {
  setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    timer.innerText = `Time: ${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
}

// Function to check if all blocks are matched
function checkForWin() {
  const matchedBlocks = document.querySelectorAll(".memory-game-blocks .has-match");

  if (blocksChildren.length === matchedBlocks.length) {
    // All blocks have been matched, play win audio
    const winSound = document.getElementById("win-sound");
    winSound.play();
    // Show a success message
    Swal.fire({
      title: `Congratulations ${Name.innerText}!`,
      text: "You have completed the Memory Game!",
      icon: "success",
    });

    // Reset the game after a delay (e.g., 3 seconds)
    setTimeout(() => {
      resetGame();
    }, 4000);
  }
}

// Function to reset the game
function resetGame() {
  // Remove the "has-match" class from all blocks
  blocksChildren.forEach((block) => {
    block.classList.remove("has-match");
  });

  // Shuffle and reset the order of blocks
  shuffle(orderRange);

  // Reset tries
  tries.innerText = "0";

  // Reset timer
  seconds = 0;
  timer.innerText = "Time: 00:00";
}
