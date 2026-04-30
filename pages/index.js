import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { cities } from '../data/mockData'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Check weather information for your city" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.content}>
        <div className={styles.title}>
          <h1 className={styles.titleLine1}>Welcome to</h1>
          <h1 className={styles.titleLine2}>Weather App!</h1>
        </div>

        <p className={styles.subtitle}>
          Choose a city from the list below to check the weather.
        </p>

        <div className={styles.buttonGroup}>
          {cities.map((city) => (
            <Link key={city} href={`/${city}`}>
              <a className={styles.cityButton}>{city}</a>
            </Link>
          ))}
        </div>

        <div className={styles.earthImage}>
          <img src={"/earth_image.png"} alt="Earth globe illustration" />
        </div>
      </div>
    </div>
  )
}
