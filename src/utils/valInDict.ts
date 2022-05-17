/**
 * 查询字典
 */
interface ValInDictProps {
  key: string | number;
  dict: Array<any>;
  keyName?: string;
  valueName?: string;
  defaultValue?: any;
}

export default function valInDict({
  key = "",
  dict = [],
  keyName = "id",
  valueName = "name",
  defaultValue = "--"
}: ValInDictProps) {
  if (key === "" || dict?.length === 0) {
    return defaultValue;
  }
  for (let item of dict) {
    if (item[keyName] === key) {
      return item[valueName];
    }
  }
  return defaultValue;
}
