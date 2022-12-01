import React from 'react'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './nprogress.sass'
import MainMenu from 'components/layout/MainMenu'
import { RootState, User } from 'actions/types'
const Header = ({ fetching, user = {} }: { fetching: number; user: User }) => {
  if (!user || !user.id) {
    return null
  }
  document.body.style.cursor = fetching ? 'wait' : 'default' // TODO 2.3 应该有更好的方式监听整个 APP 是否有未完成的请求！
  fetching ? NProgress.start() : NProgress.done()
  return (
    <section className="Header">
      <nav className="clearfix">
        <MainMenu user={user} />
      </nav>
    </section>
  )
}

const mapStateToProps = (state: RootState) => ({
  fetching: (() => {
    let fetching = 0
    for (const key in state) {
      if (state[key] && state[key].fetching) {
        fetching += 1
      }
    }
    return fetching
  })(), // state.fetching
  user: state.auth,
})

export default connect(mapStateToProps, {})(Header)
