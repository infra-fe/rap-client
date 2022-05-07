import { useTranslation, Translation } from 'react-i18next'
import React from 'react'
import { serve } from '../../relatives/services/constant'
import './API.css'
import { Paper, Button } from '@mui/material'

const ExampleJQuery = () => {
  const { t } = useTranslation()
  return (
    <div>
      <ul>
        <li>{t('First introduce the jQuery plugin')}</li>
        <li>{t('To introduce basic plug-in')}</li>
        <li>{t('Finally introduced RAP jQuery plugin')}</li>
      </ul>
      <h4>{t('The sample code')}</h4>
      <pre className="code-example">
        {
          '<script src="jquery.min.js"></script>\n' +
          '<script src="http://rap2api.taobao.org/app/plugin/:projectId"></script>\n' +
          '<script src="http://rap2api.taobao.org/libs/jquery.rap.js"></script>\n' +
          '$.ajax({\n' +
          '    url : \'/example/1501049256513\', // 自动拦截\n' +
          '    method : \'GET\',\n' +
          '    dataType : \'JSON\',\n' +
          '    success : function(data) {\n' +
          '      // 返回根据RAP文档及规则生成的mock数据\n' +
          '      $(\'#result\').html(JSON.stringify(data))\n' +
          '    }\n' +
          '})\n'
        }
      </pre>
    </div>
  )
}

// DONE 2.3 区分请求和响应作用域

type State = {
  showExampleJQuery: boolean
}

class API extends React.Component<null, State> {

  constructor(props: null) {
    super(props)
    this.state = {
      showExampleJQuery: false,
    }
  }
  render() {
    return (
      <Translation>
        {(t) => (
          <Paper className="APIList">
            <div className="header">
              <span className="title">{t('Platform API interface')}</span>
            </div>
            <div className="body">
              <div className="API">
                <div className="title">{t('Get the complete repository data (JSON)')}</div>
                <ul>
                  <li><code>{serve}/repository/get?id=:repositoryId</code></li>
                </ul>
              </div>
              <div className="API">
                <div className="title">{t('Get the complete interface data (JSON)')}</div>
                <ul>
                  <li><code>{serve}/interface/get?id=:interfaceId</code></li>
                </ul>
              </div>
              <div className="API">
                <div className="title">{t('pluginText')}</div>
                <ul>
                  <li><span className="label">{t('Basic plugin')}</span><code>{serve}/app/plugin/:repositories</code></li>
                  <li><span className="label">{t('JQuery plugin')}</span><code>{serve}/libs/jquery.rap.js</code>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={
                        e => {
                          e.preventDefault()
                          this.setState((prevState) => {
                            return { showExampleJQuery: !prevState.showExampleJQuery }
                          })
                        }
                      }
                    >
                      {t('usage')}
                    </Button>
                  </li>
                  {this.state.showExampleJQuery && <ExampleJQuery />}
                  <li><span className="label">{t('Mock js plugin')}</span><code>{serve}/libs/mock.rap.js</code></li>
                  <li><span className="label">{t('Fetch plugin')}</span><code>{serve}/libs/fetch.rap.js</code></li>
                </ul>
              </div>
              <div className="API">
                <div className="title">{t('Get data from an interface (JSON)')}</div>
                <ul>
                  <li>
                    <code>{serve}/app/mock/data/:interfaceId?scope=response|request</code>
                    <table className="table table-bordered mt12">
                      <thead>
                        <tr>
                          <th style={{ width: '140px' }}><code>scope</code></th>
                          <th>{t('Describe')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>response</code></td>
                          <td>{t('Get response data from an interface')}（JSON）</td>
                        </tr>
                        <tr>
                          <td><code>request</code></td>
                          <td>{t('Get request data from an interface')}（JSON）</td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                  <li><code>{serve}/app/mock/:repositoryId/:method/:url</code></li>
                </ul>
              </div>
              <div className="API">
                <div className="title">{t('Get interface template')}（JSON）</div>
                <ul>
                  <li>
                    <code>{serve}/app/mock/template/:interfaceId?scope=response|request</code>
                    <table className="table table-bordered mt12">
                      <thead>
                        <tr>
                          <th style={{ width: '120px' }}><code>scope</code></th>
                          <th>{t('Describe')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>response</code></td>
                          <td>{t('Get response template from an interface')}（JSON）</td>
                        </tr>
                        <tr>
                          <td><code>request</code></td>
                          <td>{t('Get request template from an interface')}（JSON）</td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </ul>
              </div>
              <div className="API">
                <div className="title">{t('Get interface template')}（JSON Schema）</div>
                <ul>
                  <li>
                    <code>{serve}/app/mock/schema/:interfaceId?scope=response|request</code>
                    <table className="table table-bordered mt12">
                      <thead>
                        <tr>
                          <th style={{ width: '120px' }}><code>scope</code></th>
                          <th>{t('Describe')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>response</code></td>
                          <td>{t('Get response template from an interface')}（JSON Schema）</td>
                        </tr>
                        <tr>
                          <td><code>request</code></td>
                          <td>{t('Get request template from an interface')}（JSON Schema）</td>
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
