import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'actions/types'
import { Card, CardActionArea, CardContent, Typography, CardActions, Button, Box } from '@mui/material'
import EditMyAccountDialog from './EditMyAccountDialog'
import { logout, fetchLoginInfo } from 'actions/account'

function MyAccountView() {
  const { t } = useTranslation()
  const me = useSelector((state: RootState) => state.auth)
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()
  const onEditSubmit = (isOk: boolean) => {
    setEditing(false)
    if (isOk) {
      dispatch(fetchLoginInfo())
    }
  }

  return (
    <Box sx={{ m: 2 }}>
      <Card sx={{ minWidth: '375px', maxWidth: '500px', maxHeight: `calc(100% - 32px)`, overflowY: 'auto' }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom={true} variant="h6" component="h6" sx={{ mt: 1, color: 'primary.main' }}>
              {me.fullname}
            </Typography>
            <Typography component="p">
              {t('signature')}
            </Typography>
            <Typography gutterBottom={true} variant="subtitle1" component="h6" sx={{ mt: 1, color: 'primary.main' }} >
              {t('nickname')}
            </Typography>
            <Typography component="p">
              {me.fullname}
            </Typography>
            <Typography gutterBottom={true} variant="subtitle1" component="h6" sx={{ mt: 1, color: 'primary.main' }} >
              {t('Account number/email address')}
            </Typography>
            <Typography component="p">
              {me.email}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={() => setEditing(true)}>{t('Modify profile')}</Button>
          <Button size="small" color="primary" onClick={() => dispatch(logout())}>{t('Logout')}</Button>
        </CardActions>
      </Card>
      {editing && <EditMyAccountDialog handleClose={onEditSubmit} />}
    </Box>
  )
}

export default MyAccountView
