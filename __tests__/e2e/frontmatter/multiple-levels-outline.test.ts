describe('outline', () => {
  beforeAll(async () => {
    await goto('/frontmatter/multiple-levels-outline')
  })

  test('set outline to deep', async () => {
    const outlineLinksLocator = page.locator('.VPDocAsideOutline .outline-link')

    const outlineLinksContent = await outlineLinksLocator.allTextContents()
    expect(outlineLinksContent).toEqual([
      'h2 - 1',
      'h3 - 1',
      'h4 - 1',
      'h3 - 2',
      'h4 - 2',
      'h2 - 2',
      'h3 - 3',
      'h4 - 3'
    ])

    const linkHrefs = await outlineLinksLocator.evaluateAll((element) =>
      element.map((element) => element.getAttribute('href'))
    )

    expect(linkHrefs).toEqual([
      '#h2-1',
      '#h3-1',
      '#h4-1',
      '#h3-2',
      '#h4-2',
      '#h2-2',
      '#h3-3',
      '#h4-3'
    ])
  })

  test.each([375, 1187])(
    'closes the local outline after clicking heading text at %ipx',
    async (width) => {
      await page.setViewportSize({ width, height: 883 })
      await goto('/frontmatter/multiple-levels-outline')
      const dropdown = page.locator('.VPLocalNavOutlineDropdown')
      await dropdown.locator('button').click()
      await dropdown.locator('a[href="#h2-2"] bdi').click()
      await page.waitForURL('**#h2-2')
      await page.waitForSelector('.VPLocalNavOutlineDropdown .items', {
        state: 'detached'
      })
      expect(
        await dropdown.locator('button').getAttribute('aria-expanded')
      ).toBe('false')
      await page.setViewportSize({ width: 1280, height: 720 })
    }
  )
})
