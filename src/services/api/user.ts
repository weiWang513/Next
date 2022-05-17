import http from '../http'

export const queryUserInfo = () => http.get('/users/userInfo') // 查询用户信息
export const updateUserHabit = params => http.post('/users/updateUserHabit', params) // 更新用户行为习惯
export const getUserHabit = () => http.get('/users/getUserHabit') // 获取用户行为习惯
export const getCertInfo = () => http.get('/kyc/getCertInfo') // 获取认证信息

export const check = (params) => http.post('/user/checkUser', params) // check
export const login = (params) => http.post('/user/new/login', params) // 登录
export const getVerifyCodeBeforeAuth = params => http.get('/users/getVerifyCodeBeforeAuth', { params }) // 登录之前发送验证码
export const register = (params) => http.post('/users/speed/register', params) // 快速注册
export const queryAccountEquity = params => http.get('/futureAsset/queryAccountEquity', { params }) // 查询所有账户权益
// 查询版本信息
export const queryVersion = params =>  http.get('/common/app/queryVersion', {params})
export const isValidBeforeAuth = params => http.get('/users/isValidBeforeAuth', { params }) // 验证验证码（未登录）
export const checkAccount = params => http.get('/users/checkAccount', { params }) // 注册时检查账号是否已存在
export const updateUserLanguage = params => http.get('users/updateUserLanguage', { params }) // 更新用户语言
export const queryInviteCode = params => http.get("/users/invite/queryCode", params); // 获取我的邀请码
export const changePassword = (params) => http.post('/users/changePassword', params) // 快速重置密码