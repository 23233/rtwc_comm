import { useEffect, useMemo, useState } from 'react';
import {
  DefaultImgFileConvOptions,
  fastFileGetSrc,
  fastImageGenThumbnail,
  imgFileConvOptions,
  imgFileConvResult,
} from '@rtwc/comm';

export interface ImageConvResult extends imgFileConvResult {
  inputFile: File;
}

export interface ImageFileThumbnailGenerateReturn {
  setFile: (f: File) => void;
  result?: ImageConvResult;
  src?: string;
  originSrc?: string;
  thumbnailSrc?: string;
  progress?: number; // 处理进度
}

interface options extends imgFileConvOptions {
  onSuccess?: (result: ImageConvResult) => void;
}

// 自动图片预览图自动生成
export const useImageFileThumbnailGenerate = (
  f?: File,
  params?: options,
): ImageFileThumbnailGenerateReturn => {
  const p = { ...DefaultImgFileConvOptions, ...params };
  const [file, setFile] = useState<File>();
  // 输入图片的src
  const [inputSrc, setInputSrc] = useState<string>();
  // 原图src地址
  const [originSrc, setOriginSrc] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  // 预览图src地址
  const [thumbnailSrc, setThumbnailSrc] = useState<string>();
  const [result, setResult] = useState<ImageConvResult>();

  useEffect(() => {
    if (f) {
      setFile(f);
    }
  }, [f]);

  const onRun = async (input: File) => {
    // 先生成一个原图的预览
    setInputSrc(fastFileGetSrc(input));
    const filesGen = await fastImageGenThumbnail(input, { ...p, onProgress: setProgress });
    setResult({
      ...filesGen,
      inputFile: input,
    });
  };

  const onGenSrc = async (r: ImageConvResult) => {
    // 生成预览地址
    if (r.originChange) {
      setOriginSrc(fastFileGetSrc(r.originFile));
    } else {
      setOriginSrc(inputSrc);
    }
    setThumbnailSrc(fastFileGetSrc(r.thumbnailFile));
  };

  useEffect(() => {
    if (result) {
      onGenSrc(result);
    }
  }, [result]);

  useEffect(() => {
    if (file) {
      onRun(file);
    }
  }, [file]);

  useEffect(() => {
    if (result) {
      p?.onSuccess && p.onSuccess(result);
    }
  }, [result]);

  return {
    setFile,
    result,
    src: inputSrc,
    originSrc: originSrc,
    thumbnailSrc: thumbnailSrc,
    progress,
  };
};
