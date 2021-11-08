import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import config from '../../config'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import { SlideUp } from 'components/common/Transition'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import { Repository } from 'actions/types'
import { DialogContent } from '@material-ui/core'

type RapperType = 'normal' | 'redux'

const codeTmpl = ({ projectId, token, rapperType, rapperPath }: {
  projectId: number
  token?: string
  rapperType: RapperType
  rapperPath: string
}) => {
  const apiUrl = `${config.serve}/repository/get?id=${projectId}${token ? `&token=${token}` : ''}`
  const rapUrl = window.location.origin
  return String.raw`"rapper": "rapper --type ${rapperType} --rapperPath \"${rapperPath}\" --apiUrl \"${apiUrl}\" --rapUrl \"${rapUrl}\""`
}

const useReadmeStyles = makeStyles({
  root: {
    '&': {
      fontSize: 16,
    },
  },
  badge: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

function Readme() {
  const classes = useReadmeStyles()
  const { t } = useTranslation()
  return (
    <div className={classes.root}>
      <div style={{ textAlign: 'center' }}>
        <a href="https://github.com/thx/rapper" target="_blank" rel="noopener noreferrer">
          <img
            src="https://img.alicdn.com/tfs/TB1SlW9lQT2gK0jSZPcXXcKkpXa-1138-220.png"
            alt="Logo"
            width="250"
          />
        </a>
        <h3>{t('A built-in type request library (closed)')}</h3>
        <div className={classes.badge}>
          <iframe
            title="star"
            src="https://ghbtns.com/github-btn.html?user=thx&repo=rapper&type=star&count=true"
            scrolling="0"
            frameBorder="0"
            width="100px"
            height="20px"
          />
          <a
            href="https://www.yuque.com/rap/rapper/readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('The document')}
          </a>
        </div>
      </div>

      <h2>{t('What is the Rapper?')}</h2>
      <p>{t('Rapper is the best partner of TypeScript, it can help you to generate a type definition request plan.')}</p>
      <ul>
        <li>{t('text1')}</li>
        <li>{t('Request parameters/return data typing, static calibration, automatic completion faster to fly up')}</li>
        <li>{t('To React/Redux special optimization, providing global data solutions, hooks have an easy to use')}</li>
      </ul>
      <p>
        {t('Learn more about please click:')}
        <a href="https://www.yuque.com/rap/rapper/readme" target="_blank" rel="noopener noreferrer">
          {t('The document')}
        </a>
      </p>
      <p>{t('Use there is any doubt welcome to nailing group: during 21912534')}</p>
      {/* <div style={{ textAlign: 'center' }}> */}
      <img
        src="https://img.alicdn.com/tfs/TB1mLzfnF67gK0jSZPfXXahhFXa-828-1068.png"
        alt="dingtalk"
        width="200"
      />
      {/* </div> */}
      <h2>{t('Rapid configuration')}</h2>
    </div>
  )
}

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: spacing(2),
      flex: 1,
    },
    btn: {
      marginBottom: spacing(2),
      marginTop: spacing(2),
    },
    content: {
      padding: '30px 15vw 40vh 15vw',
    },
    formControl: {
      margin: 0,
    },
    formItem: {
      marginBottom: 16,
    },
    formLabel: {
      fontSize: 16,
      marginBottom: 5,
    },
    step: {
      fontSize: 16,
      marginBottom: 10,
    },
    mode: {
      fontSize: 12,
      marginLeft: 10,
    },
  })
)

function RapperInstallerModal({
  open,
  handleClose,
  repository,
}: {
  open: boolean
  handleClose: () => void
  repository: Repository
}) {
  const classes = useStyles()

  /** rapper 类型 normal redux */
  const [rapperType, setRapperType] = useState<RapperType>('normal')

  /** rapper 生成目录地址 */
  const [rapperPath, setRapperPath] = useState<string>('src/rapper')

  function handleRapperTypeChange(_event: React.ChangeEvent<HTMLInputElement>, value: RapperType) {
    setRapperType(value)
  }
  const { t } = useTranslation()
  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUp}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t('Try to use Rapper help you generate code')}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <Readme />
        <div className={classes.formItem}>
          <FormLabel component="legend" className={classes.formLabel}>
            {t('The generated code')}
            <a href="https://www.yuque.com/rap/rapper/which-model" className={classes.mode} target="_blank" rel="noopener noreferrer">
              {t('Which model should I choose?')}
            </a>
          </FormLabel>
          <RadioGroup aria-label="rapperType" row={true} name="rapperType" value={rapperType} onChange={handleRapperTypeChange}>
            <FormControlLabel value="normal" control={<Radio />} label={t('Basic mode')} />
            <FormControlLabel value="redux" control={<Radio />} label={t('The React + Redux advanced mode')} />
          </RadioGroup>
        </div>
        <div className={classes.formItem}>
          <FormLabel component="legend" className={classes.formLabel}>{t('installMsg')}</FormLabel>
          <TextField
            placeholder="src/rapper"
            fullWidth={true}
            margin="normal"
            variant="outlined"
            value={rapperPath}
            onChange={(event) => setRapperPath(event.target.value)}
          />
        </div>
        <p className={classes.step}>{t('1. Install the rapper to project dependencies')}</p>
        <pre>npm install rap --save</pre>
        <p className={classes.step}>{t('2. Give package. Under the json object of scripts to add the following line of the script')}</p>
        <pre>
          {codeTmpl({ projectId: repository.id, token: repository.token, rapperType, rapperPath })}
        </pre>
        <p className={classes.step}>{t('3. Run the rapper generated code')}</p>
        <pre>
          npm run rapper
        </pre>
        <p className={classes.step}>4.
          <a href="https://www.yuque.com/rap/rapper/use" target="_blank" rel="noopener noreferrer">
            {t('Good use!')}
          </a>
        </p>

      </DialogContent>
    </Dialog>
  )
}

export default RapperInstallerModal
