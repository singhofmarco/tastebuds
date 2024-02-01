'use client'

import { TypeAnimation } from 'react-type-animation'
import { title } from './primitives'

export default function TitleAnimation() {
  return (
    <TypeAnimation
      preRenderFirstString={true}
      sequence={[
        'creative', // initially rendered starting point
        2000,
        'healthy',
        2000,
        'delicious',
        2000,
        'fun',
        2000,
        'easy',
        2000,
        'fast',
        2000,
        'exciting',
        2000,
        'new',
        2000,
        'tasty',
        2000,
        'unique',
        2000,
        'interesting',
        2000,
        'wild',
        2000,
      ]}
      speed={20}
      className={title({ className: 'text-primary' })}
      repeat={Infinity}
    />
  )
}
