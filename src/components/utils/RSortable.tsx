import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Sortable from 'sortablejs'
import './RSortable.sass'

type RSortableState = any
type RSortableProps = any
class RSortable extends Component<RSortableProps, RSortableState> {
  $sortable: any = null
  render() {
    return this.props.children
  }
  componentDidMount() {
    // onChange 不能传入 sortable，会有冲突
    const { onChange, ...restProps } = this.props
    const $sortable = Sortable.create(findDOMNode(this) as any, {
      handle: '.sortable',
      animation: 150,
      onEnd: (e: any) => {
        if (onChange) {
          onChange(e, $sortable)
        }
      },
      ...restProps,
    })
    this.$sortable = $sortable
  }
  componentDidUpdate() {
    if (this.props.disabled !== undefined) {
      this.$sortable.option('disabled', this.props.disabled)
    }
  }
}

export class RSortableHandle extends Component<any, any> {
  render() {
    return <div className="sortable">{this.props.children}</div>
  }
}

export default RSortable
