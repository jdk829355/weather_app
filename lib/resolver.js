import { cityToCoordinates } from '../data/cityInfo';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const resolver = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const {lat, lon} = cityToCoordinates[city];
    
    // 좌표에 따라 도시 이름이 누락되거나 인구가 안 뜨는 문제가 발생하였습니다. (Paris 인구가 누락되는 문제가 발생했었습니다.)
    // 그래서 Deprecated되었지만 사용할 수 있는 api로 변경하였습니다. (https://openweathermap.org/current#name)
    // const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    // const dailyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const dailyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;



    const promises = [
        fetch(currentWeatherUrl),
        fetch(dailyUrl)
    ];

    const results = await Promise.all(promises); 
    const data = await Promise.all(results.map(r => r.json()));

    const [currentWeatherData, dailyData] = data;

    const timezoneOffset = currentWeatherData.timezone;

    function formatWeatherDate(dt, timezone) {
        const date = new Date((dt + timezone) * 1000);
        const month = MONTH_NAMES[date.getUTCMonth()];
        const day = String(date.getUTCDate()).padStart(2, '0');

        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const meridiem = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        if (hours === 0) {
            hours = 12;
        }

        const time = `${String(hours).padStart(2, '0')}:${minutes}${meridiem}`;

        return {
            full: `${month} ${day}. ${time}`,
            dateOnly: `${month} ${day}`,
            timeOnly: time
        };
    }


    const currentWeather = {
        date: formatWeatherDate(currentWeatherData.dt, currentWeatherData.timezone).full,
        temp: currentWeatherData.main.temp,
        feels_like: currentWeatherData.main.feels_like,
        description: currentWeatherData.weather[0].description,
        wind_speed: currentWeatherData.wind.speed,
        humidity: currentWeatherData.main.humidity,
        icon: currentWeatherData.weather[0].icon,
    };

    const dailyWeatherMap = {};
    for (const item of dailyData.list) {
        const localDateTime = formatWeatherDate(item.dt, dailyData.city.timezone);
        const localTimeStr = localDateTime.timeOnly;
        const dateStr = localDateTime.dateOnly;
        if (!dailyWeatherMap[dateStr]) {
            dailyWeatherMap[dateStr] = {
                dt: item.dt,
                hourlyWeather: []
            };
        }
        dailyWeatherMap[dateStr].hourlyWeather.push({
            time: localTimeStr,
            min_temp: item.main.temp_min,
            max_temp: item.main.temp_max,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
        });
    }

    const dailyWeather = Object.entries(dailyWeatherMap)
        .sort(([, {dt:a}], [, {dt:b}]) => a - b)
        .map(([date, { hourlyWeather }]) => ({
            date,
            hourlyWeather,
        }));

    return {
        currentWeather,
        dailyWeather,
        city: currentWeatherData.name,
        country: currentWeatherData.sys.country,
        population: dailyData.city?.population || 0,
    };
};
