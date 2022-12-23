let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")
let pubGravity = 0.12
let defSprites = [[],[],[]]   // Each inner array represents a layer. First array is in the back, last array is in the front.
let sprites = [[],[],[]]
// Sprites: [[background][pipes][bird]]
let colliders = []
let pipes = []
let defeated = true
let globalSpriteSize = 3
let globalSpeedStart = 0.8
let globalSpeed = globalSpeedStart
let temp = false
let bgColor = "rgb(0,200,255)"
let images = document.getElementById("images").children
let tempCoord = null
let tempCondition = null
let tempX = null
let tempY = null
let bestScore = null
let loaded = false
class bird {
    constructor(x,y,terminal,velocity,gravity,image) {
        this.tags = []
        this.x = x
        this.y = y
        this.terminal = terminal
        this.velocity = velocity
        this.gravity = gravity
        colliders.push(null)
        this.collider = colliders[colliders.length-1] = new collider(this.x,this.y,30,22,"bird",["checker"])
        this.image = image
    }
    update = function() {
        this.y += this.velocity
        this.collider.adjust(0,this.velocity)
        this.velocity -= this.gravity
        if (this.velocity < this.terminal) {
            this.velocity = this.terminal
        }
        if (this.y<0 && defeated == false) {
            defeat()
        }
        if (this.y>400) {
            this.velocity = -1
        }
        drawImage(this.image, this.x, this.y, globalSpriteSize, -(this.velocity*Math.PI/180)*10);
    }
}
class pipe {
    constructor(height,holeSize,bottom) {
        this.tags = []
        this.x = 625
        if (bottom) {
            this.y = height-200
            pipes.push(new pipe(this.y+holeSize+400,0,false))
            sprites[1].push(null)
            this.graphics = sprites[1][sprites[1].length-1] = new graphics(this.x,this.y+200,[images[1],images[2]],new ray(3,1,[1,0]))
        }
        else {
            this.y = height
            sprites[1].push(null)
            this.graphics = sprites[1][sprites[1].length-1] = new graphics(this.x,this.y+-200,[images[1],images[2]],new ray(1,1,[1,0]))
        }
        colliders.push(null)
        this.collider = colliders[colliders.length-1] = new collider(this.x,this.y,100,400,"pipe",["hurty"])
    }
    update = function() {
        this.x -= 1*globalSpeed
        this.graphics.x = this.x
        //drawRect(this.x,this.y,50*2,400,"green")
        this.collider.adjust(-1*globalSpeed,0)
        if (this.x < -200) {
            pipes.shift()
            sprites[1].shift()
            colliders.splice(1,1)
        }
    }
}
class collider {
    constructor(x,y,width,height,type,tags) {
        this.type = type
        this.tags = tags
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.bottom = this.y-this.height/2
        this.top = this.y+this.height/2
        this.left = this.x-this.width/2
        this.right = this.x+this.width/2
    }
    adjust = function(x,y) {
        this.x += x
        this.y += y
        this.bottom += y
        this.top += y
        this.left += x
        this.right += x
    }
    move = function(x,y) {
        this.x = x
        this.y = y
    }
    collide = function() {
        temp = false
        let collFunction = null
        if (this.tags.includes("checker")) {
            switch (this.type) {
                case "bird" :  collFunction = birdColl; break
            }
            colliders.forEach(element => {
                if (element != this)
                    collFunction(this,element)
            })
        }
    };
}
class graphics {
    constructor(x,y,images,ray) {
        this.x = x
        this.y = y
        this.images = images
        if (typeof(ray) !== undefined && ray !== null) {
            this.ray = ray
            switch (ray.count) {
                case 1 :
                    this.draw = function() {
                        switch(ray.direction % 2) {
                            case 0: tempCoord = this.x; break
                            case 1: tempCoord = this.y; break
                        }
                        tempX = this.x
                        tempY = this.y
                        for (let i = 0; i < ray.amounths.length; i++) {
                            switch (ray.direction) {
                                case 0: length = this.images[i].width*globalSpriteSize; break
                                case 1: length = this.images[i].height*globalSpriteSize; break
                                case 2: length = -this.images[i].width*globalSpriteSize; break
                                case 3: length = -this.images[i].height*globalSpriteSize; break
                            }
                            if (i == 0) {
                                switch(ray.direction % 2) {
                                    case 0: tempX += length/2
                                    case 1: tempY += length/2
                                }
                            }
                            if (ray.amounths[i] == 0) {
                                switch (ray.direction) {
                                    case 0: tempCondition = "tempCoord < 600+length"; break
                                    case 1: tempCondition = "tempCoord < 400+length"; break
                                    case 2: tempCondition = "tempCoord > 0+length"; break
                                    case 3: tempCondition = "tempCoord > 0+length"; break
                                }
                                while (eval(tempCondition)) {
                                    drawImage(this.images[i],tempX,tempY,globalSpriteSize,0)
                                    switch (ray.direction % 2) {
                                        case 0: tempX += length; break
                                        case 1: tempY += length; break
                                    }
                                    tempCoord += length
                                }
                            }
                            else {
                                for (let ii = 0; ii < ray.amounths[i]; ii++) {
                                    drawImage(this.images[i],tempX,tempY,globalSpriteSize,0)
                                    switch (this.ray.direction % 2) {
                                        case 0: tempX += length; break
                                        case 1: tempY += length; break
                                    } 
                                    tempCoord += length
                                }
                            }
                        }
                    }
                break
            }
        }
    }
}
class ray {
    constructor(direction,count,amounths) {
        this.direction = direction
        this.count = count
        this.amounths = amounths
    }
}
window.onload = function()  {
    context.imageSmoothingEnabled = false
    loaded = true
}

//  COLLISION FUNCTIONS

function birdColl(objA,objB) {
    if (objB.tags.includes("hurty")) {
        if (aabb(objA,objB)) {
            console.log("AAA!")
            defeat()
        }
    }
}
//source: https://levelup.gitconnected.com/2d-collision-detection-8e50b6b8b5c0
function aabb(objA,objB) {
    return objA.right>=objB.left
    && objA.left<=objB.right
    && objA.top>=objB.bottom
    && objA.bottom<=objB.top
}
function drawImage(image, x, y, scale, rotation){
    context.setTransform(scale, 0, 0, scale, x, -y+400);
    context.rotate(rotation);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    context.resetTransform()
}
function drawRect(x,y,width,height,color) {
    context.setTransform(1, 0, 0, 1, x, -y+400)
    context.fillStyle = color
    context.fillRect(-width/2,-height/2,width,height)
    context.resetTransform()
}
function drawText(x,y,text,font,fontSize,centeredness,color) {
    context.setTransform(1, 0, 0, 1, x, -y+400)
    context.font = fontSize+"px "+font
    context.fillStyle = color
    if (centeredness) {context.textAlign = "center"; context.fillText(text,0,0)}
    else {context.textAlign = center; context.fillText(text,0,0)}
    context.resetTransform()
}
function keypress() {
    if (defeated == false) {player.velocity = 4.25}
}
function defeat() {
    defeated = true
    if (Math.floor(score) > bestScore) document.getElementById("bestScore").innerHTML = "Legjobb Pontszám: ".concat(Math.floor(score).toString())
    bestScore = score
}
function ranPipe(bottomMargin,topMargin,holesize) {
    pipes.push(new pipe(Math.random()*(400-bottomMargin-topMargin-holesize)+bottomMargin,holesize,true))
}
function fixedPipe(height,holesize) {
    pipes.push(new pipe(height,holesize,true))
}
function start(event) {
    if (typeof(gameLoop) !== 'undefined') clearInterval(gameLoop)
    if (loaded == false) return
    event.innerHTML = "RESTART"
    pipeInterval = 0
    score = 0
    pipes = []
    colliders = []
    player = new bird(50,200,-7,0,pubGravity,images[0])
    pipeInterval = 0
    defeated = false
    globalSpeed = globalSpeedStart
    sprites = [[],[],[]]
    gameLoop = setInterval( function() {
        console.log(colliders.length)
        context.fillStyle = bgColor
        context.fillRect(0, 0, 600, 400)
        if (defeated == false) {
            player.update()
            pipes.forEach(element => {
                element.update()
            })
            if (pipeInterval <= 0) {
                pipeInterval = 240
                ranPipe(0,0,150)
            }
            else pipeInterval -= 1*globalSpeed
            colliders.forEach(element => {
                element.collide()
            })
            score += 0.02
            globalSpeed += 0.0001
        }
        sprites.forEach(array => array.forEach(element => element.draw()))
        if (defeated) {
            if (player.y > 0) {
                    player.update()
                }
            else {
                player.update()
                player.y = 0
            }
        }
        drawText(300,350,"Pont:"+Math.floor(score),"impact",50,true,"blue")
    },10)
}

    
