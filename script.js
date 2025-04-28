let tablica_zadań = [
    "🧹 Posprzątaj jedno pomieszczenie",
    "📚 Przeczytaj 10 stron książki",
    "🚶‍♂️ Zrób 20-minutowy spacer",
    "💧 Wypij 1 litr wody do południa",
    "🧘 Zrób 10 minut medytacji lub ćwiczeń oddechowych",
    "📞 Zadzwoń do kogoś, z kim dawno nie rozmawiałeś"
];

let kod = "";
let numer_zadania = 0;
let znak = "✅";
let zadanieElem = document.getElementById("zadanie" + (numer_zadania + 1));
let historia = [];
obiekt = [];

// Użyjemy window.onload do załadowania strony
window.onload = function () {
    // Załaduj dane z localStorage
    let dane = localStorage.getItem("zadanieElem");
    let obiekt;

    SprawdźCzasResetu();

    try {
        const parsed = JSON.parse(dane);
        obiekt = (parsed && typeof parsed === "object") ? parsed : {};
    } catch (e) {
        obiekt = {};  // Jeśli nie ma danych lub są niepoprawne, przypisz pusty obiekt
    }

    // Załaduj historię ukończonych zadań
    let daneHist = localStorage.getItem("historia");
    try {
        historia = (daneHist && daneHist !== "null") ? JSON.parse(daneHist) : [];
    } catch {
        historia = [];  // Jeśli nie ma historii, przypisz pustą tablicę
    }

    // Generowanie HTML dla zadań
    for (let i = 0; i < tablica_zadań.length; i++) {
        let zadanieText = tablica_zadań[i];
        
        // Jeśli zadanie było już ukończone, załaduj zapisane dane z localStorage
        if (obiekt[i]) {
            zadanieText = obiekt[i]; 
        }

        kod += "<p id='zadanie" + (i + 1) + "'>" + zadanieText + "</p><br>";
    }

    // Wstaw wygenerowany kod do HTML
    document.getElementById('wykonane_zadania').innerHTML = kod;

    // Logowanie do konsoli, aby sprawdzić, czy dane są załadowane poprawnie
    console.log("Załadowane zadania:", obiekt);
    console.log("Historia:", historia);

};

// Funkcja Losowanie
function Losowanie() {
    document.querySelectorAll("#zadanie1, #zadanie2, #zadanie3, #zadanie4, #zadanie5, #zadanie6")
        .forEach(el => el.style.color = "white");

    numer_zadania = Math.floor(Math.random() * tablica_zadań.length);
    let tekst_zadania = document.getElementById("zadanie" + (numer_zadania + 1)).textContent;
    document.getElementById("zadanie" + (numer_zadania + 1)).style.color = "red";

    if (tekst_zadania.includes(znak)) {
        Losowanie(); 
    }
}

// Funkcja Ukończono
function Ukończono() {
    if (typeof numer_zadania !== "number" || isNaN(numer_zadania)) {
        alert("Najpierw wylosuj zadanie!");
        return;
    }

    let zadanieElem = document.getElementById("zadanie" + (numer_zadania + 1));

    if (!zadanieElem) {
        console.error("Nie znaleziono elementu zadania!");
        return;
    }

    if (!zadanieElem.innerText.includes(znak)) {
        zadanieElem.innerText += " " + znak;
    }

    zadanieElem.style.color = "yellow";

     // Załaduj dane z localStorage lub stwórz pusty obiekt, jeśli dane nie istnieją
     let dane = localStorage.getItem("zadanieElem");

     // Przypisanie ukończonego zadania do obiektu
     obiekt[numer_zadania.toString()] = zadanieElem.innerText;
 
     // Zapisz obiekt z powrotem do localStorage
     localStorage.setItem("zadanieElem", JSON.stringify(obiekt));

    // Sprawdź historię
    if (!historia.includes(zadanieElem.innerText)) {
        historia.push(zadanieElem.innerText);
        localStorage.setItem("historia", JSON.stringify(historia));
    }

    // Logowanie do konsoli, aby sprawdzić, czy zapisano dane
    console.log("Zapisane zadanie:", zadanieElem.innerText);
    console.log("Zapisany obiekt:", obiekt);
    console.log("Zapisana historia:", historia);

     

    // Animacja po ukończeniu zadania
    let anim = lottie.loadAnimation({
        container: document.getElementById('animacja'),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'https://assets10.lottiefiles.com/packages/lf20_3rwasyjy.json'
    });

    anim.addEventListener('complete', function () {
        document.getElementById('animacja').style.display = 'none';
    });

    obiekt[numer_zadania] = zadanieElem.innerText;
}

// Funkcja, która sprawdza, czy minęły 24 godziny od ostatniego resetu
function SprawdźCzasResetu() {
    const ostatniReset = localStorage.getItem("ostatniReset"); // Odczytujemy czas ostatniego resetu
    const teraz = new Date().getTime(); // Pobieramy bieżący czas w milisekundach

    // Jeśli nie ma zapisanego ostatniego resetu, ustawiamy go na teraz
    if (!ostatniReset) {
        localStorage.setItem("ostatniReset", teraz);
        return; // Jeśli reset nie miał jeszcze miejsca, nie robimy nic
    }

    const czasOdResetu = teraz - ostatniReset; // Różnica między teraz a ostatnim resetem

    // Jeśli minęły 24 godziny (86400000 ms), resetujemy dane
    if (czasOdResetu >= 8640000) { 
        ResetujDane(); // Resetowanie danych
        localStorage.setItem("ostatniReset", teraz); // Zapisujemy nową datę ostatniego resetu
    }
}

// Funkcja ResetujDane, która usuwa dane z localStorage
function ResetujDane() {
    localStorage.removeItem("zadanieElem");
    localStorage.removeItem("historia");
    location.reload(); // Odświeżenie strony po resecie danych
}


// Funkcja Historia
function Historia() {
    document.getElementById('historia').innerHTML = historia;
}