import { Translation } from 'react-i18next'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RadioList from '../utils/RadioList'
import './ImportRepositoryForm.css'
import { importRepository, fetchRepositoryList } from '../../actions/repository'
import { Button, TextField } from '@material-ui/core'

class ImportRepositoryForm extends Component<any, any> {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
  }
  static propTypes = {
    orgId: PropTypes.number.isRequired,
    importRepository: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      orgId: props.orgId,
      version: 1,
      docUrl: '',
      disableSubmit: false,
      projectData: '',
    }
  }
  render() {
    const { rmodal } = this.context
    const { disableSubmit, version, projectData } = this.state
    return (
      <section className="ImportRepositoryForm">
        <div className="rmodal-header">
          <span className="rmodal-title">{this.props.title}</span>
        </div>
        <Translation>
          {(t) => (
            <form className="form-horizontal" onSubmit={this.handleSubmit} >
              <div className="rmodal-body">
                <div className="form-group row">
                  <label className="col-sm-4 control-label">{t('Version')}</label>
                  <div className="col-sm-10">
                    <RadioList
                      data={[
                        { 'label': t('RAP1Msg'), 'value': 1 },
                        { 'label': 'RAP1 Data', 'value': 2 },
                        { 'label': 'RAP2 Data', 'value': 3 }]}
                      curVal={version}
                      name="version"
                      onChange={val => this.setState({ version: val })}
                    />
                  </div>
                </div>
                {+version === 1 && (
                  <div className="form-group row">
                    <label className="col-sm-4 control-label">{t('Document URL')}</label>
                    <div className="col-sm-10">
                      <input
                        name="projectId"
                        value={this.state.docUrl}
                        onChange={e => this.setState({ docUrl: e.target.value })}
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
                    <label className="col-sm-4 control-label">{t('Document data')}</label>
                    <div className="col-sm-10">
                      <TextField
                        value={projectData}
                        onChange={e => this.setState({ projectData: e.target.value })}
                        placeholder={t('Please paste projectData to here')}
                        multiline={true}
                        style={{ width: 600, height: 300, margin: 16 }}
                        rowsMax={10}
                      />
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
                      style={{ marginRight: 8 }}
                    >{disableSubmit ? '导入中，请稍等...' : '提交'}
                    </Button>
                    <Button onClick={() => rmodal.close()}>{t('cancel')}</Button>
                  </div>
                </div>
              </div>
            </form>
          )}</Translation>
      </section>
    )
  }
  componentDidUpdate() {
    this.context.rmodal.reposition()
  }
  handleSubmit = (e: any) => {
    this.setState({
      disableSubmit: true,
    })
    e.preventDefault()
    const { docUrl, orgId, version, projectData } = this.state
    this.props.importRepository({ docUrl, orgId, version, projectData }, (res: any) => {
      this.setState({
        disableSubmit: false,
      })
      if (res.isOk) {
        this.context.rmodal.resolve()
      }
    })
  }
}

const mapDispatchToProps = ({
  importRepository,
  fetchRepositoryList,
})

export default connect(
  null,
  mapDispatchToProps
)(ImportRepositoryForm)
