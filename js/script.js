// ===========================================================
// NAMEŠTAJ PO MERI – Glavni JavaScript fajl
// --- 0 GLOBALNE PROMENLJIVE ---
// === 1. SLAJDER LOGIKA ===
// === 2. KONTROLA I IZMENA TEME (localStorage) ===
// === 3. PRILAGOĐAVANJE VELIČINE FONTA (Akcesibilnost) ===
// === 4. MOBILNA NAVIGACIJA (Hamburger meni) ===
// === 5. LOKALIZACIJA (Dvojezičnost - SR / EN) ===
// === 6. INTERAKTIVNA HARMONIKA ===
// === 7. MINI SLAJDERI NA STRANICAMA PROIZVODA ===
// === 8. CENTRALNI KONTROLER APLIKACIJE ('DOMContentLoaded') ===
// === 9. GALERIJSKI "MULTISLAJDER" (Tracking za sve multi-galerije) ===
// === 10. JQUERY IMPLEMENTACIJA  Dugme za povratak na vrh ===
// ============================================================


// --- 0 GLOBALNE PROMENLJIVE ---
let trenutniIndeksKarusela = 0;
let indeksSlajda = 0;
let slajderInterval;

// === 1. SLAJDER LOGIKA ===
function idiNaSlajd(n) {
    const slajdovi = document.getElementsByClassName("slajd");
    const indikatori = document.querySelectorAll(".slajder-indikatori button");
    if (!slajdovi.length || !indikatori.length) return; // Beži ako nije početna strana

    if (n >= slajdovi.length) n = 0;
    if (n < 0) n = slajdovi.length - 1;
    indeksSlajda = n;

    Array.from(slajdovi).forEach((s, i) => {
        s.classList.remove("aktivni-slajd");
        if (indikatori[i]) indikatori[i].classList.remove("aktivan");
    });
    
    slajdovi[indeksSlajda].classList.add("aktivni-slajd");
    if (indikatori[indeksSlajda]) indikatori[indeksSlajda].classList.add("aktivan");
}

function promeniSlajd(n) {
    idiNaSlajd(indeksSlajda + n);
}

// === 2. KONTROLA I IZMENA TEME (localStorage) ===
function promeniTemu() {
    const trenutna = localStorage.getItem("tema") || "svetla";
    primenaTemu(trenutna === "svetla" ? "tamna" : "svetla");
}

function primenaTemu(tema) {
    document.documentElement.setAttribute("data-tema", tema);
    document.documentElement.setAttribute("data-bs-theme", tema === "tamna" ? "dark" : "light");
    
    localStorage.setItem("tema", tema);

    document.querySelectorAll("#prekidac-teme, #prekidac-teme-float").forEach(d => {
        if (d) d.textContent = tema === "tamna" ? "☀️" : "🌙";
    });

    document.body.classList.remove("svetla", "tamna");
    document.body.classList.add(tema);
}

// === 3. PRILAGOĐAVANJE VELIČINE FONTA (Akcesibilnost) ===
function promeniFont(akcija) {
    let trenutniModifikator = parseInt(localStorage.getItem("fontModifikator")) || 0;

    if (akcija === "povecaj" && trenutniModifikator < 12) trenutniModifikator += 2;
    if (akcija === "smanji"  && trenutniModifikator > -6) trenutniModifikator -= 2;

    primeniFont(trenutniModifikator);
}

function primeniFont(modifikator) {
    document.documentElement.style.setProperty('--font-modifikator', modifikator + "px");
    localStorage.setItem("fontModifikator", modifikator);

    const html = document.documentElement;
    html.classList.remove("font-mali", "font-veliki");
    if (modifikator < 0) html.classList.add("font-mali");
    if (modifikator > 0) html.classList.add("font-veliki");
}

function resetujFont() {
    document.documentElement.style.removeProperty('--font-modifikator');
    document.documentElement.classList.remove("font-mali", "font-veliki");
    localStorage.removeItem("fontModifikator"); 
    localStorage.removeItem("velicinaFonta");
}

// === 4. MOBILNA NAVIGACIJA I DROPDOWN MENI ===
function inicijalizujHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navStavke = document.getElementById("nav-stavke");
    if (!hamburger || !navStavke) return;

    // Otvaranje / zatvaranje hamburger menija
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        const otvoren = hamburger.classList.toggle("otvoren");
        navStavke.classList.toggle("otvoren", otvoren);
        hamburger.setAttribute("aria-expanded", otvoren.toString());
    });

    // Kontrola padajućeg menija
    const dropBtn = document.querySelector(".dropbtn");
    const dropdownSadrzaj = document.querySelector(".dropdown-sadrzaj");

    if (dropBtn && dropdownSadrzaj) {
        dropBtn.addEventListener("click", (e) => {
            e.preventDefault();
            //e.stopPropagation(); // Sprečava da klik zatvori navigaciju (mozda ubacim posle ne znam videcu)
            dropdownSadrzaj.classList.toggle("prikazi");
        });
    }

    // Zatvori sve samo ako se klikne van navigacije i hamburgera
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#nav-stavke") && !e.target.closest("#hamburger")) {
            hamburger.classList.remove("otvoren");
            navStavke.classList.remove("otvoren");
            hamburger.setAttribute("aria-expanded", "false");
            if (dropdownSadrzaj) dropdownSadrzaj.classList.remove("prikazi");
        }
    });
}

// === 5. LOKALIZACIJA (Dvojezičnost - SR / EN) ===
async function promeniJezik(jezik) {
    try {
        const odgovor = await fetch(`json/${jezik}.json`);
        if (!odgovor.ok) throw new Error(`HTTP greška ${odgovor.status}`);
        const podaci = await odgovor.json();

        Object.keys(podaci).forEach(kljuc => {
            const el = document.getElementById(kljuc);
            if (el) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = podaci[kljuc];
                } else {
                    el.innerHTML = podaci[kljuc];
                }
            }
        });

        localStorage.setItem("jezik", jezik);
    }   catch (greska) {
        console.warn("Jezik nije mogao biti učitan lokalno:", greska.message);
    }
}

// === 6. MINI SLAJDERI NA STRANICAMA PROIZVODA ===
function promeniMiniSlajd(dugme, pravac) {
    const kontejner = dugme.parentElement;
    const slike = kontejner.querySelectorAll('.mini-slajd');
    if (!slike.length) return;
    
    let trenutniIndeks = 0;
    for (let i = 0; i < slike.length; i++) {
        if (slike[i].classList.contains('aktivna')) {
            trenutniIndeks = i;
            break;
        }
    }
    
    slike[trenutniIndeks].classList.remove('aktivna');
    let noviIndeks = trenutniIndeks + pravac;
    
    if (noviIndeks >= slike.length) noviIndeks = 0;
    if (noviIndeks < 0) noviIndeks = slike.length - 1;
    
    slike[noviIndeks].classList.add('aktivna');
}

// === 7. CENTRALNI KONTROLER APLIKACIJE ('DOMContentLoaded') ===
document.addEventListener("DOMContentLoaded", () => {
    // Primena teme se pokreće prva
    const sacuvanaTema = localStorage.getItem("tema") || "svetla";
    primenaTemu(sacuvanaTema);

    const sacuvaniModifikator = localStorage.getItem("fontModifikator");
    if (sacuvaniModifikator !== null) {
        primeniFont(parseInt(sacuvaniModifikator));
    }

    // Provera za glavno slajder dugme (samo ako postoje slajdovi i indikatori na strani)
    const slajdovi = document.getElementsByClassName("slajd");
    const indikatori = document.querySelectorAll(".slajder-indikatori button");
    if (slajdovi.length > 0 && indikatori.length > 0) {
        idiNaSlajd(0);
        slajderInterval = setInterval(() => promeniSlajd(1), 5500);
    }

    document.querySelectorAll("#prekidac-teme, #prekidac-teme-float").forEach(d => {
        if (d) d.addEventListener("click", promeniTemu); 
    });

    const dugmeReset = document.getElementById("resetuj-font");
    if (dugmeReset) dugmeReset.addEventListener("click", resetujFont);

    const dugmePovecaj = document.getElementById("povecaj-font");
    if (dugmePovecaj) dugmePovecaj.addEventListener("click", () => promeniFont("povecaj"));

    const dugmeSmanji = document.getElementById("smanji-font");
    if (dugmeSmanji) dugmeSmanji.addEventListener("click", () => promeniFont("smanji"));

    const sacuvaniJezik = localStorage.getItem("jezik");
    if (sacuvaniJezik && sacuvaniJezik !== "sr") promeniJezik(sacuvaniJezik);

    inicijalizujHamburger();

    // --- FILTRIRANJE KARTICA ---
    const filterDugmad = document.querySelectorAll(".filter-dugme");
    const karticeUsluga = document.querySelectorAll(".usluga-kartica, .usluge-kartica");

    if (filterDugmad.length > 0 && karticeUsluga.length > 0) {
        filterDugmad.forEach(dugme => {
            dugme.addEventListener("click", function() {
                filterDugmad.forEach(d => d.classList.remove("aktivan"));
                this.classList.add("aktivan");

                const selektovaniFilter = this.getAttribute("data-filter");

                karticeUsluga.forEach(kartica => {
                    const kategorija = kartica.getAttribute("data-kategorija");
                    
                    if (selektovaniFilter === "sve" || kategorija === selektovaniFilter) {
                        kartica.style.display = "inline-block";
                        setTimeout(() => {
                            kartica.style.opacity = "1";
                            kartica.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        kartica.style.opacity = "0";
                        kartica.style.transform = "scale(0.95)";
                        setTimeout(() => {
                            kartica.style.display = "none";
                        }, 300);
                    }
                });
            });
        });
    }
});

// === 8. GALERIJSKI "MULTISLAJDER" ===
const slajderIndeksi = {
    'kategorija-kuhinje': 0,
    'kategorija-stolovi': 0,
    'kategorija-kreveti': 0,
    'kategorija-stolice': 0
};

function vratiBrojVidljivihSlika() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 950) return 2;
    return 3;
}

function pomeriSlajder(slajderId, smer) {
    const slajderOkvir = document.getElementById(slajderId);
    if (!slajderOkvir) return;

    const traka = slajderOkvir.querySelector('.slajder-traka');
    const brojSlajdova = traka.querySelectorAll('.slajd').length;
    
    const vidljiveSlike = vratiBrojVidljivihSlika();
    const maxIndeks = brojSlajdova - vidljiveSlike;

    slajderIndeksi[slajderId] += smer;

    if (slajderIndeksi[slajderId] > maxIndeks) {
        slajderIndeksi[slajderId] = 0;
    } else if (slajderIndeksi[slajderId] < 0) {
        slajderIndeksi[slajderId] = maxIndeks < 0 ? 0 : maxIndeks;
    }

    const procenatPomeranja = slajderIndeksi[slajderId] * (100 / vidljiveSlike);
    traka.style.transform = `translateX(-${procenatPomeranja}%)`;
}

window.addEventListener('resize', () => {
    const vidljiveSlike = vratiBrojVidljivihSlika();
    for (const slajderId in slajderIndeksi) {
        const slajderOkvir = document.getElementById(slajderId);
        if (!slajderOkvir) continue;
        
        const traka = slajderOkvir.querySelector('.slajder-traka');
        const brojSlajdova = traka.querySelectorAll('.slajd').length;
        const maxIndeks = brojSlajdova - vidljiveSlike;

        if (slajderIndeksi[slajderId] > maxIndeks) {
            slajderIndeksi[slajderId] = maxIndeks < 0 ? 0 : maxIndeks;
        }

        const procenatPomeranja = slajderIndeksi[slajderId] * (100 / vidljiveSlike);
        traka.style.transform = `translateX(-${procenatPomeranja}%)`;
    }
});

// === 9. JQUERY IMPLEMENTACIJA – Dugme za povratak na vrh ===
$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#nazad-na-vrh').fadeIn();
        } else {
            $('#nazad-na-vrh').fadeOut();
        }
    });

    $('#nazad-na-vrh').click(function() { 
        $('html, body').animate({ scrollTop: 0 }, 800); 
        return false; 
    });
});