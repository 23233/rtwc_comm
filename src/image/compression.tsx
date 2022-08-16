import imageCompression from 'browser-image-compression';
import { getFileNameSuffix } from './tools';
import { TimeCalc } from '../utils/funcTime';

/* 在支持bitmap的情况下 优先使用bitmap 核心是获取width 和 height */
export type ImageGetTargetBuffer = HTMLImageElement | ImageBitmap;

export function fastLoadImageBuffer(
  imageBuffer: ArrayBuffer,
  type: string,
): Promise<ImageGetTargetBuffer> {
  return new Promise((resolve, reject) => {
    const blob = new window.Blob([imageBuffer], { type });
    if (createImageBitmap) {
      resolve(createImageBitmap(blob));
      return;
    } else {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.crossOrigin = 'anonymous';
      img.onerror = function () {
        reject(new Error('加载图片buffer失败'));
      };
      img.onload = function () {
        // Call requestAnimationFrame to avoid iOS's bug.
        requestAnimationFrame(() => {
          resolve(img);
        });
      };
    }
  });
}

export interface compressionOptions {
  maxSizeMb?: number;
  maxWidthOrHeight?: number;
  onProgress?: (progress: number) => void;
  /* 注意webp在ios上目前全线不支持 尽量使用jpg或png */
  fileType?: 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/webp' | string; // 不传默认读file.type
  /* 压缩质量 0-1之间 默认0.85 */
  initialQuality?: number;
}

const defaultOp = {
  maxSizeMb: Number.POSITIVE_INFINITY,
  maxWidthOrHeight: undefined,
  useWebWorker: true,
  initialQuality: 0.85,
};
export const fastImageFileCompression = async (
  file: File,
  options?: compressionOptions,
): Promise<File> => {
  return await imageCompression(file, { ...defaultOp, ...options });
};

// https://caniuse.com/mdn-api_htmlcanvaselement_toblob_type_parameter_webp
// 因为safari全系不支持image/webp的转换 所以如果是safari就为png
const uaIsSafari = () => {
  const uaMatch = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  if (uaMatch) {
    const maxOs = /Mac OS/.test(navigator.userAgent) || /iPhone OS/.test(navigator.userAgent);
  }
  return uaMatch;
};

export interface imgFileConvResult {
  originFile: File;
  originChange: boolean;
  thumbnailFile: File;
  /* 在DEBUG模式下返回 执行花费总ms */
  progressMs?: number;
}

export interface imgFileConvOptions {
  /* 预览图最大限制宽高 默认375 */
  previewMax?: number;
  /* 预览图文件附加后缀 默认 _tm_ */
  previewSuffix?: string;
  /* 默认为0 即不压缩 存在 则会压缩原图宽高为设置值 取宽或高最大值 */
  originMaxWh?: number;
  onProgress?: (progress: number) => void;
  /* 调试模式 默认为false */
  debug?: boolean;
}

export const DefaultImgFileConvOptions: imgFileConvOptions = {
  previewMax: 375,
  previewSuffix: '_tm_',
  originMaxWh: 0,
  debug: false,
};

// 快速图片预览图生成 大约比未使用web work速度快20% 但是体验好50%+
export const fastImageGenThumbnail = async (
  file: File,
  options?: imgFileConvOptions,
): Promise<imgFileConvResult> => {
  const calc = new TimeCalc('图片生成 ' + file.name);
  let op = { ...DefaultImgFileConvOptions };
  if (!!options) {
    op = { ...op, ...options };
  }
  // safari不支持webp 所以判断一下Safari
  const inSafari = uaIsSafari();
  const [name, suffix] = getFileNameSuffix(file.name);
  let autoSuffix = suffix;
  if (inSafari) {
    if (suffix === 'webp') {
      autoSuffix = 'png';
    }
  } else {
    autoSuffix = 'webp';
  }
  const originName = `${name}.${autoSuffix}`;
  const previewName = `${name}_tm.${autoSuffix}`;

  calc.addStep('前置判断结束');
  let tr: File | undefined;
  // 如果后缀名不一致 那么原图也要改为这个后缀名
  if (autoSuffix !== suffix) {
    const of = await fastImageFileCompression(file, {
      maxWidthOrHeight: op.originMaxWh ? op.originMaxWh : undefined,
      fileType: 'image/' + autoSuffix,
    });
    calc.addStep('原图转换结束');

    tr = new File([of], originName);
    calc.addStep('原图新文件名转换结束');
  }

  // 生成缩略图
  const tFile = await fastImageFileCompression(file, {
    maxWidthOrHeight: op?.previewMax,
    fileType: 'image/' + autoSuffix,
    onProgress: op?.onProgress,
  });
  calc.addStep('预览图生成结束');

  const nf = new File([tFile], previewName);
  calc.addStep('预览图新文件名生成结束');
  const result: imgFileConvResult = {
    originFile: tr || file,
    originChange: !!tr,
    thumbnailFile: nf,
  };
  if (op?.debug) {
    calc.log();
    result.progressMs = calc.allRuntime;
  }
  return result;
};

// 图片文件快速生成BLOB进行预览
export const fastFileGetSrc = (file: File) => {
  const urlInstance = window?.URL || window?.webkitURL;
  return urlInstance.createObjectURL(file);
};

// 快速获取图片target 可以获取文件得 width 和height
export const fastFileGetTargetBuffer = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const imageBuffer = await fastLoadImageBuffer(arrayBuffer, file.type);
  return imageBuffer;
};
