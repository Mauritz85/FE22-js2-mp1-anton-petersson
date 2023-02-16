const indexH1 = document.getElementById('index-h1')
const indexP = document.getElementById('index-p')
const nameInput = document.getElementById('name-input')
const beginBtn = document.getElementById('begin-btn')

let userPoint = 0
let computerPoint = 0
let winningStreak = 0
let username 
let userChoice
const storeHiscoreArray = []
let lowestHiscore

const header = document.createElement('header')
const h1User = document.createElement('h1')
const resultDisplay = document.createElement('h1')
resultDisplay.innerText = userPoint + ' - ' + computerPoint
const h1Computer = document.createElement('h1')
h1Computer.innerText = 'Dator'
const winningStreakDisplay = document.createElement('h4')
winningStreakDisplay.innerText = 'Winning streak: ' + winningStreak

const instructionDiv = document.createElement('div')
const instructionP = document.createElement('p')
instructionP.innerHTML = 'Gör ditt val av "vapen" och tryck sedan på KÖR!'


const buttonDiv = document.getElementById('button-div')
const rockBtn = document.createElement('button')
rockBtn.innerHTML = 'Sten'
const scissorBtn = document.createElement('button')
scissorBtn.innerHTML = 'Sax'
const paperBtn = document.createElement('button')
paperBtn.innerHTML = 'Påse'
const arrowP = document.createElement('p')
arrowP.innerHTML = '=>'
const goBtn = document.createElement('button')
goBtn.innerHTML = 'KÖR!'

const choiceDiv = document.getElementById('choice-div')
const userChoiceDisplay = document.createElement('img')
const verdictDisplay = document.createElement('h3')
const computerChoiceDisplay = document.createElement('img')


const rockImg = "sten.png"
const scissorImg = "sax2.jpg"
const paperImg = "pase.png"




const baseUrl = 'https://highscore-d1d01-default-rtdb.europe-west1.firebasedatabase.app/';

//Hämtar Highscore från Firebase, sorterar efter poäng och visar den på första sidan. Funktionen hämtar även lägsta highscore-poängen och namnet på det autogenerade ID:t
async function getHiscoreData() {
    const url = baseUrl + '.json/';

    const response = await fetch(url);
    const data = await response.json();
    arr = Object.values(data)

     const sortedArray = arr.sort(function(a, b ){
        return a.score - b.score
    }) 
    console.log('sorted ' + arr[1])




    //Show highscore
    const h2 = document.createElement('h2')
    document.body.append(h2)
    h2.innerHTML = 'High Score'

    for (let i = sortedArray.length - 1; i >= 0; i--) {
        const h3 = document.createElement('h3')
        document.body.append(h3)
        h3.innerHTML = sortedArray[i].name
        const h5 = document.createElement('h5')
        document.body.append(h5)
        h5.innerHTML = sortedArray[i].score


    }
    //Hitta lägsta high score och namn på ID:t
    for (let i = 0; i < arr.length; i++) {
        storeHiscoreArray.push(Object.values(data)[i].score)
    }


    lowestHiscore = Math.min(...storeHiscoreArray)
    const indexOfLowestHiscore = storeHiscoreArray.indexOf(lowestHiscore)
    lowestHiscoreObject = (Object.keys(data)[indexOfLowestHiscore])


}

getHiscoreData()

beginBtn.addEventListener('click', beginGame)

//Detta händer efter man fyllt i namn och tryckt på 'Börja!'
function beginGame(event) {
    event.preventDefault()
    document.body.innerHTML = ''
    nameInput, beginBtn, indexH1, indexP.remove()

    document.body.appendChild(header)
    h1User.innerText = nameInput.value
    username = nameInput.value
    header.append(h1User, resultDisplay, h1Computer)
    document.body.appendChild(instructionDiv)
    instructionDiv.append(instructionP, winningStreakDisplay)
    document.body.appendChild(buttonDiv)
    buttonDiv.append(rockBtn, scissorBtn, paperBtn, arrowP, goBtn)
    document.body.appendChild(choiceDiv)
}


rockBtn.addEventListener('click', assignChoice)
paperBtn.addEventListener('click', assignChoice)
scissorBtn.addEventListener('click', assignChoice)
goBtn.addEventListener('click', goFunction)


//Detta händer när man trycker på någon utav SaxPåseSten-knapparna
function assignChoice(event) {
    event.preventDefault()
    showDisplays()
    userChoiceDisplay.remove()
    computerChoiceDisplay.remove()
    verdictDisplay.remove()

    if (event.target.textContent === 'Sten') {
        userChoice = rockImg
    }
    if (event.target.textContent === 'Sax') {
        userChoice = scissorImg
    }
    if (event.target.textContent === 'Påse') {
        userChoice = paperImg
    }

    userChoiceDisplay.src = userChoice
    choiceDiv.appendChild(userChoiceDisplay)


}

//Show och hide-funktioner
function showDisplays(){
    userChoiceDisplay.style.visibility = 'visible'
    computerChoiceDisplay.style.visibility = 'visible'
    verdictDisplay.style.visibility = 'visible'

}
function hideImgDisplays() {
    userChoiceDisplay.style.visibility = 'hidden'
    computerChoiceDisplay.style.visibility = 'hidden'
}
function hideVerdictDisplay() {
    verdictDisplay.style.visibility =  'hidden'
}

//Detta händer när man trycker 'KÖR'
async function goFunction(event) {
    event.preventDefault()
    randomComputerChoice()
    getResult()
    choiceDiv.appendChild(verdictDisplay)
    choiceDiv.appendChild(computerChoiceDisplay)
    setTimeout(hideImgDisplays, 800)
    setTimeout(hideVerdictDisplay, 1200)


    setTimeout(winnerAnnouncer, 200)

}

//När någon nått 3 poäng
function winnerAnnouncer() {
    if (userPoint === 3) {
        alert("Grattis! Du var först till 3! Fortsätt samla poäng till din winning streak")
        userPoint = 0
        computerPoint = 0
        resultDisplay.innerText = userPoint + ' - ' + computerPoint
        winningStreak++
        winningStreakDisplay.innerText = 'Winning streak: ' + winningStreak
        verdictDisplay.innerHTML = ""
        userChoiceDisplay.remove()
        computerChoiceDisplay.remove()

    }

    if (computerPoint === 3) {
        if (winningStreak > lowestHiscore) {
            deleteLowestHiscore()
            const newHiScore = {
                name: username,
                score: winningStreak,
            }
            console.log(newHiScore)
            post(newHiScore)
            winningStreak = 0
            alert("Du förlorade, men grattis till ny High Score! ")
        }
        else {
            winningStreak = 0
            alert("Du förlorade, spelet startas om ")
        }
        window.location.reload();
    }
}

//random datorval av "vapen"
function randomComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3 + 1)

    if (randomNumber === 1) {
        computerChoice = rockImg
    }
    if (randomNumber === 2) {
        computerChoice = scissorImg
    }
    if (randomNumber === 3) {
        computerChoice = paperImg
    }
    computerChoiceDisplay.src = computerChoice

}

//Jämför user och datorns "vapen" med varandra och tilldela poäng
function getResult() {
    if (computerChoice === userChoice) {
        verdictDisplay.innerHTML = "Ni drog samma"

    }
    if ((computerChoice === rockImg && userChoice === paperImg) ||
        (computerChoice === paperImg && userChoice === scissorImg) ||
        (computerChoice === scissorImg && userChoice === rockImg)) {
        userPoint++
        verdictDisplay.innerHTML = "Din poäng!"
    }

    if ((computerChoice === rockImg && userChoice === scissorImg) ||
        (computerChoice === scissorImg && userChoice === paperImg) ||
        (computerChoice === scissorImg && userChoice === paperImg)) {
        computerPoint++
        verdictDisplay.innerHTML = "Datorns poäng.."
    }
    resultDisplay.innerText = userPoint + ' - ' + computerPoint


}

//Lägger till highscore-entry i databasen
async function post(obj) {

    const url = baseUrl + '.json';

    const init = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-type': "application/json; charset=UTF-8"
        }
    };

    const response = await fetch(url, init);
    const data = await response.json();
    console.log(data);
}

//Tar bort lägsta highscore-entryn
async function deleteLowestHiscore() {
    const deleteUrl = baseUrl + lowestHiscoreObject + '.json';
    const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
    const deleteData = await deleteResponse.json();
}
