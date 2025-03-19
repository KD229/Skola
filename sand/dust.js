let Mdown = false
x = 0
y = 0
cursorSize = 1
waitTime = 5
let realWidth = 0
let realHeight = 0
width = 250
height = 250
dustcoords = Array(width).fill().map(() => Array(height).fill().map(() => 0))
console.log(dustcoords)

function drawRect(x,y,width,height,color,alpha = 1) {
    context.globalAlpha = alpha
    context.setTransform(1, 0, 0, 1, x, -y+realHeight)
    context.fillStyle = color
    context.fillRect(-width/2,-height/2,width,height)
    context.resetTransform()
}
window.onload = function() {
    realWidth = document.getElementById("canvas").width
    realHeight = document.getElementById("canvas").height
    widthRatio = Math.round(realWidth/width)
    heightRatio = Math.round(realHeight/height)
    context = document.getElementById("canvas").getContext("2d")
    start()
}
function up(event) {
    Mdown = false
}
function down(event) {
    Mdown = true
}
function move(event) {
    x = Math.round(event.offsetX*width/realWidth)
    y = Math.round((-event.offsetY+realHeight)*height/realHeight)
}

class particle {
    constructor(type, r, g, b) {
        this.type = type
        this.color = [r, g, b]
    }
    draw(x,y) {
        drawRect(x*widthRatio,y*heightRatio,widthRatio,heightRatio,"rgb("+this.color[0]+", "+this.color[1]+", "+this.color[2])
    }
    
}
class falling extends particle {
    constructor() {
        super(1, 211+Math.round(Math.random()*20)-10, 169+Math.round(Math.random()*20)-10, 108+Math.round(Math.random()*20)-10)
    }
    update(x,y) {
        if (y > 0) {
            if (y > 0 && dustcoords[x][y-1] == 0) {
                dustcoords[x][y] = 0
                dustcoords[x][y-1] = this
            }
            else {
                if (x > 0 && dustcoords[x-1][y-1] == 0 && dustcoords[x-1][y] == 0) {
                    dustcoords[x][y] = 0
                    dustcoords[x-1][y-1] = this
                }
            else {
                if (x < width-1 && dustcoords[x+1][y-1] == 0 && dustcoords[x+1][y] == 0) {
                    dustcoords[x][y] = 0
                    dustcoords[x+1][y-1] = this
                }
            }}
        }
    }
}

function start() {
    
    context.imageSmoothingEnabled = false
    gameLoop = setInterval( function() {
        if (Mdown) {
            for (let ii = y-Math.floor(cursorSize/2); ii < y+Math.ceil(cursorSize/2) && ii < width && ii > 0; ii++) {
                for (let i = x-Math.floor(cursorSize/2); i < x+Math.ceil(cursorSize/2) && i < height && i > 0; i++) {
                    //dustcoords[i][ii] = new particle(0,Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255))
                    dustcoords[i][ii] = new falling()
                }
            }
        }
        drawRect(Math.floor(realWidth/2),Math.floor(realHeight/2),realWidth+1, realHeight+1,"grey")
        for (let iy = 0; iy < width; iy++) {
            for (let ix = 0; ix < height; ix++) {
                if (dustcoords[ix][iy] != 0) {
                    dustcoords[ix][iy].draw(ix,iy)
                    dustcoords[ix][iy].update(ix,iy)
            }
                
            }
        }
    },5)
}
