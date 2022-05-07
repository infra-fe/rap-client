import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import config from '../../config'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Transition from 'components/common/Transition'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { Repository } from 'actions/types'
import { Box, DialogContent } from '@mui/material'

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


function Readme() {
  const { t } = useTranslation()
  return (
    <Box sx={{ fontSize: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <a href="https://github.com/thx/rapper" target="_blank" rel="noopener noreferrer">
          <img
            src="https://img.alicdn.com/tfs/TB1SlW9lQT2gK0jSZPcXXcKkpXa-1138-220.png"
            alt="Logo"
            width="250"
          />
        </a>
        <h3>{t('A built-in type request library (closed)')}</h3>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        </Box>
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
    </Box>
  )
}

function RapperInstallerModal({
  open,
  handleClose,
  repository,
}: {
  open: boolean
  handleClose: () => void
  repository: Repository
}) {

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
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            size="large">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
            {t('Try to use Rapper help you generate code')}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ padding: '30px 15vw 40vh 15vw' }}>
        <Readme />
        <Box sx={{ mb: 2 }}>
          <FormLabel component="legend" sx={{ fontSize: 16, mb: 0.5 }}>
            {t('The generated code')}
            <Box component="a" href="https://www.yuque.com/rap/rapper/which-model" sx={{ fontSize: 12, ml: 1.5 }} target="_blank" rel="noopener noreferrer">
              {t('Which model should I choose?')}
            </Box>
          </FormLabel>
          <RadioGroup aria-label="rapperType" row={true} name="rapperType" value={rapperType} onChange={handleRapperTypeChange}>
            <FormControlLabel value="normal" control={<Radio />} label={t('Basic mode')} />
            <FormControlLabel value="redux" control={<Radio />} label={t('The React + Redux advanced mode')} />
          </RadioGroup>
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormLabel component="legend" sx={{ fontSize: 16, mb: 0.5 }}>{t('installMsg')}</FormLabel>
          <TextField
            placeholder="src/rapper"
            fullWidth={true}
            margin="normal"
            variant="outlined"
            value={rapperPath}
            onChange={(event) => setRapperPath(event.target.value)}
          />
        </Box>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>{t('1. Install the rapper to project dependencies')}</Box>
        <pre>npm install rap --save</pre>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>{t('2. Give package. Under the json object of scripts to add the following line of the script')}</Box>
        <pre>
          {codeTmpl({ projectId: repository.id, token: repository.token, rapperType, rapperPath })}
        </pre>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>{t('3. Run the rapper generated code')}</Box>
        <pre>
          npm run rapper
        </pre>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>4.
          <a href="https://www.yuque.com/rap/rapper/use" target="_blank" rel="noopener noreferrer">
            {t('Good use!')}
          </a>
        </Box>

      </DialogContent>
    </Dialog>
  )
}

export default RapperInstallerModal
