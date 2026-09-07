/**
 * js/kontakt.js
 * Specijalizovana klasa koja se naslanja na moderni Bootstrap 5 HTML okidač (was-validated)
 * Zamenjuje klasično "ručno" bojenje grešaka.
 */

// Ponovo čekam da pretraživač u potpunosti ispiše HTML
document.addEventListener("DOMContentLoaded", function () {
    const forma = document.getElementById("kontaktForma");

    // Okidač koji prati klik na dugme "Pošalji" i ceo submit form-e
    forma.addEventListener("submit", function (event) {
        
        const imeInput = document.getElementById("unosIme");
        const prezimeInput = document.getElementById("unosPrezime");
        const telefonInput = document.getElementById("unosTelefon");
        const telefonGreska = document.getElementById("GreskaTelefon");
        
        //Regex (Regularni izrazi)
        // /\d/ znači: "Traži mi bilo gde u tekstu, bilo kakvu prostu cifru (0-9)."
        const imaBrojeva = /\d/;
        // Ovo znači: "Traži mi bilo koje validno slovo (a-z, A-Z) plus specifična karakteristična slova na kraju."
        const imaSlova = /[a-zA-ZšđčćžŠĐČĆŽ]/;

        // 1. Validacija imena
        if (imaBrojeva.test(imeInput.value)) {
            // kao 'invalid'. Ukoliko prođe string praznine "", tretira ga kao ispravnog.
            imeInput.setCustomValidity("U imenu ne sme biti brojeva.");
        } else {
            imeInput.setCustomValidity(""); // Sklanjamo blokadu
        }

    
        if (imaBrojeva.test(prezimeInput.value)) {
            prezimeInput.setCustomValidity("U prezimenu ne sme biti brojeva.");
        } else {
            prezimeInput.setCustomValidity("");
        }

        // 3. Logika čišćenja i provere Telefona
        const čistUnos = telefonInput.value.trim(); // .trim() ubija prazne spejsove pre prve i posle poslednje reči
        const samoCifre = čistUnos.replace(/\D/g, ''); // replace(\D) pretvara u ništa SVE što "nije-cifra"

        // Redosled provere
        if (čistUnos === "") {
            telefonGreska.textContent = "Molimo unesite broj telefona.";
            telefonInput.setCustomValidity("Prazno polje");
        } else if (imaSlova.test(čistUnos)) {
            telefonGreska.textContent = "Broj telefona ne može da sadrži slova.";
            telefonInput.setCustomValidity("Sadrži slova");
        } else if (samoCifre.length < 6) {
            telefonGreska.textContent = "Unesite ispravan broj telefona (minimum 6 cifara).";
            telefonInput.setCustomValidity("Prekratak broj");
        } else {
            telefonInput.setCustomValidity("");
        }

        
        if (!forma.checkValidity()) {
            event.preventDefault();    // Uvek blokira refresh ili put ka PHP fajlu
            event.stopPropagation();   // Sprečava prenošenje klika "navrh" ka DOM hijerarhiji (da nešto ne prekine flow)
        } else {
            event.preventDefault();    // Završena forma ali prekidam svakako jer nema server
            alert("Vaša poruka je uspešno poslata!"); 
            window.location.href = window.location.href;
            return;
        }

        // specificno za bootstrap neki trik
        forma.classList.add("was-validated");
    }, false);
    document.getElementById("unosIme").addEventListener("input", function() { this.setCustomValidity(""); });
    document.getElementById("unosPrezime").addEventListener("input", function() { this.setCustomValidity(""); });
    document.getElementById("unosTelefon").addEventListener("input", function() { this.setCustomValidity(""); });
});