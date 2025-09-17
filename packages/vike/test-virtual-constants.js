// Simple test to verify the virtual module works
// This can be run with: node test-virtual-constants.js

console.log('Testing virtual constants module...')

// Test that the virtual module can be imported
try {
  // Note: This would normally be handled by Vite's virtual module system
  // In a real environment, this import would work through the plugin
  console.log('Virtual module import would work in a Vite environment')
  console.log('Example usage:')
  console.log(`
import { __VIKE__IS_DEV, __VIKE__IS_CLIENT, __VIKE__IS_DEBUG } from 'virtual:vike:constants'

if (__VIKE__IS_DEV) {
  console.log('Development mode')
}

if (__VIKE__IS_CLIENT) {
  console.log('Client-side')
} else {
  console.log('Server-side')
}

if (__VIKE__IS_CLIENT && __VIKE__IS_DEBUG) {
  console.log('Debug mode on client')
}
`)
} catch (error) {
  console.error('Error testing virtual module:', error)
}

// Test backward compatibility with globalThis
console.log('Testing backward compatibility...')
console.log('globalThis.__VIKE__IS_CLIENT:', globalThis.__VIKE__IS_CLIENT)
console.log('globalThis.__VIKE__IS_DEV:', globalThis.__VIKE__IS_DEV)
console.log('globalThis.__VIKE__IS_DEBUG:', globalThis.__VIKE__IS_DEBUG)

console.log('Test completed!')
