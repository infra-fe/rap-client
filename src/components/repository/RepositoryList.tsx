import { Translation } from 'react-i18next'
import React from 'react'
import { Repository } from 'actions/types'
import RepositoryCom from './Repository'

interface Props {
  name: string
  repositories: Repository[]
  editor: string
}

class RepositoryList extends React.Component<Props, null> {
  render() {
    const { name, repositories, editor } = this.props
    if (!repositories.length) {
      return name
        ? <Translation>{
          (t) =>
            <div className="fontsize-20 text-center p50">{t('No match is found')} <strong>{name}</strong> {t('repositories')}</div>}
        </Translation>
        : <Translation>{(t) => <div className="fontsize-20 text-center p50">{t('There is no data')}</div>}</Translation>
    }
    return (
      <div className="RepositoryList row">
        {repositories.map(repository => (
          <div key={repository.id} >
            <RepositoryCom repository={repository} editor={editor} />
          </div>
        )
        )}
      </div>
    )
  }
}

export default RepositoryList
