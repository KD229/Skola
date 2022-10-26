let temp = undefined
playerList = []
controls = [["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],["w","s","a","d"],["u","j","h","k"],["8","2","4","6"]]
menu = document.getElementById("menu")
colors = ["red","blue","green","purple"]
magyarSzinek = ["piros","kék","zöld","lila"]
gameSpeeds = [200,175,120]
function controller(e) {
        if (playerList.length != 0) {
            for (let i = 0; i<playerList.length; i++) {switch (true) {
                case playerList[i].controls[0] == e.key && playerList[i].ydBad != 1  : [playerList[i].xd, playerList[i].yd] = [ 0,-1]; break
                case playerList[i].controls[1] == e.key && playerList[i].ydBad != -1 : [playerList[i].xd, playerList[i].yd] = [ 0, 1]; break
                case playerList[i].controls[2] == e.key && playerList[i].xdBad != 1  : [playerList[i].xd, playerList[i].yd] = [-1, 0]; break
                case playerList[i].controls[3] == e.key && playerList[i].xdBad != -1 : [playerList[i].xd, playerList[i].yd] = [ 1, 0]; break
            }
        }
    }
}
class settings {
    constructor(value) {
        this.value = value
    }
    set = function(button) {
        button.parentElement.children[this.value].classList.remove("selected");
        button.classList.add("selected");
        this.value = Array.prototype.indexOf.call(button.parentElement.children, button)
    }
}
class player {
    constructor(start,controls,color) {
        this.x = Math.round(start[0])
        this.y = Math.round(start[1])
        this.xd = 0
        this.yd = 0
        this.color = color
        this.snakeBody = [[this.y,this.x]]
        this.controls = controls
        this.exploding = false
        this.ate = false
        this.frozen = false
        this.xdBad = 0
        this.ydBad = 0
        this.score = 0
        this.defeated = false
        table[this.y][this.x] = 1
    }
    start = function(xd,yd) {
        this.xd = xd
        this.yd = yd
        to.children[this.y].children[this.x].style.backgroundColor = this.color
    }
    step = function() {
        if (this.exploding) {
            if (this.snakeBody.length == 1 && this.explodeStage == 1) {
                to.children[this.snakeBody[0][0]].children[this.snakeBody[0][1]].style.backgroundColor = "yellow"
                this.explodeStage = 2
            }
            else if (this.snakeBody.length == 1 && this.explodeStage == 2) {
                to.children[this.snakeBody[0][0]].children[this.snakeBody[0][1]].style.backgroundColor = null
                table[this.snakeBody[0][0]][this.snakeBody[0][1]] = 0
                this.snakeBody.shift()
                this.exploding = false
                playersDying -= 1
            }
            else if (this.snakeBody.length == 2 && this.explodeStage == 2) {
                to.children[this.snakeBody[1][0]].children[this.snakeBody[1][1]].style.backgroundColor = "yellow"
                to.children[this.snakeBody[0][0]].children[this.snakeBody[0][1]].style.backgroundColor = null
                table[this.snakeBody[0][0]][this.snakeBody[0][1]] = 0
                this.snakeBody.shift()
            }
            else if (this.explodeStage == 2) {
                to.children[this.snakeBody[2][0]].children[this.snakeBody[2][1]].style.backgroundColor = "orange"
                to.children[this.snakeBody[1][0]].children[this.snakeBody[1][1]].style.backgroundColor = "yellow"
                to.children[this.snakeBody[0][0]].children[this.snakeBody[0][1]].style.backgroundColor = null
                table[this.snakeBody[0][0]][this.snakeBody[0][1]] = 0
                this.snakeBody.shift()
            }
            else if (this.explodeStage == 1) {
                to.children[this.snakeBody[1][0]].children[this.snakeBody[1][1]].style.backgroundColor = "orange"
                to.children[this.snakeBody[0][0]].children[this.snakeBody[0][1]].style.backgroundColor = "yellow"
                this.explodeStage = 2
            }
            else if (this.explodeStage == 0) {
                to.children[this.snakeBody[0][0]].children[this.snakeBody[0][1]].style.backgroundColor = "orange"
                this.explodeStage = 1
            }
        }
        else if (this.frozen == false && (this.xd != 0 || this.yd != 0)) {
            this.x += this.xd, this.y += this.yd
            this.xdBad = this.xd
            this.ydBad = this.yd
            if ((this.x > n-1 || this.y > m-1 || this.x < 0 || this.y < 0) == false) {
                if (table[this.y][this.x] == 2) {
                    this.ate = true
                    foodRoll(0)
                    table[this.y][this.x] = 0
                }
                if (this.ate == true) {
                    this.ate = false
                }
                else {
                    temp = this.snakeBody.pop()
                    table[temp[0]][temp[1]] = 0
                    to.children[temp[0]].children[temp[1]].style.backgroundColor = null
                }
            }
        }
    }
    check = function() {
        if (this.frozen || (this.xd == 0 && this.yd == 0)) return
        if (this.x > n-1 || this.y > m-1 || this.x < 0 || this.y < 0 || (table[this.y][this.x] == 1)) {
            this.defeat()
        }
        else {
            table[this.y][this.x] = 1
            to.children[this.y].children[this.x].style.backgroundColor = this.color
            this.snakeBody.unshift([this.y,this.x])
        }
    }
    defeat = function() {
        this.defeated = true
        this.frozen = true
        console.log("defeated!")
        this.explodeStage = 0
        playersAlive -= 1
        playersDying += 1
        this.exploding = true
    }
}
let playerNumConf = new settings(0)
let foodNumConf = new settings(0)
let speedConf = new settings(1)
document.getElementById('playerNumConf').children[playerNumConf.value].classList.add("selected")
document.getElementById('speedConf').children[speedConf.value].classList.add("selected")
document.getElementById('foodNumConf').children[foodNumConf.value].classList.add("selected")
function gameStart() {
    n = parseInt(document.getElementById("width").value)
    m = parseInt(document.getElementById("height").value)
    if (isNaN(m)||isNaN(n)) 
    {
        document.getElementById('confError').innerHTML = "Adjon meg egy számot a pálya szélességének és hosszának!"
        return
    }
    if (m<5||n<5) 
    {
        document.getElementById('confError').innerHTML = "A pálya szélességének és hosszának legalább 5-nek kell lennie!"
        return
    }
    //Settings are valid
    startLocations = [[n/5-1,m/5-1],[n-n/5,m-m/5],[n/5-1,m-m/5],[n-n/5,m/5-1]]
    document.getElementById('confError').innerHTML = ""
    menu.style.display = "none"
    table = Array(m).fill().map(() => Array(n).fill())
    playerList = Array(playerNumConf+1)
    for (let i = 0; i <= playerNumConf.value; i++)  playerList[i] = new player(startLocations[i],controls[i],colors[i])
    to = document.getElementById('t'), to.innerHTML = `
    <table>${Array(m).fill(`
        <tr>
        ${Array(n).fill(`<td/>`).join('')}
        </tr>`).join('')}
    </table>`
    to = to.children[0].children[0]
    playerList.forEach(element => {
        element.start(0,0)
    })
    console.log(typeof(playerNumConf))
    playersAlive = playerNumConf.value+1
    playersDying = 0
    foodRoll(foodNumConf.value)
    iv = setInterval(() => {
        playerList.forEach(element => {
            element.step()
        })
        playerList.forEach(element => {
            element.check()
        })
        if (playersAlive <= 1 && playerNumConf.value != 0) {
            playerList.forEach(element => {
                element.frozen = true
            })
        }
        console.log("Alive: "+playersAlive+" Dying: "+playersDying)
        if (playersAlive == 1 && playersDying == 0 && playerNumConf.value != 0) {
            clearInterval(iv)
            endGame()
        }
        if (playersAlive == 0 && playersDying == 0) {
            clearInterval(iv)
            endGame()
        }
    },gameSpeeds[speedConf.value])
}
function endGame() {
    if (playersAlive = 0) alert("Döntetlen")
    else {
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].defeated = false) alert(magyarSzinek[i]+" nyert!")
        }
    }
}
function foodRoll(amounth) {
    for (let i = 0; i <= amounth; i++) {
        for (let ii = 0; ii <= 300; ii++) {
            ranY = Math.floor(Math.random() * (m))
            ranX = Math.floor(Math.random() * (n))
            if (ii == 300) {table[ranY][ranX] = 2; to.children[ranY].children[ranX].style.backgroundColor = "yellow"}
            else if (table[ranY][ranX] == 0) {table[ranY][ranX] = 2; to.children[ranY].children[ranX].style.backgroundColor = "yellow"; break}
        }
    }
}