export interface Gallery {
  /**
   * 作品ID
   */
  id: string;

  /**
   * 标题
   */
  title: Title;

  /**
   * 标签
   */
  tags: Tag[];

  /**
   * 页数
   */
  num_pages: number;

  /**
   * 上传时间
   */
  upload_date: number;

  /**
   * 图片信息
   */
  images: Images;

  /**
   * 用于生成图片链接
   */
  media_id: string;
}

interface Images {
  /**
   * 封面
   */
  cover: Image;

  /**
   * 每页信息
   */
  pages: Image[];

  /**
   * 缩略图
   */
  thumbnail: Image;
}

interface Image {
  /**
   * formaT 格式
   */
  t: string;

  /**
   * Width 宽度
   */
  w: number;

  /**
   * Height 高度
   */
  h: number;
}

interface Tag {
  /**
   * 标签ID
   */
  id: number;

  /**
   * 标签类型
   *
   * tag, artist, language, category
   */
  type: string;

  /**
   * 名称
   */
  name: string;

  /**
   * URL
   */
  url: string;

  /**
   * 数量
   */
  count: number;
}

interface Title {
  /**
   * 日语标题，如果本来就不是日语本子，可能这个字段就为空
   */
  japanese: string;

  /**
   * 也可能是其他语言的标题，不一定是英语的标题
   */
  english: string;

  /**
   * 没什么用
   */
  pretty: string;
}
