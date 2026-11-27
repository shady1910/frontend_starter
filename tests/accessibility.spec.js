import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function expectNoViolations(page) {
  const { violations } = await new AxeBuilder({ page })
    .options({
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      rules: { 'target-size': { enabled: true } },
    })
    .analyze();

  const details = violations.map(
    ({ id, impact, help, helpUrl, nodes }) =>
      `${id} (${impact}): ${help} (${helpUrl})\n` +
      nodes
        .map(
          ({ target, html, failureSummary }) => `${target.join(' > ')}\n${html}\n${failureSummary}`,
        )
        .join('\n'),
  );
  expect(details, details.join('\n\n')).toEqual([]);
}

test('Startseite erfüllt die automatisiert prüfbaren axe-Regeln', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoViolations(page);
});

test('Skip-Link setzt den Tastaturfokus auf den Hauptinhalt', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Zum Inhalt springen' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('Mobiles Menü lässt sich mit der Tastatur bedienen', async ({ isMobile, page }) => {
  test.skip(!isMobile, 'Diese Interaktion wird im mobilen Viewport geprüft.');
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Menü' });
  const link = page.getByRole('link', { name: 'Konzept' });

  for (let step = 0; step < 3; step += 1) await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(link).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expectNoViolations(page);
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(link).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#konzept$/);
  await expect(page.getByRole('region', { name: 'Schlank im Aufbau.' })).toBeFocused();
  await expect(link).toBeHidden();
});

test.describe('Ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('Direktlinks und Inhalt bleiben erreichbar', async ({ page }) => {
    await page.goto('/');
    const navigation = page.getByRole('navigation', { name: 'Hauptnavigation' });
    await expect(navigation.getByRole('button')).toBeHidden();
    await expect(navigation.getByRole('link', { name: 'Bausteine' })).toBeVisible();
    await navigation.getByRole('link', { name: 'Bausteine' }).click();
    await expect(page).toHaveURL(/#bausteine$/);
  });
});
