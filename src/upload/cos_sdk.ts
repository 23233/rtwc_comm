import COS from 'cos-js-sdk-v5';

class CosSdk extends COS {
  // 自定义域名
  visit: string | undefined;
  bucket: string | undefined;
  region: string | undefined;

  // 加密名称生成器
  generateFileName(f: File): string {
    return f.name;
  }
}

export default CosSdk;
