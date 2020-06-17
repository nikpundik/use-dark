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

function useDark(data, onLoad) {
  const canvasRef = useRef(null);
  const animation = useAnimation(canvasRef);
  useEffect(() => {
    if (animation && data) animation.setImage(getData(data), onLoad);
  }, [animation, data, onLoad]);
  return canvasRef;
}

export default useDark;
