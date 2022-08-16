import { useEffect, useMemo, useState } from 'react';
import {
  defaultImageToWebpOptions,
  imageToWebpOp,
  imageToWebpOptions,
  webpConvResult,
} from './webp';

interface resp {
  setFile: (f: File) => void;
  result?: webpConvResult;
}

interface options extends imageToWebpOptions {
  onSuccess?: (result: webpConvResult) => void;
}

// 把上传的图片File转换为webp并且生成缩略图
// Deprecated 下个版本将删除 请勿继续使用
export const useImageToWebp = (f?: File, params?: options): resp => {
  const p = { ...defaultImageToWebpOptions, ...params };
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<webpConvResult>();

  useEffect(() => {
    setFile(f);
  }, [f]);

  useEffect(() => {
    if (file) {
      imageToWebpOp(file, { ...p }).then((r) => {
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
