import { Translation } from 'react-i18next'
import copy from 'clipboard-copy'
import * as React from 'react'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import FileCopy from '@mui/icons-material/FileCopyTwoTone'
import { withSnackbar, WithSnackbarProps } from 'notistack'

import './CopyToClipboard.sass'

type Props = {
  children: React.ReactElement<any>
  text: string
  type?: 'hover' | 'right'
  label?: string
  tip?: string
} & WithSnackbarProps

interface OwnState {
  showTooltip: boolean
}

class CopyToClipboard extends React.Component<Props, OwnState> {
  public state: OwnState = { showTooltip: false }

  public render() {
    const { type = 'hover', text, label, tip } = this.props
    return (
      <Translation>
        {(t) =>
          type === 'hover' ? (
            <Tooltip
              placement="right"
              overlay={
                <div
                  style={{
                    cursor: 'pointer',
                    color: '#fff',
                    padding: '8px 10px',
                  }}
                  onClick={() => this.onCopy(text, t)}
                >
                  {t('copy')}
                </div>
              }
              mouseLeaveDelay={0.4}
              mouseEnterDelay={0.4}
              visible={this.state.showTooltip}
              onVisibleChange={this.handleVisibleChange}
            >
              {this.props.children}
            </Tooltip>
          ) : (
            <>
              {this.props.children}
              <span
                className="copy-link edit"
                onClick={() => this.onCopy(text, t)}
                title={tip || t('Copy the name')}
              >
                <FileCopy fontSize="small" />
              </span>
              {label ? (
                <span onClick={() => this.onCopy(text, t)}>
                  {label}
                </span>
              ) : null}
            </>
          )
        }
      </Translation>
    )
  }

  private onCopy = (content: string, t: any) => {
    copy(content)
      .then(() => {
        const maxLength = 30
        const cutContent =
                    content.length > maxLength
                      ? content.substr(0, maxLength) + '...'
                      : content
        this.props.enqueueSnackbar(
          `${t('copySuccess')} ${cutContent} ${t('toClipBoard')}`,
          {
            variant: 'success',
            autoHideDuration: 1000,
          }
        )
      })
      .catch(() => {
        this.props.enqueueSnackbar(`${t('copyFailed')}`, {
          variant: 'error',
          autoHideDuration: 1000,
        })
      })
    this.setState({ showTooltip: false })
  }

  private handleVisibleChange = (visible: boolean) => {
    this.setState({ showTooltip: visible })
  }
}

export default withSnackbar<Props>(CopyToClipboard)
