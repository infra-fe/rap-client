import { Translation } from 'react-i18next'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Mock from 'mockjs'
import { addUser } from '../../actions/account'
import './RegisterForm.css'
import { Button, Card } from '@material-ui/core'
import { getBGImageUrl } from 'utils/ImageUtils'

type State = {
  fullname: string
  email: string
  password: string
  bg: string
}

type Props = {
  history: any
  onAddUser: any
}

// 模拟数据
const mockUser = () =>
  process.env.NODE_ENV === 'development'
    ? Mock.mock({
      fullname: '@CNAME',
      email: '@email',
      password: '@string(6)',
    })
    : {
      fullname: '',
      email: '',
      password: '',
    }

// 展示组件
class RegisterForm extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      ...mockUser(),
      bg: getBGImageUrl(),
    }
  }
  render() {
    return (
      <Translation>
        {(t) => (
          <div className="wrapper" style={{ background: this.state.bg }}>
            <Card className="RegisterForm">
              <div className="header">
                <span className="title">{t('Register')}</span>
              </div>
              <form className="body" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>{t('Name:')}</label>
                  <input
                    value={this.state.fullname}
                    onChange={e => this.setState({ fullname: e.target.value })}
                    className="form-control"
                    placeholder="Name"
                    autoFocus={true}
                    required={true}
                  />
                </div>
                <div className="form-group">
                  <label>{t('Email address:')}</label>
                  <input
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                    className="form-control"
                    placeholder="Email"
                    required={true}
                  />
                </div>
                <div className="form-group">
                  <label>{t('Password:')}</label>
                  <input
                    value={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required={true}
                  />
                </div>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}> {t('submit')} </Button>
                <Link to="/account">{t('cancel')}</Link>
              </form>
            </Card>
          </div>
        )}
      </Translation>
    )
  }
  handleSubmit = (e: any) => {
    const { onAddUser } = this.props
    e.preventDefault()
    onAddUser(this.state, (isOk: boolean) => {
      if (isOk) {
        window.location.href = '/'
      }
    })
  }
}

// 容器组件
const mapDispatchToProps = {
  onAddUser: addUser,
}
export default connect(
  null,
  mapDispatchToProps
)(RegisterForm)
