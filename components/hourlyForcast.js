import styles from '../styles/City.module.css'

export default function HourlyWeatherList({ hourlyData }) {
  return (
    <ul className={styles.hourlyList}>
      {hourlyData.map((hour) => (
        <li key={hour.time} className={styles.hourlyItem}>
          <div className={styles.hourlyLeft}>
            <figure className={styles.weatherIconSmall}>
              <img
                src={`https://openweathermap.org/payload/api/media/file/${hour.icon}.png`}
                alt=""
              />
            </figure>
            <p className={styles.hourlyTime}>{hour.time}</p>
          </div>
          <div className={styles.hourlyRight}>
            <p className={styles.hourlyDescription}>{hour.description}</p>
            <p className={styles.hourlyTemp}>
              {hour.min_temp.toLocaleString() + "℃"} / {hour.max_temp.toLocaleString() + "℃"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
