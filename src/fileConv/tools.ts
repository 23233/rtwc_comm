// 获取文件和后缀名
export const getFileNameSuffix = (filename: string) => {
  const raw = filename.split('/');
  const f = raw[raw.length - 1];

  const l = f.split('.');

  const name = l[0];
  const suffix = l[l.length - 1];

  return [name.trim(), suffix.trim()];
};

// 文件大小转换
export const fileSizeParse = (originByte: number | undefined, empty = '0KB') => {
  if (!originByte) {
    return empty;
  }
  const kb = originByte / 1024;
  if (kb < 1024) {
    return Math.round(kb).toString() + 'KB';
  }
  const mb = kb / 1024;
  return Math.round(mb).toString() + 'MB';
};
