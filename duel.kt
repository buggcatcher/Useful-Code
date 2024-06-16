fun main() {
    var pg1 = Personaggio("cyber penguin", 10000, "laser")
    var pg2 = Personaggio("goku", 9001, "kamehameha")
    
    var mossaPg1 = Mossa()
    var mossaPg2 = Mossa()
    
    // scegli chi e' pronto e chi sta ricaricando la propria mossa
    mossaPg1.turnOn()
    mossaPg2.turnOn()

    mossaPg1.statusMossa(pg1.nome, pg1.mossa)
    mossaPg2.statusMossa(pg2.nome, pg2.mossa)
    
    duel(pg1, mossaPg1, pg2, mossaPg2)
}
 
class Personaggio(var nome: String, var level: Int, var mossa: String)

class Mossa {
    
    var isOn: Boolean = false
    
    fun turnOn() {
        isOn = true
    }
    fun turnOff() {
        isOn = false
    }
   
    fun statusMossa(nome: String, mossa: String) {
        if (isOn)
            println("$nome e' pronto a usare $mossa")
        else
            println("$nome ricarica $mossa")
    }
}

fun duel(p1: Personaggio, mossaP1: Mossa, p2: Personaggio, mossaP2: Mossa) {
    if (mossaP1.isOn && mossaP2.isOn) {
        if (p1.level > p2.level) {
            println("${p1.nome} vince contro ${p2.nome} usando la mossa ${p1.mossa}")
        } else if (p1.level < p2.level) {
            println("${p2.nome} vince contro ${p1.nome} usando la mossa ${p2.mossa}")
        } else {
            println("${p1.nome} e ${p2.nome} sono pari!")
        }
    } else if (mossaP1.isOn) {
        println("${p1.nome} vince contro ${p2.nome}")
    } else if (mossaP2.isOn) {
        println("${p2.nome} vince contro ${p1.nome}")
    } else {
        println("Entrambi ${p1.nome} e ${p2.nome} si stanno ricaricando")
    }
}
