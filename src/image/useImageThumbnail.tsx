import { useEffect, useMemo, useState } from 'react';
import {
  DefaultImgFileConvOptions,
  fastFileGetSrc,
  fastImageGenThumbnail,
  imgFileConvOptions,
  imgFileConvResult,
} from '@rtwc/comm';

interface ImageConvResult extends imgFileConvResult {
  inputFile: File;
}

interface resp {
  setFile: (f: File) => void;
  result?: ImageConvResult;
  src?: string;
  originSrc?: string;
  thumbnailSrc?: string;
}

interface options extends imgFileConvOptions {
  onSuccess?: (result: ImageConvResult) => void;
}

// 自动图片预览图自动生成
const useImageFileThumbnailGenerate = (f?: File, params?: options): resp => {
  const p = { ...DefaultImgFileConvOptions, ...params };
  const [file, setFile] = useState<File>();
  // 输入图片的src
  const [inputSrc, setInputSrc] = useState<string>();
  // 原图src地址
  const [originSrc, setOriginSrc] = useState<string>();
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
    const filesGen = await fastImageGenThumbnail(input, { ...p });
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
  };
};

export default useImageFileThumbnailGenerate;
