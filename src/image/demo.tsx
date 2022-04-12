import React from 'react';
import {useImageToWebp, imageTools} from "@rtwc/comm";
import {readBlobUrl} from "./tools";


export default () => {
  const {setFile, result} = useImageToWebp()

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setFile(files[0])
    }
  }

  return <React.Fragment>
    <input type="file" multiple={false} onChange={onUpload}/>
    <div style={{marginTop: 10}}>
      {
        !!result && <div style={{display: "flex"}}>
          <div>
            <img src={result?.originTarget.src} alt={"原图"} height={150}/>
            <p>原图</p>
          </div>
          <div>
            <img src={imageTools.readBlobUrl(result?.webp!)} alt={"webp"} height={150}/>
            <p>webp</p>
          </div>
          <div>
            <img src={imageTools.readBlobUrl(result?.previewWebp!)} alt={"预览图"} height={150}/>
            <p>预览图</p>
          </div>
        </div>
      }
    </div>
    <div>
      <p>原图文件名:{result?.originFile?.name} 大小:{imageTools.fileSizeParse(result?.originFile?.size)}</p>
      <p>转换后的文件名:{result?.webp?.name} 大小:{imageTools.fileSizeParse(result?.webp?.size)}</p>
      <p>预览图文件名:{result?.previewWebp?.name} 大小:{imageTools.fileSizeParse(result?.previewWebp?.size)}</p>
    </div>
  </React.Fragment>
}
