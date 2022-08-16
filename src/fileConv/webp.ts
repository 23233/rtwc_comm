// @ts-ignore
import Reduce from 'image-blob-reduce';

import { getFileNameSuffix } from '@rtwc/comm';
import { TimeCalc } from '@rtwc/comm';

// 图片转webp

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

export const blobResize = async (b: Blob, name: string, max: number) => {
  const reduce = Reduce();
  const blob = await reduce.toBlob(b, { max: max });
  return blobToFile(blob, name);
};

export interface webpConvResult {
  /* 原始上传的文件 */
  originFile: File;
  /* 原始文件target 可以获取原始文件宽高*/
  originTarget: HTMLImageElement;
  /* 压缩原始文件后的target 可以获取压缩后宽高*/
  compressTarget?: HTMLImageElement;
  /* 原始文件转换为webp后的文件 可能被压缩 看传入的参数  */
  webp: File;
  /* 原始文件生成的预览图webp文件  */
  previewWebp: File;
}

export interface imageToWebpOptions {
  /* 预览图最大限制宽高 默认375 */
  previewMax?: number;
  /* 预览图文件附加后缀 默认 _tm_ */
  previewSuffix?: string;
  /* 默认为0 即不压缩 存在 则会压缩原图宽高为设置值 取宽或高最大值 */
  originMaxWidth?: number;
}

export const defaultImageToWebpOptions: imageToWebpOptions = {
  previewMax: 375,
  previewSuffix: '_tm_',
  originMaxWidth: 0,
};

export const imageToWebpOp = async (
  file: File,
  options?: imageToWebpOptions,
): Promise<webpConvResult> => {
  let op = { ...defaultImageToWebpOptions };
  if (!!options) {
    op = { ...op, ...options };
  }
  return imageToWebp(file, op.previewMax, op.previewSuffix, op.originMaxWidth);
};

export const imageToWebp = async (
  file: File,
  previewMax = defaultImageToWebpOptions.previewMax,
  previewSuffix = defaultImageToWebpOptions.previewSuffix,
  originMaxWidth = defaultImageToWebpOptions.originMaxWidth,
): Promise<webpConvResult> => {
  const calc = new TimeCalc('图片生成计时');
  const [name, _] = getFileNameSuffix(file.name);
  const originName = `${name}.webp`;
  const previewName = `${name}${previewSuffix}.webp`;
  calc.addStep('前置处理结束');
  let origin = await imgFileGetBlob(file);
  calc.addStep('原图处理结束');
  const ot = { ...origin };
  let runCompress = false;
  if (originMaxWidth) {
    if (origin.target.width > originMaxWidth || origin.target.height > originMaxWidth) {
      calc.addStep('原图压缩开始');
      const originFile = await blobResize(origin.blob!, originName, originMaxWidth);
      calc.addStep('原图压缩结束');
      origin = await imgFileGetBlob(originFile);
      calc.addStep('原图压缩后成File结束');
      runCompress = true;
    }
  }

  const originWebpFile = blobToFile(origin.blob!, originName, origin.mimeType);
  calc.addStep('原始生成Blob结束');
  const thumbnail_file = await blobResize(origin.blob!, previewName, previewMax!);
  calc.addStep('预览图生成Blob结束');
  // calc.log()
  return {
    originTarget: ot.target,
    compressTarget: runCompress ? origin.target : undefined,
    originFile: file,
    webp: originWebpFile,
    previewWebp: thumbnail_file,
  };
};
