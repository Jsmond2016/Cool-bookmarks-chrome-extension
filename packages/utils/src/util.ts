// 链接：https://juejin.cn/post/7184359234060943421
function buildShortUUID() {
  let unique = 0;
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  // eslint-disable-next-line no-undef
  unique++;
  return random + unique + String(time);
}

const sourceMap = {
  'zhihu.com': '知乎',
  'github.com': 'github',
  'github.io': 'github',
  'juejin.cn': '掘金',
  'segmentfault.com': '思否',
  'wexin.qq.com': '微信',
  'csdn.net': 'CSDN',
  'jianshu.com': '简书',
  'cnblogs.com': '博客园',
  others: '其他',
};

const sourceRender = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    const address = hostname.split('.').slice(-2).join('.');
    return sourceMap[address as keyof typeof sourceMap] || '其他';
  } catch (error) {
    console.log('error: ', error);
    console.log('invalid-url: ', url);
    return '其他';
  }
};

export { buildShortUUID, sourceRender, sourceMap };
