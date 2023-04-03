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

export const mockRuleGenerator = (t) => ({
  '@string': t('@string'),
  '@natural': t('@natural'),
  '@integer': t('@integer'),
  '@float': t('@float'),
  '@boolean': t('@boolean'),
  '@character': t('@character'),
  '@date': t('@date'),
  '@time': t('@time'),
  '@datetime': t('@datetime'),
  '@now': t('@now'),
  '@color': t('@color'),
  '@rgb': t('@rgb'),
  '@rgba': t('@rgba'),
  '@hsl': t('@hsl'),
  '@paragraph': t('@paragraph'),
  '@sentence': t('@sentence'),
  '@word': t('@word'),
  '@title': t('@title'),
  '@cparagraph': t('@cparagraph'),
  '@csentence': t('@csentence'),
  '@cword': t('@cword'),
  '@ctitle': t('@ctitle'),
  '@first': t('@first'),
  '@last': t('@last'),
  '@name': t('@name'),
  '@cfirst': t('@cfirst'),
  '@clast': t('@clast'),
  '@cname': t('@cname'),
  '@url': t('@url'),
  '@domain': t('@domain'),
  '@protocol': t('@protocol'),
  '@email': t('@email'),
  '@ip': t('@ip'),
  '@lower': t('@lower'),
  '@pick(["a", "e", "i", "o", "u"])': t('@pick'),
  '@shuffle(["a", "e", "i", "o", "u"])': t('@shuffle'),
  '@guid': t('@guid'),
  '@id': t('@id'),
  '@increment': t('@increment'),
})
