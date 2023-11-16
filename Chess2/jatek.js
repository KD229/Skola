let context = document.getElementById("canvas").getContext("2d")
let tilelist = Array(10).fill().map(() => Array(6).fill().map(() => ({type: 0,characters: [],danger: false}))) //tilelist[x][y]
let camX = 0
let camY = 0
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
        this.kill = function() {
            charIndexSet(this.id)
            tilelist[this.x][this.y].characters = tilelist[this.x][this.y].characters.filter((id) => id != this.id)
        }
        switch(type) {
            case 0:
                //GAME VALUES
                this.stepTime = 20

                this.x = x
                this.y = y
                this.startX = this.x
                this.startY = this.y

                this.imageIndex = 0
                this.draw = function() {
                    drawRect(260+this.x*120 - ((this.x-this.startX)*120-(this.y-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.y*40,
                    25+this.y*50-((this.y-this.startY)*50)*(this.stepping/this.stepTime)-camY,65,
                    40,"black",0.5)
                    // x: Offset of lowest row + position on x tyles - Movement, both in x and y axis - camera offset - adjusting for board diagonalness
                    // y: Offset for the height of the image + position on y tyles + Jump curve - Movement in y axis - camera offset
                    drawImage(images[this.imageIndex], 260+this.x*120 - ((this.x-this.startX)*120-(this.y-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.y*40,
                    95+this.y*50+(30*Math.sin(Math.PI*(this.stepping/this.stepTime)))-((this.y-this.startY)*50)*(this.stepping/this.stepTime)-camY,0.35)
                }

                this.stepping = 0
                this.update = function() {
                    if (this.stepping != 0) {this.stepping -= 1}
                    if (this.stepping == 0 && stepDir != null) {this.step(stepDir)}
                    if (this.stepping == Math.round(this.steptime / 2)) {console.log("ZOINKS")}
                    if (this.stepping == 0) {this.stepFinish()}
                    //if (this.stepping == 0) {this.step(pathTo(xgoal,ygoal,this.x,this.y))}
                }
                this.step = function(direction) {
                    if (direction == undefined) {return}
                    this.stepping = this.stepTime
                    tilelist[this.x][this.y].characters = tilelist[this.x][this.y].characters.filter((id) => id != this.id)
                    characterRenderList[this.y] = characterRenderList[this.y].filter((id) => id != this.id)
                    this.startX = this.x
                    this.startY = this.y
                    switch(direction) {
                        case 0: this.x += 1; break
                        case 1: this.x -= 1; break
                        case 2: this.y += 1; break
                        case 3: this.y -= 1; break
                    }
                    tilelist[this.x][this.y].characters.push(this.id)
                    characterRenderList[Math.min(this.y,this.startY)].push(this.id)
                }
                this.stepFinish = function() {
                    if (this.startY < this.y) {
                        characterRenderList[this.startY] = characterRenderList[this.startY].filter((id) => id != this.id)
                        characterRenderList[this.y].push(this.id)
                    }
                }
                break
            case 1:
                this.steptime = 30
                this.airtime = 50
                this.falltime = 4
                this.cooldown = 20

                this.x = x
                this.y = y

                this.imageIndex = 1
                this.draw = function() {
                    switch (this.stepphase) {
                        case 3: 
                            drawRect(260+this.x*120-camX-this.y*40,25+this.y*50-camY,65,40,"black",0.5)
                            drawImage(images[this.imageIndex], 260+this.x*120-camX-this.y*40,
                            95+this.y*50+(60*Math.sin(Math.PI/2))*(1-this.stepping/this.stepTime)-camY,1)
                        break
                        case 2:
                            drawRect(260+this.x*120-camX-this.y*40,25+this.y*50-camY,65,40,"black",0.5)
                            drawImage(images[this.imageIndex], 260+this.x*120-camX-this.y*40,
                            95+this.y*50+(60*Math.sin(Math.PI/2))-camY,1)
                        break
                        
                        case 1: 
                        drawRect(260+this.x*120 - ((this.x-this.startX)*120-(this.y-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.y*40,
                        25+this.y*50+-((this.y-this.startY)*50)*(this.stepping/this.stepTime)-camY,65,
                        40,"black",0.5)
                        drawImage(images[this.imageIndex], 260+this.x*120 - ((this.x-this.startX)*120-(this.y-this.startY)*40)*(this.stepping/this.stepTime)-camX-this.y*40,
                        95+this.y*50+(60*Math.sin((Math.PI/2)*(this.stepping/this.stepTime)))-((this.y-this.startY)*50)*(this.stepping/this.stepTime)-camY,1)
                        break
                        case 4:
                        case 0:
                            drawRect(260+this.x*120-camX-this.y*40,25+this.y*50-camY,65,40,"black",0.5)
                            drawImage(images[this.imageIndex], 260+this.x*120-camX-this.y*40,
                            95+this.y*50-camY,1)
                            console.log("sss")
                        break
                    }
                    
                }
                this.stepping = 0
                this.stepphase = 0
                //STEP PHASES:  0: Standing Still   1: Jumping  2: Standing still in air    3:Smashing down 4: Cooling down
                this.update = function() {
                    if (this.stepping != 0) {this.stepping -= 1}
                    else if (this.stepping == 0 && this.stepphase == 3) {this.stepFinish()}
                    if (this.stepphase == 0 && this.stepping == 0) {
                        this.step(pathTo(player.y,player.x,this.x,this.y))
                    }
                    else if (this.stepphase == 1 && this.stepping == 0) {this.stepphase = 2; this.stepping = this.airtime}
                    else if (this.stepphase == 2 && this.stepping == 0) {this.stepphase = 3; this.stepping = this.falltime}
                    else if (this.stepphase == 3 && this.stepping == 0) {this.stepphase = 4; this.stepping = this.cooldown}
                    else if (this.stepphase == 1 && this.stepping == Math.round(this.steptime / 2)) {console.log("ZOINKS")}
                }
                this.step = function(direction) {
                    if (direction == undefined) {return}
                    this.stepping = this.stepTime
                    tilelist[this.x][this.y].characters = tilelist[this.x][this.y].characters.filter((id) => id != this.id)
                    characterRenderList[this.y] = characterRenderList[this.y].filter((id) => id != this.id)
                    this.startX = this.x
                    this.startY = this.y
                    switch(direction) {
                        case 0: this.x += 1; break
                        case 1: this.x -= 1; break
                        case 2: this.y += 1; break
                        case 3: this.y -= 1; break
                    }
                    tilelist[this.x][this.y].characters.push(this.id)
                }
                this.stepFinish = function() {
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
let characterRenderList = Array(6).fill().map(() => Array())
function drawGame() {
    //Called every game loop, responsible for drawing all graphics (No drawing should be outside of it!)
    drawRect(600,300,1200,600,"rgb(100, 130, 255)")
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
    sus = new character(1, 4, 4)
    console.log(sus)
    context.imageSmoothingEnabled = false
    gameLoop = setInterval( function() {
        characterList.forEach(character => {
            if (character == null) {return}
            character.update()
        })
        pressedTick()
        drawGame()
    },10)
}
function doit() {
    xgoal = Number(document.getElementById('x').value)
    ygoal = Number(document.getElementById('y').value)
}
