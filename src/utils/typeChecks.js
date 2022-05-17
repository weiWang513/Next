/**
 * 是否是数组
 * @param value
 * @return {boolean}
 */
export function isArray(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
}

/**
 * 是否是方法
 * @param {*} value
 * @return {boolean}
 */
export function isFunction(value) {
  return value && typeof value === "function";
}

/**
 * 是否是对象
 * @param {*} value
 * @return {boolean}
 */
export function isObject(value) {
  return !!value && typeof value === "object";
}

/**
 * 判断是否是数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

/**
 * 判断是否有效
 * @param value
 * @returns {boolean}
 */
export function isValid(value) {
  return value !== null && value !== undefined;
}

/**
 * 判断是否是boolean
 * @param value
 * @returns {boolean}
 */
export function isBoolean(value) {
  return typeof value === "boolean";
}

/**
 * 是否是字符串
 * @param value
 * @return {boolean}
 */
export function isString(value) {
  return typeof value === "string";
}
