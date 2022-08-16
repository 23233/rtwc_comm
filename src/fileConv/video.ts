import { getFileNameSuffix } from '@rtwc/comm';
import { fastFileGetSrc } from '@rtwc/comm';
import { uaIsSafari } from './compression';

export interface videoFileGetPreviewResp {
  /* 预览图地址 */
  imgFile: File;
  /* 视频blob src播放地址 */
  src: string;
}

// 获取视频第一帧图片的base64
export const getVideoFirstFrame = (url: string, t: number = 1): Promise<HTMLCanvasElement> => {
  return new Promise(function (resolve, reject) {
    let video = document.createElement('video');
    let canvas = document.createElement('canvas');

    video.setAttribute('crossOrigin', 'anonymous'); //处理跨域
    video.setAttribute('src', url);
    video.currentTime = t;
    video.load();
    video.addEventListener('loadedmetadata', function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
    video.addEventListener('loadeddata', function () {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); //绘制canvas
        resolve(canvas);
      }
    });
    video.addEventListener('error', function () {
      reject('load video fail');
    });
  });
};

// 视频file 获取第一帧图片为File
export const videoFileGetPreviewFile = (f: File): Promise<videoFileGetPreviewResp> => {
  return new Promise(async (resolve, reject) => {
    const src = fastFileGetSrc(f);
    if (src) {
      // 获取第一帧canvas
      const canvas = await getVideoFirstFrame(src);
      // safari不支持webp 所以判断一下Safari
      const suffix = uaIsSafari() ? 'jpeg' : 'webp';
      const [name, _] = getFileNameSuffix(f.name);
      const imgName = `${name}.${suffix}`;
      const quality = 0.8;
      const tp = 'image/' + suffix;
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const f = new File([blob], imgName, {
              lastModified: new Date().getTime(),
              type: tp,
            });
            resolve({
              imgFile: f,
              src,
            });
          }
        },
        tp,
        quality,
      );
    }
  });
};

export interface videoFileParseResp extends videoFileGetPreviewResp {
  /* 传入的File文件 */
  input: File;
}

export const videoFileParse = async (v: File): Promise<videoFileParseResp | undefined> => {
  // 获取到第一帧图片
  const frameResp = await videoFileGetPreviewFile(v);
  return {
    ...frameResp,
    input: v,
  };
};
