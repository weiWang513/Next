/**
 * 生成OSS图标路径
 */
export function ossCoin(coin: string) {
  return `${process.env.NEXT_PUBLIC_OSS}/currency/${coin}@3x.png`;
}

/**
 * 生成OSS图标路径 serviceProviderTag
 */
export function ossFiatCoin(serviceProviderTag: string) {
  return `${process.env.NEXT_PUBLIC_OSS}/fiatCurrency/${serviceProviderTag}.png`;
}
