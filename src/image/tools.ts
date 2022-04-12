// File image对象转换为htmlTarget
export const imageFileToTarget = async (src: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let rawImage = new Image();
    rawImage.src = readBlobUrl(src);
    rawImage.addEventListener('load', function () {
      resolve(rawImage);
    });
    rawImage.onerror = reject;
  });
};
// 获取blob url
export const readBlobUrl = (file: File): string => {
  let url = '';
  if (window?.URL) {
    url = window.URL.createObjectURL(file);
  } else if (window?.webkitURL) {
    url = window.webkitURL.createObjectURL(file);
  } else {
    console.error('上传获取blob出错');
  }
  return url;
};

// html target转换为webp的blob 直接 readBlobUrl(blob)获取访问的地址
export const imgTargetToBlob = async (
  target: HTMLImageElement,
  quality = 0.9,
): Promise<Blob | null> => {
  return new Promise(function (resolve, reject) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = target.width;
    canvas.height = target.height;
    ctx?.drawImage(target, 0, 0);
    canvas.toBlob(
      function (blob) {
        resolve(blob);
      },
      'image/webp',
      quality,
    );
    canvas.remove();
  });
};

// 获取文件和后缀名
export const getFileNameSuffix = (filename: string) => {
  const raw = filename.split('/');
  const f = raw[raw.length - 1];

  const l = f.split('.');

  const name = l[0];
  const suffix = l[l.length - 1];

  return [name.trim(), suffix.trim()];
};

export const blobToFile = (theBlob: Blob, fileName: string): File => {
  const [_, suffix] = getFileNameSuffix(fileName);

  return new File([theBlob], fileName, {
    lastModified: new Date().getTime(),
    type: 'image/' + suffix,
  });
};

// 文件大小转换
export const fileSizeParse = (originByte: number | undefined) => {
  if (!originByte) {
    return '0KB';
  }
  const kb = originByte / 1024;
  if (kb < 1024) {
    return Math.round(kb).toString() + 'KB';
  }
  return Math.round(kb / 1024).toString() + 'MB';
};


