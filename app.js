let meteolist = document.getElementById("meteolist");
let formel = document.getElementById("villeform");
let theme = document.getElementById("theme");
let temperateuretoday = document.getElementById("temperaturenow");
let sunormoonicon = document.getElementById("sunormoonicon");
let dateetheure = document.querySelectorAll("#dateettempsdujour > p");
let temperatures = [];
let datestimes = [];
let monthfr = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
let refreshtime = () => {
    setTimeout(() => {
        dateetheure[0].innerText = `${new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes() }:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`;
        refreshtime()
    }, 1000);
}
let convertKelvinToCelsus = ((Kelvin) => {
    return Math.round(Kelvin - 273.15);
})
formel.addEventListener("submit", (sa) => {
    sa.preventDefault();
    console.log(sa.currentTarget.children[0].value)
})
document.addEventListener("readystatechange", () => {
    dateetheure[0].innerText = `${new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes() }:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`;
    refreshtime()
    dateetheure[1].innerText = `${new Date().getDay()} ${monthfr[new Date().getMonth()]} ${new Date().getFullYear()}`
    // theme.attributes.href.value = "style_dark.css"
    // sunormoonicon.innerText = "nights_stay";
    if (new Date().getHours() > 18 && new Date().getHours() < 6){
        theme.attributes.href.value = "style_dark.css"
        sunormoonicon.innerText = "nights_stay";
    }
})
fetch("http://api.openweathermap.org/data/2.5/forecast?q=marseille&appid=862bbec994cb9acf4aef317403669345")
    .then(blabla => blabla.json())
    .then(data => {
        temperateuretoday.innerText = `${convertKelvinToCelsus(data.list[0].main.temp)} °C`;
        data.list.forEach(jour => {
            if (jour.dt_txt.includes("12:00:00")) {
                meteolist.insertAdjacentHTML("beforeend", `<li class='meteodegreeitem'><p>${jour.dt_txt.replace("12:00:00", "").replaceAll("-", "/")} : ${convertKelvinToCelsus(jour.main.temp)}°C</p></li>`);
                
            }
            // let ladate = jour.dt_txt.substr(0, 10).split("-").map(da => parseInt(da))
            // if (ladate[0] == new Date().getFullYear() && ladate[1] == (new Date().getMonth() + 1) && ladate[2] == new Date().getDate()) {
                datestimes.push(jour.dt_txt)
                temperatures.push(convertKelvinToCelsus(jour.main.temp))
            // }
            
        });
        ScrollReveal().reveal('.meteodegreeitem', { delay: 200 });
        setTimeout(() => {
            var ctx = document.getElementById('myChart').getContext('2d');
            var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
            gradientStroke.addColorStop(0, "#80b6f4");
            gradientStroke.addColorStop(1, "#f49080");
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: datestimes,
                        datasets: [{
                            borderColor:               gradientStroke,
                            pointBorderColor:          gradientStroke,
                            pointBackgroundColor:      gradientStroke,
                            pointHoverBackgroundColor: gradientStroke,
                            pointHoverBorderColor:     gradientStroke,
                            label: 'prediction de la journer',
                            backgroundColor: 'rgb(25, 99, 132)',
                            borderColor: 'rgb(198, 21, 132)',
                            data: temperatures
                        }]
                    },

                    // Configuration options go here
                    options: {
                        maintainAspectRatio: false
                    }
                });
        }, 1000);
    })
