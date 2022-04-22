import React, { useState } from 'react';
import { useClipboard } from '@rtwc/comm';

const index = (): any => {
  const [input, setInput] = useState<string>('赵日天');
  const { clipboard, copyToClipboard } = useClipboard();

  const copySuccess = (c: string): void => {
    alert(`写入剪切板成功${c}`);
  };

  return (
    <div>
      <input type="text" onChange={(e) => setInput(e.target.value)} value={input} />

      <button onClick={() => copyToClipboard(input, copySuccess)}>写入内容</button>
      <div>读取剪切板内容: {clipboard}</div>
    </div>
  );
};

export default index;
