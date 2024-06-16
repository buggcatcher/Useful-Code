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
    val t1 = Captain(35, "Blackbeard")
    t1.giveOrders()
    println()
    val f1 = SwordsMan(29, "Long John Silver")
    f1.duel()
}
