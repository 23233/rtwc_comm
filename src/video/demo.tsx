import React, { useState } from 'react';
import { useVideoParse } from '@rtwc/comm';

export default () => {
  const { setFile, result } = useVideoParse();

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      setFile(file);
    }
  };

  return (
    <React.Fragment>
      <p>视频上传生成预览图 自动取第一帧</p>
      <input type="file" multiple={false} onChange={onUpload} accept={'video/*'} />
      <div style={{ marginTop: 10 }}>
        {!!result && (
          <div>
            <div>
              <p>预览图</p>
              <img src={result?.imgTarget?.src} alt={'预览图'} height={150} />
            </div>
            <div>
              <p>视频</p>
              <video src={result?.playSrc} autoPlay={false} height={150} controls />
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
