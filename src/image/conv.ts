// @ts-ignore
import Reduce from 'image-blob-reduce';

// 图片转webp
import {blobToFile, getFileNameSuffix, imageFileToTarget, imgTargetToBlob} from "./tools";


export interface webpConvResult {
  originFile: File,
  originTarget: HTMLImageElement;
  webp: File;
  previewWebp: File;
}


export const imageToWebp = async (
  file: File,
  previewMax = 375,
  previewSuffix = "_tm_"
): Promise<webpConvResult> => {
  const target = await imageFileToTarget(file);
  const webpBlob = await imgTargetToBlob(target);
  const [name, suffix] = getFileNameSuffix(file.name);
  const originName = `${name}.webp`;
  const originWebpFile = blobToFile(webpBlob!, originName);

  return new Promise((resolve, reject) => {
    const reduce = Reduce();
    reduce.toBlob(webpBlob, {max: previewMax}).then((blob: Blob) => {
      const newFileName = `${name}${previewSuffix}.webp`;
      const thumbnail_file = blobToFile(blob, newFileName);
      resolve({
        originTarget: target,
        originFile: file,
        webp: originWebpFile,
        previewWebp: thumbnail_file,
      });
    });
  });
};
