import random
def a(lista):
    ki1 = 0
    ki2 = 0
    for item in lista:
        if item < 0:
            ki1 += 1
        elif item > 0:
            ki2 += 1
    return [ki1/80,ki2/80]
def b(lista):
    ki = 0
    for elem in lista:
        if elem > 0:
            ki += 1
        elif elem < 0:
            ki -= 1
    if ki > 0:
        return 1
    elif ki < 0:
        return -1
    else: return 0
def c(lista):
    hossz = 0
    leghoszabb = 0
    kezdet = 0
    leghoszabbkezdet = 0
    for i in range(len(lista)):
        if lista[i] > 0:
            if hossz == 0:
                kezdet = i
            hossz += 1
        elif hossz != 0:
            if hossz > leghoszabb:
                leghoszabb = hossz
                leghoszabbkezdet = kezdet
            hossz = 0
    if hossz > leghoszabb:
        leghoszabb = hossz
        leghoszabbkezdet = kezdet
    return [leghoszabb,leghoszabbkezdet]
def d(lista):
    ki = 0
    for i in range(1,len(lista)):
        if (lista[i-1] > 0) != (lista[i] > 0):
            ki += 1
    return ki
def e(lista):
    mely = False
    ki = 0
    for elem in lista:
        if elem <= -4:
            if not mely:
                mely = True
                ki += 1
        else: mely = False
    return ki
def delfinStart():
    lista = [random.randint(-5,3) for _ in range(80)]
    kiirni = []
    print(lista)
    temp = a(lista)
    kiirni.append("a: A delfin az út "+str(round(temp[0]*100,2))+"%-át tette meg a víz alatt és "+str(round(temp[1]*100,2))+"%-át tette meg a víz felett.")
    temp = b(lista)
    if temp == 0:
        kiirni.append("b: A delfin az útja során ugyanannyit volt a víz alatt mint a víz felett")
    elif temp == 1:
        kiirni.append("b: A delfin az útja során többet volt a víz felett mint a víz alatt")
    elif temp == -1:
        kiirni.append("b: A delfin az útja során többet volt a víz alatt mint a víz felett")
    temp = c(lista)
    kiirni.append("c: A delfin leghosszabb kiugrása az út "+str(temp[1]+1)+". pontjánál kezdődött és "+str(temp[0])+" útszakasz hosszú volt.")
    kiirni.append("d: A delfin "+str(d(lista))+" alkalommal törte át a víz felszínét.")
    kiirni.append("e: A delfin "+str(e(lista))+" alkalommal merült mélyre.")
    kiirni = "\n".join(kiirni)
    div = Element("delfinDiv")
    div.element.innerText = kiirni
