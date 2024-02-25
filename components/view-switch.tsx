'use client'

import { FC } from 'react'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { SwitchProps, useSwitch } from '@nextui-org/switch'
import { useIsSSR } from '@react-aria/ssr'
import clsx from 'clsx'

import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { useView } from '@/app/hooks/use-view'

export interface ViewSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
}

export const ViewSwitch: FC<ViewSwitchProps> = ({ className, classNames }) => {
  const { view, setView } = useView()
  const isSSR = useIsSSR()

  const onChange = () => {
    view === 'grid' ? setView('list') : setView('grid')
  }

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: view === 'grid' || isSSR,
    'aria-label': `Switch to ${view === 'grid' || isSSR ? 'list' : 'grid'} view`,
    onChange,
  })

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          'px-px transition-opacity hover:opacity-80 cursor-pointer',
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              'w-auto h-auto',
              'bg-transparent',
              'rounded-lg',
              'flex items-center justify-center',
              'group-data-[selected=true]:bg-transparent',
              '!text-default-500',
              'pt-px',
              'px-0',
              'mx-0',
            ],
            classNames?.wrapper
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <Squares2X2Icon className="h-6 w-6" />
        ) : (
          <ListBulletIcon className="h-6 w-6" />
        )}
      </div>
    </Component>
  )
}
