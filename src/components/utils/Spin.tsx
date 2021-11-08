import { useTranslation } from 'react-i18next'
import React from 'react'
import './Spin.css'

export default function Spin() {
  const { t } = useTranslation()
  return (
    <section className="Spin">
      <div className="three-bounce">
        {t('Try very hard to loading in')}...(*╹▽╹*)
      </div>
    </section>
  )}
