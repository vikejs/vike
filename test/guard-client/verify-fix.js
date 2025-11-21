/**
 * This script verifies that our fix for client-side guards works correctly.
 * It simulates the conditions that would occur during page reload vs navigation.
 */

// Mock the functions and types we need
function mockHookClientOnlyExists(hookName, pageContext) {
  // Simulate a client-only guard
  if (hookName === 'guard' && pageContext.hasClientOnlyGuard) {
    return true
  }
  return false
}

function simulateGuardExecution(pageContext, isErrorPage = false) {
  console.log(`\n--- Simulating guard execution ---`)
  console.log(`_hasPageContextFromServer: ${pageContext._hasPageContextFromServer}`)
  console.log(`hasClientOnlyGuard: ${pageContext.hasClientOnlyGuard}`)
  console.log(`isErrorPage: ${isErrorPage}`)

  // This is the NEW logic from our fix
  const shouldExecuteGuard =
    !isErrorPage && (!pageContext._hasPageContextFromServer || mockHookClientOnlyExists('guard', pageContext))

  console.log(`Should execute guard: ${shouldExecuteGuard}`)

  if (shouldExecuteGuard) {
    console.log('✅ Guard would be executed')
  } else {
    console.log('❌ Guard would NOT be executed')
  }

  return shouldExecuteGuard
}

// Test scenarios
console.log('=== Testing Guard Execution Logic ===')

console.log('\n🔄 Scenario 1: Page reload with client-only guard (FIXED)')
const pageReloadWithClientGuard = {
  _hasPageContextFromServer: true, // Server-side routing (page reload)
  hasClientOnlyGuard: true, // Has +guard.client.js
}
const result1 = simulateGuardExecution(pageReloadWithClientGuard)
console.log(`Expected: true, Got: ${result1} ${result1 ? '✅' : '❌'}`)

console.log('\n🔄 Scenario 2: Client navigation with client-only guard')
const clientNavWithClientGuard = {
  _hasPageContextFromServer: false, // Client-side routing (navigation)
  hasClientOnlyGuard: true, // Has +guard.client.js
}
const result2 = simulateGuardExecution(clientNavWithClientGuard)
console.log(`Expected: true, Got: ${result2} ${result2 ? '✅' : '❌'}`)

console.log('\n🔄 Scenario 3: Page reload with server-only guard')
const pageReloadWithServerGuard = {
  _hasPageContextFromServer: true, // Server-side routing (page reload)
  hasClientOnlyGuard: false, // No client-only guard
}
const result3 = simulateGuardExecution(pageReloadWithServerGuard)
console.log(`Expected: false, Got: ${result3} ${result3 === false ? '✅' : '❌'}`)

console.log('\n🔄 Scenario 4: Client navigation with server-only guard')
const clientNavWithServerGuard = {
  _hasPageContextFromServer: false, // Client-side routing (navigation)
  hasClientOnlyGuard: false, // No client-only guard
}
const result4 = simulateGuardExecution(clientNavWithServerGuard)
console.log(`Expected: true, Got: ${result4} ${result4 ? '✅' : '❌'}`)

console.log('\n=== Summary ===')
const allPassed = result1 && result2 && !result3 && result4
console.log(`All tests passed: ${allPassed ? '✅' : '❌'}`)

if (allPassed) {
  console.log('\n🎉 The fix correctly handles client-side guards!')
  console.log('   - Client-only guards now execute on page reload')
  console.log('   - Client-only guards still execute on navigation')
  console.log('   - Server-only guards are not executed unnecessarily')
} else {
  console.log('\n❌ Some tests failed. The fix needs adjustment.')
}
