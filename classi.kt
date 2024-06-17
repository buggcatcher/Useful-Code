// vedo spesso scrivere fun main (args: Array<String>) {... perche?
fun main() {
    val pg1 = Classe1("marko", 26)
    val pg2 = Classe2("babbo natale", 42)
    val pg3 = Classe3("gesu cristo", 100)
    
    println("${pg1.nome} ha ${pg1.eta} anni")
    println("${pg2.nomeCognome} ha ${pg2.eta} anni")
    println("${pg3.nomeCognome} ha ${pg3.eta} anni")
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

// nel caso in cui non ci sia un costruttore primario ogni classe base deve iniziallizare la base usando 'super'
// o delegare un altro costruttore che lo faccia per lei
// fun main(args: Array<String>) {
//     val p1 = AuthLog("Bad Password")
// }
// open class Log {
//     var data: String
//     var numberOfData = 0
//     constructor(_data: String) {
//         data = _data
//     }
//     constructor(_data: String, _numberOfData: Int) {
//         data = _data
//         numberOfData = _numberOfData
//         println("$data: $numberOfData times")
//     }
// }
// class AuthLog : Log {
//     constructor(_data: String) : this("From AuthLog -> $_data", 10)
//     constructor(_data: String, _numberOfData: Int) : super(_data, _numberOfData)
// }
