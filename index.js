import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const almaty = {
    lat:43.25667,
    lon:76.92861
}

const app = express();
const port = 80;

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

app.listen(port, () => {
    console.log(`Прокси-сервер запущен на порту --- ${port}`);
});