import React from 'react';
import { useMaskNotMove } from '@rtwc/comm';

const index = (): any => {
  const { run, restore, running } = useMaskNotMove(true);
  return (
    <div>
      <button onClick={run}>设置</button>
      <button onClick={restore}>还原</button>
      <div style={{ height: 2000 }}>
        遮罩层滚动 {running ? '此时已经无法滚动 ' : '当前可以滚动'}
      </div>
    </div>
  );
};

export default index;
