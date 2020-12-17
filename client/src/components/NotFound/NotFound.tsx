import React from 'react';

const NOT_FOUND_IMG = 'https://source.unsplash.com/3jBU9TbKW7o/565x370';

export default function NotFound(): JSX.Element {
  return (
    <div>
      <h1>Page not found</h1>
      <img src={NOT_FOUND_IMG} alt="hand holding compass" />
    </div>
  );
}
