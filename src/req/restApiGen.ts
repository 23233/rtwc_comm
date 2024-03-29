export const genGeoGetParams = (
  lng: number,
  lat: number,
  minDistance: number,
  maxDistance: number,
): RecordJson => {
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

export interface WebResp<DT = any> {
  data: DT;
  response: Response;
}

export interface WeAppResp<DT = any> {
  data: DT;
  // 响应码
  statusCode: number;
  // 调用结果
  errMsg?: string;
  header?: RecordJson;
  cookies?: string[];
}

// 切记这里一定不能单独增加 T 或者 any 等选择 必须为指定类型
export type Resp<T = any> = WebResp<T> | WeAppResp<T> | Array<T> | RecordJson;

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

export type RecordJson<T = any> = {
  [k: string]: T;
};

/* crud 接口生成器
 * BT 代表resp类型 默认为WebResp
 * 也可以在每个请求前定义准确类型 eg: r.get<WebResp<RecordJson>>()
 */
export class RestApiGen<BT extends Resp = WebResp> {
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

  get = <T extends Resp = BT>(params?: RecordJson): Promise<T> => {
    return this.Req.get(this.url, {
      params,
    });
  };

  post = <T extends Resp = BT, D = any>(data: D): Promise<T> => {
    return this.Req.post(this.url, {
      data,
    });
  };

  put = <T extends Resp = BT, D = any>(mid: string, data: D): Promise<T> => {
    return this.Req.put(`${this.url}/${mid}`, {
      data,
    });
  };

  delete = <T extends Resp = BT>(mid: string): Promise<T> => {
    return this.Req.delete(`${this.url}/${mid}`);
  };

  getSingle = <T extends Resp = BT>(mid: string): Promise<T> => {
    return this.Req.get(`${this.url}/${mid}`);
  };

  // 前缀匹配% 后缀匹配 前后匹配
  search = <T extends Resp = BT>(
    val: string,
    match: 'left' | 'right' | 'full',
    params?: RecordJson,
  ): Promise<T> => {
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
  geoGet = <T extends Resp = BT>(
    lng: number,
    lat: number,
    minDistance: number,
    maxDistance: number,
    other?: RecordJson,
  ): Promise<T> => {
    const geoParams = genGeoGetParams(lng, lat, minDistance, maxDistance);
    return this.get({
      ...other,
      ...geoParams,
    });
  };

  // 主要用于像`swr`这种依赖相同key缓存的请求库
  GetKey = (params?: RecordJson): string => {
    const p = new URLSearchParams(params);
    return `${this.url}${params ? '?' + p.toString() : ''}`;
  };

  GetSingleKey = (mid: string): string => {
    return `${this.url}/${mid}`;
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

  SortAsc(...fields: Array<string>) {
    this.u.set('_o', fields.join(','));
    return this;
  }

  SortDesc(...fields: Array<string>) {
    this.u.set('_od', fields.join(','));
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

  ToObj() {
    return Object.fromEntries(this.u) as RecordJson;
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

  // 验证字段是否存在
  OpFieldExists(field: string, has?: boolean) {
    return this.Op(field, !!has, 'exists');
  }

  // 验证内容是否存在 true 为不存在 false为存在
  OpNull(field: string, isNull?: boolean) {
    return this.Op(field, !!isNull, 'null');
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
