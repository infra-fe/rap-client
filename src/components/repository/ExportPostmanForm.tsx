import { useTranslation } from 'react-i18next'
import React from 'react'
import config from '../../config'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import Transition from 'components/common/Transition'

export default function ExportPostmanForm(props: {
  repoId: number
  repoToken: string
  open: boolean
  onClose: () => void
  title: string
}) {
  const { repoId, open, onClose, title, repoToken } = props
  const postmanLink = `${config.serve}/export/openapi?id=${repoId}`
  const markdownLink = `${config.serve}/export/markdown?id=${repoId}&origin=${window.location.origin}`
  const docxLink = `${config.serve}/export/docx?id=${repoId}&origin=${window.location.origin}`
  const rapLink =`${config.serve}/repository/get?id=${repoId}${repoToken? `&token=${repoToken}` : ''}`
  const { t } = useTranslation()
  // const pdfLink = `${config.serve}/export/pdf?id=${repoId}&origin=${window.location.origin}`
  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <form className="form-horizontal" onSubmit={() => false}>
          <div className="mb5">
            <div>
              OpenApi3(Postman):</div>
            <div
              className="alert alert-info"
              role="alert"
              style={{ margin: '8px 0' }}
            >
              DownLoad: <a href={`${postmanLink}&format=file`} target="_blank" rel="noopener noreferrer">
                {`${postmanLink}&format=file`}
              </a>
              <div></div>
              JSONData: <a href={postmanLink} target="_blank" rel="noopener noreferrer">
                {postmanLink}
              </a>
            </div>
            <div>
              {t('Click the above links to download, click the Import in the Postman (Import),' +
              'and select Import from the File (the Import File) to download the File.')}
            </div>
          </div>

          <div>
            <div>Markdown:</div>
            <div
              className="alert alert-info"
              role="alert"
              style={{ margin: '8px 0' }}
            >
              <a href={markdownLink} target="_blank" rel="noopener noreferrer">
                {markdownLink}
              </a>
            </div>
          </div>

          <div>
            <div>Docx:</div>
            <div
              className="alert alert-info"
              role="alert"
              style={{ margin: '8px 0' }}
            >
              <a href={docxLink} target="_blank" rel="noopener noreferrer">{docxLink}</a>
            </div>
          </div>

          <div>
            <div>RAP Data:</div>
            <div
              className="alert alert-info"
              role="alert"
              style={{ margin: '8px 0' }}
            >
              <a href={rapLink} target="_blank" rel="noopener noreferrer">{rapLink}</a>
            </div>
            <div>{t('For backups, or in other RAP2 platform import, opens the save as to save. Can also be accessed through programming.')}</div>
          </div>

          <div className="mt1">
            <Button variant="outlined" onClick={onClose}>
              {t('Close')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
