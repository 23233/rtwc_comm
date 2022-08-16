import React from 'react';
import { fastFileGetSrc, fileSizeParse, useImageToWebp } from '@rtwc/comm';

export default () => {
  const { setFile, result } = useImageToWebp();

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  return (
    <React.Fragment>
      <p>文件上传转换为webp并且生成缩略图 旧方法 请不要继续使用了</p>
      <input type="file" multiple={false} onChange={onUpload} accept={'image/*'} />
      <div style={{ marginTop: 10 }}>
        {!!result && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <div>
              <img src={URL.createObjectURL(result.originFile)} alt={'原图'} height={150} />
              <p>原图</p>
            </div>
            <div>
              <img src={fastFileGetSrc(result?.webp!)} alt={'webp'} height={150} />
              <p>webp</p>
            </div>
            <div>
              <img src={fastFileGetSrc(result?.previewWebp!)} alt={'预览图'} height={150} />
              <p>预览图</p>
            </div>
          </div>
        )}
      </div>
      <div>
        <p>
          原图文件名:{result?.originFile?.name} 大小:
          {fileSizeParse(result?.originFile?.size)}
        </p>
        <p>
          转换后的文件名:{result?.webp?.name} 大小:{fileSizeParse(result?.webp?.size)}
        </p>
        <p>
          预览图文件名:{result?.previewWebp?.name} 大小:
          {fileSizeParse(result?.previewWebp?.size)}
        </p>
      </div>
    </React.Fragment>
  );
};
