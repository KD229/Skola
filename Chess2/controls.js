controlList = ["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"," ","k"]
controlPressed = Array(controlList.length).fill(false)
iterateStop = controlList.length
let stepDir = null

function controlDown(press) {
    for (i = 0; i < iterateStop; i++) {
        if (press == controlList[i]) {
            if (controlPressed[i]) {
                return
            }
            if (i < 4) {
                stepDir = i
            }
            controlPressed[i] = true
            controlPress(i)
            return
        }
    }
}
function controlUp(press) {
    for (i = 0; i < iterateStop; i++) {
        if (press == controlList[i]) {
            if (controlPressed[i]) {
                controlPressed[i] = false
                if (stepDir == i) {
                    stepDir = null
                }
            }
            return
        }
    }
}
function controlPress(press) {
    if (press == 4) {player.attack()}
    if (press == 5) {characterList.forEach(character => {character.shift(0,-1)})}
}
function pressedTick() {
    /*if (controlPressed[0]) {camX += 8}
    if (controlPressed[1]) {camX -= 8}
    if (controlPressed[2]) {camY += 8}
    if (controlPressed[3]) {camY -= 8}*/
}