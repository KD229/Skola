let n = 64
let aknaszam = 640
let maradhely = n * n - aknaszam
let aknak = []
let halott = false;

aknagen = (max) => {
    for (let n = 0; n < max; ++n) {
        let akna
        do {
            akna = aknageneracio()
        } while (bennevan(akna))
        aknak.push(akna)
    }
}
aknageneracio = () => {
    let x = Math.floor(Math.random() * n)
    let y = Math.floor(Math.random() * n)
    return [x, y]
}
mutak = () => {
    for (const akna of aknak) {
        minemutat(akna)
    }
}
minemutat = (akna) => {
    let rows = document.getElementById('tabla').getElementsByTagName('tr');
    let columns = rows[akna[1]].getElementsByTagName('td');
    let cell = columns[akna[0]]
    cell.innerHTML = '💣'
}
bennevan = (coordinates) => {
    for (const akna of aknak) {
        if (akna[0] == coordinates[0] && akna[1] == coordinates[1]) {
            return true
        }
    }
    return false
}
onClick = (target, esemeny) => {
    if (halott == true) {
        alert("Ne csalj")
        return
    }
    if (esemeny != undefined && esemeny.button == 2 && (target.innerHTML.trim() == "" || target.innerHTML == '🚩')) {
        if (target.innerHTML == '🚩') {target.innerHTML = ""}
        else {target.innerHTML = '🚩'}
    }
    if ((esemeny == undefined || esemeny.button == 0) && target.innerHTML.trim() === "") {
        let x = target.cellIndex
        let y = target.parentElement.rowIndex

        if (bennevan([x, y])) {
            target.setAttribute('class', 'exploded')
            mutak()
            alert("Veszitettel!")
            halott = true
            return
        }

        let neighboursWithMines = bennevan([x - 1, y - 1])
                                + bennevan([x - 1, y + 0])
                                + bennevan([x - 1, y + 1])
                                + bennevan([x + 0, y - 1])
                                + bennevan([x + 0, y + 1])
                                + bennevan([x + 1, y - 1])
                                + bennevan([x + 1, y + 0])
                                + bennevan([x + 1, y + 1]);
        if (neighboursWithMines == 0) {
            target.innerHTML = "0"
        }
        else {
            target.innerHTML = neighboursWithMines
        }
        target.setAttribute('class', 'clicked')

        if (--maradhely == 0) {
            mutak()
            alert("Nyertel!")
        }

        document.getElementById('remaining').innerHTML = maradhely
        if (neighboursWithMines == 0 && !halott) {
            if (x > 0) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y].getElementsByTagName('td')[x-1])}
            if (y > 0) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y-1].getElementsByTagName('td')[x])}
            if (x < n-1) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y].getElementsByTagName('td')[x+1])}
            if (y < n-1) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y+1].getElementsByTagName('td')[x])}
            if (x > 0 && y > 0) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y-1].getElementsByTagName('td')[x-1])}
            if (x > 0 && y < n-1) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y+1].getElementsByTagName('td')[x-1])}
            if (x < n-1 && y > 0) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y-1].getElementsByTagName('td')[x+1])}
            if (x < n-1 && y < n-1) {onClick(document.getElementById('tabla').getElementsByTagName('tr')[y+1].getElementsByTagName('td')[x+1])}
        }
    }
}
killTheContextMenu = (esemeny) => {esemeny.preventDefault()}
    
(init = () => {
    aknagen(aknaszam)
    document.getElementById('remaining').innerHTML = maradhely
    document.getElementById('tabla').innerHTML = `
    <table>
        ${Array(n).fill(`
        <tr>
        ${Array(n).fill(`<td onmouseup="onClick(this, event)" oncontextmenu="killTheContextMenu(event)" />`).join('')}
        </tr>
        `).join('')}
    </table>`
    let veletlenszerux = Math.floor(Math.random() * n)
    let veletlenszeruy = Math.floor(Math.random() * n)
    let mines = bennevan([veletlenszerux - 1, veletlenszeruy - 1])
                            + bennevan([veletlenszerux - 1, veletlenszeruy + 0])
                            + bennevan([veletlenszerux - 1, veletlenszeruy + 1])
                            + bennevan([veletlenszerux + 0, veletlenszeruy - 1])
                            + bennevan([veletlenszerux + 0, veletlenszeruy + 1])
                            + bennevan([veletlenszerux + 1, veletlenszeruy - 1])
                            + bennevan([veletlenszerux + 1, veletlenszeruy + 0])
                            + bennevan([veletlenszerux + 1, veletlenszeruy + 1])
                            + bennevan([veletlenszerux + 0, veletlenszeruy + 0]);
    while (mines != 0) {
        veletlenszerux = Math.floor(Math.random() * n)
        veletlenszeruy = Math.floor(Math.random() * n)
        mines = bennevan([veletlenszerux - 1, veletlenszeruy - 1])
                            + bennevan([veletlenszerux - 1, veletlenszeruy + 0])
                            + bennevan([veletlenszerux - 1, veletlenszeruy + 1])
                            + bennevan([veletlenszerux + 0, veletlenszeruy - 1])
                            + bennevan([veletlenszerux + 0, veletlenszeruy + 1])
                            + bennevan([veletlenszerux + 1, veletlenszeruy - 1])
                            + bennevan([veletlenszerux + 1, veletlenszeruy + 0])
                            + bennevan([veletlenszerux + 1, veletlenszeruy + 1])
                            + bennevan([veletlenszerux + 0, veletlenszeruy + 0]);

    }
    onClick(document.getElementById('tabla').getElementsByTagName('tr')[veletlenszeruy].getElementsByTagName('td')[veletlenszerux])
})()
