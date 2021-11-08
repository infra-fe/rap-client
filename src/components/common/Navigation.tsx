import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoHome, GoRepo, GoOrganization, GoPulse, GoPlug } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
export default function Navigation() {
  const { t } = useTranslation()
  return (
    <ul className="nav-links">
      <li><NavLink exact={true} to="/" activeClassName="selected"><GoHome /> {t('Home')}</NavLink></li>
      <li><NavLink to="/repository" activeClassName="selected"><GoRepo /> {t('Repository')}</NavLink></li>
      <li><NavLink to="/organization" activeClassName="selected"><GoOrganization /> {t('Organization')}</NavLink></li>
      <li><NavLink to="/api" activeClassName="selected"><GoPlug /> {t('API')}</NavLink></li>
      <li><NavLink to="/status" activeClassName="selected"><GoPulse /> {t('Status')}</NavLink></li>
    </ul>
  )}
