// ==UserScript==
// @name         LuxMed - points from DocPlanner
// @namespace    http://www.webdudi.pl/
// @version      1.2
// @description  Get stars from site znanylekarz.pl
// @author       Piotr Dutko <p.dutko@webdudi.pl>
// @match        https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Reservation/Find
// @match        https://portalpacjenta.luxmed.pl/PatientPortal/NewPortal/Page/Reservation/Results
// @grant        none
// ==/UserScript==

function createDoctor(name, service) {
    return name + "=" + service;
}

function getDoctorName(doctor) {
    return doctor.substring(0, doctor.indexOf("="));
}

function getDoctorNameWithoutTitle(doctor) {
    return getDoctorName(doctor)
        .replace("dr n. med. ", "")
        .replace("dr n.med. ", "")
        .replace("dr hab. n. med ", "")
        .replace("lek. med. ", "")
        .replace("lek. stom. ", "");
}

function getDoctorService(doctor) {
    return doctor.substring(doctor.indexOf("=") + 1, doctor.length);
}

function getSearchParamForDoctor(doctor) {
    var doctorService = getDoctorService(doctor);
    var text = "query=" + doctorService + " " + getDoctorNameWithoutTitle(doctor) + "&hitsPerPage=4";
    return text.replace(/ /g, "%20");
}

function createPointsElements(numberOfPoints) {
    if(isNaN(numberOfPoints) || typeof numberOfPoints == 'undefined'){
        return '';
    }

    return numberOfPoints + '/5';
}

function addNoDataInfo(doctor) {
    var doctorNameDiv = $(".doctor");
    var doctorName = getDoctorName(doctor);
    for (var i = 0; i < doctorNameDiv.length; i++) {
        if (doctorNameDiv[i].textContent.trim() === doctorName) {
            $(doctorNameDiv[i]).append("&nbsp;&nbsp;");
            var text = '<a href="https://www.google.pl/search?q='+doctorName+'" target="_blank" '
            + 'title="Brak strony o danym lekarzu w serwisie znanylekarz.pl Kliknij, aby wyszukać informacji w Google">'
            + '<span style="white-space: nowrap;">brak</span></a>';
            $(doctorNameDiv[i]).append(text);
        }
    }
}

function addPointsToPage(doctor, numberOfPoints, opinionCount, url) {
    var doctorNameDiv = $(".doctor");
    var doctorName = getDoctorName(doctor);
    for (var i = 0; i < doctorNameDiv.length; i++) {
        if (doctorNameDiv[i].textContent.trim() === doctorName) {
            $(doctorNameDiv[i]).append("&nbsp;&nbsp;");
            var text = '<a href="' + url + '" target="_blank" '
            + 'title="Przejdź do strony znanylekarz.pl, aby zobaczyć wszystkie opinie.">'
            + '<span style="white-space: nowrap;">'
            + createPointsElements(numberOfPoints) + '</span>&nbsp;('+opinionCount+')</a>';
            $(doctorNameDiv[i]).append(text);
        }
    }
}

function loadDoctor(doctor) {
    var argumentsa = {
        params: getSearchParamForDoctor(doctor),
        apiKey: "90a529da12d7e81ae6c1fae029ed6c8f",
        appID: "docplanner"
    };
    var doctorResponse = $.post("https://docplanner-3.algolia.io/1/indexes/pl_autocomplete_doctor/query",
                                JSON.stringify(argumentsa));
    doctorResponse.done(function (data) {
        if (data.hits.length > 0) {
            var numberOfStars = parseFloat(data.hits[0].stars);
            var opinionCount = data.hits[0].opinionCount;
            addPointsToPage(doctor, numberOfStars, opinionCount, data.hits[0].url.replace("http://", "https://"));
        } else {
            addNoDataInfo(doctor);
        }
    });
}

function loadPoints(doctors) {
    doctors.forEach(loadDoctor);
}


var serviceLuxToDocPlanner = new Map();
serviceLuxToDocPlanner.set("Konsultacja alergologa", "alergolog");
serviceLuxToDocPlanner.set("Konsultacja chirurga dzieci", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja chirurga ogólnego", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja chirurga naczyniowego", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja chirurga plastyka", "chirurg plastyczny");
serviceLuxToDocPlanner.set("Konsultacja chirurga onkologa", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja dermatologa", "dermatolog");
serviceLuxToDocPlanner.set("Konsultacja dermatologa - dzieci", "dermatolog");
serviceLuxToDocPlanner.set("Konsultacja diabetologa", "dermatolog");
serviceLuxToDocPlanner.set("Konsultacja endokrynologa", "endokrynolog");
serviceLuxToDocPlanner.set("Konsultacja flebologiczna", "flebolog");
serviceLuxToDocPlanner.set("Konsultacja gastroenterologa", "gastrolog");
serviceLuxToDocPlanner.set("Konsultacja ginekologa", "ginekolog");
serviceLuxToDocPlanner.set("Konsultacja ginekologa - endokrynologa", "ginekolog");
serviceLuxToDocPlanner.set("Konsultacja hematologa", "hematolog");
serviceLuxToDocPlanner.set("Konsultacja hepatologiczna", "gastrolog");
serviceLuxToDocPlanner.set("Konsultacja internisty", "internista");
serviceLuxToDocPlanner.set("Konsultacja internistyczna - Centrum Infekcyjne", "internista");
serviceLuxToDocPlanner.set("Konsultacja kardiologa", "kardiolog");
serviceLuxToDocPlanner.set("Konsultacja laryngologa", "laryngolog");
serviceLuxToDocPlanner.set("Konsultacja lekarza rodzinnego", "lekarz rodzinny");
serviceLuxToDocPlanner.set("Konsultacja nefrologa", "nefrolog");
serviceLuxToDocPlanner.set("Konsultacja neurochirurga", "neurochirurg");
serviceLuxToDocPlanner.set("Konsultacja neurologa", "neurolog");
serviceLuxToDocPlanner.set("Konsultacja neurologa - dzieci", "neurolog dziecięcy");
serviceLuxToDocPlanner.set("Konsultacja okulisty", "okulista");
serviceLuxToDocPlanner.set("Konsultacja okulisty - dzieci", "okulista dziecięcy");
serviceLuxToDocPlanner.set("Konsultacja onkologa", "onkolog");
serviceLuxToDocPlanner.set("Konsultacja ortopedy", "ortopeda");
serviceLuxToDocPlanner.set("Konsultacja ortopedy - dzieci", "ortopeda dziecięcy");
serviceLuxToDocPlanner.set("Konsultacja pediatry - szczepienia dzieci do lat 6", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja pediatry - w gabinecie dzieci chorych", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja pediatry - w gabinecie dzieci zdrowych", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja pediatry - w gabinecie dzieci zdrowych - bilans", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja proktologa", "proktolog");
serviceLuxToDocPlanner.set("Konsultacja pulmonologa", "pulmonolog");
serviceLuxToDocPlanner.set("Konsultacja reumatologa", "reumatolog");
serviceLuxToDocPlanner.set("Konsultacja urologa", "urologa");
serviceLuxToDocPlanner.set("Kwalifikacja - do szczepienia dorośli", "lekarz rodzinny");
serviceLuxToDocPlanner.set("Kwalifikacja - do szczepienia dzieci powyżej 6 r.ż.", "lekarz rodzinny");
serviceLuxToDocPlanner.set("Umówienie wizyty na scaling (usuwanie złogów)", "stomatolog");
serviceLuxToDocPlanner.set("Umówienie wizyty u chirurga stomatologa", "stomatolog");
serviceLuxToDocPlanner.set("Umówienie wizyty u stomatologa", "stomatolog");
serviceLuxToDocPlanner.set("Umówienie wizyty u stomatologa dziecięcego", "stomatolog dziecięcy");

(function() {
    'use strict';

    var doctorNames = $(".doctor");
    var favour = $('.service .item');
    var doctors = new Set();
    for (var i = 0; i < doctorNames.length; i++) {
        var doctor = createDoctor(doctorNames[i].textContent.trim(), favour.text().trim());
        doctors.add(doctor);
    }

    loadPoints(doctors);


})();
