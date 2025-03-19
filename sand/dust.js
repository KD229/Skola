let Mdown = false
x = 0
y = 0
waitTime = 5
width = 500
height = 500
dustcoords = Array(width).fill().map(() => Array(height).fill().map(() => 0))
console.log(dustcoords)

function drawRect(x,y,width,height,color,alpha = 1) {
    context.globalAlpha = alpha
    context.setTransform(1, 0, 0, 1, x, -y+500)
    context.fillStyle = color
    context.fillRect(-width/2,-height/2,width,height)
    context.resetTransform()
}
window.onload = function() {
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
    x = Math.round(event.offsetX)
    y = Math.round(-event.offsetY+height)
}

class particle {
    constructor(type, r, g, b) {
        this.type = type
        this.color = [r, g, b]
    }
    draw(x,y) {
        //console.log("rgb("+this.color[0]+", "+this.color[1]+", "+this.color[2])
        drawRect(x,y,1,1,"rgb("+this.color[0]+", "+this.color[1]+", "+this.color[2])
    }
    fall(x,y) {
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
                if (x < width && dustcoords[x+1][y-1] == 0 && dustcoords[x+1][y] == 0) {
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
            for (let i = x-5; i < x+5 && i < width && i > 0; i++) {
                for (let ii = y-5; ii < y+5 && ii < height && ii > 0; ii++) {
                    dustcoords[i][ii] = new particle(0,Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255))
                }
            }
        }
        drawRect(250,250,height+1, width+1,"grey")
        for (let ix = 0; ix < width; ix++) {
            for (let iy = 0; iy < height; iy++) {
                if (dustcoords[ix][iy] != 0) {
                    dustcoords[ix][iy].draw(ix,iy)
                    dustcoords[ix][iy].fall(ix,iy)
            }
                
            }
        }
    },5)
}
