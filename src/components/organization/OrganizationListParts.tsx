import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PropTypes,
  push,
  replace,
  URI,
  StoreStateRouterLocationURI,
} from '../../family'
import { Spin, Pagination } from '../utils'
import OrganizationList from './OrganizationList'
import OrganizationForm from './OrganizationForm'
import {
  addOrganization,
  deleteOrganization,
  updateOrganization,
} from '../../actions/organization'
import { useDispatch, useSelector } from 'react-redux'
import { Select, MenuItem, TextField, Button } from '@mui/material'
import { RootState, User } from 'actions/types'
import { useConfirm } from 'hooks/useConfirm'
export const contextTypes = {
  store: PropTypes.object,
}

export const childContextTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  onAddOrganization: PropTypes.func,
  onDeleteOrganization: PropTypes.func,
  onUpdateOrganization: PropTypes.func,
  auth: PropTypes.object,
}

export function getChildContext(this: any) {
  const {
    history,
    location,
    match,
    onAddOrganization,
    onDeleteOrganization,
    onUpdateOrganization,
    auth,
  } = this.props
  return {
    history,
    location,
    match,
    onAddOrganization,
    onDeleteOrganization,
    onUpdateOrganization,
    auth,
  }
}

export const mapDispatchToProps = {
  onAddOrganization: addOrganization,
  onDeleteOrganization: deleteOrganization,
  onUpdateOrganization: updateOrganization,
}

export function CreateButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <span className="float-right ml10">
      <Button
        className="OrganizationCreateButton"
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
      >
        {' '}
        {t('create team')}{' '}
      </Button>
      <OrganizationForm open={open} onClose={() => setOpen(false)} />
    </span>
  )
}

// TODO 2.2 <select> => <Dropdown>
export function OrganizationsTypeDropdown({ url }: { url: string }) {
  const dispatch = useDispatch()
  const handlePush = (url: string) => {
    dispatch(push(url))
  }
  const { t } = useTranslation()
  return (
    <Select
      className="mr8"
      value={url}
      onChange={e => handlePush(e.target.value as string)}
    >
      <MenuItem value="/organization/joined">{t('My team')}</MenuItem>
      <MenuItem value="/organization/all">{t('All the team')}</MenuItem>
    </Select>
  )
}

export function SearchGroup(props: { name: string }) {
  const { name } = props
  const dispatch = useDispatch()
  const router = useSelector((state: RootState) => state.router)
  const [query, setQuery] = useState('')
  const { t } = useTranslation()
  const handleSearch = () => {
    const { pathname, hash, search } = router.location
    const uri = URI(pathname + hash + search).removeSearch('cursor')
    query ? uri.setSearch('name', query) : uri.removeSearch('name')
    dispatch(push(uri.href()))
  }
  useEffect(() => {
    setQuery(name)
  }, [name])
  return (
    <TextField
      value={query || ''}
      placeholder={t('Search repository: name, ID')}
      autoComplete="off"
      onChange={e => setQuery(e.target.value.trim())}
      onKeyUp={e => e.which === 13 && handleSearch()}
      style={{ width: 200 }}
    />
  )
}

// DONE 把控制钱从 Dialog 移动到 Component 中！
// DONE 2.1 通常应该用 replaceLocation
// DONE 2.1 删除确认
export function useHandleDelete() {
  const replaceLocation = useReplaceLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const confirm = useConfirm()
  return (organization: any) => {
    const message = `${t('confirm delete organization')}『#${organization.id} ${organization.name}』${t('?')}`
    confirm({
      title: t('Confirm delete'),
      content: message,
    }).then(() => {
      dispatch(
        deleteOrganization(organization.id, () => {
          replaceLocation()
        })
      )
    })
  }
}

// DONE 重构表之间的对应关系，分为多张表。否则每次更新成员都会导致当前团队排到第一位！待测试。
export function useReplaceLocation() {
  const router = useSelector((state: RootState) => state.router)
  const dispatch = useDispatch()
  return () => {
    const uri = StoreStateRouterLocationURI(router)
    dispatch(replace(uri.href()))
  }
}

export function useHandleJoin() {
  const auth = useSelector((state: RootState) => state.auth)
  const replaceLocation = useReplaceLocation()
  const dispatch = useDispatch()
  return (organization: any) => {
    const next = {
      id: organization.id,
      memberIds: [...organization.members.map((user: User) => user.id), auth.id],
    }
    dispatch(
      updateOrganization(next, () => {
        replaceLocation()
      })
    )
  }
}

export function useHandleExit() {
  const auth = useSelector((state: RootState) => state.auth)
  const replaceLocation = useReplaceLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const confirm = useConfirm()

  return (organization: any) => {
    const message = `${t('confirm exit organization')}『#${organization.id} ${organization.name}』${t('?')}`
    confirm({
      content: message,
    }).then(() => {
      const next = {
        id: organization.id,
        memberIds: organization.members
          .filter(user => user.id !== auth.id)
          .map(user => user.id),
      }
      dispatch(
        updateOrganization(next, () => {
          replaceLocation()
        })
      )
    })
  }
}

export const OrganizationListWithSpin = ({ name, organizations }: any) =>
  organizations.fetching ? (
    <Spin />
  ) : (
    <OrganizationList name={name} organizations={organizations.data} />
  )

export function PaginationWithLocation(props: any) {
  const router = useSelector((state: RootState) => state.router)
  const { calculated } = props
  const { location } = router
  return <Pagination location={location} calculated={calculated} />
}
