import { useTranslation } from 'react-i18next'
import React from 'react'
import config from '../../config'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { SlideUp } from 'components/common/Transition'

export default function ExportPostmanForm(props: {
  repoId: number
  open: boolean
  onClose: () => void
  title: string
}) {
  const { repoId, open, onClose, title } = props
  const postmanLink = `${config.serve}/export/postman?id=${repoId}`
  const markdownLink = `${config.serve}/export/markdown?id=${repoId}&origin=${window.location.origin}`
  const docxLink = `${config.serve}/export/docx?id=${repoId}&origin=${window.location.origin}`
  const rapLink =`${config.serve}/repository/get?id=${repoId}`
  const { t } = useTranslation()
  // const pdfLink = `${config.serve}/export/pdf?id=${repoId}&origin=${window.location.origin}`
  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      TransitionComponent={SlideUp}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <form className="form-horizontal" onSubmit={() => false}>
          <div className="mb5">
            <div>
              Postman:</div>
            <div
              className="alert alert-info"
              role="alert"
              style={{ margin: '8px 0' }}
            >
              <a href={postmanLink} target="_blank" rel="noopener noreferrer">
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

          <div className="mt10">
            <Button variant="outlined" onClick={onClose}>
              {t('Shut down')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
