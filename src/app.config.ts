export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/benefits/index',
    'pages/visit/index',
    'pages/mine/index',
    'pages/benefit-detail/index',
    'pages/store-list/index',
    'pages/family-bind/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFF8F3',
    navigationBarTitleText: '康享权益',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#E8723A',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/home/index', text: '首页' },
      { pagePath: 'pages/benefits/index', text: '权益' },
      { pagePath: 'pages/visit/index', text: '到店' },
      { pagePath: 'pages/mine/index', text: '我的' },
    ],
  },
});
