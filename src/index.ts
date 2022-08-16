// 视频预览图相关
export { useGetVideoFirstFrameImg } from './upload/video';
export { getVideoFirstFrame, videoFileGetPreviewFile, videoFileParse } from './fileConv/video';
export type { videoFileGetPreviewResp, videoFileParseResp } from './fileConv/video';

// 图片公共方法
export { getFileNameSuffix, fileSizeParse } from './fileConv/tools';

// 图片在转换成webp相关
export { imageToWebp } from './fileConv/webp';
export type { webpConvResult } from './fileConv/webp';
export { useImageToWebp } from './fileConv/useImageToWebp';

// 图片压缩转换相关
export {
  fastImageGenThumbnail,
  fastFileGetSrc,
  fastDataUrlToFile,
  fastFileGetTargetBuffer,
  fastImageFileCompression,
  DefaultImgFileConvOptions,
  fastLoadImageBuffer,
} from './fileConv/compression';
export type {
  imgFileConvOptions,
  imgFileConvResult,
  compressionOptions,
  ImageGetTargetBuffer,
} from './fileConv/compression';

export { useImageFileThumbnailGenerate } from './fileConv/useImageThumbnail';
export type { ImageFileThumbnailGenerateReturn } from './fileConv/useImageThumbnail';

// 距离相关
export { getDistanceOfMetre, getDistance, parseToKm } from './utils/distance';

export { default as restApiGen, RestApiGen, genGeoGetParams, RestParams } from './req/restApiGen';
export type { Resp, RestParamsOptions, WebResp, WeAppResp, RecordJson } from './req/restApiGen';

export { CosSdk } from './upload/cos_sdk';

export { useFileUploads } from './upload/useFileUploads';
export type { uploadItem, fileUploadItem, uploadResult } from './upload/useFileUploads';

export { runCosUpload } from './upload/promiseUpload';
export type { runCosUploadOptions } from './upload/promiseUpload';

export { useClipboard, sendClipboard } from './clipboard/useClipboard';
export type { useClipParams, ClipboardResult } from './clipboard/useClipboard';

export { useMaskNotMove } from './dom/modal/useMaskNotMove';
export type { maskNoMoveResult } from './dom/modal/useMaskNotMove';

export { TimeCalc } from './utils/funcTime';
