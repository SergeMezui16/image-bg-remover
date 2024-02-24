'use client';

import { Button } from '@/components/ui/button';
import { FormEventHandler, useState } from 'react';
import Image from 'next/image';
import { useRemoveBg } from '@/hooks/use-remove-bg';
import { useCountdown } from 'usehooks-ts';

export default function Home() {
  const [url, setUrl] = useState<string | undefined>();
  const { remove, isLoading, key } = useRemoveBg();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const image = form.get('image') as File;
    if (!image.name) return;

    const blob = await remove(image);

    const src = URL.createObjectURL(blob);

    setUrl(src);
  };

  return (
    <div className='bg-background flex flex-col gap-36 items-center justify-center w-screen min-h-screen'>
      <form className='' encType='multipart/form-data' onSubmit={handleSubmit}>
        <input type='file' name='image' id='image' />
        <Button>envoyer</Button>
        <RemoverPage isLoading={isLoading} url={url} />
      </form>
    </div>
  );
}

export const RemoverPage = ({
  isLoading,
  url,
}: {
  isLoading: boolean;
  url?: string;
}) => {
  const [count, action] = useCountdown({
    countStart: 0,
    intervalMs: 1000,
    isIncrement: true,
  });

  if (isLoading == true) action.startCountdown();

  return (
    <>
      <div className='text-center text-4xl font-mono'>
        {isLoading && 'Chargement' + `(${count})`}
      </div>

      <div className='bg-primary flex flex-col'>
        {url && (
          <Image
            src={url}
            alt='image'
            width={10000}
            height={10000}
            className='w-80'
          />
        )}
      </div>
    </>
  );
};
