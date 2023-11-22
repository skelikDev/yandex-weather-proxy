import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const almaty = {
    lat: 43.25667,
    lon: 76.92861
}

const transformWeatherData = (data) => {
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

const getDateString = (dateInput) => {
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

app.listen(port, () => {
    console.log(`Прокси-сервер запущен на порту --- ${port}`);
});