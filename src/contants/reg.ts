// 正则 账号 手机或邮箱
export const usernameReg = /(^\d{6,11}$)|(^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$)/

// 正则 手机号
export const phoneReg = /^\d{6,11}$/

// 正则 邮箱
export const emailReg = /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/

// 正则 密码规则-不允许汉字空格
export const pwdRuleReg = /[\s\u4e00-\u9fa5]/g

// 正则 登录密码
export const pwdReg = /^[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、|\w]{8,24}$/

// 正则 验证码
export const codeReg = /^\d{6}$/

// 正则 钓鱼码
export const fishCodeReg = /^[0-9a-zA-Z]{6,32}$/

// 正则 谷歌码
export const googleCodeReg = /^\d{6}$/

// 正则 资金密码
export const tradePwdReg = /^[\d_a-zA-Z]{6,12}$/

// 正则 中文姓名
export const cnNameReg = /^[\u4e00-\u9fa5]{2,12}$/

// 正则 身份证号
export const idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

// 正则 银行卡号
export const bankCardReg = /^\d{16,19}$/

// 正则 护照
export const passportReg = /^([a-zA-z]|[0-9]){9,17}$/

// 小写
export const lowerCaseReg = /^.*[a-z]+.*$/

// 大写
export const upperCaseReg = /^.*[A-Z]+.*$/

// 字母
export const letterReg = /^.*[a-zA-Z]+.*$/

// 数字
export const numberReg = /^.*[0-9]+.*$/
