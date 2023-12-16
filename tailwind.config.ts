import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: ({ theme }: any) => ({
        sky: {
          css: {
            '--tw-prose-bold': theme('colors.sky[50]'),
            '--tw-prose-counters': theme('colors.white'),
            '--tw-prose-bullets': theme('colors.sky[400]'),
            '--tw-prose-hr': theme('colors.sky[300]'),
            '--tw-prose-quotes': theme('colors.sky[900]'),
            '--tw-prose-quote-borders': theme('colors.sky[300]'),
            '--tw-prose-captions': theme('colors.sky[700]'),
            '--tw-prose-code': theme('colors.sky[900]'),
            '--tw-prose-pre-code': theme('colors.sky[100]'),
            //'--tw-prose-pre-bg': theme('colors.sky[900]'),
            '--tw-prose-th-borders': theme('colors.sky[300]'),
            '--tw-prose-td-borders': theme('colors.sky[200]'),
            '--tw-prose-invert-body': theme('colors.sky[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.sky[300]'),
            '--tw-prose-invert-links': theme('colors.white'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.sky[400]'),
            '--tw-prose-invert-bullets': theme('colors.sky[600]'),
            '--tw-prose-invert-hr': theme('colors.sky[700]'),
            '--tw-prose-invert-quotes': theme('colors.sky[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.sky[700]'),
            '--tw-prose-invert-captions': theme('colors.sky[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.sky[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.sky[600]'),
            '--tw-prose-invert-td-borders': theme('colors.sky[700]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
