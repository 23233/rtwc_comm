import { CosSdk } from '@rtwc/comm';
import { imgFileUploadItem, uploadItem } from './useImageUploads';
import { UploadFileItemParams } from 'cos-js-sdk-v5';

interface options {
  cos: CosSdk;
  file: imgFileUploadItem;
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

// 进行图片上传
const runImgUpload = async (options: options) => {
  const { cos, file } = options;

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
    SliceSize: 6 * 1024 * 1024,
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
    origin: cos.visit + originResult.options.Key,
  };

  if (file?.preview) {
    result.thumbnail = cos.visit + (<any>file.preview)._encrypt_name;
  }

  options?.onSuccess && options?.onSuccess(result);

  return result;
};

export default runImgUpload;
