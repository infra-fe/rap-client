/*
 * @Author: xia xian
 * @Date: 2022-06-07 19:02:40
 * @LastEditors: xia xian
 * @LastEditTime: 2022-06-08 17:43:43
 * @Description:
 */
import { Module, Repository } from '../../actions/types'
import { useTranslation } from 'react-i18next'
import { deleteModule } from '../../actions/module'
import { useState, MouseEventHandler, CSSProperties } from 'react'
import { useConfirm } from 'hooks/useConfirm'
import ModuleForm from './ModuleForm'
import MoveModuleForm from './MoveModuleForm'
import { useDispatch } from 'react-redux'
import { GoPencil, GoTrashcan, GoRepoClone } from 'react-icons/go'
type Props = {
  mod: Module
  repository: Repository
}
export default function ModuleOperation(props: Props) {
  const { mod, repository } = props
  const [moduleFormOpen, setModuleFormOpen] = useState(false)
  const [moveModuleFormOpen, setMoveModuleFormOpen] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const confirm = useConfirm()
  const dangerousStyles: CSSProperties = { color: '#CC0000', fontWeight: 'bold', fontSize: 16, display: 'inline', margin: '0 4px' } // 给眼神不太好的同学专门的设计
  const handleDeleteModule: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const message = (
      <div style={{ width: 800 }}>
        <div>
          <div style={dangerousStyles}>{t('Module')}</div>
          {t('Deleted after')}
          <div style={dangerousStyles}>{t('unrecoverable')}</div>
          {t('! And will be deleted')}
          <div style={dangerousStyles}>{t('The relevant interface')}</div>！</div>
        <div>
          {t('Confirm delete')}『#{mod.id} ${mod.name}』{t('?')}
        </div>
      </div>
    )
    confirm({
      title: t('Confirm delete module'),
      content: message,
    }).then(() => {
      dispatch(
        deleteModule(
          mod.id,
          () => {
            // TODO:
          },
          repository!.id
        )
      )
    })
  }
  return (
    <>
      {
        repository.canUserEdit ? (
          <div className="toolbar">
            <span onClick={() => setModuleFormOpen(true)} className="g-link edit mr1">
              <GoPencil className="fontsize-14" />  {t('Modify module')}
            </span>
            <span onClick={() => setMoveModuleFormOpen(true)} className="g-link edit mr1">
              <GoRepoClone className="fontsize-14" /> {t('Move/Copy module')}
            </span>
            <span onClick={handleDeleteModule} className="g-link edit mr1">
              <GoTrashcan className="fontsize-14" />  {t('Delete module')}
            </span>
            {moduleFormOpen && (
              <ModuleForm
                title={t('Modify module')}
                module={mod}
                repository={repository}
                open={moduleFormOpen}
                onClose={() => setModuleFormOpen(false)}
              />
            )}

            {moveModuleFormOpen && (
              <MoveModuleForm
                title={t('Move/Copy module')}
                mod={mod}
                repository={repository}
                open={moveModuleFormOpen}
                onClose={() => setMoveModuleFormOpen(false)}
              />
            )}
          </div>
        ) : null
      }
    </>
  )
}
