// Legacy exports - re-export from motion.config for backward compatibility
export * from './motion.config'

// Legacy aliases for backward compatibility
export { fadeUp as fadeInUp } from './motion.config'
export { hoverEffects } from './motion.config'
export const imageZoom = {
  scale: 1.1,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}
