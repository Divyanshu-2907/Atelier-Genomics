/**
 * Atelier Genomics — Motion Utilities
 */

import { motionDurations } from './tokens';

/**
 * Creates CSS transition string for hardware-accelerated transform & opacity
 */
export function getTransition(
  properties: string[] = ['transform', 'opacity'],
  duration: number = motionDurations.fast,
  easing: string = 'cubic-bezier(0.23, 1, 0.32, 1)'
): string {
  return properties.map((prop) => `${prop} ${duration}s ${easing}`).join(', ');
}

/**
 * Common button press scale style (active state feedback)
 */
export const activePressStyle = {
  transform: 'scale(0.97)',
  transition: getTransition(['transform'], motionDurations.fast),
};
