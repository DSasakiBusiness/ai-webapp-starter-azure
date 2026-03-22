import { test, expect } from '@playwright/test';

test.describe('ヘルスチェック', () => {
  test('トップページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Web App/);
    await expect(page.locator('h1')).toContainText('AI Web App Starter');
  });

  test('チャット入力フォームが表示される', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('#chat-input');
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('空メッセージでは送信ボタンが無効', async ({ page }) => {
    await page.goto('/');
    const sendButton = page.locator('#send-button');
    await expect(sendButton).toBeDisabled();
  });

  test('API ヘルスチェックが正常', async ({ request }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await request.get(`${apiUrl}/api/health`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });
});
