let context = document.getElementById("canvas").getContext("2d")
let tilelist = Array(10).fill().map(() => Array(6).fill().map(() => ({type: 0,characters: [],danger: false, occupied: 0}))) //tilelist[x][y]
tilelist[4][2].type = 1
tilelist[4][5].type = 1
let camX = 0
let camY = -50
let images = null
let xgoal = 0
let ygoal = 0
/* TILE TYPES
    0 - Tile
    1 - Pit
*/
window.onload = function() {
    images = document.getElementById("images").children
    start()
}

//  CHARACTERS
/* CHARACTER TYPES
    0 - Player
*/

let characterList = [null]
let characterIndex = 0
let player = null
let gameOver = false
let timers = [] //ACTION SYNTAX: [frames left, function]
function charIndexIncrease() {
    characterIndex += 1
    while (characterList.length < characterIndex && characterList[characterIndex] == null) {characterIndex += 1}
    if (characterList.length <= characterIndex) {characterList.push(null)}
}
function charIndexSet(index) {
    if (characterIndex > index) {
        characterIndex = index
    }
}
class character {
    constructor(type,x,y) {
        this.x = x
        this.y = y
        tilelist[this.x][this.y].occupied = 2
        this.startX = this.x
        this.startY = this.y
        this.endX = this.x
        this.endY = this.y
        this.dying = false
        this.step = function(direction) {
            if (direction == undefined) {return}
            this.stepphase = 1
            this.stepping = this.stepTime
            characterRenderList[this.y] = characterRenderList[this.y].filter((id) => id != this.id)
            switch(direction) {
                case 0: this.endX += 1; break
                case 1: this.endX -= 1; break
                case 2: this.endY += 1; break
                case 3: this.endY -= 1; break
            }
            characterRenderList[Math.max(Math.min(this.endY,this.startY),0)].push(this.id)
        }
        this.stepFinish = function() {
            if (this.x < 0 || this.x > tilelist.length-1 || this.y < 0 || this.y > 5 || tilelist[this.x][this.y].type == 1) {
                this.kill(0)
            }
            if (this.startY < this.endY) {
                characterRenderList[this.startY] = characterRenderList[this.startY].filter((id) => id != this.id)
                characterRenderList[this.y].push(this.id)
            }
            this.startX = this.x
            this.startY = this.y
        }
        this.halfStep = function() {
            if (this.endX < 0 || this.endX > tilelist.length-1 || this.endY < 0 || this.endY > 5 || tilelist[this.endX][this.endY].occupied < 2) {
                tilelist[this.x][this.y].occupied -= 2
                tilelist[this.x][this.y].characters = tilelist[this.x][this.y].characters.filter((id) => id != this.id)
                this.x = this.endX
                this.y = this.endY
                if (this.x > -1 && this.x < tilelist.length && this.y > -1 && this.y < 6) {
                    tilelist[this.x][this.y].occupied += 2
                    tilelist[this.x][this.y].characters.push(this.id)
                }
            }
            else {
                this.startX = this.endX
                this.startY = this.endY
                this.endX = this.x
                this.endY = this.y
            }
        }
        switch(type) {
            case 0:
                //GAME VALUES
                this.stepTime = 20
                this.yOffset = 0

                this.imageIndex = 0
                this.draw = function() {
                    if (this.x > -1 && this.x < tilelist.length && this.y > -1 && this.y < 6 && tilelist[this.x][this.y].type != 1) {
                        drawRect(260+this.endX*120 - ((this.endX-this.startX)*120-(this.endY-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.endY*40,
                        25+this.endY*50-((this.endY-this.startY)*50)*(this.stepping/this.stepTime)-camY,65,
                        40,"black",0.5)
                    }
                    // x: Offset of lowest row + position on x tyles - Movement, both in x and y axis - camera offset - adjusting for board diagonalness
                    // y: Offset for the height of the image + position on y tyles + Jump curve - Movement in y axis - camera offset
                    drawImage(images[this.imageIndex], 260+this.endX*120 - ((this.endX-this.startX)*120-(this.endY-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.endY*40,
                    95+this.endY*50+(30*Math.sin(Math.PI*(this.stepping/this.stepTime)))-((this.endY-this.startY)*50)*(this.stepping/this.stepTime)-camY+this.yOffset,0.35)
                }
                this.kill = function(type) {
                    charIndexSet(this.id)
                    if (this.x < 0 || this.x > tilelist.length-1 || this.y < 0 || this.y > 5) {
                        tilelist[this.startX][this.startY].characters = tilelist[this.startX][this.startX].characters.filter((id) => id != this.id)
                    }
                    else
                    tilelist[this.x][this.y].characters = tilelist[this.x][this.y].characters.filter((id) => id != this.id)
                    switch (type) {
                        case 0:
                            this.dying = 1
                        break
                        case 1:
                            this.dying = 2
                            this.draw = function() {}
                        break
                    }
                    gameOver = true
                }
                
                this.update = function() {
                    if (this.stepping == 1) {this.stepFinish()}
                    if (this.stepping != 0) {this.stepping -= 1}
                    if (this.dying == 1) {this.yOffset -= 30}
                    else if (this.dying == 2) {}
                    else if (this.stepping == 0 && stepDir != null) {this.step(stepDir)}
                    else if (this.stepping == Math.round(this.stepTime / 2)) {this.halfStep()}
                }
                
                this.stepping = 0
                break
            case 1:
                this.stepTime = 25
                this.airTime = 10
                this.fallTime = 6
                this.cooldown = 80

                this.imageIndex = 1
                this.draw = function() {
                    switch (this.stepphase) {
                        case 3:
                            if (tilelist[this.x][this.y].type != 1) {drawRect(260+this.endX*120-camX-this.endY*40,25+this.endY*50-camY,65,40,"black",0.5)}
                            drawImage(images[this.imageIndex], 260+this.endX*120-camX-this.endY*40,
                            70+this.endY*50+(120*Math.sin(Math.PI/2))*(this.stepping/this.fallTime)-camY,4)
                        break
                        case 2:
                            if (tilelist[this.x][this.y].type != 1) {drawRect(260+this.endX*120-camX-this.endY*40,25+this.endY*50-camY,65,40,"black",0.5)}
                            drawImage(images[this.imageIndex], 260+this.endX*120-camX-this.endY*40,
                            70+this.endY*50+(120*Math.sin(Math.PI/2))-camY,4)
                        break
                        
                        case 1: 
                        if (tilelist[this.x][this.y].type != 1) {drawRect(260+this.endX*120 - ((this.endX-this.startX)*120-(this.endY-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.endY*40,
                        25+this.endY*50+-((this.endY-this.startY)*50)*(this.stepping/this.stepTime)-camY,65,
                        40,"black",0.5)}
                        drawImage(images[this.imageIndex], 260+this.endX*120 - ((this.endX-this.startX)*120-(this.endY-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.endY*40,
                        70+this.endY*50+(120*Math.sin((Math.PI/2)*(1-this.stepping/this.stepTime)))-((this.endY-this.startY)*50)*(this.stepping/this.stepTime)-camY,4)
                        break
                        case 4:
                        case 0:
                            if (tilelist[this.x][this.y].type != 1) {drawRect(260+this.endX*120-camX-this.endY*40,25+this.endY*50-camY,65,40,"black",0.5)}
                            drawImage(images[this.imageIndex], 260+this.endX*120-camX-this.endY*40,
                            70+this.endY*50-camY,4)
                        break
                    }
                    
                }
                this.stepping = 0
                this.stepphase = 0
                //STEP PHASES:  0: Standing Still   1: Jumping  2: Standing still in air    3: Smashing down    4: Cooling down
                this.update = function() {
                    if (this.stepphase == 1 && this.stepping == Math.round(this.stepTime / 2)) {this.halfStep()}
                    if (this.stepping != 0) {this.stepping -= 1}
                    else if (this.stepphase == 0 && this.stepping == 0) {
                        this.step(pathTo(player.x,player.y,this.x,this.y))
                    }
                    else if (this.stepphase == 1 && this.stepping == 0) {this.stepFinish(); this.stepphase = 2; this.stepping = this.airTime}
                    else if (this.stepphase == 2 && this.stepping == 0) {this.stepphase = 3; this.stepping = this.fallTime}
                    else if (this.stepphase == 3 && this.stepping == 0) {this.attack()}
                }
                this.step = function(direction) {
                    if (direction == undefined) {return}
                    this.stepphase = 1
                    this.stepping = this.stepTime
                    characterRenderList[this.y] = characterRenderList[this.y].filter((id) => id != this.id)
                    switch(direction) {
                        case 0: this.endX += 1; break
                        case 1: this.endX -= 1; break
                        case 2: this.endY += 1; break
                        case 3: this.endY -= 1; break
                    }
                    tilelist[this.endX][this.endY].occupied = 1
                    characterRenderList[Math.max(Math.min(this.endY,this.startY),0)].push(this.id)
                    if (this.endX > -1 && this.endX < tilelist.length && this.endY > -1 && this.endY < 6) {
                        tilelist[this.endX][this.endY].occupied = 1
                    }
                }
                this.halfStep = function() {
                    if (this.endX < 0 || this.endX > tilelist.length-1 || this.endY < 0 || this.endY > 5 || tilelist[this.endX][this.endY].occupied < 2) {
                        tilelist[this.x][this.y].occupied = 0
                        tilelist[this.x][this.y].characters = tilelist[this.x][this.y].characters.filter((id) => id != this.id)
                        this.x = this.endX
                        this.y = this.endY
                        if (this.x > -1 && this.x < tilelist.length && this.y > -1 && this.y < 6) {
                            tilelist[this.x][this.y].occupied = 2
                            tilelist[this.x][this.y].characters.push(this.id)
                        }
                    }
                    else {
                        this.startX = this.endX
                        this.startY = this.endY
                        this.endX = this.x
                        this.endY = this.y
                    }
                }
                this.attack = function() {
                    this.stepphase = 0
                    this.stepping = this.cooldown
                    tilelist[this.x][this.y].characters.forEach(id => {if (this.id != id) {characterList[id].kill(1)}})
                    if (this.startY < this.y) {
                        characterRenderList[this.startY] = characterRenderList[this.startY].filter((id) => id != this.id)
                        characterRenderList[this.y].push(this.id)
                    }
                }
            break       
        }
        this.id = characterIndex
        tilelist[this.x][this.y].characters.push(this.id)
        characterRenderList[this.y].push(this.id)
        characterList[characterIndex] = this
        charIndexIncrease()
        
    }
}
//  MATHS

//Fisher-Yates shuffle algoritmus
function FYS(array) {
    let hold
    let temp
    for (let i = array.length - 1; i > 0; i--) {
        temp = Math.floor(Math.random() * (i+1))
        hold = array[temp]
        array[temp] = array[i]
        array[i] = hold
    }
    return array
}
//  DRAW UPDATE
let characterRenderList = Array(7).fill().map(() => Array())
function drawGame() {
    //Called every game loop, responsible for drawing all graphics (No drawing should be outside of it!)
    drawRect(600,300,1200,600,"rgb(100, 130, 255)")
    drawRect(600,0-camY,1200,550,"rgb(255, 0, 0)")
    characterRenderList[6].forEach(element => {characterList[element].draw()})
    for (let ii = 5;ii > -1;ii--) {
        for (let i = 9;i > -1;i--) {
            switch(tilelist[i][ii].type) {
                case 0: drawRect(260+i*120-camX-ii*40,25+ii*50-camY,120,50,i % 2 == ii % 2 ? "rgb(255,255,255)" : "rgb(50,50,50)"); break
            }           
        }
        characterRenderList[ii].forEach(element => {characterList[element].draw()})
    }
}

//  GAME!!
function start() {
    player = new character(0, 2, 3)
    new character(1, 6, 4)
    new character(1, 6, 3)
    new character(1, 6, 2)
    context.imageSmoothingEnabled = false
    gameLoop = setInterval( function() {
        characterList.forEach(character => {
            if (character == null) {return}
            character.update()
        })
        pressedTick()
        drawGame()
        timers.forEach(timer => {
            if (timer[0] == 0) {
                if (timer[2] != undefined) {timer[1](timer[2])}
                else timer[1]()
                timers = timers.filter((id) => id != this.id)
            }
            else timer[0]--
            
        })
    },10)
}
function doit() {
    xgoal = Number(document.getElementById('x').value)
    ygoal = Number(document.getElementById('y').value)
}