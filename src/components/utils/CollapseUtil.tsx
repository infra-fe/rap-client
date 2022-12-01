/*
 * @Author: xia xian
 * @Date: 2022-06-07 17:45:59
 * @LastEditors: xia xian
 * @LastEditTime: 2022-06-08 16:47:19
 * @Description:
 */
import { useTranslation } from 'react-i18next'
import React from 'react'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'

type Props = {
  iconStyle?: { width: string; height: string }
  desc?: string
  fold: boolean
  setFold: (value: boolean) => void
}
export default function CollapseButton(props: Props) {
  const { t } = useTranslation()
  const { iconStyle, fold, setFold } = props
  const style = iconStyle || { width: '16px', height: '16px' }
  return (
    <>
      {fold ? <span className='g-link edit mr1' onClick={() => setFold(false)}>
        <UnfoldMoreIcon style={style} />
        {t('View description')}
      </span> :
        <span className='g-link edit mr1' onClick={() => setFold(true)}>
          <UnfoldLessIcon style={style} />
          {t('Fold description')}
        </span>
      }
    </>
  )
}
