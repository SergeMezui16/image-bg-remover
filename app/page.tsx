'use client';

import { Button } from '@/components/ui/button';
import { FormEventHandler, useState } from 'react';
import imglyRemoveBackground, { Config } from '@imgly/background-removal';
import Image from 'next/image';
import { useRemoveBg } from '@/hooks/use-remove-bg';

const config: Config = {
  progress: (key: string, current: number, total: number, unk: any) => {
    console.log(`Downloading ${key}: ${current} of ${total} => `, unk);
  },
  fetchArgs: {
    mode: 'no-cors',
  },
  debug: true,
};

export default function Home() {
  const [url, setUrl] = useState<string | undefined>();
  const { remove, state, isLoading } = useRemoveBg();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const image = form.get('image') as File;

    console.log(image);

    if (!image.name) return;

    const blob = await remove(image);

    const src = URL.createObjectURL(blob);

    setUrl(src);
    console.log(src);
  };

  return (
    <div className='bg-background flex flex-col gap-36 items-center justify-center w-screen min-h-screen'>
      <form className='' encType='multipart/form-data' onSubmit={handleSubmit}>
        <input type='file' name='image' id='image' />
        <Button>envoyer</Button>
      </form>
      {isLoading && 'Chargement'}
      <div className='text-center text-4xl font-mono'>
        <p>{state.avg} %</p>
      </div>

      <div className='bg-primary flex flex-col'>
        {url && (
          <Image
            src={url}
            alt='image'
            width={10000}
            height={10000}
            className=''
          />
        )}
      </div>
    </div>
  );
}
