export enum DayFirstCategoryEnum {
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
  Argument_Gpt_AI = 'Argument_Gpt_AI',
}

export const DayFirstCategoryOrder = [
  DayFirstCategoryEnum.Work,
  DayFirstCategoryEnum.MotionToday,
  DayFirstCategoryEnum.Article_Recommend,
  DayFirstCategoryEnum.Project_Blog,
  DayFirstCategoryEnum.Job_Experience_Profession,
  DayFirstCategoryEnum.Argument_Gpt_AI,
];

export const DayFirstCategoryOptions = {
  [DayFirstCategoryEnum.Work]: '今日工作',
  [DayFirstCategoryEnum.MotionToday]: '今日心情',
  [DayFirstCategoryEnum.Article_Recommend]: '好文推荐',
  [DayFirstCategoryEnum.Project_Blog]: '项目/博客推荐',
  [DayFirstCategoryEnum.Job_Experience_Profession]: '求职/就业/经验/职业规划',
  [DayFirstCategoryEnum.Argument_Gpt_AI]: '讨论 & GPT & AI',
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
  /** default */
  Default = 'DayDefault',
}

export const DaySecondCategoryOrder = [
  DaySecondCategoryEnum.Top3,
  DaySecondCategoryEnum.New_Knowledge,
  DaySecondCategoryEnum.Blog_English,
  DaySecondCategoryEnum.Topics,
  DaySecondCategoryEnum.Other_Articles,
  DaySecondCategoryEnum.Blog,
  DaySecondCategoryEnum.Project,
  DaySecondCategoryEnum.Tools,
  DaySecondCategoryEnum.Tutorials,
  DaySecondCategoryEnum.Default,
];

export const DaySecondCategoryOptions = {
  [DaySecondCategoryEnum.Top3]: 'TOP3',
  [DaySecondCategoryEnum.New_Knowledge]: '新知识',
  [DaySecondCategoryEnum.Blog_English]: '英文推荐',
  [DaySecondCategoryEnum.Topics]: '专题',
  [DaySecondCategoryEnum.Other_Articles]: '其他好文',
  [DaySecondCategoryEnum.Blog]: '博客',
  [DaySecondCategoryEnum.Project]: '项目',
  [DaySecondCategoryEnum.Tools]: '工具',
  [DaySecondCategoryEnum.Tutorials]: '教程',
  [DaySecondCategoryEnum.Default]: '默认',
} as const;

export const CategoryDescOptions = {
  [DayFirstCategoryEnum.Work]: '问题，原因，解决方式，优化，巧妙实现，新知识',
  [DayFirstCategoryEnum.MotionToday]: '所见所想，有感而发',
  [DayFirstCategoryEnum.Article_Recommend]: '有感好文，专题好文',
  [DayFirstCategoryEnum.Project_Blog]: '值得学习 作者/项目/工具等',
  [DayFirstCategoryEnum.Job_Experience_Profession]: '求职, 就业, 经验, 推荐公司, 职业规划',
  [DayFirstCategoryEnum.Argument_Gpt_AI]: '就某个技术点，和 gpt 讨论，得到有用的信息；或者 AI 相关',

  [DaySecondCategoryEnum.New_Knowledge]: '库更新，未知的知识点等',
  [DaySecondCategoryEnum.Topics]: 'CSS, ts, 微前端，nest, next, 性能优化, leetcode, ... 2 篇同类文章起收录',
  [DaySecondCategoryEnum.Tools]: '有用的小工具',
  [DaySecondCategoryEnum.Project]: '用于学习参考的开源项目，github，预览网站等',
  [DaySecondCategoryEnum.Tutorials]: '关于特定技能点或者技术栈的学习教程',
};

export const FirstBindSecondCategoryRelation = {
  [DayFirstCategoryEnum.Article_Recommend]: [
    DaySecondCategoryEnum.Top3,
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
  [DayFirstCategoryEnum.Job_Experience_Profession]: [DaySecondCategoryEnum.Default],
  [DayFirstCategoryEnum.Argument_Gpt_AI]: [DaySecondCategoryEnum.Default],
};
