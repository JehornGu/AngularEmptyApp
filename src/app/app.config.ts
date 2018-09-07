import {ESex, EUserType} from '../models/user-info.model';

/**
 * 全局属性
 */
export const CONF = {
  // 接口参数
  ApiData: {
    ServiceHost: '',
    ClientType: 1,
    ContentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    Token: '',
    DiffTime: 0
  },
  // 网站静态信息
  SiteData: {},
  // 用户信息
  UserData: {
    NickName: '',
    Sign: '',
    UserType: EUserType.Visitor,
    Phone: '',
    Email: '',
    Level: 0,
    Address: '',
    Sex: ESex.UnKnow,
    AuthEmail: false,
    IsLogin: false
  }
};
