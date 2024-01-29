function drawImage(image, x, y, scale, rotation,alpha = 1){
    context.globalAlpha = alpha
    context.setTransform(scale, 0, 0, scale, x-camX, -y+600+camY);
    context.rotate(rotation);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    context.resetTransform()
}
function drawRect(x,y,width,height,color,alpha = 1) {
    context.globalAlpha = alpha
    context.setTransform(1, 0, 0, 1, x-camX, -y+600+camY)
    context.fillStyle = color
    context.fillRect(-width/2,-height/2,width,height)
    context.resetTransform()
}
function drawText(x,y,text,font,fontSize,centered,color,alpha = 1) {
    context.globalAlpha = alpha
    context.setTransform(1, 0, 0, 1, x-camX, -y+600+camY)
    context.font = fontSize+"px "+font
    context.fillStyle = color
    if (centered) {context.textAlign = "center"}
    context.fillText(text,0,0)
    context.resetTransform()
}
function cameraUpdate() {
    camX = (player.endX*120-((player.endX-player.startX)*120-(player.endY-player.startY)*40)*(player.stepping/player.stepTime)-player.endY*40-140 + 10*camX)/11
}