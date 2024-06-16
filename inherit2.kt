// In Kotlin, quando crei un oggetto di una classe come Captain che eredita da Pirate, i parametri vengono passati al costruttore principale della classe base (Pirate).
// Questo costruttore principale è il primo a essere chiamato quando l'oggetto viene creato.
// Il blocco init nella classe Pirate viene eseguito per primo.
// Se la classe derivata Captain avesse anche un blocco init proprio, questo verrebbe eseguito subito dopo quello della classe base Pirate.

// I parametri vengono passati al costruttore primario. In Kotlin, il blocco init viene chiamato quando l'oggetto viene creato.
// Poiché Captain deriva dalla classe Pirate, cerca il blocco di inizializzazione nella classe base (Pirate) ed esegue questo.
// Se Captain avesse un blocco init, il compilatore avrebbe eseguito anche il blocco init della classe derivata.
// Successivamente, la funzione giveOrders() per l'oggetto pg1 viene chiamata usando l'istruzione pg1.giveOrders().
// Il programma funziona in modo simile quando viene creato l'oggetto pg2 della classe SwordsMan. Esegue il blocco init della classe base.
// Quindi, il metodo duel() della classe SwordsMan viene chiamato usando l'istruzione pg2.duel().

open class Pirate(kills: Int, name: String) {
    init {
        println("My name is $name.")
        println("I killed $kills rats")
    }
}

class Captain(kills: Int, name: String) : Pirate(kills, name) {
    fun giveOrders() {
        println("I give orders on the ship.")
    }
}

class SwordsMan(kills: Int, name: String) : Pirate(kills, name) {
    fun duel() {
        println("I engage in sword duels.")
    }
}

fun main(args: Array<String>) {
    val pg1 = Captain(35, "Blackbeard")
    pg1.giveOrders()
    println()
    val pg2 = SwordsMan(29, "Long John Silver")
    pg2.duel()
}
