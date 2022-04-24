export const genGeoGetParams = (
  lng: number,
  lat: number,
  minDistance: number,
  maxDistance: number,
): Record<string, undefined> => {
  const p = {
    _g: `${lng},${lat}`,
  } as any;
  if (maxDistance) {
    p._gmax = maxDistance;
  }
  if (minDistance) {
    p._gmin = minDistance;
  }
  return p;
};

export interface Resp<T = any> {
  data: T;
  response: Response;
}

// crud 接口生成器
class RestApiGen {
  url: string;
  Req: any;

  constructor(url: string, Req: any) {
    if (url.endsWith('/')) {
      this.url = url.slice(0, url.length - 1);
    } else {
      this.url = url;
    }
    this.Req = Req;
  }

  get = (params?: Record<string, unknown>): Promise<Resp> => {
    return this.Req.get(this.url, {
      params,
    });
  };

  post = (data: any): Promise<Resp> => {
    return this.Req.post(this.url, {
      data,
    });
  };

  put = (mid: string, data: any): Promise<Resp> => {
    return this.Req.put(`${this.url}/${mid}`, {
      data,
    });
  };

  delete = (mid: string): Promise<Resp> => {
    return this.Req.delete(`${this.url}/${mid}`);
  };

  getSingle = (mid: string): Promise<Resp> => {
    return this.Req.get(`${this.url}/${mid}`);
  };

  // 前缀匹配% 后缀匹配 前后匹配
  search = (val: string, match: 'left' | 'right' | 'full', params?: Record<string, unknown>) => {
    let s: string;
    if (match === 'left') {
      s = `__${val}`;
    } else if (match === 'right') {
      s = `${val}__`;
    } else {
      s = `__${val}__`;
    }
    return this.get({
      ...params,
      _s: s,
    });
  };

  // geo搜索
  geoGet = (
    lng: number,
    lat: number,
    minDistance: number,
    maxDistance: number,
    other?: Record<string, unknown>,
  ) => {
    const geoParams = genGeoGetParams(lng, lat, minDistance, maxDistance);
    return this.get({
      ...other,
      ...geoParams,
    });
  };
}

export default RestApiGen;
