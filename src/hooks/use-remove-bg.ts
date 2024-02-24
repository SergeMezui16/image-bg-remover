'use client';

import imglyRemoveBackground, { Config } from '@imgly/background-removal';
import { useState } from 'react';
import { useCountdown } from 'usehooks-ts';

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
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('');

  const remove = async (image: File) => {
    setIsLoading(true);
    const res = await imglyRemoveBackground(image, {
      ...config,
      process: (key: string) => {
        setKey(key);
        console.log(key);
      },
    });

    setIsLoading(false);
    return res;
  };

  return {
    remove,
    isLoading,
    key,
  };
};
