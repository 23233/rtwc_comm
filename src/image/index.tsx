import { useEffect, useMemo, useState } from 'react';
import { imageToWebp, webpConvResult } from './conv';

interface resp {
  setFile: (f: File) => void;
  result?: webpConvResult;
}

interface options {
  max?: number; // 允许的预览图最大宽或者高
  previewSuffix?: string; // 预览图文件名额外后缀
  originMaxWidth?: number; // 原图最大宽度
  onSuccess?: (result: webpConvResult) => void;
}

// 把上传的图片File转换为webp并且生成缩略图
const useImageToWebp = (f?: File, params?: options): resp => {
  const defaultOp = {
    max: 375,
    previewSuffix: '_tm_',
    originMaxWidth: 0,
  } as options;
  const p = { ...defaultOp, ...params };
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<webpConvResult>();

  useEffect(() => {
    setFile(f);
  }, [f]);

  useEffect(() => {
    if (file) {
      imageToWebp(file, p.max, p.previewSuffix, p.originMaxWidth).then((r) => {
        setResult(r);
      });
    }
  }, [file]);

  useEffect(() => {
    if (result) {
      p?.onSuccess && p.onSuccess(result);
    }
  }, [result]);

  return {
    setFile: setFile,
    result,
  };
};

export default useImageToWebp;
