import React from 'react';
import { CosSdk, imageToWebp, useFileUploads, runCosUpload, imageTools } from '@rtwc/comm';

const sdk = new CosSdk({
  FileParallelLimit: 5,
  ChunkParallelLimit: 5,
  SliceSize: 8 * 1024 * 1024,
  Timeout: 20 * 1000,
  UploadCheckContentMd5: true,
  UploadAddMetaMd5: true,
  // 如果用过匿名函数没有this的上下文
  getAuthorization: function (options, callback) {
    callback({
      TmpSecretId: 'sdf88e',
      TmpSecretKey: '8394dfuijg',
      XCosSecurityToken: 'dfjunhguijg3erjireg',
      StartTime: 1580000000, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
      ExpiredTime: 1580000900, // 时间戳，单位秒，如：1580000900
    });
  },
});

sdk.bucket = 'test-1250000000';
sdk.region = 'ap-chengdu';
sdk.generateFileName = (f: File) => {
  return f.name;
};

export default () => {
  const { status, msg, process, upload, runRetry, loading, addFile } = useFileUploads(sdk);

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];

      const r = await imageTools.videoFileParse(file);
      if (r) {
        addFile({
          origin: r.video,
          preview: r.imgFile,
        });
      }
    }
  };

  const onPromiseUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const r = await imageTools.videoFileParse(file);
      if (r) {
        const up = await runCosUpload({
          cos: sdk,
          file: {
            origin: r.video,
            preview: r.imgFile,
          },
          onFail: (err) => {
            console.log('上传出现错误', err);
          },
          onProcess: (p) => {
            console.log('进度变化', p);
          },
          onSuccess: (resp) => {
            console.log('上传成功', resp);
          },
        });
        console.log('up', up);
      }
    }
  };

  return (
    <div>
      <div>
        <p>视频上传 use方式使用</p>
        <input type="file" multiple={false} onChange={onUpload} accept={'video/*'} />
        <div>
          状态:{status} 说明:{msg} 进度:{process} 加载中:{loading ? '是' : '否'}
        </div>
        <div>
          上传结果
          <img src={upload?.origin} height={150} alt="" />
          <img src={upload?.thumbnail} height={150} alt="" />
        </div>
      </div>

      <div>
        <p>直接promise调用 打开控制台查看进展</p>
        <input type="file" multiple={false} onChange={onPromiseUpload} accept={'video/*'} />
      </div>
    </div>
  );
};
