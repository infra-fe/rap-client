import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CACHE_KEY } from 'utils/consts'
import MySettings from './MySettings'
import { RootState } from 'actions/types'
import { fetchUserSettings, doUpdateUserSetting } from 'actions/account'
import { Box } from '@mui/material'

const SETTING_KEYS: CACHE_KEY[] = [
  CACHE_KEY.THEME_ID,
]

function MySettingsView() {
  const dispatch = useDispatch()
  const settings = useSelector((state: RootState) => state.userSettings)
  const isFetching = useSelector((state: RootState) => state.userSettingsIsUpdating)

  useEffect(() => {
    dispatch(fetchUserSettings(SETTING_KEYS))
  }, [dispatch])

  const handleSettingChange = (key: CACHE_KEY, val: string) => {
    dispatch(doUpdateUserSetting(key, val, isOk => {
      if (isOk) {
        fetchUserSettings(SETTING_KEYS)
      }
    }))
  }

  return (
    <Box sx={{ p: 2 }}>
      <MySettings
        data={settings}
        isFetching={isFetching}
        onChange={handleSettingChange}
      />
    </Box>
  )
}

export default MySettingsView
