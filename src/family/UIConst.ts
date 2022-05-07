import { TFunction } from 'i18next'

export const FORM = (t) => ({
  RADIO_LIST_DATA_VISIBILITY: [
    { 'label': t('private'), 'value': false },
    { 'label': t('public'), 'value': true },
  ],
})

export const YUP_MSG = (t: TFunction) => ({
  REQUIRED: t('required1'),
  MAX_LENGTH: (n: number) => `${t('maxLength')}${n}`,
  MIN_LENGTH: (n: number) => `${t('minLenth')}${n}`,
  PHOTO_REQUIRED: t('Please select a picture'),
})
