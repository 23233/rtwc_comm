import { useEffect, useState } from 'react';
import { videoFileParse, videoFileParseResp } from '@rtwc/comm';

export const useGetVideoFirstFrameImg = (f?: File, cb?: (result: videoFileParseResp) => void) => {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<videoFileParseResp>();

  const runProcess = async (f: File) => {
    const r = await videoFileParse(f);
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
