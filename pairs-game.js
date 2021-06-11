(() => {
    let firstSelectedCard = null;
    let secondSelectedCard = null;
    let openPairsNumber = 0;

    const defaultFieldSize = 4;
    let fieldDimension = defaultFieldSize;
    
    const defaultGameTime = 60;
    let timerValue = defaultGameTime;

    let timerId;   
    
    let selectedCardShowTimeout;

    const fieldSize = fieldDimension => Math.pow(fieldDimension, 2);

    function createPlayField(playField){     
        const shuffledNumbers = shuffle(generateNumbers());
             
        for (let i = 0; i < fieldSize(fieldDimension); i++) {
            const card = createCard(shuffledNumbers[i]);          
            playField.append(card);
        }                        
    }

    function createCard(number) {
        const card = document.createElement('div'); 
        card.setAttribute('value', number);

        card.addEventListener('click', () => {
            card.textContent = number;
            disableElement(card);
            clearTimeout(selectedCardShowTimeout);

            if (firstSelectedCard){
                secondSelectedCard = card;                         
                checkCardsEquals();
            } 
            else {
                firstSelectedCard = card;            
            }    
        });
        
        return card;  
    }

    function generateNumbers() {
        const numberPairs = [];

        for (let i = 1; i <= fieldSize(fieldDimension) / 2; i++) {
            numberPairs.push(i);
            numberPairs.push(i);            
        }

        return numberPairs;       
    }
   
    function shuffle(array) {
        let length = array.length, temp, randomIndex;        
        
        while (length) {        
            randomIndex = Math.floor(Math.random() * length--);            
            
            temp = array[length];
            array[length] = array[randomIndex];
            array[randomIndex] = temp;
        }
        
        return array;
    }

    function checkCardsEquals() {
        const firstCardnumber = parseInt(firstSelectedCard.getAttribute('value'));
        const secondCardnumber = parseInt(secondSelectedCard.getAttribute('value'));
        
        
        if (firstCardnumber === secondCardnumber) {
            openPairsNumber++;           

            firstSelectedCard = null;
            secondSelectedCard = null;
        } 
        else {            
            selectedCardShowTimeout = setTimeout(() => {
                enableElement(firstSelectedCard);
                enableElement(secondSelectedCard);

                firstSelectedCard.textContent = '';
                secondSelectedCard.textContent = '';

                firstSelectedCard = null;
                secondSelectedCard = null;

            }, 200);   
        }        
    }
    
    function showElement(element) {
        element.style.display = 'block';
    }

    function hideElement(element) {
        element.style.display = 'none';
    }

    function disableElement(element){
        element.setAttribute('style', 'pointer-events: none;');
    }

    function enableElement(element){
        element.removeAttribute('style');
    }     

    function getInput() {               
        return document.getElementById('cardsNumber');
    }

    function getInputValue() {                      
        return parseInt(getInput().value);
    }

    function isInputValid(inputValue) {
        return inputValue >= 2 && inputValue <= 10 && inputValue % 2 === 0;
    }
 
    function onStartGameClicked() {
        const playField = document.getElementById('playField');
        const timer = document.getElementById('timer');
        const timerSeconds = document.getElementById('seconds');          
        const restartGameButton = document.getElementById('restartGameButton');
        const cardsNumberContainer = document.getElementById('cardsNumberContainer');
        const message = document.getElementById('message');
        
        const winMessage = 'Все карты открыты!';
        const loseMessage = 'Время вышло!'; 
            
        timerSeconds.innerHTML = timerValue;   

        showElement(timer);
        hideElement(cardsNumberContainer);    

        clearInterval(timerId);            
           
        timerId = setInterval(() => {
            if (timerValue === 0) {
                clearInterval(timerId);   
                hideElement(playField);
                showElement(restartGameButton);
                message.textContent = loseMessage;
                showElement(message);
                    
            } 
            else if (timerValue > 0 && openPairsNumber === fieldSize(fieldDimension) / 2) {
                clearInterval(timerId);
                showElement(restartGameButton);
                message.textContent = winMessage;
                showElement(message);
            }
            else {
                timerSeconds.innerHTML = --timerValue;
            }
        }, 1000);                   

        const inputValue = getInputValue();

        if (isInputValid(inputValue)) {                
            fieldDimension = inputValue;   
        }

        playField.style.cssText = `
            display: grid;
            grid-template-rows: repeat(${fieldDimension}, 100px);
            grid-template-columns: repeat(${fieldDimension}, 100px);
            grid-gap: 1vw;`;

        createPlayField(playField, getInputValue());   
    }
      
    function startGame(playField) {        
        const startGameButton = document.getElementById('startGameButton');  
        const restartGameButton = document.getElementById('restartGameButton');

        startGameButton.addEventListener('click', onStartGameClicked);            

        restartGameButton.addEventListener('click', () => {             
            restartGame(playField);
        });
    }

    function restartGame() {
        const playField = document.getElementById('playField');
        const cardsNumberContainer = document.getElementById('cardsNumberContainer');
        const restartGameButton = document.getElementById('restartGameButton');
        const timer = document.getElementById('timer');
        const message = document.getElementById('message');

        hideElement(playField); 

        while (playField.firstChild) {
            playField.removeChild(playField.firstChild);
        }

        openPairsNumber = 0;
        fieldDimension = defaultFieldSize;
        timerValue = defaultGameTime;

        startGame(playField);

        showElement(cardsNumberContainer);
        hideElement(restartGameButton);
        hideElement(timer);
        hideElement(message);
    }   

    window.startGame = startGame;
})();