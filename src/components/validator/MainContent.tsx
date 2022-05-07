
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Tabs, Tab, Box } from '@mui/material'

// 类型定义
import { CommonProps, TabPanelProps } from './types'

import BasePanel from './BasePanel'
import TargetPanel from './TargetPanel'
import RequestPanel from './RequestPanel'

function TabPanel(props: TabPanelProps) {
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

/**
 * tabs数据定义
 */
const DefineTabs = [
  { label: 'Base Setting', component: BasePanel },
  { label: 'Target Result', component: TargetPanel },
  { label: 'Request Interface', component: RequestPanel },
]

export default function MainContent(props: CommonProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState(0)
  const $Panels = useRef(null)

  const handleChange = async (event: any, newValue: number) => {
    // 先校验数据是否已经保存
    // TODO：要么延时切换（自动保存是异步存储到IndexedDB），要么提示用户手动保存

    try {
      $Panels!.current?.checkAndAutoSave()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('auto save error:', e)
    } finally {
      setTimeout(() => {
        setValue(newValue)
      }, 150)
    }
  }

  return (
    <Container className='MainContent' fixed={true}>
      {/* <AppBar position="static"> */}
      {/* tab切换按钮 */}
      <Tabs className='tabs' indicatorColor='primary' textColor='primary'
        TabIndicatorProps={{ style: { top: 0 } }}
        value={value} onChange={handleChange}>
        {DefineTabs.map((item, index) => {
          return <Tab className='tab' key={index} label={t(item.label)} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
        })}
      </Tabs>
      {/* </AppBar> */}

      {/* tab面板列表 */}
      {DefineTabs.map((item, index) => {
        return (
          <TabPanel key={index} value={value} index={index}>
            <item.component ref={$Panels} {...props} />
          </TabPanel>
        )
      })}
    </Container>
  )
}
