import './style.css'

document.addEventListener("DOMContentLoaded", () => {
  var grid = [];
  let row = 0, col = 0, enteredWord = "";
  let isCorrect = false;
  // loading the 2d array with grid child nodes
  const gridItems = document.querySelector(".grid-container").childNodes;
  let index = 1;
  for (let i = 0; i < 6; i++) {
    grid[i] = [];
    for (let j = 0; j < 5; j++, index += 2) {
      grid[i][j] = gridItems[index];
      // console.log(grid[i][j]);
    }
  }

  // storing the occurrences of each character of the word to be guessed
  let wordToBeGuessed, wordDetails;
  let randomWord = async () => {
    // let word ="";
    try {
      const result = await fetch('https://random-word-api.vercel.app/api?words=1&length=5')
        .then((response) => response.json())
        .then((obj) => {
          // word = obj[0];
          wordToBeGuessed=obj[0].toUpperCase();
          // console.log(wordToBeGuessed);
          // console.log(word);
        });
        // return word;
      // console.log(result.json());
      // wordToBeGuessed=result.toUpperCase();
    } catch (error) {
      console.log('There was an error', error);
    }
  };
  // window.onload = async function () {
  //   wordToBeGuessed = await randomWord();
  //   console.log(wordToBeGuessed);
  // };
  // wordToBeGuessed = randomWord().then(value=>console.log(value));
  randomWord();
  // console.log(wordToBeGuessed);
  let algorithm = (enteredWord, wordToBeGuessed, row) => {
    // console.log(enteredWord + " " + wordToBeGuessed +" "+row);
    if (enteredWord === wordToBeGuessed) {
      for (let x = 0; x < 5; x++) {
        // grid[row][x].style.backgroundColor = 'green';
        grid[row][x].style.boxShadow = "0px 0px 10px 4px #39FF14 inset";
        grid[row][x].style.border = "#39FF14";
      }
      return true;
    }
    else {
      // store occurrences of each character in a map named 'occurrences'
      let occurrences = new Map();
      for (let i = 0; i < wordToBeGuessed.length; i++) {
        // console.log(wordToBeGuessed[i]);
        occurrences.set(wordToBeGuessed[i], occurrences.get(wordToBeGuessed[i]) + 1 || 1);
      }
      // create an array to map index with character of entered word
      const indexes = wordToBeGuessed.split('');

      // turn the tiles green of those characters that are at its right position
      for (let i = 0; i < enteredWord.length; i++) {
        if (occurrences.has(enteredWord[i])) {
          if (enteredWord[i] === indexes[i]) {
            grid[row][i].style.boxShadow = "0px 0px 10px 4px #39FF14 inset";
            grid[row][i].style.border = "#39FF14";
            occurrences.set(enteredWord[i], occurrences.get(enteredWord[i]) - 1);
            indexes[i] = '-1'; // marked so that this index is not evaluated in the below loop
          }
        }
      }
      for (let i = 0; i < enteredWord.length; i++) {
        // skip the indexes that are marked
        if (indexes[i] !== '-1') {
          if (occurrences.has(enteredWord[i])) {
            // check if occurrence is greater than 0
            if (occurrences.get(enteredWord[i]) > 0) {
              // since at same index is checked before this loop, therefore it must be present at wrong index, that is why changing the tile color to yellow
              grid[row][i].style.boxShadow = "0px 0px 10px 4px #FFFF00 inset";
              grid[row][i].style.border = "#FFFF00";
              occurrences.set(enteredWord[i], occurrences.get(enteredWord[i]) - 1);
            }
            else {
              grid[row][i].style.boxShadow = "0px 0px 10px 5px #D5D6D7 inset";
              grid[row][i].style.border = "#D5D6D7";
            }
          }
          else {
            grid[row][i].style.boxShadow = "0px 0px 10px 5px #D5D6D7 inset";
            grid[row][i].style.border = "#D5D6D7";
          }
        }
      }
      /* 1st step - direct compare the 2 strings, if equal word guessed else
        - iterate the enteredword character by character
        - check if key is present or not, if not grey out the character
          else check if occurrence is > 0 
            if > 0, check if at same index
              if at same index, turn tile green and reduce the occurence by 1
              else turn tile yellow
            else if occ =0, turn tile grey
      */
      occurrences.forEach((value, key) => {
        console.log(`${key} = ${value}`);
      });
    }
    return false;
  };

  let isValid = async (enteredWord) => {
    console.log(wordToBeGuessed);
    try {
      const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord}`);
      if (result.ok){
        wordDetails = result.json();
        return true;
      } 
      else return false;
    } catch (error) {
      console.log('There was an error', error);
    }
    // return true;
  };

  document.addEventListener("keydown", async (e) => {
    const isAlphabet = /^[a-zA-Z]$/.test(e.key);
    if (isCorrect === false && row != 6) {
      if (isAlphabet && row < 6) {
        if (col < 5) {
          grid[row][col].textContent = e.key.toUpperCase();
          enteredWord += grid[row][col].textContent;
          col++;
        }
        else {
          console.log("5 characters already typed");
        }
      }
      else if (row < 6) {
        if (e.key === 'Backspace' && col > 0) {
          console.log("BACKSPACE PRESSED");
          grid[row][--col].textContent = "";
          enteredWord = enteredWord.slice(0, -1);
        }
        else if (e.key === 'Backspace' && col == 0) {
          console.log("NOTHING TO ERASE");
        }
        else if (e.key === 'Enter' && col == 5) {
          console.log("Enter key pressed and word checked if valid or not");
          let valid = await isValid(enteredWord);
          if (valid) {
            console.log("VALID");
            let res = algorithm(enteredWord, wordToBeGuessed, row);
            if (res) {
              isCorrect = true;
              if (e.key === 'Enter') {
                e.preventDefault();
              }
              result(isCorrect);
            }
            row++; col = 0;
            enteredWord = "";
          }
          else console.log("INVALID WORD");
          if (isCorrect === false && row === 6) {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
            result(isCorrect);
          }
        }
        else if (e.key === 'Enter' && col != 5) {
          console.log("ENTER KEY VALID 5 CHARACTERS");
        }
        else {
          console.log("INVALID KEY PRESSED");
        }
      }
    }

    // console.log(enteredWord);
  });



  let result = (isCorrect) => {
    const heading = document.querySelector(".result-modal .result-heading");
    const correctWord = document.querySelector(".result-modal .correctWord")
    const result_modal = document.querySelector('.result-modal');
    // isValid(wordToBeGuessed);
    // console.log(wordDetails.then().then());
    if (isCorrect === false) {
      heading.textContent = "BETTER LUCK NEXT TIME!";
      correctWord.textContent = "The correct word was "+wordToBeGuessed;
    }
    else {
      heading.textContent = "SPLENDID!";
    }

    result_modal.showModal();
    const playAgainBtn = document.querySelector('.playAgain');
    playAgainBtn.addEventListener("click", () => {
      window.location.reload();
    });

  };
});

// result_modal.addEventListener("keydown", (e)=>{
//   if(e.key==='Enter'){
//     e.preventDefault();
//   }
// });