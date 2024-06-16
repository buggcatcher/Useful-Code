// l'eredita' permette di creare una nuova classe derivata da una classe base
// la classe derivata eredita tutte le caratteristiche dalla classe base e puo' avere caratteristiche addizionali tutte sue

// classe base
open class Pirate {
    fun walkThePlank() {
        println("Walking the plank!") }
    fun drinkRum() {
        println("Drinking rum!") }
    fun shoutArrr() {
        println("Shouting Arrr!") }}

// classi derivate
class Captain : Pirate() {
    fun giveOrders() {
        println("Giving orders to the crew!") }}
class SwordsMan : Pirate() {
    fun duel() {
        println("Engaging in a sword duel!") }}

fun main() {
    val pirate = Pirate()
    val captain = Captain()
    val swordsman = SwordsMan()
    
    pirate.shoutArrr()
    captain.walkThePlank()
    pirate.drinkRum()
    captain.giveOrders()
    swordsman.duel() }
