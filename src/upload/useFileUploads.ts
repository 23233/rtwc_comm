import { useEffect, useRef, useState } from 'react';
import CosSdk from './cos_sdk';
import { runCosUpload } from '@rtwc/comm';

export interface uploadItem {
  origin: string;
  thumbnail?: string;
}

export interface uploadResult {
  msg: string;
  status: number;
  process: number;
  upload: uploadItem;
  runRetry: () => void;
  loading: boolean;
  addFile: (f: imgFileUploadItem) => void;
}

interface options {
  onSuccess?: (up: uploadItem) => void;
  onFail?: (err: Error) => void;
}

export interface imgFileUploadItem {
  origin: File;
  preview?: File;
}

// 通用图片上传
const useFileUploads = (cos: CosSdk, file?: imgFileUploadItem, option?: options): uploadResult => {
  const [msg, setMsg] = useState<string>(''); // 状态说明
  const [process, setProcess] = useState<number>(0); // 上传的进度
  const [status, setStatus] = useState<number>(0); // 0待上传 1上传中 2成功 3错误
  const [loading, setLoading] = useState<boolean>(false);
  const upload = useRef<uploadItem>({ origin: '' });

  // 进行上传
  const runUpload = async (sf?: imgFileUploadItem) => {
    const f = sf || file;
    if (f) {
      await runCosUpload({
        cos: cos,
        file: f,
        onUploadStart: () => {
          setLoading(true);
        },
        onUploadEnd: () => {
          setLoading(false);
        },
        onFail: (err) => {
          option?.onFail && option?.onFail(err);
          setStatus(3);
          setMsg('上传出现错误');
          return;
        },
        onSuccess: (result) => {
          upload.current = result;
          option?.onSuccess && option?.onSuccess(upload.current);
          setStatus(2);
          setMsg('成功');
        },
        onProcess: setProcess,
      });
    }
  };

  useEffect(() => {
    if (file?.origin) {
      runUpload(file);
    }
  }, [file?.origin]);

  const runRetry = () => {
    runUpload();
  };

  const addFile = (f: imgFileUploadItem) => {
    runUpload(f);
  };

  return {
    msg,
    status,
    process,
    upload: upload.current,
    loading,
    runRetry,
    addFile,
  };
};

export default useFileUploads;
