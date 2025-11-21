import { test, expect } from '@playwright/test'

// Simple test to verify redirect chain functionality
test('redirect chain tracking', async ({ page }) => {
  // Test direct access (no redirects)
  await page.goto('http://localhost:3000/redirect-chain')
  await expect(page.locator('#no-redirects')).toBeVisible()
  
  // Test single redirect
  await page.goto('http://localhost:3000/redirect-to-chain')
  await expect(page.locator('#redirect-chain')).toBeVisible()
  const singleRedirectItems = await page.locator('#redirect-chain li').count()
  expect(singleRedirectItems).toBe(1)
  
  // Test double redirect
  await page.goto('http://localhost:3000/redirect-to-redirect-to-chain')
  await expect(page.locator('#redirect-chain')).toBeVisible()
  const doubleRedirectItems = await page.locator('#redirect-chain li').count()
  expect(doubleRedirectItems).toBe(2)
  
  // Verify the redirect chain order
  const firstRedirect = await page.locator('#redirect-chain li').first().textContent()
  const secondRedirect = await page.locator('#redirect-chain li').last().textContent()
  expect(firstRedirect).toBe('/redirect-to-redirect-to-chain')
  expect(secondRedirect).toBe('/redirect-to-chain')
})
