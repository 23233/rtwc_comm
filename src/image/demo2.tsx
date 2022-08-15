import React, { useState } from 'react';
import { useImageToWebp, imageTools, fastFileGetSrc, fastFileGetTargetBuffer } from '@rtwc/comm';
import useImageFileThumbnailGenerate from './useImageThumbnail';

export default () => {
  const [fileInfo, setFileInfo] = useState<any>();
  const { setFile, result, src, originSrc, thumbnailSrc } = useImageFileThumbnailGenerate();

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const f = files[0];
      // 可以这样获取文件的宽高信息
      const target = await fastFileGetTargetBuffer(f);
      setFileInfo(target);
      setFile(f);
    }
  };

  return (
    <React.Fragment>
      <p>文件上传自动判断环境生成预览图 使用web worker优先 但是大图片请尽量压缩</p>
      <input type="file" multiple={false} onChange={onUpload} accept={'image/*'} />
      <div style={{ marginTop: 10 }}>
        <div>
          {!!fileInfo && (
            <div>
              宽 {fileInfo.width}x{fileInfo.height} 高
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <div>
            <img src={src} alt={'原图'} height={150} />
            <p>原图 </p>
          </div>
          {!!result && (
            <React.Fragment>
              {result.originChange && (
                <div>
                  <img src={originSrc} alt={'原图变更'} height={150} />
                  <p>原图变更</p>
                </div>
              )}
              <div>
                <img src={thumbnailSrc} alt={'预览图'} height={150} />
                <p>预览图</p>
              </div>
            </React.Fragment>
          )}
        </div>

        <div>
          {result?.originChange && (
            <React.Fragment>
              <p>
                原图文件名:{result?.inputFile?.name} 大小:
                {imageTools.fileSizeParse(result?.inputFile?.size)}
              </p>
            </React.Fragment>
          )}
          <p>
            {result?.originChange ? '变更图' : '原图'}文件名:{result?.originFile?.name} 大小:
            {imageTools.fileSizeParse(result?.originFile?.size)}
          </p>
          <p>
            预览图文件名:{result?.thumbnailFile?.name} 大小:
            {imageTools.fileSizeParse(result?.thumbnailFile?.size)}
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};
