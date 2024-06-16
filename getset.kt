// getters & setters sono generati automaticamente anche se non esplicitati
fun main() {
    val maria = Girl()
    maria.age = 15
    maria.profession = "studentessa"
    val giulia = Girl()
    giulia.age = 35
    giulia.profession = "dottoressa"
    println("Maria e' una ${maria.profession} e dice di avere ${maria.age} anni.\nGiulia e' una ${giulia.profession} e dice di averne ${giulia.age}.")
}
 
class Girl {
    // non serve inizializzare subito, lo puoi fare dopo con lateinit
    lateinit var profession: String
    var age: Int = 0
    get() = field
    set(value) {
        field = if (value < 18)
        	18
        else if (value >= 18 && value <= 30)
        	value
        else
        	value - 5
    }
}

// class Casa {
//     var indirizzo: String = "Piazza degli Antinori"
// }
//
// equivale a scrivere:
//
// class Casa {
//     var indirizzo: String = "Piazza degli Antinori"
    
//     get() = field
//     set(value) {
//         field = value
//     }
// }
