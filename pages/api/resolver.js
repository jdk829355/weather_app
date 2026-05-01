export const resolver = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const cityToCoordinates = await import('../../data/cityInfo').then(module => module.cityToCoordinates);
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

    function formatTimezoneOffset(seconds) {
        const sign = seconds >= 0 ? '+' : '-';
        const abs = Math.abs(seconds);
        const h = Math.floor(abs / 3600).toString().padStart(2, '0');
        const m = Math.floor((abs % 3600) / 60).toString().padStart(2, '0');
        return `${sign}${h}:${m}`;
    }

    function formatDateTime(dt, timezoneSeconds) {
        const date = new Date((dt + timezoneSeconds) * 1000);
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(date.getUTCDate()).padStart(2, '0');
        const hh = String(date.getUTCHours()).padStart(2, '0');
        const min = String(date.getUTCMinutes()).padStart(2, '0');
        const ss = String(date.getUTCSeconds()).padStart(2, '0');
        const offset = formatTimezoneOffset(timezoneSeconds);
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${offset}`;
    }

    function parseDtTxtToLocal(dtTxt, timezoneSeconds) {
        const utcDate = new Date(dtTxt + 'Z');
        const localTimestamp = utcDate.getTime() + timezoneSeconds * 1000;
        const localDate = new Date(localTimestamp);
        const yyyy = localDate.getUTCFullYear();
        const mm = String(localDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(localDate.getUTCDate()).padStart(2, '0');
        const hh = String(localDate.getUTCHours()).padStart(2, '0');
        const min = String(localDate.getUTCMinutes()).padStart(2, '0');
        const ss = String(localDate.getUTCSeconds()).padStart(2, '0');
        const offset = formatTimezoneOffset(timezoneSeconds);
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${offset}`;
    }

    function formatWeatherDate(isoString) {
        const date = new Date(isoString);

        const month = date.toLocaleString('en-US', { month: 'short' });
        

        const day = String(date.getDate()).padStart(2, '0');

        const time = date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase().replace(' ', '');

        return {
            full: `${month} ${day}. ${time}`,
            dateOnly: `${month} ${day}`,
            timeOnly: time                
        };
    }

    const currentWeather = {
        date: formatWeatherDate(formatDateTime(currentWeatherData.dt, timezoneOffset)).full,
        temp: currentWeatherData.main.temp,
        feels_like: currentWeatherData.main.feels_like,
        description: currentWeatherData.weather[0].description,
        wind_speed: currentWeatherData.wind.speed,
        humidity: currentWeatherData.main.humidity,
    };

    const dailyWeatherMap = {};
    for (const item of dailyData.list) {
        const localTimeStr = formatWeatherDate(parseDtTxtToLocal(item.dt_txt, timezoneOffset)).timeOnly;
        const dateStr = formatWeatherDate(parseDtTxtToLocal(item.dt_txt, timezoneOffset)).dateOnly;
        if (!dailyWeatherMap[dateStr]) {
            dailyWeatherMap[dateStr] = [];
        }
        dailyWeatherMap[dateStr].push({
            time: localTimeStr,
            min_temp: item.main.temp_min,
            max_temp: item.main.temp_max,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
        });
    }

    const dailyWeather = Object.entries(dailyWeatherMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, hourlyWeather]) => ({
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
