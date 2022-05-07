import { Typography, IconButton } from '@mui/material'

export default function PanelTitle(props) {
  const { text, children, buttons } = props

  return (
    <Typography variant="h6" gutterBottom={true}>
      {text || children}
      <span style={{ marginLeft: '10px' }}>
        {buttons && buttons.map((button: any, index: number) => (!button.hide &&
          (<IconButton
            key={index}
            style={{ margin: '0px', padding: '5px' }}
            color="primary"
            {...button.props}
            size="large">
            {<button.icon />}
          </IconButton>)
        ))}
      </span>
    </Typography>
  )
}
