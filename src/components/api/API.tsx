import { Translation } from 'react-i18next'
import React from 'react'
import { serve } from '../../relatives/services/constant'
import './API.sass'
import { Paper } from '@mui/material'

// DONE 2.3 区分请求和响应作用域

class API extends React.Component<null> {
  render() {
    return (
      <Translation>
        {(t) => (
          <Paper className="APIList">
            <div className="header">
              <span className="title">
                {t('Platform API interface')}
              </span>
            </div>
            <div className="body">
              <div className="API">
                <div className="title">
                  {t(
                    'Get the complete repository data (JSON)'
                  )}
                </div>
                <ul>
                  <li>
                    <code>
                      {serve}
                                            /repository/get?id=:repositoryId
                    </code>
                  </li>
                </ul>
              </div>
              <div className="API">
                <div className="title">
                  {t(
                    'Get the complete interface data (JSON)'
                  )}
                </div>
                <ul>
                  <li>
                    <code>
                      {serve}
                                            /interface/get?id=:interfaceId
                    </code>
                  </li>
                </ul>
              </div>
              <div className="API">
                <div className="title">{t('pluginText')}</div>
                <ul>
                  <li>
                    <span className="label">
                      {t('Basic plugin')}
                    </span>
                    <code>
                      {serve}/app/plugin/:repositories
                    </code>
                  </li>
                </ul>
              </div>
              <div className="API">
                <div className="title">
                  {t('Get data from an interface (JSON)')}
                </div>
                <ul>
                  <li>
                    <code>
                      {serve}
                                            /app/mock/data/:interfaceId?scope=response|request
                    </code>
                    <table className="table table-bordered mt12">
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: '140px',
                            }}
                          >
                            <code>scope</code>
                          </th>
                          <th>{t('Describe')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <code>response</code>
                          </td>
                          <td>
                            {t(
                              'Get response data from an interface'
                            )}
                                                        （JSON）
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <code>request</code>
                          </td>
                          <td>
                            {t(
                              'Get request data from an interface'
                            )}
                                                        （JSON）
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                  <li>
                    <code>
                      {serve}
                                            /app/mock/:repositoryId/:method/:url
                    </code>
                  </li>
                </ul>
              </div>
              <div className="API">
                <div className="title">
                  {t('Get interface template')}（JSON）
                </div>
                <ul>
                  <li>
                    <code>
                      {serve}
                                            /app/mock/template/:interfaceId?scope=response|request
                    </code>
                    <table className="table table-bordered mt12">
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: '120px',
                            }}
                          >
                            <code>scope</code>
                          </th>
                          <th>{t('Describe')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <code>response</code>
                          </td>
                          <td>
                            {t(
                              'Get response template from an interface'
                            )}
                                                        （JSON）
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <code>request</code>
                          </td>
                          <td>
                            {t(
                              'Get request template from an interface'
                            )}
                                                        （JSON）
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </ul>
              </div>
              <div className="API">
                <div className="title">
                  {t('Get interface template')}（JSON Schema）
                </div>
                <ul>
                  <li>
                    <code>
                      {serve}
                                            /app/mock/schema/:interfaceId?scope=response|request
                    </code>
                    <table className="table table-bordered mt12">
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: '120px',
                            }}
                          >
                            <code>scope</code>
                          </th>
                          <th>{t('Describe')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <code>response</code>
                          </td>
                          <td>
                            {t(
                              'Get response template from an interface'
                            )}
                                                        （JSON Schema）
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <code>request</code>
                          </td>
                          <td>
                            {t(
                              'Get request template from an interface'
                            )}
                                                        （JSON Schema）
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </ul>
              </div>
            </div>
          </Paper>
        )}
      </Translation>
    )
  }
}

export default API
