import React, { useRef } from 'react';
import { RippleView, useRipple } from '@rtwc/comm';

const index = (): any => {
  const btnRef = useRef<any>();
  useRipple(btnRef);

  return (
    <div>
      <button ref={btnRef}>点击特效</button>
      <button>点击无特效</button>

      <RippleView>
        <button>view 点击特效</button>
      </RippleView>
    </div>
  );
};

export default index;
