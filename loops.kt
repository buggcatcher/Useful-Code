fun main() {
    var x = 1

    while (x <= 5) {
        when (x) {
            1 -> println("x è uguale a 1")
            2 -> println("x è uguale a 2")
            3 -> println("x è uguale a 3")
            4 -> println("x è uguale a 4")
            5 -> println("x è uguale a 5")
        }
        x++
    }

    var y = 1
    do {
        when (y) {
            1 -> println("y è uguale a 1")
            2 -> println("y è uguale a 2")
            3 -> println("y è uguale a 3")
            4 -> println("y è uguale a 4")
            5 -> println("y è uguale a 5")
        }
        y++
    } while (y <= 5)

    for (z in 1..5) {
        when (z) {
            1 -> println("z è uguale a 1")
            2 -> println("z è uguale a 2")
            3 -> println("z è uguale a 3")
            4 -> println("z è uguale a 4")
            5 -> println("z è uguale a 5")
        }
    }
}
