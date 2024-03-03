'use client'

import { TypeAnimation } from 'react-type-animation'
import { title } from './primitives'

export default function TitleAnimation() {
  return (
    <TypeAnimation
      preRenderFirstString={true}
      sequence={[
        'creative', // initially rendered starting point
        3500,
        'healthy',
        3500,
        'delicious',
        3500,
        'fun',
        3500,
        'easy',
        3500,
        'fast',
        3500,
        'exciting',
        3500,
        'new',
        3500,
        'tasty',
        3500,
        'unique',
        3500,
        'interesting',
        3500,
        'wild',
        3500,
      ]}
      speed={20}
      className={title({ className: 'text-primary' })}
      repeat={Infinity}
    />
  )
}
