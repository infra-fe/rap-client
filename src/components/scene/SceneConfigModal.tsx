import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Input, Button, FormControl, FormHelperText, Dialog, DialogTitle, DialogContent, Box } from '@mui/material'
import { EditOutlined, Save, Cancel } from '@mui/icons-material'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Close } from '@mui/icons-material'
import _ from 'lodash'
import JSON5 from 'json5'
import { serve } from '../../relatives/services/constant'
import { getRelativeUrl } from '../../utils/URLUtils'
import { Spin } from '../utils'
import SceneList from './SceneList'
import { addScene, updateScene, deleteScene, fetchSceneList, fetchScene } from '../../actions/scene'
import MonacoEditor from 'react-monaco-editor'
import { useSnackbar } from 'notistack'
export enum SCENE_STATUS {
  NORMAL = 'normal',
  ACTIVE = 'active',
  EDITING = 'editing',
}

export interface IScene {
  id: number
  sceneName: string
  sceneKey?: string
  headers: string
  sceneData: string
  interfaceId: number
  moduleId: number
  repositoryId: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  status?: SCENE_STATUS
}

interface IModalProps {
  itfMethod: string
  itfUrl: string
  itfName: string
  moduleId: number
  repositoryId: number
  interfaceId: number
  showSceneConfig: boolean
  closeSceneConfig: (status: boolean) => void
}

interface ISceneConfig extends Partial<IModalProps> {
  id: number
  mockUrl: string
}

const SceneConfig = (props: ISceneConfig) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [sceneKey, setSceneKey] = useState<string>()
  const [scene, setScene] = useState<IScene>()
  const [editable, setEditable] = useState(false)
  const [json, setJson] = useState('{}')
  const [error, setError] = useState(false)
  const [jsonO, setJsonO] = useState(json) // original JSON, use to distinguish whether JSON text changed
  const { id } = props
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (id) {
      dispatch(fetchScene(id, (res) => {
        setSceneKey(res.sceneKey ?? id + '')
        setScene(res)
        setEditable(false)
        const sceneData = res?.sceneData ?? '{}'
        setJson(sceneData)
        setJsonO(sceneData)
      }))
    }
  }, [props.id])

  const handleSaveJson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = validJSON()
    if (result) {
      const res = { ..._.omit(scene, 'sceneKey'), sceneData: json }
      dispatch(
        updateScene(res, (r) => {
          setScene({ ...scene, sceneData: json })
          setJsonO(json)
          // dispatch(showMessage(t('Save Success'), MSG_TYPE.SUCCESS))
          enqueueSnackbar(t('Save Success'), { variant: 'success' })
        })
      )
    }
  }

  const validJSON = () => {
    try {
      const result = JSON5.parse(json)
      return result
    } catch (e) {
      enqueueSnackbar(t('Invalid JSON'), { variant: 'error' })
      return
    }
  }

  const handleBeautify = () => {
    const result = validJSON()
    if (result) {
      const beautified = JSON.stringify(result, null, 2)
      setJson(beautified)
    }
  }

  const handleUrlWithScene = (url: string) => {
    return `${url}${url.includes('?') ? '&' : '?'}__scene=${scene?.sceneKey}`
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {
        (sceneKey || error) ?
          <>
            <Box component="ul" sx={{ mt: 0, pl: 0, '& li': { listStyle: 'none', margin: '10px 0', p: 0 } }}>
              <Box component="li" sx={{ mb: 2, display: 'block', fontSize: 18 }}>{props.itfName}</Box>
              <li style={{ margin: error ? '0' : '10px 0' }}>
                <span className="mr10">{t('sceneKey')}:</span>
                {editable ?
                  <form style={{ display: 'inline-block' }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (sceneKey === '') {
                        setError(true)
                        return
                      }
                      dispatch(
                        updateScene(
                          { ...scene, sceneKey },
                          res => {
                            if (res) {
                              setEditable(false)
                              setScene({ ...scene, sceneKey })
                            } else {
                              enqueueSnackbar(t('Duplicate scene key'), { variant: 'error' })
                            }
                          }
                        )
                      )
                    }}>
                    <FormControl>
                      <div style={{ display: 'flex' }}>
                        <Input
                          value={sceneKey}
                          autoFocus={true}
                          sx={{ '& input': { p: 0, fontSize: 12 } }}
                          style={{ padding: 0 }}
                          placeholder={t('en_num_zh_allowed')}
                          onChange={e => {
                            const val = e.target.value
                            setError(val === '')
                            setSceneKey(e.target.value)
                          }}
                        />
                        <IconButton type='submit' color='primary' sx={{ padding: 0, mt: '-2px', mr: '2px' }} size="large">
                          <Save style={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          sx={{ padding: 0, mt: '-2px', mr: '2px' }}
                          onClick={() => {
                            setEditable(false)
                            setSceneKey(scene.sceneKey)
                          }}
                          size="large">
                          <Cancel style={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                      {error ? <FormHelperText id="error" style={{ color: 'red' }}>Error, must enter a value!</FormHelperText> : null}
                    </FormControl>
                  </form> :
                  <>
                    <span>{scene?.sceneKey}</span>
                    <IconButton
                      color="primary"
                      sx={{ padding: 0, mt: '-2px', mr: '2px' }}
                      style={{ marginLeft: 2 }}
                      onClick={() => setEditable(true)}
                      size="large">
                      <EditOutlined style={{ fontSize: 16 }} />
                    </IconButton>
                  </>
                }
              </li>
              <li style={{ margin: error ? '0' : '10px 0' }}>
                <Box component="a" href={handleUrlWithScene(props.mockUrl)}
                  sx={{ display: 'inline-block', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {handleUrlWithScene(props.itfUrl)}
                </Box>
              </li>
            </Box>
            <form onSubmit={handleSaveJson}>
              <Box sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  sx={{ m: 1 }}
                  type='submit'
                  color="primary"
                  disableElevation={true}
                  disabled={json === jsonO}
                >
                  {t('save')}
                  <Save sx={{ ml: 0.5 }} />
                </Button>
                <Button onClick={handleBeautify} variant="contained" disableElevation={true}>
                  {t('format')}
                  <FormatListNumberedIcon sx={{ ml: 0.5 }} style={{ fontSize: 18 }} />
                </Button>
              </Box>
              <Box sx={{ border: '1px solid #d1d5da', borderRadius: 4, mt: 0.5 }}>
                <MonacoEditor language="json" value={json} onChange={(value: string) => setJson(value)} height="27rem" theme="vs" options={{ tabSize: 2 }} />
              </Box>
            </form>
          </> :
          <Box sx={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}>
            <Spin />
          </Box>
      }
    </div>
  )
}

export default function SceneConfigModal(props: IModalProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [list, setList] = useState<IScene[]>([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState<number>()

  const { itfMethod, repositoryId, moduleId, interfaceId, itfUrl, itfName } = props
  const mockUrl = `${serve}/app/mock/${repositoryId}/${itfMethod.toLowerCase()}${getRelativeUrl(itfUrl || '')}`

  useEffect(() => {
    setLoading(true)
    dispatch(
      fetchSceneList(interfaceId, (list) => {
        const newList = list.map((s, idx) => ({
          ...s,
          status: idx === 0 ? SCENE_STATUS.ACTIVE : SCENE_STATUS.NORMAL,
        }))
        setList(newList)
        setCurrent(newList?.[0]?.id)
        setLoading(false)
      })
    )
  }, [interfaceId])

  const addSceneList = () => {
    const params = { repositoryId, moduleId, interfaceId }
    dispatch(
      addScene(params, (newScene) => {
        const newList = list.map(s => ({
          ...s,
          status: SCENE_STATUS.NORMAL,
        }))
        newScene.status = 'active'
        setList([newScene, ...newList])
        setCurrent(newScene.id)
      })
    )
  }

  const deleteSceneList = (key: number) => {
    dispatch(
      deleteScene(key, () => {
        const newList = list.filter(i => i.id !== key)
        if (newList.every(i => i.status === SCENE_STATUS.NORMAL)) {
          const scene = newList?.[0]
          scene && (scene.status = SCENE_STATUS.ACTIVE)
        }
        setList([...newList])
        setCurrent(newList?.[0]?.id)
      })
    )
  }

  const updateSceneList = (key: number) => {
    const newList = list.map(s => {
      return {
        ...s,
        status: s.id === key ? SCENE_STATUS.EDITING : SCENE_STATUS.NORMAL,
      }
    })
    setList(newList)
    setCurrent(key)
  }

  const saveSceneList = (key: number, sceneName: string) => {
    const newList = list.map(s => ({
      ...s,
      status: SCENE_STATUS.NORMAL,
    })
    )
    const scene = newList.find(s => s.id === key)
    scene.sceneName = sceneName
    scene.status = SCENE_STATUS.ACTIVE
    dispatch(
      updateScene({ ..._.omit(scene, 'status', 'sceneKey'), sceneName }, () => {
        setList(newList)
      })
    )
  }

  const handleClose = () => {
    props.closeSceneConfig(false)
  }

  const switchSceneList = (key: number) => {
    setCurrent(key)
    const newList = list.map(s => ({
      ...s,
      status: s.id === key ? SCENE_STATUS.ACTIVE : SCENE_STATUS.NORMAL,
    }))
    setList(newList)
  }

  return (
    <Dialog open={props.showSceneConfig} onClose={handleClose} maxWidth="lg">
      <DialogTitle className="rmodal-header">
        <span className="rmodal-title">{t('scene')}</span>
        <a href="https://github.com/infra-fe/rap-client/wiki/Mock%E5%9C%BA%E6%99%AF"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HelpOutlineOutlinedIcon sx={{ fontSize: 18, mt: '2px', ml: '5px', color: 'primary.main', cursor: 'pointer', verticalAlign: 'text-top' }} />
        </a>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ float: 'right' }}
          size="large">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box className="rmodal-body" sx={{ display: 'flex', width: '100%', height: 500 }}>
          {
            loading ?
              <Box sx={{ m: '0 auto', '& .Spin': { position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }}>
                <Spin />
              </Box> :
              <>
                <Box sx={{ width: 240, overflow: 'auto', pr: 2, borderRight: '1px solid #d1d5da' }}>
                  <SceneList
                    deleteSceneList={deleteSceneList}
                    addSceneList={addSceneList}
                    list={list}
                    switchSceneList={switchSceneList}
                    updateSceneList={updateSceneList}
                    saveSceneList={saveSceneList} />
                </Box>
                <Box className="pl30" sx={{width: 890}}>
                  {current ?
                    <SceneConfig
                      id={current}
                      interfaceId={interfaceId}
                      mockUrl={mockUrl}
                      itfUrl={itfUrl}
                      itfName={itfName}
                    /> :
                    <Box
                      sx={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: 18 }}>
                      {t('No data')}
                    </Box>
                  }
                </Box>
              </>
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}
