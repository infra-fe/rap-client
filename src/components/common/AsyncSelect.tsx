import { Autocomplete, CircularProgress, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks'

// const debounce = require('debounce-promise')
interface Props {
  /** fetch URL */
  label?: string
  multiple?: boolean
  value?: INumItem | INumItem[]

  onChange: (value: INumItem[]) => void
  fetcher: (query: string) => Promise<INumItem[]>
}
function AsyncSelect(props: Props) {
  const { fetcher, multiple = true, onChange, value, label = '' } = props
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<INumItem[]>([])
  const [loading, setLoading] = useState(false)

  const debouncedInputValue = useDebounce(inputValue, 600)

  useEffect(() => {
    if (debouncedInputValue !== '') {
      setLoading(true)
      fetcher(debouncedInputValue).then(ops => {
        setOptions(ops)
        setLoading(false)
      })
    }
  }, [debouncedInputValue])

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple={multiple}
        value={value}
        options={options}
        loading={loading}
        inputValue={inputValue}
        onInputChange={(_, val) => setInputValue(val)}
        isOptionEqualToValue={(option: INumItem, value: INumItem) => {
          return option.value === value.value
        }}
        onChange={(_, val: INumItem | INumItem[]) => {
          onChange(val instanceof Array ? val : [val])
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Stack>
  )
}

export default AsyncSelect
