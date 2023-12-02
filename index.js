import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const almaty = {
    lat: 43.25667,
    lon: 76.92861
}

export class Weather {
    data = null;

    fetchNewData = async () => {
        try {
            const yandexResponse = await fetch(`https://api.weather.yandex.ru/v2/informers?lat=${almaty.lat}&lon=${almaty.lon}`, {
                method: 'GET',
                headers: {
                    'X-Yandex-API-Key': '41f3eb2c-a229-4ae2-b1e2-ed2aaf4b2481'
                }
            });
            const fetchedData = await yandexResponse.json();
            return {
                forecast: transformWeatherData(fetchedData),
                now: getDateString(fetchedData.now_dt)
            }
        } catch (error) {
            console.log(error)
            this.data = null;
        }
    }
}

export const weatherService = new Weather()


export const transformWeatherData = (data) => {
    const transformedData = [{
        icon: data.fact.icon,
        temp: data.fact.temp,
        part_name: 'now'
    }]

    data?.forecast?.parts?.forEach(({temp_avg, icon, part_name}) => {
        transformedData.push({
            icon: icon,
            temp: temp_avg,
            part_name: part_name,
        })
    })

    return transformedData
}

export const getDateString = (dateInput) => {
    const almatyTime = new Date(dateInput);
    const date = {
        hours: almatyTime.getHours().toString().padStart(2, '0'),
        minutes: almatyTime.getMinutes().toString().padStart(2, '0'),
        day: almatyTime.getDate().toString().padStart(2, '0'),
        month: (almatyTime.getMonth() + 1).toString().padStart(2, '0'),
        year: almatyTime.getFullYear(),

    }
    return `По данным на ${date.hours}:${date.minutes} ${date.day}.${date.month}.${date.year}`
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const yandexResponse = await fetch(`https://api.weather.yandex.ru/v2/informers?lat=${almaty.lat}&lon=${almaty.lon}`, {
            method: 'GET',
            headers: {
                'X-Yandex-API-Key': '41f3eb2c-a229-4ae2-b1e2-ed2aaf4b2481'
            }
        });
        const data = await yandexResponse.json();
        res.send(data);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});


app.get('/transformed', async (req, res) => {
    try {
        const yandexResponse = await fetch(`https://api.weather.yandex.ru/v2/informers?lat=${almaty.lat}&lon=${almaty.lon}`, {
            method: 'GET',
            headers: {
                'X-Yandex-API-Key': '41f3eb2c-a229-4ae2-b1e2-ed2aaf4b2481'
            }
        });
        const data = await yandexResponse.json();
        res.send({
            forecast: transformWeatherData(data),
            now: getDateString(data.now_dt)
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

const PART_NAME = {
    now: 'Сейчас',
    night: 'Ночь',
    morning: 'Утро',
    day: 'День',
    evening: 'Вечер',
}

const ELEMENT_IDS = [
    "now",
    "next",
    "nextAfter",
]

app.get('/html', async (req, res) => {
    const data = await weatherService.fetchNewData()

    const createCard = (elementId, icon, temp, part_name, index) => {
        return `
         <div id="${elementId}" class="card">
            <span class="title">
               ${PART_NAME[part_name]}
            </span>
            <div class="icon">
                <img src="image/weather/${icon}.svg" alt="${icon}"/>
            </div>
            <span class="temperature">
                ${temp}°
            </span>
        </div>
`
    }
    const cards = data.forecast.map(({
                                         icon,
                                         temp,
                                         part_name
                                     }, index) => createCard(ELEMENT_IDS[index], icon, temp, part_name, index)).join('')

    $('#date').append(json?.now)

    const html = `
        <!DOCTYPE html> 
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Yandex Weather</title>
            <link rel="stylesheet" type="text/css" href="css/style.css">
        </head>
        <body>
            <div class="content">
                 <div class="cards">
                    ${cards}
       
                 </div>
                 <div class="footer">
                     <img class="logo" src="image/logo.svg"/>
                     <span id="date" class="date">
                     ${data.now}
                     </span>
                 </div>
            </div>
        </body>
        </html>
`
    res.send(html);

});


app.listen(port, () => {
    console.log(`Прокси-сервер запущен на порту --- ${port}`);
});
