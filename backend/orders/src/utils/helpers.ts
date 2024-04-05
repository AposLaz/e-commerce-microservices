export const getDistinctObjectsByProperty = <T>(
  data: T[],
  property: keyof T
): T[] => {
  const helperObj: { [key: string]: T } = {};
  const distinctArr: T[] = [];

  data.forEach((obj) => {
    const key = String(obj[property]);
    if (!helperObj[key]) {
      helperObj[key] = obj;
      distinctArr.push(obj);
    }
  });

  return distinctArr;
};
