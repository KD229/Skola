let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")
let pubGravity = 0.12
let colliders = []
let pipes = []
var img = document.getElementById("flappy")
var temp = 0

class bird {
    constructor(x,y,terminal,velocity,gravity,image) {
        this.x = x
        this.y = y
        this.terminal = terminal
        this.velocity = velocity
        this.gravity = gravity
        colliders.push(null)
        this.collider = colliders[colliders.length-1] = new collider(this.x,this.y,30,22,true)
        this.image = image
    }
    update = function() {
        this.y += this.velocity
        this.collider.move(0,this.velocity)
        this.velocity -= this.gravity
        if (this.velocity < this.terminal) {
            this.velocity = this.terminal
        }
        if (this.y<0) {
            this.velocity = -this.velocity
        }
        if (this.y>400) {
            this.velocity = -1
        }
        drawImage(this.image, this.x, this.y, 3, -(this.velocity*Math.PI/180)*10);
    }
}
class pipe {
    constructor(height,holeSize,bottom) {
        this.x = 625
        this.y = height
        colliders.push(null)
        this.collider = colliders[colliders.length-1] = new collider(this.x,this.y,50,400,false)
        if (bottom == true) {pipes.push(new pipe(this.y+holeSize+400,0,false))}
    }
    update = function() {
        this.x -= 1
        drawRect(this.x,this.y,50,400,"green")
        this.collider.move(-1,0)
    }
}
class collider {
    constructor(x,y,width,height,checker) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.bottom = this.y-this.height/2
        this.top = this.y+this.height/2
        this.left = this.x-this.width/2
        this.right = this.x+this.width/2
        this.checker = checker
    }
    move = function(x,y) {
        this.x += x
        this.y += y
        this.bottom += y
        this.top += y
        this.left += x
        this.right += x
    }
    collide = function() {
        if (this.checker == true) {
            colliders.forEach(element => {
                if (element != this) {
                    if (aabb(this,element)) {
                        alert("Morbius gaming")
                    }
                }
            });
        }
    }
}
window.onload = function()
{
    context.imageSmoothingEnabled = false
    start()
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
function keypress() {
    player.velocity = 4.25
}
function start() {
    pipeInterval = 0
    player = new bird(50,200,-7,0,pubGravity,img)
    //pipes.push(new pipe(Math.floor(Math.random()*300)-160,100,true))
    gameLoop = setInterval( function() {
        context.clearRect(0, 0, 600, 400);
        player.update()
        pipes.forEach(element => {
            element.update()
        })
        if (pipeInterval == 0) {
            pipeInterval = 300
            pipes.push(new pipe(Math.floor(Math.random()*300)-160,150,true))
        }
        else pipeInterval -= 1
        colliders.forEach(element => {
            element.collide()
        })
    },10)
}

    
