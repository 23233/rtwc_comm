import { useEffect, useState } from 'react';
import { imageTools } from '@rtwc/comm';

interface result extends imageTools.videoFileGetPreviewResp {
  imgTarget: HTMLImageElement;
  playSrc: string;
}

const useVideoParse = (f?: File, cb?: (r: result) => void) => {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<result>();

  const runProcess = async (f: File) => {
    const r = await imageTools.videoFileParse(f);
    if (r) {
      setResult(r);
    }
  };

  useEffect(() => {
    setFile(f);
  }, [f]);

  useEffect(() => {
    if (file) {
      runProcess(file);
    }
  }, [file]);

  useEffect(() => {
    if (result) {
      cb && cb(result);
    }
  }, [result]);

  return {
    setFile,
    result,
  };
};

export default useVideoParse;
