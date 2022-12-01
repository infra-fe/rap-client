import CloseIcon from '@mui/icons-material/Close'
import { AppBar, Box, Dialog, DialogContent, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, Toolbar, Typography } from '@mui/material'
import { Repository } from 'actions/types'
import Transition from 'components/common/Transition'
import { CopyToClipboard } from 'components/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import config from '../../config'

type RapperType = 'ts' | 'normal' | 'redux' | 'react' | 'dto'

const codeTmpl = ({ projectId, token, rapperType, rapperPath, versionId }: {
  projectId: number
  token?: string
  rapperType: RapperType
  rapperPath: string
  versionId: number
}) => {
  const apiUrl = `${config.serve}/repository/get?id=${projectId}${versionId ? `&versionId=${versionId}` : ''}${token ? `&token=${token}` : ''}`
  const rapUrl = window.location.origin
  return String.raw`"rapper": "rapper --type ${rapperType} --rapperPath \"${rapperPath}\" --apiUrl \"${apiUrl}\" --rapUrl \"${rapUrl}\""`
}

function getDep(type) {
  if (type === 'dto') {
    return 'class-validator class-transformer '
  }
  if (type === 'react') {
    return 'ahooks '
  }
  return ''
}
function Readme(props: {rapperVersion: string}) {
  const { rapperVersion } = props
  const { t } = useTranslation()
  return (
    <Box sx={{ fontSize: 16 }}>
      <h2>{t('What is the Rapper?')}</h2>
      <p>
        {t(
          'Rapper is the best partner of TypeScript, it can help you to generate a type definition request plan.'
        )}
      </p>
      <ul>
        <li>{t('text1')}</li>
        <li>
          {t(
            'Request parameters/return data typing, static calibration, automatic completion faster to fly up'
          )}
        </li>
        <li>
          {t(
            'Integrated ahooks useRequest API, easy to handle async request hooks'
          )}
        </li>
        <li>
          {t(
            'To React/Redux special optimization, providing global data solutions, hooks have an easy to use'
          )}
        </li>
      </ul>
      <p>
        {t('Learn more about please click:')}
        <a
          href={rapperVersion ==='v3'? 'https://infra-fe.github.io/rap-client/code/' :
            'https://www.yuque.com/rap/rapper/readme'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('The document')}
        </a>
      </p>
    </Box>
  )
}

const AddDepsTextMap = {
  ts: '',
  normal: '@rapper3/request ',
  react: '@rapper3/request @rapper3/react-ahooks ahooks ',
  dto: 'class-validator class-transformer ',
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
  /** rapper 版本 v2、v3 */
  const [rapperVersion, setRapperVersion] = useState('v3')
  /** rapper 类型 normal redux */
  const [rapperType, setRapperType] = useState<RapperType>('react')

  /** rapper 生成目录地址 */
  const [rapperPath, setRapperPath] = useState<string>('src/rapper')

  function handleRapperTypeChange(
    _event: React.ChangeEvent<HTMLInputElement>,
    value: RapperType
  ) {
    setRapperType(value)
  }
  const { t } = useTranslation()
  const depTextV2 = `yarn add rapper ${getDep(
    rapperType
  )}`
  const depTextV3 = `yarn add @rapper3/cli ${
    AddDepsTextMap[rapperType] || ''
  }`
  const depText = rapperVersion === 'v2' ? depTextV2 : depTextV3
  const codeText = codeTmpl({
    projectId: repository.id,
    token: repository.token,
    rapperType,
    rapperPath,
    versionId: rapperVersion === 'v2' ? null: repository?.version?.id,
  })
  const runText = `yarn rapper`
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
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
            {t('Try to use Rapper help you generate code')}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ padding: '30px 15vw 40vh 15vw' }}>
        <Box>
          <div style={{ textAlign: 'center' }}>
            <a
              href="https://github.com/infra-fe/rapper"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.alicdn.com/tfs/TB1SlW9lQT2gK0jSZPcXXcKkpXa-1138-220.png"
                alt="Logo"
                width="250"
              />
            </a>
            <h3>{t('A built-in type request library (closed)')}</h3>
          </div>
        </Box>
        <Box sx={{ fontSize: 16 }}>
          {' '}
          <h2>{t('Configuration')}</h2>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FormLabel sx={{ marginRight: 2 }}>Rapper Version:</FormLabel>
          <RadioGroup
            value={rapperVersion}
            onChange={(e, val) => {
              setRapperVersion(val)
              if (val === 'v2' && !['normal', 'redux'].includes(rapperType)) {
                setRapperType('normal')
              }
              if (val === 'v3' && rapperType === 'redux') {
                setRapperType('react')
              }
            }}
            row={true}
          >
            <FormControlLabel
              control={<Radio />}
              value="v3"
              label="Rapper V3"
            />
            <FormControlLabel
              control={<Radio />}
              value="v2"
              label="Rapper V2"
            />
          </RadioGroup>
        </Box>
        <Box sx={{ mb: 2, color: 'red', fontSize: 16 }}>
          {t('Rapper notice')}
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormLabel component="legend" sx={{ fontSize: 16, mb: 0.5 }}>
            {t('The generated code')}
            <Box
              component="a"
              href={rapperVersion === 'v3' ?
                'https://infra-fe.github.io/rap-client/code/' :
                'https://www.yuque.com/rap/rapper/which-model'}
              sx={{ fontSize: 12, ml: 1.5 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Which model should I choose?')}
            </Box>
          </FormLabel>
          <RadioGroup
            aria-label="rapperType"
            row={true}
            name="rapperType"
            value={rapperType}
            onChange={handleRapperTypeChange}
          >
            {rapperVersion === 'v3' && <FormControlLabel
              value="react"
              control={<Radio />}
              label={t('React mode')}
            />}
            <FormControlLabel
              value="normal"
              control={<Radio />}
              label={t('Basic mode')}
            />
            {rapperVersion === 'v2' && (
              <FormControlLabel
                value="redux"
                control={<Radio />}
                label={t('The React + Redux advanced mode')}
              />
            )}
            {rapperVersion === 'v3' && (
              <FormControlLabel
                value="ts"
                control={<Radio />}
                label={t('Pure TS Models mode')}
              />
            )}
            {rapperVersion === 'v3' && <FormControlLabel
              value="dto"
              control={<Radio />}
              label={t('Nest DTO mode')}
            />}
          </RadioGroup>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>
            1. {t('installMsg')}
          </Box>
          <TextField
            placeholder="src/rapper"
            fullWidth={true}
            margin="normal"
            variant="outlined"
            value={rapperPath}
            onChange={(event) => setRapperPath(event.target.value)}
          />
        </Box>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>
          2. {t('Install the rapper to project dependencies')}
        </Box>
        <pre>
          <CopyToClipboard type="right" text={depText} tip="Copy Access Token">
            <span />
          </CopyToClipboard>{' '}
          {depText}
        </pre>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>
          3. {t('Add the following line of the script in package.json')}
        </Box>
        <pre>
          <CopyToClipboard type="right" text={codeText} tip="Copy">
            <span />
          </CopyToClipboard>{' '}
          {codeText}
        </pre>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>
          4. {t('Run the rapper generated code')}
        </Box>
        <pre>
          <CopyToClipboard type="right" text={runText} tip="Copy">
            <span />
          </CopyToClipboard>{' '}
          {runText}
        </pre>
        <Box component="p" sx={{ fontSize: 16, mb: 0.5 }}>
          5.
          <a
            href={rapperVersion === 'v3' ?
              'https://infra-fe.github.io/rap-client/code/' :
              'https://www.yuque.com/rap/rapper/use'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Good use!')}
          </a>
        </Box>
        <Readme rapperVersion={rapperVersion}/>
      </DialogContent>
    </Dialog>
  )
}

export default RapperInstallerModal
