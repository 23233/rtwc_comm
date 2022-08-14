// 图片转webp
import { blobResize, blobToFile, getFileNameSuffix, imgFileGetBlob } from './tools';

export interface webpConvResult {
  originFile: File;
  originTarget: HTMLImageElement;
  webp: File;
  previewWebp: File;
}

export interface imageToWebpOptions {
  previewMax?: number;
  previewSuffix?: string;
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
  const [name, _] = getFileNameSuffix(file.name);
  const originName = `${name}.webp`;
  const previewName = `${name}${previewSuffix}.webp`;
  let origin = await imgFileGetBlob(file);
  if (originMaxWidth) {
    if (origin.target.width > originMaxWidth || origin.target.height > originMaxWidth) {
      const originFile = await blobResize(origin.blob!, originName, originMaxWidth);
      origin = await imgFileGetBlob(originFile);
    }
  }
  const originWebpFile = blobToFile(origin.blob!, originName, origin.mimeType);
  const thumbnail_file = await blobResize(origin.blob!, previewName, previewMax!);
  return {
    originTarget: origin.target,
    originFile: file,
    webp: originWebpFile,
    previewWebp: thumbnail_file,
  };
};
