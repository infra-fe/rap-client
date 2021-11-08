import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Paper, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(2),
    margin: spacing(2),
  },
}))

function AboutView() {
  const classes = useStyles()
  const md = `
  # About us
  `
  return (
    <Paper className={classes.root}>
      <Markdown>{md}</Markdown>
    </Paper>
  )
}

export default AboutView
