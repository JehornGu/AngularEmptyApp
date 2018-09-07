/**
 * 性别
 * UnKnow 未知
 * Male 男
 * FeMale 女
 * Between 其他
 */
export enum ESex {
  UnKnow = 0,
  Male = 1,
  FeMale = 2,
  Between = 3
}

/**
 * 用户类型
 * Visitor 访客
 * Normal 注册用户
 * Manager 管理员
 * Admin 站长
 * Other 其他
 */
export enum EUserType {
  Visitor = 0,
  Normal = 1,
  Manager = 2,
  Admin = 3,
  Other = 4
}

/**
 * 用户信息
 * @param NickName 昵称
 * @param Sign 签名
 * @param UserType 用户类型
 * @param Phone 手机号码
 * @param Email 邮箱
 * @param Level 等级
 * @param Address 联系地址
 * @param Male 性别
 * @param AuthEmail 邮箱验证
 * @param IsLogin 是否登录
 */
export class UserInfoModel {
  constructor(
    public NickName?: string,
    public Sign?: string,
    public UserType?: EUserType,
    public Phone?: string,
    public Email?: string,
    public Level?: number,
    public Address?: string,
    public Sex?: ESex,
    public AuthEmail?: boolean,
    public IsLogin?: boolean
  ) { }
}
