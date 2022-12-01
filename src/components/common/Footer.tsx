import React from 'react'
import { connect } from 'react-redux'
import './Footer.sass'
import { Counter, RootState } from 'actions/types'

const Footer = ({ counter }: { counter?: Counter }) => {
  return (
    <div className="Footer">
      {counter?.version ?? '-'}
      <ul className="friend_links">
        <li>
          <a
            href="https://github.com/infra-fe/rap-client"
            target="_blank"
            rel="noopener noreferrer"
          >
                        GitHub
          </a>
        </li>
        <li>
          <a
            href="http://mockjs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
                        Mock.js
          </a>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  counter: state.counter,
})
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
