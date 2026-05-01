import styles from '../styles/City.module.css'


const formatLocalDateTime = (isoString) => {
  if (!isoString) {
    return ''
  }

  const date = new Date(isoString)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = String(date.getDate()).padStart(2, '0')
  const time = date
    .toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase()
    .replace(' ', '')

  return `${month} ${day}. ${time}`
}

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
            <p className={styles.hourlyTime}>{formatLocalDateTime(hour.time).split(' ')[2]}</p>
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
