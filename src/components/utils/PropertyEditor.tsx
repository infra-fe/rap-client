import { Translation } from 'react-i18next'
/*
  ### Mock 模板编辑器
  1. 属性名
  2. 类型
    * String
    * Number
    * Boolean
    * Function
    * RegExp
    * Object
    * Array
  3. 生成规则
  4. 初始值
*/

import React, { Component } from 'react'
import { mock } from 'mockjs'
import { TYPES } from '../../utils/consts'
import './PropertyEditor.sass'

const fixValue = ({ type, value }: Readonly<any>) => {
  switch (type) {
    case 'String':
      return value
    case 'Number':
      try {
        // eslint-disable-next-line
                return eval(`(${value})`);
      } catch (e) {
        return 1
      }
    case 'Boolean':
      try {
        // eslint-disable-next-line
                return eval(`(${value})`);
      } catch (e) {
        return true
      }
    case 'Function':
    case 'RegExp':
      try {
        // eslint-disable-next-line
                return eval(`(${value})`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(type, value)
      }
      break
    case 'Object':
      return {}
    case 'Array':
      return []
    case 'Null':
      return null
    default:
      return value
  }
}

class StringRuleEditor extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { rule: '', count: 1, min: 3, max: 7, value: '' }
  }
  get() {
    switch (this.state.rule) {
      case '':
        return { [`name`]: `${this.state.value}` }
      case '|count':
        return { [`name|${this.state.count}`]: `${this.state.value}` }
      case '|min-max':
        return {
          [`name|${this.state.min}-${this.state.max}`]: `${this.state.value}`,
        }
      default:
        // eslint-disable-next-line no-console
        console.warn('wrong generate rules')
    }
    return ''
  }
  render() {
    return (
      <Translation>
        {(t) => (
          <section className="RuleEditor">
            <table className="table">
              <thead>
                <tr>
                  <td>-</td>
                  <td>{t('Generate rules')}</td>
                  <td>-</td>
                  <td>{t('Initial value')}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('string')}</td>
                  <td>
                    <select
                      value={this.state.rule}
                      onChange={(e) =>
                        this.setState({
                          rule: e.target.value,
                        })
                      }
                      className="rule"
                    >
                      <option value="">
                        {t('A fixed value')}
                      </option>
                      <option value="|count">
                        {t('Fixed number of repeat')}
                      </option>
                      <option value="|min-max">
                        {t('Repeat random number')}
                      </option>
                    </select>
                  </td>
                  <td>
                    {this.state.rule === '|count' && (
                      <span>
                        <span>{t('repeat')}</span>
                        <input
                          value={this.state.count}
                          onChange={(e) =>
                            this.setState({
                              count: e.target
                                .value,
                            })
                          }
                          className="count"
                        />
                        <span>{t('time')}</span>
                      </span>
                    )}
                    {this.state.rule === '|min-max' && (
                      <span>
                        <span>
                          {t('Repeat the number')}
                        </span>
                        <div>
                          {t(
                            'Greater than or equal to'
                          )}
                          <input
                            value={this.state.min}
                            onChange={(e) =>
                              this.setState({
                                min: e.target
                                  .value,
                              })
                            }
                            className="min"
                          />
                        </div>
                        <div>
                          {t('Less than or equal to')}
                          <input
                            value={this.state.max}
                            onChange={(e) =>
                              this.setState({
                                max: e.target
                                  .value,
                              })
                            }
                            className="max"
                          />
                        </div>
                      </span>
                    )}
                  </td>
                  <td>
                    <input
                      value={this.state.value}
                      onChange={(e) =>
                        this.setState({
                          value: e.target.value,
                        })
                      }
                      className="value"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </Translation>
    )
  }
  onChange = () => {
    /** empty */
  }
}

class IntegerRuleEditor extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      type: '',
      count: 1,
      min: 3,
      max: 7,
      value: '',
    }
  }
  get() {
    switch (this.state.type) {
      case '':
        return { [`name`]: this.state.value }
      case '|min-max':
        return { [`name|${this.state.min}-${this.state.max}`]: 1 }
      default:
        // eslint-disable-next-line no-console
        console.warn('错误的生成规则')
    }
    return ''
  }
  render() {
    return (
      <Translation>
        {(t) => (
          <section className="RuleEditor">
            <span>{t('The integer')}</span>
            <select
              value={this.state.type}
              onChange={(e) =>
                this.setState({ type: e.target.value })
              }
              className="type"
            >
              <option value="">{t('A fixed value')}</option>
              <option value="|min-max">
                {t('Random value')}
              </option>
            </select>
            <div>
              {this.state.type === '' ? (
                <span>
                  <input
                    value={this.state.value}
                    onChange={(e) =>
                      this.setState({
                        value: e.target.value,
                      })
                    }
                    className="value"
                  />
                </span>
              ) : null}
              {this.state.type === '|min-max' ? (
                <span>
                  <span>{t('Greater than or equal to')}</span>
                  <input
                    value={this.state.min}
                    onChange={(e) =>
                      this.setState({
                        min: e.target.value,
                      })
                    }
                    className="min"
                  />
                  <span>
                    {t('And less than or equal to')}
                  </span>
                  <input
                    value={this.state.max}
                    onChange={(e) =>
                      this.setState({
                        max: e.target.value,
                      })
                    }
                    className="max"
                  />
                </span>
              ) : null}
            </div>
          </section>
        )}
      </Translation>
    )
  }
}
class FloatRuleEditor extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      type: '',
      count: 1,
      min: 3,
      max: 7,
      dmin: 3,
      dmax: 7,
      value: '',
    }
  }
  get() {
    switch (this.state.type) {
      case '':
        return { [`name`]: +this.state.value }
      case '|min-max.dmin-dmax':
        return {
          [`name|${this.state.min}-${this.state.max}.${this.state.dmin}-${this.state.dmax}`]: 1,
        }
      default:
        // eslint-disable-next-line no-console
        console.warn('错误的生成规则')
    }
    return ''
  }
  render() {
    return (
      <Translation>
        {(t) => (
          <section className="RuleEditor">
            <span>{t('Floating point Numbers')}</span>
            <select
              value={this.state.type}
              onChange={(e) =>
                this.setState({ type: e.target.value })
              }
              className="type"
            >
              <option value="">{t('A fixed value')}</option>
              <option value="|min-max.dmin-dmax">
                {t('Random value')}
              </option>
            </select>
            <div>
              {this.state.type === '' ? (
                <span>
                  <input
                    value={this.state.value}
                    onChange={(e) =>
                      this.setState({
                        value: e.target.value,
                      })
                    }
                    className="value"
                  />
                </span>
              ) : null}
              {this.state.type === '|min-max.dmin-dmax' ? (
                <span>
                  <span>{t('The integer part')}</span>
                  <span>{t('Greater than or equal to')}</span>
                  <input
                    value={this.state.min}
                    onChange={(e) =>
                      this.setState({
                        min: e.target.value,
                      })
                    }
                    className="min"
                  />
                  <span>
                    {t('And less than or equal to')}
                  </span>
                  <input
                    value={this.state.max}
                    onChange={(e) =>
                      this.setState({
                        max: e.target.value,
                      })
                    }
                    className="max"
                  />
                  <span>{t(', the decimal part')}</span>
                  <input
                    value={this.state.dmin}
                    onChange={(e) =>
                      this.setState({
                        dmin: e.target.value,
                      })
                    }
                    className="min"
                  />
                  <span>{t('to')}</span>
                  <input
                    value={this.state.dmax}
                    onChange={(e) =>
                      this.setState({
                        dmax: e.target.value,
                      })
                    }
                    className="max"
                  />
                  <span>{t('position')}</span>
                </span>
              ) : null}
            </div>
          </section>
        )}
      </Translation>
    )
  }
}

class PropertyEditor extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      name: 'name',
      type: 'String',
      rule: '',
      value: '',
    }
  }
  render() {
    const template = {
      [`${this.state.name}|${this.state.rule}`]: fixValue(this.state),
    }
    const data = mock(template)
    return (
      <Translation>
        {(t) => (
          <div className="row">
            <div className="col-12">
              <StringRuleEditor />
              <IntegerRuleEditor />
              <FloatRuleEditor />
              <hr />
            </div>
            <div className="col-6">
              <div className="form-group">
                <label className="control-label">
                  {t('The property name:')}
                </label>
                <input
                  type="text"
                  value={this.state.name}
                  onChange={(e) =>
                    this.setState({ name: e.target.value })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="control-label">
                  {t('Type')}:
                </label>
                <select
                  name="type"
                  value={this.state.type}
                  onChange={(e) => {
                    const type = e.target.value
                    if (type === 'Null') {
                      this.setState({ value: '' })
                    }
                    this.setState({ type })
                  }}
                  className="form-control"
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="control-label">
                  {t('Generate rules:')}
                </label>
                <input
                  type="text"
                  value={this.state.rule}
                  onChange={(e) =>
                    this.setState({ rule: e.target.value })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="control-label">
                  {t('The initial value:')}
                </label>
                <input
                  type="text"
                  value={this.state.value}
                  onChange={(e) =>
                    this.setState({ value: e.target.value })
                  }
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-6">
              <pre>{JSON.stringify(template, null, 2)}</pre>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </Translation>
    )
  }
}

export default PropertyEditor
