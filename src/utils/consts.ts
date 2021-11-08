export const TYPES = [
  'String',
  'Number',
  'Boolean',
  'Object',
  'Array',
  'Function',
  'RegExp',
  'Null',
]

export enum ENTITY_TYPE {
  REPOSITORY = 0,
  INTERFACE = 1,
  PARAMETER = 2,
}

export enum CACHE_KEY {

  /** GLOBAL PERSONAL PREFERENCES */
  THEME_ID = 'THEME_ID',

  GUIDE_20200714 = 'GUIDE_20200714',

}


export const TablePaginationProps = (t) => ({
  labelRowsPerPage: t('Entry for each page'),
  backIconButtonProps: {
    'aria-label': t('The previous page'),
  },
  nextIconButtonProps: {
    'aria-label': t('The next page'),
  },
})
