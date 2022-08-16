import React, { useEffect, useState } from 'react';
import {
  fastImageGenThumbnail,
  imgFileConvResult,
  fastFileGetSrc,
  fileSizeParse,
} from '@rtwc/comm';

interface manyResultItem extends imgFileConvResult {
  src: string;
  inputFile: File;
}

export default () => {
  const [rl, setRl] = useState<Array<manyResultItem>>([]);

  const onOneUp = async (f: File) => {
    console.log('处理', f.name);
    const src = fastFileGetSrc(f);
    const filesGen = await fastImageGenThumbnail(f, { debug: true });
    const m: manyResultItem = {
      inputFile: f,
      src,
      ...filesGen,
    };
    setRl((r) => [...r, m]);
  };

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        onOneUp(file);
      }
    }
  };

  return (
    <React.Fragment>
      <p>测试多图处理</p>
      <input type="file" multiple={true} onChange={onUpload} accept={'image/*'} />
      <div style={{ marginTop: 10 }}>
        {rl.map((d, i) => {
          return (
            <div
              key={i}
              style={{
                border: '1px solid #eee',
                padding: '0px 10px',
                marginBottom: 5,
              }}
            >
              {d.originChange && (
                <React.Fragment>
                  <p>
                    原图文件名:{d?.inputFile?.name} 大小:
                    {fileSizeParse(d?.inputFile?.size)}
                  </p>
                </React.Fragment>
              )}
              <p>
                {d?.originChange ? '变更图' : '原图'}文件名:{d?.originFile?.name} 大小:
                {fileSizeParse(d?.originFile?.size)}
              </p>
              <p>
                预览图文件名:{d?.thumbnailFile?.name} 大小:
                {fileSizeParse(d?.thumbnailFile?.size)}
              </p>
              <p>总花费时间 {d?.progressMs} ms</p>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};
