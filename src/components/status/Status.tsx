import { Card } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { RootState } from 'actions/types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RChart } from '../utils/'
import './Status.sass'

// TODO 2.3 仓库曲线 接口曲线
// TODO 2.3 接口覆盖率
// TODO 2.3 接口调用（模拟）曲线
// TODO 2.3 用户曲线

export default function Status() {
  const theme = useTheme()
  const { t } = useTranslation()
  const adapt = (list: any, label: any) => {
    const mainColor = theme.palette.primary.main
    return {
      labels: list?.map((item: any) => item.label),
      datasets: [
        {
          label: label || '-',
          data: list?.map((item: any) => item.value),
          backgroundColor: mainColor,
          borderColor: mainColor,
          borderWidth: 1,
          fill: false,
        },
      ],
    }
  }
  const counter = useSelector((state: RootState) => state.counter)
  const users = useSelector((state: RootState) => state.users)
  const organizations = useSelector((state: RootState) => state.organizations)
  const repositories = useSelector((state: RootState) => state.repositories)
  const interfaces = useSelector((state: RootState) => state.interfaces)
  const analyticsRepositoriesCreatedState = useSelector((state: RootState) => state.analyticsRepositoriesCreated)
  const analyticsUsersActivationState = useSelector(
    (state: RootState) => state.analyticsUsersActivation
  )
  const analyticsRepositoriesActivationState = useSelector(
    (state: RootState) => state.analyticsRepositoriesActivation
  )
  const analyticsRepositoriesUpdatedState = useSelector(
    (state: RootState) => state.analyticsRepositoriesUpdated
  )
  const analyticsRepositoriesCreated = analyticsRepositoriesCreatedState?.data || []
  const analyticsUsersActivation = analyticsUsersActivationState?.data?.map((item: any) => ({
    label: item.fullname || item.empId || item.userId,
    value: item.value,
  }))
  const analyticsRepositoriesActivation = analyticsRepositoriesActivationState?.data?.map(
    (item: any) => ({
      label: item.name || item.repositoryId,
      value: item.value,
    })
  )
  const analyticsRepositoriesUpdated = analyticsRepositoriesUpdatedState.data
  const dict = [
    [t('Version'), counter.version, ''],
    [t('User'), users.pagination.total, t('people')],
    [t('Mock'), counter.mock, t('time')],
    [t('Organization'), organizations.pagination.total, t('unit')],
    [t('Repository'), repositories.pagination.total, t('unit')],
    [t('API'), interfaces.pagination.total, t('unit')],
  ]
  return (
    <article className="Status">
      {/* <div className='header'><span className='title'>分析和报告</span></div> */}
      <div className="body">
        <div className="row mb20">
          {dict.map(([name, value, unit]) => (
            <div key={name}>
              <Card className="card">
                <div className="card-block">
                  <div className="card-title name">{t(`${name}`)}</div>
                  <div>
                    <span className="value techfont">{value}</span>
                    <span className="unit">{t(`${unit}`)}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        <div className="row">
          <Card className="chart">
            <div className="header">
              <span className="title">{t('New repositories recent 30 days')}</span>
            </div>
            <RChart type="line" data={adapt(analyticsRepositoriesCreated, t('new repositories'))} options={{}} />
          </Card>
          <Card className="chart">
            <div className="header">
              <span className="title">{t('Active repositories recent 30 days')}</span>
            </div>
            <RChart
              type="line"
              data={adapt(analyticsRepositoriesUpdated, t('active repositories'))}
              options={{}}
            />
          </Card>
          <Card className="chart">
            <div className="header">
              <span className="title">{t('Active users ranking recent 30 days')}</span>
            </div>
            <RChart
              type="bar"
              data={adapt(analyticsUsersActivation, t('operation'))}
              options={{}}
            />
          </Card>
          <Card className="chart">
            <div className="header">
              <span className="title">{t('Active repositories ranking recent 30 days')}</span>
            </div>
            <RChart
              type="bar"
              data={adapt(analyticsRepositoriesActivation, t('operation'))}
              options={{}}
            />
          </Card>
        </div>
      </div>
    </article>
  )
}
