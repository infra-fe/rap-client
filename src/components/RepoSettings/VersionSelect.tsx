/*
 * @Author: xia xian
 * @Date: 2022-08-11 09:28:10
 * @LastEditors: xia xian
 * @LastEditTime: 2022-08-25 17:22:43
 * @Description:
 */
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import VersionService from '../../relatives/services/Version'
type Options = {id: number; label: string}
export const fetchVersionList = async (repositoryId: number) => {
  const result = await VersionService.fetchVersionList({
    repositoryId,
    start: 1,
    limit: 100,
  })
  return result?.data?.list || []
}
interface Props {
  repositoryId: number
  initial?: string
  width?: number
  size?: 'small' | 'medium'
  variant?: 'filled' | 'standard' | 'outlined'
  label?: string
  onChange: (value: Options) => void
  onListChange?: (value?: Options) => void
  opVersion?: boolean
}
function VersionSelect(props: Props) {
  const { width, onChange, repositoryId, variant, size, label, onListChange, opVersion} = props
  const initialName  = props.initial || 'master'
  const firstData  = {label: initialName, id: -1}
  const [target, setTarget] = useState(firstData)
  const [options, setOptions] = useState<readonly Options[]>([])
  const [loading, setLoading] = useState(false)
  const setOptionList = (list) => {
    let target = null
    if(list.length) {
      target = list?.find(v => v.versionName === firstData.label) || list?.[0]
      setTarget({
        label: target.versionName,
        id: target.id,
      })
      setOptions(list?.map(v => ({label: v.versionName, id: v.id})))
    } else {
      setTarget(target)
      setOptions([])
    }
    if (typeof onListChange === 'function') {
      onListChange(target)
    }
  }
  const targetFetcher = async (isActive: boolean) => {
    if (isActive) {
      setLoading(true)
      const list = await fetchVersionList(repositoryId)
      setOptionList(list)
      setLoading(false)
    }
  }

  useEffect(()=> {
    let isActive = true
    targetFetcher(isActive)
    return () => { isActive = false}
  }, [repositoryId, opVersion])

  return (
    <Autocomplete
      sx={{ width }}
      disableClearable={true}
      value={target}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option: Options) => option.label}
      onChange={(_, v: Options) => {
        setTarget(v)
        onChange(v)
      }}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={variant}
          size={size}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={20} style={{marginRight: '25px'}}/> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  )
}

export default VersionSelect
