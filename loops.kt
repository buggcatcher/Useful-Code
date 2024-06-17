fun main() {
    var x = 1

    while (x <= 3) {
        when (x) {
            1 -> println("queso e' un ciclo")
            2 -> println("while")
            3 -> println()
        }
        x++
    }

    var y = 1
    do {
        when (y) {
            1 -> println("queso e' un ciclo")
            2 -> println("do-when")
            3 -> println()
        }
        y++
    } while (y <= 3)

    for (z in 1..3) {
        when (z) {
            1 -> println("queso e' un ciclo")
            2 -> println("for")
            3 -> println()
        }
    }
}
