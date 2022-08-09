// @ts-ignore
import Reduce from 'image-blob-reduce';

// File image对象转换为htmlTarget
export const imageFileToTarget = async (src: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let rawImage = new Image();
    rawImage.src = fileToBlobUrl(src);
    rawImage.addEventListener('load', function () {
      resolve(rawImage);
    });
    rawImage.onerror = reject;
  });
};
// 获取blob url
export const fileToBlobUrl = (file: File): string => {
  let url = '';
  if (window?.URL) {
    url = window.URL.createObjectURL(file);
  } else if (window?.webkitURL) {
    url = window.webkitURL.createObjectURL(file);
  } else {
    console.error('上传获取blob出错');
    return '';
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

export const blobToFile = (theBlob: Blob, fileName: string, mimeType?: string): File => {
  let mt;
  if (!mimeType) {
    const [_, suffix] = getFileNameSuffix(fileName);
    mt = 'image/' + suffix;
  } else {
    mt = mimeType;
  }

  return new File([theBlob], fileName, {
    lastModified: new Date().getTime(),
    type: mt,
  });
};

export interface imgFileGetBlobResp {
  target: HTMLImageElement;
  blob: Blob | null;
  mimeType: string;
}

export const imgFileGetBlob = async (f: File): Promise<imgFileGetBlobResp> => {
  const target = await imageFileToTarget(f);
  const blob = await imgTargetToBlob(target);
  return {
    target,
    blob,
    mimeType: 'image/webp',
  };
};

export const imageResize = async (f: File, nameSuffix: '', max: number) => {
  const m = await imgFileGetBlob(f);
  if (!m.blob) {
    return;
  }

  const [name, suffix] = getFileNameSuffix(f.name);
  const newFileName = `${name}${nameSuffix}.${suffix}`;
  return blobResize(m.blob, newFileName, max);
};

export const blobResize = async (b: Blob, name: string, max: number) => {
  const reduce = Reduce();
  const blob = await reduce.toBlob(b, { max: max });
  return blobToFile(blob, name);
};

// 获取视频第一帧图片的base64
export const getVideoFirstFrame = (url: string): Promise<HTMLCanvasElement> => {
  return new Promise(function (resolve, reject) {
    let video = document.createElement('video');
    let canvas = document.createElement('canvas');

    video.setAttribute('crossOrigin', 'anonymous'); //处理跨域
    video.setAttribute('src', url);
    video.currentTime = 1;
    video.load();
    video.addEventListener('loadedmetadata', function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
    video.addEventListener('loadeddata', function () {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); //绘制canvas
        resolve(canvas);
      }
    });
    video.addEventListener('error', function () {
      reject('load video fail');
    });
  });
};

export interface videoFileGetPreviewResp {
  imgFile: File;
  imgBlob: Blob; // 预览图片的blob
  video: File;
}

// 视频file获取第一帧
export const videoFileGetPreviewImg = (f: File): Promise<videoFileGetPreviewResp | undefined> => {
  return new Promise(async (resolve, reject) => {
    const r = fileToBlobUrl(f);
    if (r) {
      const [name, suffix] = getFileNameSuffix(f.name);
      const imgName = `${name}.webp`;

      const canvas = await getVideoFirstFrame(r);
      const quality = 0.8;
      // const b64 = canvas.toDataURL('image/webp', quality)
      const webpMime = 'image/webp';
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const file = await blobToFile(blob, imgName, webpMime);
            resolve({
              imgFile: file,
              video: f,
              imgBlob: blob,
            });
          }
        },
        webpMime,
        quality,
      );
    }
  });
};

export interface videoFileParseResp extends videoFileGetPreviewResp {
  imgTarget: HTMLImageElement;
  playSrc: string;
}

export const videoFileParse = async (v: File): Promise<videoFileParseResp | undefined> => {
  const m = await videoFileGetPreviewImg(v);
  if (m) {
    const pm = await imgFileGetBlob(m?.imgFile);
    return {
      ...m,
      imgTarget: pm.target,
      playSrc: fileToBlobUrl(m.video),
    };
  }
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
