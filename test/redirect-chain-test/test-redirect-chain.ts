import { test, expect } from '@playwright/test'

// Simple test to verify previousPageContexts functionality
test('previousPageContexts tracking', async ({ page }) => {
  // Test direct access (no previous contexts)
  await page.goto('http://localhost:3000/redirect-chain')
  await expect(page.locator('#no-previous-contexts')).toBeVisible()

  // Test single redirect
  await page.goto('http://localhost:3000/redirect-to-chain')
  await expect(page.locator('#previous-contexts')).toBeVisible()
  const singleRedirectItems = await page.locator('#previous-contexts li').count()
  expect(singleRedirectItems).toBe(1)

  // Test double redirect
  await page.goto('http://localhost:3000/redirect-to-redirect-to-chain')
  await expect(page.locator('#previous-contexts')).toBeVisible()
  const doubleRedirectItems = await page.locator('#previous-contexts li').count()
  expect(doubleRedirectItems).toBe(2)

  // Verify the redirect chain order and types
  const firstRedirect = await page.locator('#previous-contexts li').first().textContent()
  const secondRedirect = await page.locator('#previous-contexts li').last().textContent()
  expect(firstRedirect).toContain('/redirect-to-redirect-to-chain')
  expect(firstRedirect).toContain('redirect')
  expect(secondRedirect).toContain('/redirect-to-chain')
  expect(secondRedirect).toContain('redirect')

  // Test single rewrite
  await page.goto('http://localhost:3000/rewrite-to-chain')
  await expect(page.locator('#previous-contexts')).toBeVisible()
  const singleRewriteItems = await page.locator('#previous-contexts li').count()
  expect(singleRewriteItems).toBe(1)

  // Verify the rewrite type
  const rewriteContext = await page.locator('#previous-contexts li').first().textContent()
  expect(rewriteContext).toContain('/rewrite-to-chain')
  expect(rewriteContext).toContain('rewrite')
})
