export enum DayFirstCategoryEnum {
  /** 今日重点 */
  Important = 'DayImportant',
  /** 今日工作 */
  Work = 'DayWork',
  /** 今日心情  */
  MotionToday = 'DayMotionToday',
  /** 今日好文 */
  Article_Recommend = 'DayArticle_Recommend',
  /** 项目-博客推荐 */
  Project_Blog = 'DayProject_Blog',
  /** 求职 or 就业 or 经验 or 职业规划 */
  Job_Experience_Profession = 'DayJob_Experience_Profession',
  /** 讨论 & GPT & AI */
  AI_GPT = 'AI_GPT',
  /** 后端 */
  Backend = 'DayBackend',
  /** Web3 和 区块链 */
  Web3AndBlockChain = 'DayWeb3AndBlockChain',
  /** 讨论 */
  Argument = 'Argument',

  /** 默认 */
  Default = 'Default',
}

export const DayFirstCategoryOrder = [
  DayFirstCategoryEnum.Default,
  DayFirstCategoryEnum.Important,
  DayFirstCategoryEnum.Work,
  DayFirstCategoryEnum.MotionToday,
  DayFirstCategoryEnum.Article_Recommend,
  DayFirstCategoryEnum.Project_Blog,
  DayFirstCategoryEnum.Job_Experience_Profession,
  DayFirstCategoryEnum.AI_GPT,
  DayFirstCategoryEnum.Backend,
  DayFirstCategoryEnum.Web3AndBlockChain,
  DayFirstCategoryEnum.Argument,
];

export const DayFirstCategoryOptions = {
  [DayFirstCategoryEnum.Default]: '默认',
  [DayFirstCategoryEnum.Important]: '今日重点',
  [DayFirstCategoryEnum.Work]: '今日工作',
  [DayFirstCategoryEnum.MotionToday]: '今日心情',
  [DayFirstCategoryEnum.Article_Recommend]: '好文推荐/Top3/新知识/英文推荐/专题/其他好文',
  [DayFirstCategoryEnum.Project_Blog]: '项目/博客/工具/教程',
  [DayFirstCategoryEnum.Job_Experience_Profession]: '求职/副业/经验/程序员转行',
  [DayFirstCategoryEnum.AI_GPT]: 'AI & GPT',
  [DayFirstCategoryEnum.Backend]: '后端-Java-Golang等',
  [DayFirstCategoryEnum.Web3AndBlockChain]: 'Web3 & 区块链',
  [DayFirstCategoryEnum.Argument]: '热议话题-讨论',
} as const;

export enum DaySecondCategoryEnum {
  /** TOP3 */
  Top3 = 'DayTop3',
  /** 新知识  */
  New_Knowledge = 'DayNew_Knowledge',
  /** 英文推荐 */
  Blog_English = 'DayBlog_English',
  /** 专题 */
  Topics = 'DayTopics',
  /** 其他好文 */
  Other_Articles = 'DayOther_Articles',
  /** 博客 */
  Blog = 'DayBlog',
  /** 项目 */
  Project = 'DayProject',
  /** 工具 */
  Tools = 'DayTools',
  /** 教程 */
  Tutorials = 'DayTutorials',
  /** 前端工具库 */
  FrontTools = 'DayFrontTools',
  /** default */
  Default = 'DayDefault',

  GoodArticle = 'GoodArticle',
  Job = 'Job' /** 求职 */,
  SideJob = 'SideJob' /** 副业 */,
  WorkExperience = 'WorkExperience' /** 工作经验 */,
  ChangeJob = 'ChangeJob' /** 程序员转行 */,

  Java = 'Java',
  Golang = 'Golang',
  OtherBackendSection = 'OtherBackendSection',

  Web3 = 'Web3',
  BlockChain = 'BlockChain',
}

export const DaySecondCategoryOrder = [
  DaySecondCategoryEnum.Default,
  DaySecondCategoryEnum.Top3,
  DaySecondCategoryEnum.GoodArticle,
  DaySecondCategoryEnum.New_Knowledge,
  DaySecondCategoryEnum.Blog_English,
  DaySecondCategoryEnum.Topics,
  DaySecondCategoryEnum.Other_Articles,
  DaySecondCategoryEnum.Blog,
  DaySecondCategoryEnum.Project,
  DaySecondCategoryEnum.Tools,
  DaySecondCategoryEnum.Tutorials,
  DaySecondCategoryEnum.FrontTools,

  DaySecondCategoryEnum.GoodArticle,
  DaySecondCategoryEnum.Job,
  DaySecondCategoryEnum.SideJob,
  DaySecondCategoryEnum.WorkExperience,
  DaySecondCategoryEnum.ChangeJob,
  DaySecondCategoryEnum.Java,
  DaySecondCategoryEnum.Golang,
  DaySecondCategoryEnum.OtherBackendSection,

  DaySecondCategoryEnum.Web3,
  DaySecondCategoryEnum.BlockChain,
];

export const DaySecondCategoryOptions = {
  [DaySecondCategoryEnum.Top3]: 'TOP3',
  [DaySecondCategoryEnum.GoodArticle]: '好文推荐',
  [DaySecondCategoryEnum.New_Knowledge]: '新知识',
  [DaySecondCategoryEnum.Blog_English]: '英文推荐',
  [DaySecondCategoryEnum.Topics]: '专题',
  [DaySecondCategoryEnum.Other_Articles]: '其他好文',

  [DaySecondCategoryEnum.Project]: '项目',
  [DaySecondCategoryEnum.Blog]: '优秀博客推荐',
  [DaySecondCategoryEnum.Tools]: '工具',
  [DaySecondCategoryEnum.FrontTools]: '前端工具库',
  [DaySecondCategoryEnum.Tutorials]: '教程',

  [DaySecondCategoryEnum.Job]: '求职',
  [DaySecondCategoryEnum.SideJob]: '副业',
  [DaySecondCategoryEnum.WorkExperience]: '工作经验',
  [DaySecondCategoryEnum.ChangeJob]: '程序员转行',
  [DaySecondCategoryEnum.Java]: 'Java后端',
  [DaySecondCategoryEnum.Golang]: 'Golang后端',
  [DaySecondCategoryEnum.OtherBackendSection]: '其他后端相关',

  [DaySecondCategoryEnum.Web3]: 'Web3相关',
  [DaySecondCategoryEnum.BlockChain]: '区块链相关',

  [DaySecondCategoryEnum.Default]: '默认',
} as const;

export const CategoryDescOptions = {
  [DayFirstCategoryEnum.Default]: '默认',
  [DayFirstCategoryEnum.Important]: '认为是今日重要的内容-时事热点',
  [DayFirstCategoryEnum.Work]: '问题，原因，解决方式，优化，巧妙实现，新知识',
  [DayFirstCategoryEnum.MotionToday]: '所见所想，有感而发',
  [DayFirstCategoryEnum.Article_Recommend]: '有感好文，专题好文',
  [DayFirstCategoryEnum.Project_Blog]: '值得学习 作者/项目/工具等',
  [DayFirstCategoryEnum.Job_Experience_Profession]: '求职, 就业, 经验, 推荐公司, 职业规划',
  [DayFirstCategoryEnum.AI_GPT]: '就某个技术点，和 gpt 讨论，得到有用的信息；或者 AI 相关',
  [DayFirstCategoryEnum.Backend]: '后端知识-Java-Golang-数据库等后端相关的知识点',
  [DayFirstCategoryEnum.Web3AndBlockChain]: 'Web3/区块链相关的内容和知识',
  [DayFirstCategoryEnum.Argument]: '值得讨论的内容，比如技术相关/职业规划/工作方法/生活哲理',

  [DaySecondCategoryEnum.Top3]: '今天看到的最好的，收益最大的3-5篇文章',
  [DaySecondCategoryEnum.New_Knowledge]: '前后端的库更新，新特点，未知的知识点等',
  [DaySecondCategoryEnum.Blog_English]: '有意思的英文博客站点或者内容',
  [DaySecondCategoryEnum.Topics]: 'CSS, ts, 微前端，nest, next, 性能优化, leetcode, ... 2 篇同类文章起收录',
  [DaySecondCategoryEnum.Other_Articles]: '其他没有分类的文章和内容',
  [DaySecondCategoryEnum.Blog]: '优秀的博客站点/up主/博主等',
  [DaySecondCategoryEnum.Project]: '有意思有价值的开源项目，github，预览网站等',
  [DaySecondCategoryEnum.Tutorials]: '关于特定技能点或者技术栈的学习教程',
  [DaySecondCategoryEnum.Tools]: '有用的小工具，不论前后端/开发工具/效率工具/种草推荐等',
  [DaySecondCategoryEnum.FrontTools]: '有用的前端开发工具等',

  [DaySecondCategoryEnum.Job]: '求职，失业，市场行情',
  [DaySecondCategoryEnum.SideJob]: '副业，赚钱之道',
  [DaySecondCategoryEnum.WorkExperience]: '他人工作经验分享，提效技巧，管理经验等',
  [DaySecondCategoryEnum.ChangeJob]: '程序员转行',
  [DaySecondCategoryEnum.Java]: 'Java后端相关知识点',
  [DaySecondCategoryEnum.Golang]: 'Golang后端知识点',
  [DaySecondCategoryEnum.OtherBackendSection]: '其他后端相关，数据库，redis等',

  [DaySecondCategoryEnum.Web3]: 'Web3相关',
  [DaySecondCategoryEnum.BlockChain]: '区块链相关',

  [DaySecondCategoryEnum.Default]: '默认',
};

export const FirstBindSecondCategoryRelation = {
  [DayFirstCategoryEnum.Default]: [DaySecondCategoryEnum.Default],
  [DayFirstCategoryEnum.Important]: [DaySecondCategoryEnum.Default],
  [DayFirstCategoryEnum.Article_Recommend]: [
    DaySecondCategoryEnum.Top3,
    DaySecondCategoryEnum.GoodArticle,
    DaySecondCategoryEnum.New_Knowledge,
    DaySecondCategoryEnum.Blog_English,
    DaySecondCategoryEnum.Topics,
    DaySecondCategoryEnum.Other_Articles,
  ],
  [DayFirstCategoryEnum.Project_Blog]: [
    DaySecondCategoryEnum.Blog,
    DaySecondCategoryEnum.Project,
    DaySecondCategoryEnum.Tools,
    DaySecondCategoryEnum.Tutorials,
  ],
  [DayFirstCategoryEnum.Work]: [DaySecondCategoryEnum.Default],
  [DayFirstCategoryEnum.MotionToday]: [DaySecondCategoryEnum.Default],
  [DayFirstCategoryEnum.Job_Experience_Profession]: [
    DaySecondCategoryEnum.Job,
    DaySecondCategoryEnum.SideJob,
    DaySecondCategoryEnum.WorkExperience,
    DaySecondCategoryEnum.ChangeJob,
    DaySecondCategoryEnum.Default,
  ],
  [DayFirstCategoryEnum.AI_GPT]: [DaySecondCategoryEnum.Default],
  [DayFirstCategoryEnum.Backend]: [
    DaySecondCategoryEnum.Java,
    DaySecondCategoryEnum.Golang,
    DaySecondCategoryEnum.OtherBackendSection,
    DaySecondCategoryEnum.Default,
  ],
  [DayFirstCategoryEnum.Web3AndBlockChain]: [
    DaySecondCategoryEnum.Web3,
    DaySecondCategoryEnum.BlockChain,
    DaySecondCategoryEnum.Default,
  ],
  [DayFirstCategoryEnum.Argument]: [DaySecondCategoryEnum.Default],
};
