import { useTranslation } from 'react-i18next'
import React from 'react'
import RSortable from './RSortable'
import { Random } from 'mockjs'

const RandomBackground = () => ({ background: Random.color() })

export default function RSortableExample() {
  const { t } = useTranslation()
  return (
    <RSortable group="depth-0">
      <ul>
        <li className="sortable p6" style={RandomBackground()}>
          <div className="flex-row">
            <div className="flex-col flex-col-40">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
            <div className="flex-col flex-col-30">bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</div>
            <div className="flex-col flex-col-30">ccccccccccccccccccccccccccccccccccccc</div>
          </div>
          <div className="flex-row">
            <div className="flex-col flex-col-40">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
            <div className="flex-col flex-col-30">bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</div>
            <div className="flex-col flex-col-30">ccccccccccccccccccccccccccccccccccccc</div>
          </div>
          <span>{t('Repository')}1</span>
          <RSortable group="depth-1.1">
            <ul>
              <li className="sortable p6" style={RandomBackground()}>
                <span>{t('Module')} 1.1</span>
                <RSortable group="depth-1.2">
                  <ul>
                    <li className="sortable p6" style={RandomBackground()}>{t('API')} 1.1.1</li>
                    <li className="sortable p6" style={RandomBackground()}>{t('API')} 1.1.2</li>
                    <li className="sortable p6" style={RandomBackground()}>{t('API')} 1.1.3</li>
                  </ul>
                </RSortable>
              </li>
              <li className="sortable p6" style={RandomBackground()}>{t('Module')} 1.2</li>
              <li className="sortable p6" style={RandomBackground()}>{t('Module')} 1.3</li>
            </ul>
          </RSortable>
        </li>
        <li className="sortable p6" style={RandomBackground()}>
          <span>{t('Repository')}2</span>
          <RSortable group="depth-2.1">
            <ul>
              <li className="sortable p6" style={RandomBackground()}>
                <span>{t('Module')} 2.1</span>
                <RSortable group="depth-2.2">
                  <ul>
                    <li className="sortable p6" style={RandomBackground()}>{t('API')} 2.1.1</li>
                    <li className="sortable p6" style={RandomBackground()}>{t('API')} 2.2.2</li>
                    <li className="sortable p6" style={RandomBackground()}>{t('API')} 2.2.3</li>
                  </ul>
                </RSortable>
              </li>
              <li className="sortable p6" style={RandomBackground()}>{t('Module')} 2.2</li>
              <li className="sortable p6" style={RandomBackground()}>{t('Module')} 2.3</li>
            </ul>
          </RSortable>
        </li>
        <li className="sortable p6" style={RandomBackground()}>{t('Organization')}</li>
        <li className="sortable p6" style={RandomBackground()}>{t('User')}</li>
      </ul>
    </RSortable>
  )
}
