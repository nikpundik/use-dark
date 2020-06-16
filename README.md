# Use Dark

A canvas based hook for sliding images, inspired by Netflix's Dark opening theme.

## Requisites

React 16.8+

## Installation

```
npm install --save use-dark
```

## Usage

#### With a single image

```react
import React from 'react';
import useDark from 'use-dark';

import imgSrc from './dark.jpg';

function App() {
  const ref = useDark(imgSrc);
  return (
    <div>
      <canvas ref={ref} />
    </div>
  );
}

export default App;
```

#### With a series of images

```react
import React, { useState, useEffect } from 'react';
import useDark from 'use-dark';

import img1Src from './dark1.jpg';
import img2Src from './dark2.jpg';

const images = [img1Src, img2Src];

function App() {
  const [index, setIndex] = useState(0);
  const ref = useDark(images[index]);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((c) => (c < images.length - 1 ? c + 1 : 0));
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div>
      <canvas ref={ref} />
    </div>
  );
}

export default App;
```

#### With configurable options and React Spring

```react
import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import useDark from 'use-dark';

import img1Src from './dark1.jpg';

const slides = [
  {
    dark: {
      image: img1Src,
      type: 3,
      speed: 0.3,
    },
    data: {
      text: 'USE DARK',
      subtext: (
        <span>
          canvas based <strong>react hook</strong>
        </span>
      ),
    },
  },
  {
    dark: {
      image: 'https://external.url/image.jpg',
      type: 4,
      speed: 0.4,
    },
    data: {
      text: 'INSTALL',
      subtext: (
        <span>
          npm install <strong>use-dark</strong>
        </span>
      ),
    },
  },
];

function App() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState({});
  const [fading, setFading] = useState(true);
  const props = useSpring({ opacity: fading ? 0 : 1 });

  const onLoaded = useCallback(() => {
    setData(slides[index].data);
    setFading(false);
  }, [index]);

  const ref = useDark(slides[index].dark, onLoaded);

  useEffect(() => {
    const i = setInterval(() => {
      setFading(true);
      setIndex((current) => (current < slides.length - 1 ? current + 1 : 0));
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div>
      <canvas ref={ref} />
      <animated.div style={props}>
        <h1>{data.text}</h1>
        <h2>{data.subtext}</h2>
      </animated.div>
    </div>
  );
}

export default App;

```

## License

[MIT](https://choosealicense.com/licenses/mit/)
