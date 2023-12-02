import {weatherService} from "../../index.js";

const WEATHER_NAME = {
    "clear": "ясно",
    "partly-cloudy": "малооблачно",
    "cloudy": "облачно с прояснениями",
    "overcast": "пасмурно",
    "light-rain": "небольшой дождь",
    "rain": "дождь",
    "heavy-rain": "сильный дождь",
    "showers": "ливень",
    "wet-snow": "дождь со снегом",
    "light-snow": "небольшой снег",
    "snow": "снег",
    "snow-showers": "снегопад",
    "hail": "град",
    "thunderstorm": "гроза",
    "thunderstorm-with-rain": "дождь с грозой",
    "thunderstorm-with-hail": "гроза с градом",
}

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

const replaceCardInfo = (elementId, icon, temp, part_name, index) => {
    $(`#${elementId} .title`).append(PART_NAME[part_name])

    const iconImg = $(`<img src="image/weather/${icon}.svg" alt="${icon}"/>`)

    $(`#${elementId} .icon`).append(iconImg)

    $(`#${elementId} .temperature`).append(temp + '°')

}

const getAndRender = () => {

    $('#date').append(weatherService.data?.now)
    weatherService.data?.forecast?.forEach(({icon, temp, part_name,}, index) => {
        replaceCardInfo(ELEMENT_IDS[index], icon, temp, part_name, index)
    })


}

$(document).ready(function () {
    getAndRender()
})
