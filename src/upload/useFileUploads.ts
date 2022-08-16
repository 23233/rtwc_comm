import { useEffect, useRef, useState } from 'react';
import { runCosUpload, CosSdk } from '@rtwc/comm';

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
  addFile: (f: fileUploadItem) => void;
}

interface options {
  onSuccess?: (up: uploadItem) => void;
  onFail?: (err: Error) => void;
}

export interface fileUploadItem {
  origin: File;
  preview?: File;
}

// 通用文件上传
export const useFileUploads = (
  cos: CosSdk,
  file?: fileUploadItem,
  option?: options,
): uploadResult => {
  const [msg, setMsg] = useState<string>(''); // 状态说明
  const [process, setProcess] = useState<number>(0); // 上传的进度
  const [status, setStatus] = useState<number>(0); // 0待上传 1上传中 2成功 3错误
  const [loading, setLoading] = useState<boolean>(false);
  const upload = useRef<uploadItem>({ origin: '' });
  const now = useRef<fileUploadItem>();

  // 进行上传
  const runUpload = async (sf?: fileUploadItem) => {
    const f = sf || now.current;
    if (f && f?.origin) {
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
      now.current = file;
    }
  }, [file?.origin]);

  const runRetry = () => {
    runUpload();
  };

  const addFile = (f: fileUploadItem) => {
    runUpload(f);
    now.current = f;
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
