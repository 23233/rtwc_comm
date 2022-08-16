import COS from 'cos-js-sdk-v5';

export class CosSdk extends COS {
  // 自定义域名
  visitHost: string | undefined;
  bucket: string | undefined;
  region: string | undefined;
  // 注入的数据
  injectData?: any;

  // 加密名称生成器
  generateFileName(f: File): string {
    return f.name;
  }
}
