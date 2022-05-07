import { useTranslation } from 'react-i18next'
import React from 'react'
import { Link } from '../../family'
import { Spin } from '../utils'
import { Card } from '@mui/material'
import { Repository } from 'actions/types'

const OwnedRepositoriesCard = ({ repositories }: any) => {
  const { t } = useTranslation()
  return (
    <Card>
      <div className="card-header">{t('My own repository')}</div>
      {repositories.fetching ? <Spin /> : (
        <div className="card-block">
          {repositories.data.slice(0, 10).map((repository: Repository) =>
            <p key={repository.id}><OwnedRepositoryLink repository={repository} /></p>
          )}
          {repositories.data.length === 0 ? <span>-</span> : null}
          {repositories.data.length > 10
            ? <Link to="/repository/joined">{'=>'} {t('Look at all')} {repositories.data.length} {t('repositories')}</Link>
            : null
          }
        </div>)
      }
    </Card>
  )}
const OwnedRepositoryLink = ({ repository }: any) => {
  return (
    <Link to={`/repository/editor?id=${repository.id}`}>
      <span>{repository.organization ? repository.organization.name + ' / ' : ''}</span>
      <span>{repository.name}</span>
    </Link>
  )}

export default OwnedRepositoriesCard
