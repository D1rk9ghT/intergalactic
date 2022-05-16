import React, { useEffect, useState } from 'react';
import Breakpoints from '@semcore/breakpoints';
import Button from '@semcore/button';

export default () => {
  const [index, updateIndex] = useState(Breakpoints.mediaList.matches());

  useEffect(() => {
    const unsubscribe = Breakpoints.mediaList.addListener((index) => {
      updateIndex(index);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <Button size={['m', 'l'][index]}>Button size {['M', 'L'][index]}</Button>;
};
