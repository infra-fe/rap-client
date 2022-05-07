export interface SortableTreeTableHeaderProps {
  editable: boolean
  handleClickCreatePropertyButton: () => void
}
export interface SortableTreeTableRowProps {
  /** 当前层级是不是展开 */
  isExpanding: boolean
  interfaceId: number
  [k: string]: any
}
export interface SortableTreeTableRowState {
  property: {
    children: any[]
    [k: string]: any
  }
  interfaceId: number
  childrenAdded: boolean
  childrenExpandingIdList: number[]
}
