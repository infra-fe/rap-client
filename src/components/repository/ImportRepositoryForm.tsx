import { Translation } from 'react-i18next'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RadioList from '../utils/RadioList'
import './ImportRepositoryForm.sass'
import {
  importRepository,
  fetchRepositoryList,
} from '../../actions/repository'
import RepositoryService from '../../relatives/services/Repository'
import { Button, TextField } from '@mui/material'
import { ProviderContext, withSnackbar } from 'notistack'

interface Props extends ProviderContext {
  orgId: number
  importRepository: (data: any, cb: any) => void
  title: string
}

interface States {
  orgId: number
  version: number
  docUrl: string
  disableSubmit: boolean
  projectData: string
}
class ImportRepositoryForm extends Component<Props, States> {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
  }
  static propTypes = {
    orgId: PropTypes.number.isRequired,
    importRepository: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }
  constructor(props: Props) {
    super(props)
    this.state = {
      orgId: props.orgId,
      version: 3,
      docUrl: '',
      disableSubmit: false,
      projectData: '',
    }
  }
  render() {
    const { rmodal } = this.context as any
    const { disableSubmit, version, projectData } = this.state
    return (
      <section className="ImportRepositoryForm">
        <div className="rmodal-header">
          <span className="rmodal-title">{this.props.title}</span>
        </div>
        <Translation>
          {(t) => (
            <form
              className="form-horizontal"
              onSubmit={(e) => {
                this.handleSubmit(e, t)
              }}
              style={{ padding: '0 20px', width: '660px' }}
            >
              <div className="rmodal-body">
                <div className="form-group row">
                  <label className="col-sm-4 control-label">
                    {t('Version')}
                  </label>
                  <div className="col-sm-10">
                    <RadioList
                      data={[
                        // { 'label': t('RAP1Msg'), 'value': 1 },
                        // { 'label': 'RAP1 Data', 'value': 2 },
                        {
                          label: 'RAP2 Data',
                          value: 3,
                        },
                      ]}
                      curVal={version}
                      name="version"
                      onChange={(val) =>
                        this.setState({ version: val })
                      }
                    />
                  </div>
                </div>
                {+version === 1 && (
                  <div className="form-group row">
                    <label className="col-sm-4 control-label">
                      {t('Document URL')}
                    </label>
                    <div className="col-sm-10">
                      <input
                        name="projectId"
                        value={this.state.docUrl}
                        onChange={(e) =>
                          this.setState({
                            docUrl: e.target.value,
                          })
                        }
                        className="form-control"
                        placeholder="http://rapapi.org/workspace/myWorkspace.do?projectId=145#2548"
                        spellCheck={false}
                        autoFocus={true}
                        required={true}
                        data-parsley-maxlength="256"
                        style={{ width: 500 }}
                      />
                    </div>
                  </div>
                )}
                {(+version === 2 || +version === 3) && (
                  <div className="form-group row">
                    {/* <label className="col-sm-4 control-label">{t('Document data')}</label> */}
                    <div className="col-sm-10">
                      <div>
                        <TextField
                          id="outlined-basic"
                          label={t('From URL')}
                          variant="outlined"
                          style={{ width: '600px' }}
                          value={this.state.docUrl}
                          onChange={(e) =>
                            this.setState({
                              docUrl: e.target
                                .value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          value={projectData}
                          onChange={(e) =>
                            this.setState({
                              projectData:
                                                                e.target.value,
                            })
                          }
                          placeholder={t(
                            'Please paste projectData to here'
                          )}
                          multiline={true}
                          label={t('copyJson')}
                          style={{
                            width: '600px',
                            margin: '10px 0',
                          }}
                          rows={10}
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="form-group row mb0">
                  <label className="col-sm-2 control-label" />
                  <div className="col-sm-10">
                    <Button
                      type="submit"
                      id="btnSubmitImportRAP"
                      disabled={disableSubmit}
                      variant="contained"
                      color="primary"
                      style={{
                        marginRight: 8,
                        maxWidth: '400px',
                      }}
                    >
                      {disableSubmit
                        ? `${t('importingMsg')}...`
                        : `${t('submit')}`}
                    </Button>
                    <Button onClick={() => rmodal.close()}>
                      {t('cancel')}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Translation>
      </section>
    )
  }
  componentDidUpdate() {
    (this.context as any).rmodal.reposition()
  }
  handleSubmit = async (e: any, t: any) => {
    e.preventDefault()
    const { docUrl, orgId, version } = this.state
    let { projectData } = this.state
    if (!projectData && !docUrl) {
      this.props.enqueueSnackbar(
        t(
          'Parsing, failure is not a valid JSON, please check the JSON format'
        ),
        { variant: 'error' }
      )
      return
    }
    this.setState({
      disableSubmit: true,
    })
    if (docUrl && !projectData) {
      try {
        const result = await RepositoryService.getSwaggerRepository({
          docUrl,
        })
        if (typeof result === 'object') {
          const { errMsg } = result
          if (errMsg) {
            this.props.enqueueSnackbar(errMsg, {
              variant: 'warning',
            })
            this.setState({
              disableSubmit: false,
            })
            return
          } else {
            projectData = JSON.stringify(result)
          }
        }
      } catch (error) {
        this.props.enqueueSnackbar(
          t(
            'Unable to obtain data, please check whether your service allows CORS, or use directly paste JSON import'
          ),
          { variant: 'error' }
        )
        this.setState({
          disableSubmit: false,
        })
        return
      }
    }
    this.props.importRepository(
      { docUrl, orgId, version, projectData },
      (res: any) => {
        this.setState({
          disableSubmit: false,
        })
        if (res.isOk) {
          (this.context as any).rmodal.resolve()
        } else {
          this.props.enqueueSnackbar(t('importFailed'), {
            variant: 'error',
          })
        }
      }
    )
  }
}

const mapDispatchToProps = {
  importRepository,
  fetchRepositoryList,
}

export default connect(
  null,
  mapDispatchToProps
)(withSnackbar(ImportRepositoryForm))
