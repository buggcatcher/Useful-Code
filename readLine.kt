fun main(args: Array<String>) {
    var sum: Int = 0
    var input: String?

    do {
        print("Enter an integer: ")
        input = readLine()
        if (input != null && input != "0") {
            sum += input.toIntOrNull() ?: 0 // input.toIntOrNull() prova a convertire l'input in un intero. Se non riesce restituisce null
            								                // ?: 0 assegna 0 se la conversione fallisce
        }
    } while (input != "0" && input != null)

    println("sum = $sum")
}
