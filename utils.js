import fetch from "node-fetch";

const almaty = {
    lat: 43.25667,
    lon: 76.92861
}

export const getYandexWeather = async () => {
    try {
        const yandexResponse = await fetch(`https://api.weather.yandex.ru/v2/informers?lat=${almaty.lat}&lon=${almaty.lon}`, {
            method: 'GET',
            headers: {
                'X-Yandex-API-Key': '41f3eb2c-a229-4ae2-b1e2-ed2aaf4b2481'
            }
        });
        const data = await yandexResponse.json();
        return data
    } catch (error) {
        console.log(error)
    }
}
