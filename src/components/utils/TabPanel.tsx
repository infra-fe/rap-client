/*
 * @Author: xia xian
 * @Date: 2022-05-24 16:42:02
 * @LastEditors: xia xian
 * @LastEditTime: 2022-05-24 16:44:37
 * @Description:
 */
import { Box } from '@mui/material'

export interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  )
}
