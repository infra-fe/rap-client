import { useTranslation } from 'react-i18next'
import React, { useState, useCallback, Fragment } from 'react'
import ConfirmDialog from 'components/common/ConfirmDialog'

interface Options {
  title?: string
  content: React.ReactNode
  type: 'alert' | 'confirm'
}

interface CallOptions {
  title?: string
  content: React.ReactNode
}

interface GlobalContext {
  alert: (options: CallOptions) => Promise<void>
  confirm: (options: CallOptions) => Promise<void>
}


export const GlobalContext = React.createContext<GlobalContext>({
  alert: () => Promise.resolve(),
  confirm: () => Promise.resolve(),
})

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const defaultOptions: Options = {
    title: t('confirm'),
    content: '',
    type: 'alert',
  }
  const [options, setOptions] = useState<Options>({ ...defaultOptions })
  const [resolveReject, setResolveReject] = useState<Array<() => void>>([])
  const [resolve, reject] = resolveReject

  const confirm = useCallback((options: CallOptions) => {
    return new Promise<void>((resolve, reject) => {
      setOptions({ ...options, type: 'confirm' })
      setResolveReject([resolve, reject])
    })
  }, [])

  const alert = useCallback((options: CallOptions) => {
    return new Promise<void>((resolve, reject) => {
      setOptions({ ...options, type: 'alert' })
      setResolveReject([resolve, reject])
    })
  }, [])

  const handleClose = useCallback(() => {
    setResolveReject([])
  }, [])

  const handleCancel = useCallback(() => {
    reject()
    handleClose()
  }, [reject, handleClose])

  const handleConfirm = useCallback(() => {
    resolve()
    handleClose()
  }, [resolve, handleClose])

  return (
    <Fragment>
      <GlobalContext.Provider value={{ confirm, alert }}>{children}</GlobalContext.Provider>
      <ConfirmDialog
        open={resolveReject.length === 2}
        {...options}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Fragment>
  )
}
