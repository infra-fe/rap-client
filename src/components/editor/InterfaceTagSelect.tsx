import { Add } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import { Box, ButtonBase, IconButton, InputBase, List, ListItem, ListItemButton, Popper, TextField } from '@mui/material'
import Autocomplete, { autocompleteClasses, AutocompleteCloseReason } from '@mui/material/Autocomplete'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { styled, useTheme } from '@mui/material/styles'
import { updateTagList } from 'actions/interface'
import { ITag, RootState } from 'actions/types'
import { TagView } from 'components/utils'
import PopperContainer, { PopperForm } from 'components/validator/PopperContainer'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import { ChangeEvent, CSSProperties, Fragment, KeyboardEvent, MouseEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import TagService from '../../relatives/services/Tag'
interface PopperComponentProps {
  anchorEl?: any
  disablePortal?: boolean
  open: boolean
}

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: 'none',
    margin: 0,
    color: 'inherit',
    fontSize: 13,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      padding: 8,
      borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'
      }`,
      '&[aria-selected="true"]': {
        backgroundColor: 'transparent',
      },
      [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]: {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: 'relative',
  },
}))

function PopperComponent(props: PopperComponentProps) {
  const { disablePortal, anchorEl, open, ...other } = props
  return <StyledAutocompletePopper {...other} />
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
  boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'
  }`,
  borderRadius: 6,
  width: 270,
  zIndex: theme.zIndex.modal,
  fontSize: 13,
  color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
}))

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: 10,
  width: '100%',
  borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
  }`,
  '& input': {
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
    padding: 8,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
    }`,
    fontSize: 14,
    '&:focus': {
      boxShadow: `0px 0px 0px 3px ${theme.palette.mode === 'light'
        ? 'rgba(3, 102, 214, 0.3)'
        : 'rgb(12, 45, 107)'
      }`,
      borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd',
    },
  },
}))

const Button = styled(ButtonBase)(({ theme }) => ({
  fontSize: 13,
  width: '100%',
  textAlign: 'left',
  paddingBottom: 8,
  color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
  fontWeight: 600,
  '&:hover': {
    color: theme.palette.mode === 'light' ? '#0366d6' : '#58a6ff',
  },
  '& span': {
    width: '100%',
  },
  '& svg': {
    width: 16,
    height: 16,
  },
}))
interface InterfaceTagSelectProps {
  repositoryId: number
  canUserEdit: boolean
  tagIds?: number[]
  title?: string
  onChange?: (tagIds: number[]) => void
  style?: Partial<CSSProperties>
}

export default function InterfaceTagSelect(props: InterfaceTagSelectProps) {
  const { repositoryId, tagIds, title, onChange, canUserEdit } = props
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [value, setValue] = useState<ITag[]>([])
  const [pendingValue, setPendingValue] = useState<ITag[]>()
  const tags = useSelector((state: RootState) => state.tags)
  const dispatch = useDispatch()
  const setTags = (tags) => {
    dispatch(updateTagList(tags))
  }
  // 数据初始化
  const open = Boolean(anchorEl)
  const initData = async () => {
    // 根据仓库ID获取标签列表
    const response = await TagService.fetchTagList({
      repositoryId,
      limit: 100,
    })
    const { isOk, data } = response

    if (isOk) {
      setTags(data?.list)
      const selected = data?.list.filter(v => tagIds.includes(v.id))
      setValue(selected)
      setPendingValue(selected)
    } else {
      setTags([])
    }
  }
  useEffect(() => {
    if (repositoryId) {
      initData()
    }
  }, [repositoryId])

  const theme = useTheme()

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setPendingValue(value)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setValue(pendingValue)
    if (anchorEl) {
      anchorEl.focus()
    }
    setAnchorEl(null)
    try {
      onChange && onChange(pendingValue?.map(value => value.id))
    } catch (e) {
      // eslint-disable-line
    }
  }

  const id = open ? 'github-label' : undefined

  // 新建tag的操作
  const createTag = async (tagName: string) => {
    const response = await TagService.createTag({
      name: tagName,
      repositoryId,
      level: 'repository',
    })
    const { isOk, errMsg, data } = response

    if (isOk && data?.created && data?.tag) {
      setTags([
        ...tags,
        data.tag,
      ])
      const selected = [...value, data.tag]
      setValue(selected)
      setPendingValue(selected)
    }

    if (!isOk && errMsg) {
      enqueueSnackbar(errMsg, { variant: 'error' })
    }

    return isOk
  }
  const handleDelete = (item) => {
    const newValue = value.filter(v => v.id !== item.id)
    setValue(newValue)
    setPendingValue(newValue)
    onChange && onChange(newValue?.map(value => value.id))
  }
  return (
    <Fragment>
      <Box sx={{ fontSize: 13, width: '23rem' }}>
        <Button disableRipple={true} aria-describedby={id} onClick={handleClick}>
          <span>{title || `${t('Filter')}`}{t('Tags')}</span>
          <SettingsIcon />
        </Button>
        <TagView tags={value} onDelete={handleDelete} />
      </Box>
      <StyledPopper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
                }`,
                padding: '8px 10px',
                fontWeight: 600,
              }}
            >
              <span>{`${t('Select')}${t('Tags')}`}<a href="https://github.com/infra-fe/rap-client/wiki/Interface-Tags"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HelpOutlineOutlinedIcon sx={{ fontSize: '16px', color: '#3f51b5', cursor: 'pointer', margin: '2px' }} />
              </a></span>
              <span style={{ cursor: 'pointer', color: '#30363d' }} onClick={handleClose}><CloseIcon style={{ fontSize: 16 }} /></span>
            </Box>
            <Autocomplete
              open={true}
              multiple={true}
              onClose={(
                event: ChangeEvent,
                reason: AutocompleteCloseReason
              ) => {
                if (reason === 'escape') {
                  handleClose()
                }
              }}
              value={pendingValue}
              onChange={(event, newValue, reason) => {
                if (
                  event.type === 'keydown' &&
                  (event as KeyboardEvent).key === 'Backspace' &&
                  reason === 'removeOption'
                ) {
                  return
                }
                setPendingValue(newValue)
              }}
              disableCloseOnSelect={true}
              PopperComponent={PopperComponent}
              renderTags={() => null}
              noOptionsText="No labels"
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Box
                    component={DoneIcon}
                    sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                    style={{
                      visibility: selected ? 'visible' : 'hidden',
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      wordBreak: 'break-all',
                    }}
                  >
                    {option.name}
                  </Box>
                </li>
              )}
              options={_.sortBy(tags, 'id')}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <StyledInput
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  autoFocus={true}
                  placeholder={`${t('Filter')}${t('Tags')}`}
                />
              )}
            />
            {canUserEdit && <nav aria-label="main mailbox folders">
              <List>
                <ListItem disablePadding={true}>
                  <PopperContainer
                    isMountedParent={false}
                    trigger={(triggerProps) => (
                      <ListItemButton {...triggerProps}>
                        <IconButton color="primary" component="label"><Add /></IconButton>
                        <span>{t('Create New Tag')}</span>
                      </ListItemButton>
                    )}
                  >
                    {(popperProps) => (
                      <PopperForm<Pick<ITag, 'name'>>
                        style={{ width: '260px' }}
                        initialValues={{ name: '' }}
                        fields={(values) => {
                          return [
                            <TextField key='tagName' name='name' label='Tag Name' fullWidth={true} value={values.name} />,
                          ]
                        }}
                        onSubmit={async (values) => {
                          return await createTag(values.name)
                        }}
                        onClose={popperProps.close} />
                    )}
                  </PopperContainer>
                </ListItem>
              </List>
            </nav>}
          </div>
        </ClickAwayListener>
      </StyledPopper>
    </Fragment>
  )
}
