export { default as useImageToWebp } from './image/useImageToWebp';
export { default as useVideoParse } from './upload/video';

export { imageToWebp } from './image/conv';
export type { webpConvResult } from './image/conv';
export * as imageTools from './image/tools';

// 图片压缩转换相关
export {
  fastImageGenThumbnail,
  fastFileGetSrc,
  fastDataUrlToFile,
  fastFileGetTargetBuffer,
  fastImageFileCompression,
  DefaultImgFileConvOptions,
  fastLoadImageBuffer,
} from './image/compression';
export type {
  imgFileConvOptions,
  imgFileConvResult,
  compressionOptions,
  ImageGetTargetBuffer,
} from './image/compression';

export { default as useImageFileThumbnailGenerate } from './image/useImageThumbnail';
export type { ImageFileThumbnailGenerateReturn } from './image/useImageThumbnail';

// 距离相关
export { getDistanceOfMetre, getDistance, parseToKm } from './utils/distance';

export { default as restApiGen, genGeoGetParams, RestParams } from './req/restApiGen';
export type { Resp, RestParamsOptions, WebResp, WeAppResp, RecordJson } from './req/restApiGen';

export { default as CosSdk } from './upload/cos_sdk';

export { default as useFileUploads } from './upload/useFileUploads';
export type { uploadItem, imgFileUploadItem, uploadResult } from './upload/useFileUploads';

export { default as runCosUpload } from './upload/promiseUpload';
export type { runCosUploadOptions } from './upload/promiseUpload';

export { default as useClipboard, sendClipboard } from './clipboard/useClipboard';
export type { useClipParams, ClipboardResult } from './clipboard/useClipboard';

export { default as useMaskNotMove } from './dom/modal/useMaskNotMove';
export type { maskNoMoveResult } from './dom/modal/useMaskNotMove';

export { TimeCalc } from './utils/funcTime';
