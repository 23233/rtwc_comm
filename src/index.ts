export { default as useImageToWebp } from './image/index';

export { imageToWebp } from './image/conv';
export type { webpConvResult } from './image/conv';
export * as imageTools from './image/tools';
export * as DistanceCalc from './utils/distance';

export {
  default as restApiGen,
  genGeoGetParams,
  RestParamsOptions,
  RestParams,
} from './req/restApiGen';
export type { Resp } from './req/restApiGen';

export { default as CosSdk } from './upload/cos_sdk';

export { default as useImageUploads } from './upload/useImageUploads';
export type { uploadItem, imgFileUploadItem, uploadResult } from './upload/useImageUploads';

export { default as runImgUpload } from './upload/promiseUpload';
export type { runImgOptions } from './upload/promiseUpload';

export { default as useRipple } from './click/useRipple';
export type { RippleOptions } from './click/useRipple';

export { default as RippleView } from './click/rippleView';

export { default as useClipboard } from './clipboard/useClipboard';
export type { useClipParams, ClipboardResult } from './clipboard/useClipboard';

export { default as useMaskNotMove } from './dom/modal/useMaskNotMove';
export type { maskNoMoveResult } from './dom/modal/useMaskNotMove';
