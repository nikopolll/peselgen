/*jshint esversion: 6 */
/***********************************************************************************
************************************************************************************
PESEL GENERATOR V1.0 autor PG
https://obywatel.gov.pl/dokumenty-i-dane-osobowe/czym-jest-numer-pesel
Każda z 11 cyfr w numerze PESEL ma swoje znaczenie. Można je podzielić następująco:
RRMMDDPPPSK
RR - to 2 ostanie cyfry roku urodzenia,
MM - to miesiąc urodzenia (zapoznaj się z sekcją  "Dlaczego osoby urodzone po 1999
     roku mają inne oznaczenie miesiąca urodzenia", która znajduje się poniżej),
DD - to dzień urodzenia,
PPPS to liczba porządkowa oznaczająca płeć. U kobiety ostatnia cyfra tej liczby
     jest parzysta (0, 2, 4, 6, 8), a u mężczyzny - nieparzysta (1, 3, 5, 7, 9),
K - to cyfra kontrolna.
---------------------------------do zrobienia--------------------------------------
- sex_control_nr czasami zwraca undefined. Sprawdzić i poprawić. Undefined jest jak
  Math.random = 0, wtedy nie ma wartości do przypisania.
- cyfra kontrolna k czasami jest = 10 no i wtedy nie wiem co zrobić.
- napisać test który sprawdza poprawność obliczeń. Jeżeli test jest ok wyświetlić
  PESEL. Jeżeli nie ok wyświetlić informację że trzeba jeszcze raz generować
- zrobić czytelny interfejs do wyświetlania nr PESEL

************************************************************************************
***********************************************************************************/

(function() {
  const button = document.getElementById('button');
  const sex = document.getElementById('sexSelect');
  const dat = document.getElementById('data');
  const pform = document.getElementById('p-data');
  const data_print = document.getElementById('data_print');

  // ************* RR-MM-DD ***********
  const getData = function() {
    let input_data = {
      sex: sex.value,
      birth_dat: dat.value //wartość musi być pobrana tutaj bo przy deklaracji jest undefined. Wartość jest pobierana dopiero po kliku w getData
    };
    return input_data;
  };

  // ************* MM ***********
  const year_sets_month = function() {
    let form_input_data = getData().birth_dat.split("-"); // zamienia datę na tablicę z 3 elementami 0-rok, 1-miesiąc, 2-dzień
    let year = form_input_data[0]; // string
    let month = form_input_data[1]; // string

    //console.log("To: ", year);

    if (1800 <= year && year <= 1899) {
      if (10 <= month) {
        month = month.replace(month[0], '9');
      } else {
        month = month.replace(month[0], '8');
      }
    } else if (1900 <= year && year <= 1999) {
      if (10 <= month) {
        month = month;
      } else {
        month = month;
      }
    } else if (2000 <= year && year <= 2099) {
      if (10 <= month) {
        month = month.replace(month[0], '3');
      } else {
        month = month.replace(month[0], '2');
      }
    } else if (2100 <= year && year <= 2199) {
      if (10 <= month) {
        month = month.replace(month[0], '5');
      } else {
        month = month.replace(month[0], '4');
      }
    } else if (2200 <= year && year <= 2299) {
      if (10 <= month) {
        month = month.replace(month[0], '7');
      } else {
        month = month.replace(month[0], '6');
      }
    } else {
      alert("Jesteś po za zasięgiem systemu. Nie dostaniesz PESELu!");
    }

    //console.log("To: ", typeof(month));

    return month;

  };

  //console.log("Year sets: ", year_sets_month());

  //*************** PPPS **************************
  const sex_control_nr = function() {
    let sex = getData().sex;
    let range_M = [1, 3, 5, 7, 9];
    let range_K = [0, 2, 4, 6, 8];
    let full_Nr = [];

    for (let i = 0; i <= 2; i++) {
      full_Nr.push(Math.floor(Math.random() * (9 - 0 + 1) + 0)); // Losuje liczby z zakresu 0-9: Math.floor(Math.random() * (max - min + 1) + min);
    }
    // To niżej czasami zwraca undefined. Sprawdzić i poprawić. Undefined jest jak Math.random = 0, wtedy nie ma wartości do przypisania.
    if (sex == "M") {
      full_Nr.push(range_M[Math.floor(Math.random() * (range_M.length - 0 + 1) + 0)]); //Losuje liczbę min-max z range_M i dodaje wartość na koniec full_Nr
      return full_Nr;

    } else {
      full_Nr.push(range_K[Math.floor(Math.random() * (range_K.length - 0 + 1) + 0)]); //Losuje liczbę min-max z range_K i dodaje wartość na koniec full_Nr
      return full_Nr;
    }
    console.log("Fulnr:", full_Nr);
  };

  //*************** K- obliczanie cyfry kontrolnej **************************
  const control_num = function() {
    let form_input_data = getData().birth_dat.split("-");
    let year = form_input_data[0].slice(2);
    let month = year_sets_month();
    let day = form_input_data[2];
    let ppps = sex_control_nr().join('');
    let wagi = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let k = 0; // cyfra kontrolna

    let numbers = year.concat(month, day, ppps).split(''); //łączy wszystkie stringi, potem tworzy tablicę ze znakami/ typeOf numbers = array
    let numbers_done = [];
    let numbers_done2 = [];

    // mnoży numbers przez wagi <--// tak można pomnożyć jedną tablicę przez drugą
    let trzy = numbers.forEach(function(el, i) {
      numbers_done.push(parseInt(el) * wagi[i]);
    });

    // zamienia tablicę numbers_done spowrotem na stringi
    let cztery = numbers_done.toString().split(',');

    // wyciąga z numbers_done drugie cyfry z liczb dwucyfrowych i zwraca wszystkie elementy jako jedno cyfrowe liczby
    let piec = cztery.forEach(function(el, i) {
      if (cztery[i].length > 1) {
        numbers_done2.push(cztery[i].substring(1)); //zostawia drugą liczbę z dwócyfrowej
      } else {
        numbers_done2.push(cztery[i]);
      }
    });

    // zamienia numbers_done2 spowrotem na cyfry i dodaje je do siebie
    let k_proces = numbers_done2.reduce((acc, curVal) => parseInt(acc) + parseInt(curVal));

    // zamienia k_porces spowrotem na string jeżeli liczba otrzymana z dodawania numbers_done2 jest dwucyfrowa
    let szesc = function() {
      if (k_proces.toString().length > 1) {
        return k_proces.toString().substring(1);
      } else {
        return k_proces;
      }
    };

    k = 10 - parseInt(szesc());

    data_print.innerHTML = year.concat(month, day, ppps, k);

    //console.log("Normal: ", year, month, day, ppps);
    //console.log("Concat: ", year.concat(month, day, ppps));
    //console.log(numbers);
    //console.log("Trzy jest cyfrą: ", numbers_done);
    //console.log("Cztery: ", cztery);
    //console.log("Numbers done 2", numbers_done2);
    //console.log("Kproces: ", k_proces);
    //console.log("Szesc: ", szesc());
    //console.log("K: ", k);
  };

  button.addEventListener('click', control_num);

})();
