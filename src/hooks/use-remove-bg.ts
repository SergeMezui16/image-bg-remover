'use client';

import imglyRemoveBackground, { Config } from '@imgly/background-removal';
import { useState } from 'react';

const config: Config = {
  fetchArgs: {
    mode: 'no-cors',
  },
  debug: true,
};

/**
 * step 1: upload => contains models
 * step 2: remove => contains onnxruntime
 * step 3: download => contains compute
 */

interface State {
  step?: 'upload' | 'remove' | 'download';
  key?: string;
  current?: number;
  total?: number;
}

export const useRemoveBg = () => {
  const [state, setState] = useState<State>();
  const [isLoading, setIsLoading] = useState(false);

  const remove = async (image: File) => {
    setIsLoading(true);
    const res = await imglyRemoveBackground(image, {
      ...config,
      process: (key: string, current: number, total: number, unk: any) => {
        console.log(`Downloading ${key}: ${current} of ${total} =>`, unk);
        setState((prev) => ({
          ...prev,
          current,
          total,
          step: key.includes('models')
            ? 'upload'
            : key.includes('compute')
            ? 'download'
            : 'remove',
        }));
        setIsLoading(false);
      },
    });

    return res;
  };

  return {
    state: {
      step: state?.step,
      curent: state?.current,
      total: state?.total,
      avg:
        state?.current && state.total
          ? (state?.current / state?.total) * 100
          : 0,
    },
    remove,
    isLoading,
  };
};
