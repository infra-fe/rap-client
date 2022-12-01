import configDev from './config.dev'
import configProd from './config.prod'
const config: IConfig =
  process.env.NODE_ENV === 'development' // development or production
    ? configDev
    : configProd

export default config
