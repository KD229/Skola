function pathTo(x,y,startX,startY) {
    if ((x == startX && y == startY) || x < 0 || x > tilelist.length-1 || y < 0 || y > 5) {return null}
    let pathQueue = [[x,y]]
    let pathed = Array(tilelist.length).fill().map(() => Array(6).fill(false))
    pathed[x][y] = true
    let randomOrder = FYS([0,1,2,3])
    let i
    let coordinatePair
    while (pathQueue.length != 0) {
        x = pathQueue[0][0]
        y = pathQueue[0][1]
        pathQueue.shift()
        randomOrder = FYS([0,1,2,3])
        for (ii = 0; ii < 4; ii++) {
            i = randomOrder[ii]
            coordinatePair = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]][i]
            if (coordinatePair[0] == startX && coordinatePair[1] == startY) {return 3-(i+2)%4}
            else {
                if (pathable(coordinatePair[0],coordinatePair[1],pathed)) {
                        pathQueue.push([coordinatePair[0],coordinatePair[1]])
                        pathed[coordinatePair[0]][coordinatePair[1]] = true
                    }
            }
        }
    }
}
function pathable(x,y,pathed) {
    if (x < 0 || x > pathed.length-1 || y < 0 || y > 5) {return false}
    if (tilelist[x][y].type == 1) {return false}
    if (occupyList[x][y] > 0) {return false}
    if (pathed[x][y]) {return false}
    return true
}
