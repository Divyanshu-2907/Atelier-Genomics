'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx } from 'clsx';
import { motionDurations, motionEasings } from '@/motion/tokens';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'scientific';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, children, className, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap select-none font-sans font-medium transition-colors cursor-pointer rounded-full border text-center focus-visible:outline-none';

    const sizeStyles = {
      sm: 'text-xs px-4 py-2 gap-2 min-h-[44px]',
      md: 'text-sm px-6 py-3 gap-2.5 min-h-[44px]',
      lg: 'text-base px-8 py-4 gap-3 min-h-[52px]',
    };

    const variantStyles = {
      primary:
        'bg-[#f3f4f1] text-[#06080a] border-transparent hover:bg-white hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)]',
      secondary:
        'bg-[#0b0f14] text-[#f3f4f1] border-white/12 hover:border-emerald-500/50 hover:bg-[#11161d]',
      ghost:
        'bg-transparent text-[#8e959e] border-transparent hover:text-[#f3f4f1] hover:bg-white/5',
      scientific:
        'bg-[#0b0f14]/80 font-mono text-xs uppercase tracking-widest text-emerald-400 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{
          duration: motionDurations.fast,
          ease: motionEasings.easeOut,
        }}
        className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
        {icon && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{icon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
