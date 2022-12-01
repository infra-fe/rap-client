import { Chip, Stack } from '@mui/material'
import { SystemStyleObject } from '@mui/system'
import { ITag } from 'actions/types'
import _ from 'lodash'
interface ITagViewProps {
  tags: ITag[]
  style?: Partial<SystemStyleObject>
  onDelete?: (tag: ITag) => void
}

const DefaultStyle: Partial<SystemStyleObject> = {
  flexWrap: 'wrap',
}

export default function TagView(props: ITagViewProps) {
  const { tags, style, onDelete} = props
  const sx = !style ? DefaultStyle : {
    ...DefaultStyle,
    ...style,
  }

  return (
    <Stack direction="row" spacing={1} sx={sx}>
      {_.sortBy(tags, 'id').map((tag) => {
        return (
          <Chip variant="outlined" size="small"
            style={{borderRadius: '2px', background: '#fafafa', border: '1px solid #d9d9d9', margin: '4px'}}
            key={tag.id} label={tag.name} color={tag?.level === 'system' ? 'primary' : 'default'}
            onDelete={onDelete ? () => {onDelete(tag)} : null}
          />
        )
      })}
    </Stack>
  )
}
