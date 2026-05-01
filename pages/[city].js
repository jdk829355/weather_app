import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import styles from '../styles/City.module.css'
import { cities } from '../data/cityInfo'

const WEATHER_QUERY = gql`
  query WeatherPageData($city: String!) {
    weatherPageData(city: $city) {
      currentWeather {
        date
        temp
        feels_like
        description
        wind_speed
        humidity
      }
      dailyWeather {
        date
        hourlyWeather {
          time
          min_temp
          max_temp
          description
          icon
        }
      }
      city
      country
      population
    }
  }
`

export default function CityPage({ city }) {
  const { data, loading, error } = useQuery(WEATHER_QUERY, {
    variables: { city: city },
  })
  
  const [openDays, setOpenDays] = useState({ 0: true })
  
  const toggleDay = (index) => {
    setOpenDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }
  
  if (loading || error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p>{loading ? 'Loading...' : error ? 'Error loading data' : 'City not found'}</p>
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
        <title>Weather Information for {data.weatherPageData.city}</title>
        <meta name="description" content={`Weather forecast for ${data.weatherPageData.city}`} />
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
            Weather Information for {data.weatherPageData.city}
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
              <p className={styles.currentDate}>{data.weatherPageData.currentWeather.date}</p>
              <div className={styles.currentCityRow}>
                <p className={styles.currentCity}>
                  {data.weatherPageData.city}, {data.weatherPageData.country}
                </p>
                <p className={styles.currentPopulation}>
                  (인구수 : {data.weatherPageData.population.toLocaleString()})
                </p>
              </div>
            </div>
          </div>
          <div className={styles.currentRight}>
            <p className={styles.currentTemp}>
              {data.weatherPageData.currentWeather.temp.toLocaleString() + "℃"}
            </p>
            <p className={styles.currentDetail}>
              Feels like {data.weatherPageData.currentWeather.feels_like.toLocaleString() + "℃"} {data.weatherPageData.currentWeather.description} 풍속{' '}
              {data.weatherPageData.currentWeather.wind_speed}m/s 습도 {data.weatherPageData.currentWeather.humidity}%
            </p>
          </div>
        </div>

        <div className={styles.forecastContainer}>
          <div className={styles.forecastHeader}>
            <h2 className={styles.forecastHeaderTitle}>5-day Forecast</h2>
          </div>

          {data.weatherPageData.dailyWeather.map((day, index) => (
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
                />
              </button>

              {openDays[index] && (
                <div className={styles.hourlyList}>
                  {day.hourlyWeather.map((hour) => (
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
                          {hour.min_temp.toLocaleString() + "℃"} / {hour.max_temp.toLocaleString() + "℃"}
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