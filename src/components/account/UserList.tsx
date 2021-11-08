import { useTranslation } from 'react-i18next'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Pagination from '../utils/Pagination'
import { addUser, deleteUser, fetchUserList } from '../../actions/account'
import './UserList.css'
import { RootState } from 'actions/types'

// 展示组件
const UserList = ({ match, location, users, onDeleteUser }: any) => {
  const {t} = useTranslation()
  return (
    <section className="UserList">
      <div className="header">
        <span className="title">{t('User management')}</span>
      </div>
      <nav className="toolbar clearfix">
        {/* <div className='float-left'>
        <Link to='/account/register' className='btn btn-success w140'><span className=''>&#xe654;</span>注册用户</Link>
      </div>
      <div className='float-right'>
        <button onClick={e => onFetchUserList(location.params)} className='btn btn-default'>R</button>
      </div> */}
      </nav>
      <div className="body">
        <table className="table">
          <thead>
            <tr>
              <th>{t('The name')}</th>
              <th>{t('email')}</th>
              <th className="w100">{t('operation')}</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((user: any) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/repository?user=${user.id}`}>#{user.id} {user.fullname}</Link>
                </td>
                <td>{user.email}</td>
                <td>
                  <span style={{ cursor: 'not-allowed' }}>
                    <Link to={match.url} onClick={() => onDeleteUser(user.id)} className="operation disabled">{t('delete')}</Link>
                  </span>
                </td>
              </tr>
            )
            )}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <Pagination location={location} calculated={users.pagination} />
      </div>
    </section>
  )
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  users: state.users,
})
const mapDispatchToProps = ({
  onAddUser: addUser,
  onDeleteUser: deleteUser,
  onFetchUserList: fetchUserList,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)
