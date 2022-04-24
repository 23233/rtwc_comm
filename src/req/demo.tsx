import React, { useState } from 'react';
import { Resp, restApiGen } from '@rtwc/comm';
import { extend } from 'umi-request';

const request = extend({
  getResponse: true,
});

interface p {
  children?: React.ReactNode;
}

const V: React.FC<p> = ({ ...props }) => {
  const r = new restApiGen('/api/v1', request);
  const [resp, setResp] = useState<Array<Resp>>([]);

  const run = async () => {
    const g = await r.get();
    const p = await r.post({});
    const put = await r.put('123312123', 'asd');
    setResp([g, p, put]);
  };

  return (
    <div>
      <button onClick={run}>发起网络请求</button>

      <div>
        {resp.map((d, i) => {
          return (
            <div key={i}>
              <div>
                {d.response?.status} {d.response?.url}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default V;
