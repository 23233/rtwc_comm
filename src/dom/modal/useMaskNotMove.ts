import { useEffect, useRef, useState } from 'react';

export interface maskNoMoveResult {
  run: () => void;
  restore: () => void;
  running: boolean;
}

// 对body加入touch 防止有些傻逼浏览器滑动时控制浏览器前进后退
export const useMaskNotMove = (manual = false): maskNoMoveResult => {
  const nowBodyProp = useRef<Record<string, any>>({});
  const [running, setRunning] = useState<boolean>(false);

  const run = () => {
    nowBodyProp.current.oldTouch = document.body.style.getPropertyValue('touchAction');
    nowBodyProp.current.oldWidth = document.body.style.getPropertyValue('width');
    nowBodyProp.current.oldOverflow = document.body.style.getPropertyValue('overflow');

    // 对body加入touch 防止有些傻逼浏览器滑动时控制浏览器前进后退
    // 在成功或者关闭时需要复原
    document.body.style.touchAction = 'none';
    document.body.style.width = 'calc(100% - 0px)';
    document.body.style.overflow = 'hidden';
    setRunning(true);
  };

  const restore = () => {
    document.body.style.touchAction = nowBodyProp.current?.oldTouch;
    document.body.style.width = nowBodyProp.current?.oldWidth;
    document.body.style.overflow = nowBodyProp.current?.oldOverflow;

    setRunning(false);
  };

  useEffect(() => {
    if (!manual) {
      run();
      return restore;
    }
  }, []);

  return {
    run,
    restore,
    running,
  };
};
