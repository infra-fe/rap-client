/*
 * @Author: xia xian
 * @Date: 2021-09-22 13:55:13
 * @LastEditors: xia xian
 * @LastEditTime: 2021-09-26 19:19:02
 * @Description:
 */
import LanguageDetector from 'i18next-browser-languagedetector'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import cn from './zh-cn.json'
import en from './en-us.json'


export const resources = {
  'zh': {
    translation: cn,
    name: '中',
  },
  'en': {
    translation: en,
    name: 'EN',
  },
}

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    },
  })

export default i18n
