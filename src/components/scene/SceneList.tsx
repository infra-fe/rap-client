import React, { useState, CSSProperties, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { Button, Input, Paper, IconButton, FormControl, FormHelperText, Box } from '@mui/material'
import { Save, DeleteTwoTone, EditOutlined, Cancel } from '@mui/icons-material'
import { IScene, SCENE_STATUS, SceneContext } from './SceneConfigModal'
import { useConfirm } from 'hooks/useConfirm'


interface ISceneListProp {
  list: IScene[]
  addSceneList: () => void
  deleteSceneList: (key: number) => void
  switchSceneList: (key: number) => void
  updateSceneList: (key: number) => void
  saveSceneList: (key: number, sceneName: string) => void
}

interface ISceneProp extends Partial<IScene & ISceneListProp> {
  index: number
}

const EditScene = (props: ISceneProp) => {

  const [sceneName, setSceneName] = useState(props.sceneName)
  const [error, setError] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setError(val === '')
    setSceneName(val)
  }

  return (
    <Paper variant="outlined" sx={{
      m: 'auto',
      display: 'flex',
      alignItems: 'center',
      mt: '10px',
      width: '100%',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      cursor: 'pointer',
      p: '6px 10px',
      borderColor: 'primary.main',
    }}>
      <Box
        component="form"
        sx={{ width: '100%' }}
        onSubmit={(e) => {
          e.preventDefault()
          if (sceneName.trim() === '') {
            setError(true)
            return
          }
          props.saveSceneList(
            props.index,
            sceneName
          )
        }}
      >
        <FormControl fullWidth={true}>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Input
              style={{ width: '90%' }}
              sx={{ p: 0, mr: '2px' }}
              autoFocus={true}
              defaultValue={props.sceneName}
              onChange={onChange}
            />
            <IconButton type='submit' color='primary' sx={{ p: 0, mr: '2px' }} size="large">
              <Save style={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              sx={{ p: 0, mr: '2px' }}
              onClick={() => {
                props.switchSceneList(props.index)
              }}
              size="large">
              <Cancel style={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          {error ? <FormHelperText id="error" style={{ color: 'red' }}>Error, must enter a value!</FormHelperText> : null}
        </FormControl>
      </Box>
    </Paper>
  )
}

const Scene = (props: ISceneProp) => {
  const { t } = useTranslation()
  const [fade, setFade] = useState(false)
  const confirm = useConfirm()
  const dangerousStyles: CSSProperties = { color: '#CC0000', fontWeight: 'bold', fontSize: 16, display: 'inline', margin: '0 4px' }

  const deleteScene = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    const content = (
      <div>
        <span style={dangerousStyles}>{t('scene')}</span>
        {t('Deleted after')}
        <span style={dangerousStyles}>{t('unrecoverable')}!</span>
        <span>
          {t('Confirm delete')}『#{props.index} ${props.sceneName}』{t('?')}
        </span>
      </div>
    )
    confirm({
      title: t('Confirm delete scene'),
      content,
    }).then(() => {
      setFade(true)
      _.delay(() => props.deleteSceneList(props.index), 200)
    })
  }

  const handleUpdateScene = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    props.updateSceneList(props.index)
  }

  return (
    <Box
      sx={fade ? { visibility: 'hidden', opacity: 0, transition: 'visibility 1s 0.5s, opacity 0.5s' } : null}
      key={props.index}
      onClick={() => props.switchSceneList(props.index)}
    >
      <Paper
        sx={{
          m: 'auto',
          p: '12px 10px',
          display: 'flex',
          alignItems: 'center',
          mt: '10px',
          width: '100%',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          cursor: 'pointer',
          ...props.status === SCENE_STATUS.ACTIVE ? { borderColor: 'primary.main' } : {},
        }}
        variant="outlined">
        <span className="fontsize-14">{props.sceneName}</span>
        <div>
          <IconButton
            color="primary"
            style={{ padding: 0 }}
            onClick={handleUpdateScene}
            size="large">
            <EditOutlined style={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            color='primary'
            style={{ padding: 0, marginLeft: 2 }}
            onClick={deleteScene}
            size="large">
            <DeleteTwoTone style={{ fontSize: 16 }} />
          </IconButton>
        </div>
      </Paper>
    </Box>
  )
}

const List = (props: Omit<ISceneListProp, 'addSceneList'>) => {
  const renderScene = (s: IScene) => {
    if ([SCENE_STATUS.ACTIVE, SCENE_STATUS.NORMAL].includes(s.status)) {
      return (
        <Scene
          key={s.id}
          index={s.id}
          status={s.status}
          sceneName={s.sceneName}
          switchSceneList={props.switchSceneList}
          deleteSceneList={props.deleteSceneList}
          updateSceneList={props.updateSceneList}
        />
      )
    } else if (s.status === SCENE_STATUS.EDITING) {
      return (
        <EditScene
          key={s.id}
          index={s.id}
          status={s.status}
          sceneName={s.sceneName}
          saveSceneList={props.saveSceneList}
          switchSceneList={props.switchSceneList}
        />
      )
    }
  }

  return (
    <div>
      {props.list.map(s => renderScene(s))}
    </div>
  )
}

const NoScene = () => {
  const { t } = useTranslation()
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        p: '8px',
        mt: '10px',
        width: '100%',
        textAlign: 'center',
        color: '#0c5460',
        backgroundColor: '#d1ecf1',
        borderColor: '#bee5eb',
        borderRadius: 2,
      }}>
      {t('No Scene, please create a new one')}
    </Box>
  )
}

const SceneList = (props: ISceneListProp) => {
  const { t } = useTranslation()
  const context = useContext(SceneContext)
  const { json, jsonO } = context
  const confirm = useConfirm()
  const handleCreate = () => {
    if (json !== jsonO) {
      confirm({
        content: t('Switch scene confirm'),
      }).then(() => {
        props.addSceneList()
      })
    } else {
      props.addSceneList()
    }
  }
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        fullWidth={true}
        style={{ padding: '10px 16px', fontSize: 14 }}
        onClick={handleCreate}>
        {t('Create Scene')}
      </Button>
      {!!props.list.length ?
        <List
          deleteSceneList={props.deleteSceneList}
          list={props.list}
          switchSceneList={props.switchSceneList}
          updateSceneList={props.updateSceneList}
          saveSceneList={props.saveSceneList}
        /> :
        <NoScene />
      }
    </div>
  )
}

export default SceneList

