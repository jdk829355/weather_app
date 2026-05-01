import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import styles from '../styles/City.module.css'
import { cities } from '../data/cityInfo'
import dynamic from 'next/dynamic'

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
        icon
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

  const [openDays, setOpenDays] = useState({})

  const toggleDay = (index) => {
    setOpenDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (loading || error || !data) {
    return (
      <main className={styles.container}>
        <article className={styles.content}>
          <Link href="/">
            <a className={styles.backLink}>← Back to main</a>
          </Link>
          <p>{loading ? 'Loading...' : error ? 'Error loading data' : 'City not found'}</p>
        </article>
      </main>
    )
  }

  const HourlyWeatherList = dynamic(() => import('../components/hourlyForcast'), {
    loading: () => <p style={{ padding: '20px', textAlign: 'center' }}>Loading hourly forecast...</p>,
    ssr: false
  });

  return (
    <main className={styles.container}>
      <Head>
        <title>Weather Information for {data.weatherPageData.city}</title>
        <meta name="description" content={`Weather forecast for ${data.weatherPageData.city}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.content}>
        <Link href="/">
          <a className={styles.backLink}>← Back to main</a>
        </Link>

        <header className={styles.header}>
          <figure className={styles.headerImage}>
            <img src={"/earth_image.png"} alt="" />
          </figure>
          <h1 className={styles.headerTitle} id="page-title">
            Weather Information for {data.weatherPageData.city}
          </h1>
        </header>

        <section className={styles.currentWeather} aria-label="Current weather conditions">
          <div className={styles.currentLeft}>
            <figure className={styles.weatherIconLarge}>
              <span>
                <img
                src={`https://openweathermap.org/payload/api/media/file/${data.weatherPageData.currentWeather.icon}.png`}
                alt=""
              />
              </span>
            </figure>
            <div className={styles.currentInfo}>
              <p className={styles.currentDate}>
                {data.weatherPageData.currentWeather.date}
              </p>
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
        </section>

        <section className={styles.forecastContainer} aria-labelledby="forecast-heading">
          <header className={styles.forecastHeader}>
            <h2 className={styles.forecastHeaderTitle} id="forecast-heading">5-day Forecast</h2>
          </header>

          {data.weatherPageData.dailyWeather.map((day, index) => (
            <article key={day.date} className={styles.dayRow}>
              <button
                className={styles.dayHeader}
                onClick={() => toggleDay(index)}
                aria-expanded={openDays[index] || false}
                aria-controls={`hourly-list-${index}`}
              >
                <span>{day.date}</span>
                <span
                  className={`${styles.toggleIcon} ${
                    openDays[index] ? styles.toggleIconOpen : ''
                  }`}
                />
              </button>

              {openDays[index] && (
                <div id={`hourly-list-${index}`}>
                  <HourlyWeatherList hourlyData={day.hourlyWeather} />
                </div>
              )}
            </article>
          ))}
        </section>
      </article>
    </main>
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
