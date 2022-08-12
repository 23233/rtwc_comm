import React, { useState } from 'react';
import { RecordJson, restApiGen, RestParams, WeAppResp, WebResp } from '@rtwc/comm';
import { extend } from 'umi-request';

const request = extend({
  getResponse: true,
});

interface p {
  children?: React.ReactNode;
}

const V: React.FC<p> = ({ ...props }) => {
  const r = new restApiGen<WebResp>('/api/v1', request);
  const [resp, setResp] = useState<Array<WebResp>>([]);

  const run = async () => {
    const d = await r.get();
    console.log('默认跟随前置类型', d?.response);
    const g = await r.get<WebResp<RecordJson>>();
    const p = await r.post<WebResp<RecordJson>>({});
    console.log('p', p?.response?.status);
    const weapp = await r.post<WeAppResp<RecordJson>>({});
    console.log('weappresp', weapp?.statusCode);
    const put = await r.put<WeAppResp<RecordJson>>('123312123', { asd: 'asd' });
    console.log('weappresp', put?.statusCode);

    setResp([g, p, d]);
  };

  const a = new RestParams();
  a.Page(1).And('and', '中文').Or('or', 'or').SortDesc('_id').OpIn('tags', ['c', 'b']);

  return (
    <div>
      <button onClick={run}>发起网络请求</button>

      <div>
        {resp.map((d, i) => {
          return (
            <div key={i}>
              <div>
                {d?.response?.status} {d?.response?.url}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2>参数构建: </h2>
        <pre>默认string:{a.String()}</pre>
        <pre>join参数:{a.JoinParams('/sdjfiw/fdifi')}</pre>
        <pre>JSON对象:{JSON.stringify(a.ToObj())}</pre>
      </div>
    </div>
  );
};
export default V;
