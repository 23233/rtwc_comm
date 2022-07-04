import { useEffect, useState } from 'react';

// 写入剪切板
export const sendClipboard = (text: string, cb?: () => void): void => {
  if (!text) return;
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  cb && cb();
};

export interface useClipParams {
  updateFrequency?: number; // default 1s 1000
  onReadError?: (reason: Error) => any;
  onlyWrite?: boolean;
}

export interface ClipboardResult {
  clipboard: string;
  copyToClipboard: (
    clipboardContent: string,
    onCopySuccess?: (content: string) => void,
    onWriteError?: (reason: Error) => void,
  ) => void;
}

const useClipboard = (props?: useClipParams): ClipboardResult => {
  const [clipboard, setClipboardContent] = useState<string>('');

  const copyToClipboard = (
    clipboardContent: string,
    onCopySuccess?: (content: string) => void,
    onWriteError?: (reason: Error) => void,
  ): void => {
    if (navigator.permissions && navigator.clipboard) {
      navigator.permissions
        .query(<PermissionDescriptor>(<unknown>{ name: 'clipboard-write' }))
        .then(({ state }) => {
          if (['granted', 'prompt'].includes(state)) {
            navigator.clipboard.writeText(clipboardContent).then(() => {
              setClipboardContent(clipboardContent);
              if (onCopySuccess) {
                onCopySuccess(clipboardContent);
              }
            }, onWriteError);
          } else {
            if (onWriteError) {
              onWriteError(new Error('ClipboardWrite permission has been blocked as the user.'));
            }
          }
        });
    }
  };

  useEffect(() => {
    if (props?.onlyWrite) {
      return;
    }
    let readClipboardInterval: any;
    let raiseError = false;
    if (navigator.permissions && navigator.clipboard) {
      navigator.permissions
        .query(<PermissionDescriptor>(<unknown>{ name: 'clipboard-read' }))
        .then(({ state }) => {
          if (['granted', 'prompt'].includes(state)) {
            readClipboardInterval = setInterval(() => {
              navigator.clipboard.readText().then((clipboardContent: string) => {
                setClipboardContent(clipboardContent);
              }, props?.onReadError);
            }, props?.updateFrequency || 1000);
          } else {
            const err = new Error('ClipboardRead permission has been blocked as the user.');
            if (!raiseError) {
              console.error('clipboard', err);
              raiseError = true;
            }
            if (props?.onReadError) {
              props?.onReadError(err);
            }
          }
        });
    }
    // eslint-disable-next-line consistent-return
    return () => {
      if (navigator.clipboard) {
        clearInterval(readClipboardInterval);
      }
    };
  }, []);

  return {
    clipboard,
    copyToClipboard,
  };
};

export default useClipboard;
