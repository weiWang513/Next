export const STATUS_IDLE: STATUS = "idle";
export const STATUS_PENDING: STATUS = "pending";
export const STATUS_FULFILLED: STATUS = "succeeded";
export const STATUS_FAILED: STATUS = "failed";

export const FIAT_SYMBOL_DICT = [
  {
    id: "USD",
    name: "$"
  },
  {
    id: "EUR",
    name: "€"
  },
  {
    id: "JPY",
    name: "¥"
  },
  {
    id: "GBP",
    name: "£"
  },
  {
    id: "CNY",
    name: "¥"
  },
  {
    id: "KRW",
    name: "₩"
  },
  {
    id: "INR",
    name: "₹"
  }
];
export const DEFAULT_LANG = "English";
export const DEFAULT_LOCALE = "en_US";
export const LANG_DICT: Language[] = [
  {
    id: "English",
    value: "en_US"
  },
  {
    id: "한국어",
    value: "ko_KR"
  },
  {
    id: "繁體中文",
    value: "zh_TW"
  },
  {
    id: "简体中文",
    value: "zh_CN"
  }
];

export const CONTACT_TWITTER = "https://twitter.com/CCFOX2020";
export const CONTACT_TELEGRAM = "https://t.me/ccfox_English";

export const SIGN_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAII5QSZjanOIb/4El5+nvI1u5sCWNnEw+lgHP6Y0/v/cmJzmtVXol686zOv8eMXFkmdX14N4NvFtJmULLHg/LdHlsygkRa5BwOy/h/4+vHSQd7ks76Q/QIAw9ZubgalffUr8yavN0TsgEbQjr2PS5ah6ulDqedSpj4V0LndDdLaLAgMBAAECgYAw8UHKIr0kdNfaeXFfANS9tzukkBAgFI9SPE8wsWRRV2BIP/FRO1ye8BOKcdYWRn4StxH5iFnl/ObcPQnWm7AlVNOD+okXoVEVZwARH9jsN450sesVL8JkScFOM4yIwc4bMG0sATlwIQyaTxJU09nbdZXX4VD1fRp2moVTz7W4cQJBALlVy4eR0I2qekGlqX0ADkQlAfBkWzvrJbb6K4tQ2nRUigvKweMYcYGjWn1Zw0HhNBYdpgT/Tv4eukHihA/mRrMCQQCz4CI2BoCVrfcZr9FdPdlL0988oSmIdOBKQodzLiJNJk+wdZdw6rlmbHxt8Y9/pJUoqN/+od+lDz6IQuItNfzJAkEAs15AW5WYtPKv3cb58LtUE0mJxeEqlyPuXVdjOzLmKb4D2IPEAAiRGflBw51TJvhQ07KgEagSCEku1ELoswaXlwJBAInhONgoy8/wdgUenGHY0wQo+GnFL80FqhfCP4mux2RUBanBucA4bL1yUz8Dd3fkdOGh8XGCK6iestRIUI9PXuECQE+pa436Lk9/GDoOmJ6CN9B2nGlOgZIYXFbPWbOajccZphujuw+mdRMDUnlkpg5WfQmiSlKcLsYyGpWNSwrFUzg=
-----END PRIVATE KEY-----`;
