export default {
  outputPath: 'docs-dist',
  base: 'rap-client',
  publicPath: '/rap-client/',
  exportStatic: {},
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  mode: 'site',
  title: 'RAP',
  favicon: 'http://rap2.taobao.org/favicon.png',
  logo: 'http://rap2.taobao.org/favicon.png',
  locales: [
    ['en-US', 'English'],
    ['zh-CN', '中文'],
  ],
  dynamicImport: {},
  manifest: {},
  hash: true,
  // mfsu: {},
  resolve: {
    // previewLangs: [],
    includes: ['docs'],
  },
  links: [
    {
      rel: 'stylesheet',
      href:
        'https://unpkg.com/@alifd/theme-design-pro@0.6.2/dist/next-noreset.min.css',
    },
    { rel: 'stylesheet', href: '/style.css' },
  ],
  navs: {
    'zh-CN': [
      { title: '指南', path: '/zh-CN/guide' },
      { title: 'Open API', path: '/zh-CN/open' },
      { title: 'GitHub', path: 'https://github.com/infra-fe/rap-client' },
      {
        title: '视频教程',
        path: 'https://www.bilibili.com/video/BV1s3411H7fr/',
      },
    ],
    'en-US': [
      { title: 'Guide', path: '/guide' },
      { title: 'Generate Code', path: '/code' },
      { title: 'Open API', path: '/open' },
      { title: 'GitHub', path: 'https://github.com/infra-fe/rap-client' },
      {
        title: 'Tutorial',
        path: 'https://www.bilibili.com/video/BV1s3411H7fr/',
      },
    ],
  },
  menus: {
    '/': [
      {
        title: 'Home',
        path: 'index',
      },
    ],
    '/zh-CN': [
      {
        title: '首页',
        path: 'index',
      },
    ],
    '/guide': [
      {
        title: 'First View',
        path: '/guide',
      },
      {
        title: 'Getting started',
        path: '/guide/start',
      },
      {
        title: 'Project',
        children: [
          {
            title: 'Organization',
            path: '/guide/project/organization',
          },
          {
            title: 'Repository',
            path: '/guide/project/repository',
          },
        ],
      },
      {
        title: 'Interface',
        children: [
          {
            title: 'Module',
            path: '/guide/interface/module',
          },
          {
            title: 'Basic settings',
            path: '/guide/interface/basic',
          },
          {
            title: 'Validation',
            path: '/guide/interface/validation',
          },
          {
            title: 'History',
            path: '/guide/interface/history',
          },
          {
            title: 'Generate Code',
            path: '/guide/interface/code',
          },
        ],
      },
      {
        title: 'Mock',
        children: [
          {
            title: 'Basic settings',
            path: '/guide/mock/basic',
          },
          {
            title: 'Scene setting',
            path: '/guide/mock/scene',
          },
          {
            title: 'Rules',
            path: '/guide/mock/rule',
          },
        ],
      },
      {
        title: 'Import',
        children: [
          {
            title: 'Rap import',
            path: '/guide/import/rap',
          },
          {
            title: 'Swagger/OpenApi import',
            path: '/guide/import/swagger',
          },
          {
            title: 'Yapi import',
            path: '/guide/import/yapi',
          },
          {
            title: 'Protobuf import',
            path: '/guide/import/protobuf',
          },
        ],
      },
      {
        title: 'Export',
        path: '/guide/export',
      },
      {
        title: 'FAQ',
        path: '/guide/qa',
      },
    ],
    '/code': [
      {
        title: 'Rapper v3',
        path: '/code',
      },
      {
        title: 'Pure TS Models',
        path: '/code/ts',
      },
      {
        title: 'Http Request',
        path: '/code/http',
      },

      {
        title: 'For React',
        path: '/code/react',
        children: [
          {
            title: 'React Hooks',
            path: '/code/react',
          },
          {
            title: '@rapper3/react-query',
            path: '/code/react/react-query',
          },
          {
            title: '@rapper3/react-query3',
            path: '/code/react/react-query3',
          },
          {
            title: '@rapper3/react-swr',
            path: '/code/react/react-swr',
          },
          {
            title: '@rapper3/react-redux',
            path: '/code/react/redux',
          },
          {
            title: '@rapper3/react-redux-toolkit',
            path: '/code/react/redux-toolkit',
          },
        ],
      },
      {
        title: 'For Vue',
        path: '/code/vue',
        children: [
          {
            title: '@rapper3/vue-query',
            path: '/code/vue/vue-query',
          },
          {
            title: '@rapper3/vue-swr',
            path: '/code/vue/vue-swr',
          },
        ],
      },
      {
        title: 'Nest DTO',
        path: '/code/dto',
      },
      {
        title: 'Migration v2 -> v3',
        path: '/code/migration',
      },
    ],
    '/open': [
      {
        title: 'Rap OpenAPI',
        children: [
          {
            title: 'Update interfaces data',
            path: '/open/upload',
          },
          {
            title: 'Search repository lists',
            path: '/open/repos',
          },
          {
            title: 'Search organization lists',
            path: '/open/organizations',
          },
          {
            title: 'Search repository details',
            path: '/open/detail',
          },
          {
            title: 'Search interface details',
            path: '/open/interface',
          },
          {
            title: 'Search repository format data',
            path: '/open/data',
          },
        ],
      },
    ],
    '/zh-CN/guide': [
      {
        title: '初识RAP',
        path: '/zh-CN/guide',
      },
      {
        title: '快速上手',
        path: '/zh-CN/guide/start',
      },
      {
        title: '项目管理',
        children: [
          {
            title: '团队操作',
            path: '/zh-CN/guide/project/organization',
          },
          {
            title: '仓库操作',
            path: '/zh-CN/guide/project/repository',
          },
        ],
      },
      {
        title: '接口管理',
        children: [
          {
            title: '模块管理',
            path: '/zh-CN/guide/interface/module',
          },
          {
            title: '基本设置',
            path: '/zh-CN/guide/interface/basic',
          },
          {
            title: '信息校验',
            path: '/zh-CN/guide/interface/validation',
          },
          {
            title: '查看历史',
            path: '/zh-CN/guide/interface/history',
          },
          {
            title: '生成代码',
            path: '/zh-CN/guide/interface/code',
          },
        ],
      },
      {
        title: '数据Mock',
        children: [
          {
            title: '基础设置',
            path: '/zh-CN/guide/mock/basic',
          },
          {
            title: '场景设置',
            path: '/zh-CN/guide/mock/scene',
          },
          {
            title: '匹配规则',
            path: '/zh-CN/guide/mock/rule',
          },
        ],
      },
      {
        title: '数据导入',
        children: [
          {
            title: 'Rap导入',
            path: '/zh-CN/guide/import/rap',
          },
          {
            title: 'Swagger/OpenApi导入',
            path: '/zh-CN/guide/import/swagger',
          },
          {
            title: 'Yapi导入',
            path: '/zh-CN/guide/import/yapi',
          },
          {
            title: 'Protobuf导入',
            path: '/zh-CN/guide/import/protobuf',
          },
        ],
      },
      {
        title: '数据导出',
        path: '/zh-CN/guide/export',
      },
      {
        title: '常见问题解答',
        path: '/zh-CN/guide/qa',
      },
    ],
    '/zh-CN/open': [
      {
        title: 'Rap开放API',
        children: [
          {
            title: '更新仓库接口信息',
            path: '/zh-CN/open/upload',
          },
          {
            title: '查询仓库列表',
            path: '/zh-CN/open/repos',
          },
          {
            title: '查询团队列表',
            path: '/zh-CN/open/organizations',
          },
          {
            title: '查询仓库详细信息',
            path: '/zh-CN/open/detail',
          },
          {
            title: '查询接口信息',
            path: '/zh-CN/open/interface',
          },
          {
            title: '查询仓库指定格式数据',
            path: '/zh-CN/open/data',
          },
        ],
      },
    ],
  },
  scripts: [],
  chainWebpack(memo) {
    memo.plugins.delete('copy')
  },
}
