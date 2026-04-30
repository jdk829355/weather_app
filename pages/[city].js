import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/City.module.css'
import { cities, mockWeatherData } from '../data/mockData'

export default function CityPage({ city }) {
  const data = mockWeatherData[city]
  const [openDays, setOpenDays] = useState({ 0: true })

  const toggleDay = (index) => {
    setOpenDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p>City not found</p>
          <Link href="/">
            <a className={styles.backLink}>← Back to main</a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather Information for {data.name}</title>
        <meta name="description" content={`Weather forecast for ${data.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.content}>
        <Link href="/">
          <a className={styles.backLink}>← Back to main</a>
        </Link>

        <div className={styles.header}>
          <div className={styles.headerImage}>
            <img src={"/earth_image.png"} alt="Earth globe illustration" />
          </div>
          <h1 className={styles.headerTitle}>
            Weather Information for {data.name}
          </h1>
        </div>

        <div className={styles.currentWeather}>
          <div className={styles.currentLeft}>
            <div className={styles.weatherIconLarge}>
              <span>
                Weather
                <br />
                icon
              </span>
            </div>
            <div className={styles.currentInfo}>
              <p className={styles.currentDate}>{data.current.date}</p>
              <div className={styles.currentCityRow}>
                <p className={styles.currentCity}>
                  {data.name}, {data.country}
                </p>
                <p className={styles.currentPopulation}>
                  (인구수 : {data.population.toLocaleString()})
                </p>
              </div>
            </div>
          </div>
          <div className={styles.currentRight}>
            <p className={styles.currentTemp}>
              {data.current.temp.toFixed(2)}℃
            </p>
            <p className={styles.currentDetail}>
              Feels like {data.current.feelsLike.toFixed(2)}℃ {data.current.description} 풍속{' '}
              {data.current.windSpeed}m/s 습도 {data.current.humidity}%
            </p>
          </div>
        </div>

        <div className={styles.forecastContainer}>
          <div className={styles.forecastHeader}>
            <h2 className={styles.forecastHeaderTitle}>5-day Forecast</h2>
          </div>

          {data.forecast.map((day, index) => (
            <div key={day.date} className={styles.dayRow}>
              <button
                className={styles.dayHeader}
                onClick={() => toggleDay(index)}
              >
                <span>{day.date}</span>
                <span
                  className={`${styles.toggleIcon} ${
                    openDays[index] ? styles.toggleIconOpen : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {openDays[index] && (
                <div className={styles.hourlyList}>
                  {day.hourly.map((hour) => (
                    <div key={hour.time} className={styles.hourlyItem}>
                      <div className={styles.hourlyLeft}>
                        <div className={styles.weatherIconSmall}>
                          <span>
                            Weather
                            <br />
                            icon
                          </span>
                        </div>
                        <p className={styles.hourlyTime}>{hour.time}</p>
                      </div>
                      <div className={styles.hourlyRight}>
                        <p className={styles.hourlyDescription}>
                          {hour.description}
                        </p>
                        <p className={styles.hourlyTemp}>
                          {hour.temp.toFixed(2)}℃ / {hour.tempMax.toFixed(2)}℃
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = cities.map((city) => ({
    params: { city },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      city: params.city,
    },
  }
}
