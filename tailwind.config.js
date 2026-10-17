/** Same theme the page used with the Play CDN; build with `npm run build:css`. */
module.exports = {
  content: ['./index.html', './app.js', './site-fx.js'],
  // class names stored in the saved cloud data (reviewsHeader.commitments icon, navMenu.subItemFeedIcon); the scanner cannot see them
  safelist: ['text-[#1877F2]'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zen: {
          bg: '#F5F8FD',
          surface: '#FFFFFF',
          cardborder: '#E2EAF5',
          dark: '#0B2545',
          forest: '#12306B',
          torii: '#2563EB',
          toriidark: '#1D4ED8',
          sand: '#EAF1FB',
          sanddark: '#D6E3F6',
          muted: '#5F7089',
          line: '#067A36',
          linehover: '#056B30'
        }
      },
      fontFamily: {
        sans: ['Prompt', '"Sukhumvit Set"', 'sans-serif'],
        serif: ['Prompt', '"Sukhumvit Set"', 'sans-serif']
      }
    }
  }
};
