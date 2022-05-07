
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BiEditAlt } from 'react-icons/bi'
import { GiConfirmed } from 'react-icons/gi'
import PanelTitle from './PanelTitle'
import { CommonProps, ICheckSavedResult } from './types'

import JSONEditor from '../JSONEditor/JSONEditor'
import { createJSONSchema, createJSONData } from '../JSONEditor/JSONEditorUtils'
import { IJSONEditorInstance, IJSONEditorOptions } from '../JSONEditor/JSONEditorTypes'

import { TargetResponseStorage, ExpireTimeEnum } from 'utils/Storage'
import { useSnackbar } from 'notistack'

const DefaultOptions = {
  // schema: schema,
  mode: 'code',
  // modes: ['code', 'tree'],
}

export function TargetPanel(props: CommonProps, ref: any) {
  const { itf, mod, repository } = props
  const { t } = useTranslation()
  // const dispatch = useDispatch()
  const $editor = useRef<IJSONEditorInstance>(null)
  const [editorOptions, setEditorOptions] = useState<IJSONEditorOptions>(null)
  const { enqueueSnackbar } = useSnackbar()

  // const S_SAVE_KEY = `P${repository.id}.M${mod.id}.I${itf.id}-TargetResponse` // 按照仓库级别保存接口服务基本信息
  const S_SAVE_KEY = `P${repository.id}.M${mod.id}.I${itf.id}` // 按照仓库级别保存接口服务基本信息

  // =================== 编辑按钮状态控制 ===================
  const [isTargetLocked, setIsTargetLocked] = useState(true)
  // const duration = 4000

  const handleEditTarget = () => {
    setIsTargetLocked(false)
  }

  /**
   * 校验JSON编辑数据
   * @param json
   * @returns
   */
  const validateData = (json: any) => {
    const errors = $editor.current?.validate(json)

    if (errors && errors.length > 0) {
      return false
    } else {
      return true
    }
  }
  const handleSaveTarget = () => {

    const jsonData = $editor.current?.getJSON()
    if (!validateData(jsonData)) {
      // 提示编辑错误
      enqueueSnackbar(t('Target Result Edit Error'), { variant: 'warning' })
      return
    }

    if (jsonData) {
      // 保存数据
      saveData(jsonData)
    }

    setIsTargetLocked(true)
  }
  // =================== //编辑按钮状态控制 ===================

  // 数据初始化
  const initOptions = () => {
    const schema = createJSONSchema(itf, 'response')
    setEditorOptions({
      ...DefaultOptions,
      schema,
    })
  }
  const initData = async () => {
    let data = await TargetResponseStorage.get(S_SAVE_KEY)
    if (!data) {
      data = createJSONData(itf, 'response')
    }
    $editor.current.setJSON(data)
  }
  useEffect(() => {
    initOptions()
    initData()
  }, [])

  // 数据保存
  const saveData = (data: any) => {
    TargetResponseStorage.set(S_SAVE_KEY, data, ExpireTimeEnum.oneMonth)
  }

  // ================ 非受控方法 ================
  const checkSaved: () => ICheckSavedResult = () => {
    const isSaved = isTargetLocked
    const message = isSaved ? '' : t('Edit Target Result Not Saved')

    return {
      isSaved,
      message,
    }
  }
  const checkAndAutoSave = () => {
    if (!isTargetLocked) {
      handleSaveTarget()
    }
  }
  useImperativeHandle(ref, () => ({
    checkSaved: checkSaved,
    checkAndAutoSave: checkAndAutoSave,
  }))
  // ================ //非受控方法 ================

  return (
    <div className="panel-body">
      {/* 目标结果编辑器 */}
      <PanelTitle text={t('Editing Target Result')}
        buttons={[
          { icon: BiEditAlt, props: { disabled: !isTargetLocked, onClick: handleEditTarget } },
          // { icon: BiCodeAlt, props: { disabled: false } },
          { icon: GiConfirmed, props: { disabled: isTargetLocked, onClick: handleSaveTarget } },
        ]} />
      {editorOptions && <JSONEditor name="targetEditor" ref={$editor} height={400} disabled={isTargetLocked} options={editorOptions} />}
    </div>
  )
}

const TargetPanelWrapper = forwardRef(TargetPanel)
export default TargetPanelWrapper
