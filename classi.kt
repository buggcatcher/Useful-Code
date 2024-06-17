// vedo spesso scrivere fun main (args: Array<String>) {... perche?
fun main() {
    val pg1 = Classe1("marko", 26)
    val pg2 = Classe2("babbo natale", 42)
    val pg3 = Classe3("gesu cristo", 100)
    val pg4 = Classe4("dante alighieri", 56)
    
    println("${pg1.nome} ha ${pg1.eta} anni")
    println("${pg2.nomeCognome} ha ${pg2.eta} anni")
    println("${pg3.nomeCognome} ha ${pg3.eta} anni")
    println("${pg4.nome} e' morto a ${pg4.anniVissuti} anni")
}
 
// constructor primario
class Classe1(val nome: String, var eta: Int) {  
}

class Classe2(nC: String, secoli: Int){
    val nomeCognome: String
    var eta: Int
    
    // blocco di inizializzazione
    init {
        nomeCognome = nC.capitalize()
        eta = secoli * 100
}}

class Classe3(nC: String, secoli: Int){
    val nomeCognome = nC.capitalize()
    var eta = secoli * 100
}

// Classe4 e Vita contengono due constructor secondari
open class Classe4 {
    var nome: String
    var anniVissuti = 0
    constructor(_nome: String) {
        nome = _nome
    }
    constructor(_nome: String, _anniVissuti: Int) {
        nome = _nome
        anniVissuti = _anniVissuti
}}

// nel caso in cui non ci sia un costruttore primario ogni classe base deve iniziallizare la base() usando 'super'
// o delegare un altro costruttore che lo faccia per lei
class Vita : Classe4 {
    constructor(_nome: String) : this("From AuthLog -> $_nome", 10)
    constructor(_nome: String, _anniVissuti: Int) : super(_nome, _anniVissuti)
}

// // constructor secondari servono per espandere le classi (check kotlin inheritance) e probabilmente non mi sevira'
// class Log {
//     constructor(data: String){
//         // codice
//     }
//     constructor(dtata: String, numberOfData: Int){
//         // codice
//     }
// }
// class AuthLog: Log {
//     constructor(data: String): super(data){
//         // codice
//     }
//     constructor(data: String, numberOfData: Int): super(data, numberOfData){
//         // codice
//     }
// }
