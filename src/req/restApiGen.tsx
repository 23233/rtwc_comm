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

export enum RestParamsOptions {
  'eq' = 'eq', // 等于
  'gt' = 'gt', // 大于
  'gte' = 'gte', // 大于等于
  'lt' = 'lt', // 小于
  'lte' = 'lte', // 小于等于
  'ne' = 'ne', // 不等于
  'in' = 'in', // 包含
  'nin' = 'nin', // 不包含
  'exists' = 'exists', // 字段是否存在
  'null' = 'null', // 内容是否存在
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

// 请求参数构建
export class RestParams {
  u = new URLSearchParams();

  constructor() {}

  Page(n: number) {
    this.u.set('page', n.toString());
    return this;
  }

  PageNext(now: number) {
    return this.Page(now + 1);
  }

  PagePre(now: number) {
    return this.Page(now - 1);
  }

  PageSize(n: number) {
    this.u.set('page_size', n.toString());
    return this;
  }

  SortAsc(field: string) {
    this.u.set('_o', field);
    return this;
  }

  SortDesc(field: string) {
    this.u.set('_od', field);
    return this;
  }

  Or(field: string, value: any) {
    this.u.set('_o_' + field, value);
    return this;
  }

  And(field: string, value: any) {
    this.u.set(field, value);
    return this;
  }

  // maxDistance 单位为米
  Geo(lng: number, lat: number, maxDistance?: number, minDistance?: number) {
    this.u.set('_g', `${lng},${lat}`);
    if (maxDistance != undefined) {
      this.GeoMaxDistance(maxDistance);
    }
    if (minDistance != undefined) {
      this.GeoMinDistance(minDistance);
    }
    return this;
  }

  // meters 为米
  GeoMaxDistance(meters: number) {
    this.u.set('_gmax', meters.toString());
    return this;
  }

  // meters 为米
  GeoMinDistance(meters: number) {
    this.u.set('_gmin', meters.toString());
    return this;
  }

  Search(text: string, match?: 'left' | 'right' | 'full') {
    let s: string;
    switch (match) {
      case 'left':
        s = `__${text}`;
        break;
      case 'right':
        s = `${text}__`;
        break;
      default:
        s = `__${text}__`;
        break;
    }
    this.u.set('_s', s);
    return this;
  }

  LastMid(mid: string) {
    this.u.set('_last', mid);
    return this;
  }

  String() {
    return this.u.toString();
  }

  Op(field: string, value: any, op: RestParamsOptions | string) {
    this.u.set(`${field}_${op}_`, value);
    return this;
  }

  OpIn(field: string, values: any[]) {
    const valueStr = values.join(',');
    return this.Op(field, valueStr, 'in');
  }

  OpNotIn(field: string, values: any[]) {
    const valueStr = values.join(',');
    return this.Op(field, valueStr, 'nin');
  }

  JoinParams(url: string) {
    const fullUrl = url + '?' + this.String();
    return fullUrl.replace('??', '?');
  }

  static ObjectToFlatData = (data: object, prefix?: string, limit?: string) => {
    if (!limit) {
      limit = '__';
    }
    const result = {} as any;
    for (const [key, value] of Object.entries(data)) {
      result[prefix + limit + key] = value;
    }
    return result;
  };
}

export default RestApiGen;
