
import { HelpOutlineOutlined } from '@mui/icons-material'
import { Box, Button, Container, OutlinedInput } from '@mui/material'
import { refreshToken } from 'actions/repository'
import { RepositoryVersion } from 'actions/types'
import { CopyToClipboard } from 'components/utils'
import { useConfirm } from 'hooks/useConfirm'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
type Props = {
  id: number
  token: string
  version: RepositoryVersion
}
export default function OpenApi(props: Props) {
  const { id, token, version } = props
  const { t } = useTranslation()
  const [accessToken, setAccessToken] = useState(token)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const handleAccessToken = () => {
    confirm({
      content: t('Confirm refresh token'),
    }).then(() => {
      dispatch(refreshToken(id, (res) => {
        if (res.token) {
          setAccessToken(res.token)
          enqueueSnackbar(t('Refresh access token success'), { variant: 'success' })
        } else {
          enqueueSnackbar(t('Refresh access token failed'), { variant: 'error' })
        }
      }, () => {
        enqueueSnackbar('error', { variant: 'error' })
      }))
    })
  }
  const list = [
    { url: '/openAPI/repository/list', tip: 'Search repository(project) list' },
    { url: '/openAPI/organization/list', tip: 'Search organization list' },
    { url: `/openAPI/repository/${id}`, tip: 'Search repository(project) modules and interfaces' },
    { url: `/openAPI/interface/${id}`, tip: 'Search interface details' },
    { url: '/openAPI/repository/import', tip: 'Import data' },
  ]
  return (
    <Container className='MainContent' fixed={true}>
      <Box>
        <h2>{t('Configuration')}</h2>
        <span>{t('TokenTip')}</span>
        <h3>{t('Access')} Token</h3>
        <OutlinedInput size="small" value={accessToken} readOnly={true} sx={{ mr: 1, width: '310px' }} />
        <CopyToClipboard type="right" text={accessToken} tip="Copy Access Token">
          <span />
        </CopyToClipboard>
        <Button sx={{ ml: 1 }} size="small" variant="contained" color="primary" tabIndex={3} onClick={handleAccessToken}>{`${accessToken ? 'Refresh' : 'Create'}`}</Button>
        <h3>{t('Repository')} ID</h3>
        <OutlinedInput size="small" value={id} readOnly={true} sx={{ mr: 1, width: '310px' }} />
        <CopyToClipboard type="right" text={id.toString()} tip="Copy Repository ID"><span /></CopyToClipboard>
        {version && <>
          <h3>{`${t('Version')} ${t('Name')}`}</h3>
          <OutlinedInput size="small" value={version.versionName} readOnly={true} sx={{ mr: 1, width: '310px' }} />
          <CopyToClipboard type="right" text={version.versionName.toString()} tip="Copy the name"><span /></CopyToClipboard>
        </>
        }
      </Box>
      <Box>
        <h2>{t('How to use')}<a href="https://infra-fe.github.io/rap-client/open/upload"
          target="_blank" rel="noopener noreferrer">
          <HelpOutlineOutlined sx={{ ml: 1, mb: 0.5 }} />
        </a></h2>
        <ul>
          {list.map(({ url, tip }) => {
            return <li key={url}><CopyToClipboard type="right" text={url} tip="Copy Access Token"><span></span></CopyToClipboard> {url}【{t(`${tip}`)}】</li>
          })}
        </ul>
      </Box>
    </Container>
  )
}
