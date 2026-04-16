import { fetchWeatherApi } from 'openmeteo';

const url = 'https://api.open-meteo.com/v1/forecast';

export default async function getWeatherData(lattitude, longitude) {
  try {
    /
    const params = {
        latitude: [lattitude],
        longitude: [longitude],
        hourly: [
            'uv_index',
            'uv_index_clear_sky',
            'cloud_cover',
            'cloud_cover_low',
            'cloud_cover_mid',
            'cloud_cover_high'
        ],
        forecast_days: 1
    };

    const responses = await fetchWeatherApi(url, params);
    
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();

    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const weatherData = {
      hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval())
                .map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        uvIndex:         hourly.variables(0).valuesArray(),
        uvIndexClearSky: hourly.variables(1).valuesArray(),
        cloudCover:      hourly.variables(2).valuesArray(),
      }
    };

    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      const hour = weatherData.hourly.time[i].toLocaleTimeString([], { hour: '2-digit' });
      const uv = weatherData.hourly.uvIndex[i].toFixed(1);
      const cloud = weatherData.hourly.cloudCover[i].toFixed(0);

      console.log(`Time: ${hour} | UV Index: ${uv} | Cloud Cover: ${cloud}%`);
      return(`Time: ${hour} | UV Index: ${uv} | Cloud Cover: ${cloud}%`);
    }
  } catch (e) {
    console.error("Fetch failed. Check if 'openmeteo-sdk' is installed or the URL is correct.");
    console.error("Error details:", e);
    throw e; 
  }
}