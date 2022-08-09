import { CosSdk } from '@rtwc/comm';
import { imgFileUploadItem, uploadItem } from './useFileUploads';
import { UploadFileItemParams } from 'cos-js-sdk-v5';

export interface runCosUploadOptions {
  cos: CosSdk;
  file: imgFileUploadItem;
  // 超过此大小则分片上传 默认 3 * 1024 * 1024 即1mb 单位为byte
  sliceSize?: number;
  // 上传成功的回调
  onSuccess?: (up: uploadItem) => void;
  // 上传失败的回调
  onFail?: (err: Error) => void;
  // 上传进度变更
  onProcess?: (p: number) => void;
  // 开始上传时
  onUploadStart?: () => void;
  // 上传结束
  onUploadEnd?: () => void;
  // 甭管上传成功与失败都回调
  onCompile?: () => void;
}

// 进行上传
const runCosUpload = async (options: runCosUploadOptions) => {
  const { cos, file, sliceSize } = options;
  const SliceSize = sliceSize || 3 * 1024 * 1024;

  const genUploadParams = (file: File) => {
    const encryptName = options.cos.generateFileName(file);
    (<any>file)._encrypt_name = encryptName;
    return {
      Body: file,
      Bucket: options.cos.bucket,
      Region: options.cos.region,
      Key: encryptName,
    } as UploadFileItemParams;
  };

  const files = [] as Array<UploadFileItemParams>;

  files.push(genUploadParams(file.origin));
  if (file?.preview) {
    files.push(genUploadParams(file.preview));
  }

  options?.onUploadStart && options?.onUploadStart();
  const r = await options.cos.uploadFiles({
    files: files,
    SliceSize: SliceSize,
    onProgress: async (progressData: any) => {
      options?.onProcess && options?.onProcess(progressData.percent * 100);
    },
    onFileFinish: () => {
      options?.onCompile && options?.onCompile();
    },
  });
  options?.onUploadEnd && options?.onUploadEnd();

  const originResult = r.files.find((d) => d.options.Key === (<any>file.origin)._encrypt_name);
  if (!originResult || originResult?.error) {
    options?.onFail && options?.onFail(originResult?.error || new Error('uploads errors'));
    return;
  }
  const result: uploadItem = {
    origin: cos.visitHost + originResult.options.Key,
  };

  if (file?.preview) {
    result.thumbnail = cos.visitHost + (<any>file.preview)._encrypt_name;
  }

  options?.onSuccess && options?.onSuccess(result);

  return result;
};

export default runCosUpload;
