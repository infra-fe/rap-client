import { Translation } from 'react-i18next'
import React, { Component } from 'react'
import { Link, StoreStateRouterLocationURI } from '../../family'
import { GoAlert } from 'react-icons/go'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RouterState } from 'connected-react-router'
import { Repository } from 'actions/types'

type DuplicatedInterfacesWarningState = {
  showMore: boolean
}
type DuplicatedInterfacesWarningProps = {
  repository: Repository
  router: RouterState
}
class DuplicatedInterfacesWarning extends Component<
DuplicatedInterfacesWarningProps,
DuplicatedInterfacesWarningState
> {
  static contextTypes = {
    store: PropTypes.object,
  }
  constructor(props: DuplicatedInterfacesWarningProps) {
    super(props)
    this.state = {
      showMore: false,
    }
  }

  static parseDuplicatedInterfaces(repository: Repository) {
    const counter: any = {}
    for (const mod of repository.modules) {
      for (const itf of mod.interfaces) {
        const key = `${itf.method} ${itf.url}`
        if (!counter[key]) {
          counter[key] = []
        }
        counter[key] = [...counter[key], { ...itf, mod }]
      }
    }
    const duplicated: any[] = []
    for (const key in counter) {
      if (counter[key].length > 1) {
        duplicated.push(counter[key])
      }
    }
    return duplicated
  }
  static printDuplicatedInterfacesWarning(duplicated: any) {
    duplicated.forEach((interfaces: any) => {
      const key = `${interfaces[0].method} ${interfaces[0].url}`
      // eslint-disable-next-line no-console
      console.group('警告：检测到重复接口 ' + key)
      interfaces.forEach((itf: any) => {
        // eslint-disable-next-line no-console
        console.warn(`#${itf.id} ${itf.method} ${itf.url}`)
      })
      // eslint-disable-next-line no-console
      console.groupEnd()
    })
  }

  render() {
    const { repository, router } = this.props
    const { showMore } = this.state
    if (!repository) {
      return null
    }
    const duplicated = DuplicatedInterfacesWarning.parseDuplicatedInterfaces(repository)
    if (!duplicated.length) {
      return null
    }
    const uri = StoreStateRouterLocationURI(router)
      .removeSearch('page')
      .removeSearch('itf')
    return (
      <div className="DuplicatedInterfacesWarning">
        {duplicated.map(
          (interfaces, index) =>
            (index === 0 || showMore) && (
              <div key={index} className="alert alert-warning">
                <span className="title">
                  {index === 0 && (
                    <>
                      <GoAlert className="icon" />
                      <Translation>
                        {(t) => <span className="msg">{t('Warning detected')}</span>}
                      </Translation>
                    </>
                  )}
                  <span className="itf">
                    {interfaces[0].method} {interfaces[0].url || '-'}
                  </span>
                </span>
                {interfaces.map((itf: any) => (
                  <Link
                    key={itf.id}
                    to={uri
                      .setSearch('mod', itf.mod.id)
                      .setSearch('itf', itf.id)
                      .href()}
                    className="mr12"
                  >
                    {itf.name}
                  </Link>
                ))}
                {index === 0 && duplicated.length > 1 && (
                  <span
                    className="fake-link more-link"
                    onClick={() => {
                      this.setState({
                        showMore: !showMore,
                      })
                    }}
                  >
                    <Translation>
                      {(t) => showMore ? t('fold') : t('unfold')}
                    </Translation>
                  </span>
                )}
              </div>
            )
        )}
      </div>
    )
  }
}
export default connect((state: any) => ({
  router: state.router,
}))(DuplicatedInterfacesWarning)
