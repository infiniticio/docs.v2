import { Head, Html, Main, NextScript } from 'next/document'

const themeScript = `
  let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

  function updateTheme(theme) {
    theme = theme ?? window.localStorage.theme ?? 'system'

    if (theme === 'dark' || (theme === 'system' && isDarkMode.matches)) {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light' || (theme === 'system' && !isDarkMode.matches)) {
      document.documentElement.classList.remove('dark')
    }

    return theme
  }

  function updateThemeWithoutTransitions(theme) {
    updateTheme(theme)
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  document.documentElement.setAttribute('data-theme', updateTheme())

  new MutationObserver(([{ oldValue }]) => {
    let newValue = document.documentElement.getAttribute('data-theme')
    if (newValue !== oldValue) {
      try {
        window.localStorage.setItem('theme', newValue)
      } catch {}
      updateThemeWithoutTransitions(newValue)
    }
  }).observe(document.documentElement, { attributeFilter: ['data-theme'], attributeOldValue: true })

  isDarkMode.addEventListener('change', () => updateThemeWithoutTransitions())
`

const codeScript = `
  function updateCode(code) {
    return code ?? window.localStorage.code ?? 'java'
  }

  new MutationObserver(([{ oldValue }]) => {
    let newValue = document.documentElement.getAttribute('data-code')
    if (newValue !== oldValue) {
      try {
        window.localStorage.setItem('code', newValue)
        // display this language
        document.querySelectorAll('[data-language-code='+newValue+']').forEach((el) => { el.removeAttribute('hidden') })
        // hide all others
        document.querySelectorAll('[data-language-code]:not([data-language-code='+newValue+'])').forEach((el) => { el.setAttribute('hidden', true) })
      } catch {}
      updateCode(newValue)
    }
  }).observe(document.documentElement, { attributeFilter: ['data-code'], attributeOldValue: true })

  document.documentElement.setAttribute('data-code', updateCode())
`

export default function Document() {
  return (
    <Html className="antialiased [font-feature-settings:'ss01']" lang="en">
      <Head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script dangerouslySetInnerHTML={{ __html: codeScript }} />
      </Head>
      <body className="bg-white dark:bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-800 prose-code:font-thin prose-code:bg-slate-50 dark:prose-code:border-slate-900 prose-code:border-slate-300 prose-code:rounded prose-code:p-1 prose-code:border  