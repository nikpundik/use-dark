import { useState, useRef, useEffect } from 'react';

import Animation from './animation';

function getData(data) {
  if (typeof data === 'string')
    return {
      image: data,
    };
  return data;
}

function useAnimation(canvasRef) {
  const [animation, setAnimation] = useState(null);
  useEffect(() => {
    if (canvasRef.current) {
      const a = new Animation();
      a.setup(canvasRef.current);
      setAnimation(a);
    }
  }, [canvasRef]);
  return animation;
}

function useDark(data, onFadeIn, onFadeOut) {
  const canvasRef = useRef(null);
  const animation = useAnimation(canvasRef);
  useEffect(() => {
    if (animation && data)
      animation.setImage(getData(data), onFadeIn, onFadeOut);
  }, [animation, data, onFadeIn, onFadeOut]);
  return canvasRef;
}

export default useDark;
