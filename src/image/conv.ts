// 图片转webp
import { blobResize, blobToFile, getFileNameSuffix, imgFileGetBlob } from './tools';

export interface webpConvResult {
  originFile: File;
  originTarget: HTMLImageElement;
  webp: File;
  previewWebp: File;
}

export const imageToWebp = async (
  file: File,
  previewMax = 375,
  previewSuffix = '_tm_',
  originMaxWidth = 0,
): Promise<webpConvResult> => {
  const [name, _] = getFileNameSuffix(file.name);
  const originName = `${name}.webp`;
  const previewName = `${name}${previewSuffix}.webp`;
  let origin = await imgFileGetBlob(file);
  if (originMaxWidth) {
    const originFile = await blobResize(origin.blob!, originName, originMaxWidth);
    origin = await imgFileGetBlob(originFile);
  }
  const originWebpFile = blobToFile(origin.blob!, originName, origin.mimeType);
  const thumbnail_file = await blobResize(origin.blob!, previewName, previewMax);
  return {
    originTarget: origin.target,
    originFile: file,
    webp: originWebpFile,
    previewWebp: thumbnail_file,
  };
};
