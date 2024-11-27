import { DM_Sans, Nunito_Sans } from "next/font/google";
import localFont from 'next/font/local'

export const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--nunito-sans-font'
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--dm-sans-font'
})

export const newKansas = localFont({
  src: [
     {
      path: './New Kansas Light.otf',
      weight: '300',
      style: 'normal',
    },
     {
      path: './New Kansas Regular.otf',
      weight: '400',
      style: 'normal',
    },
     {
      path: './New Kansas Bold.otf',
      weight: '700',
      style: 'normal',
    },
     {
      path: './New Kansas Medium.otf',
      weight: '500',
      style: 'normal',
    },
   ],
  display: 'swap',
  variable: '--new-Kansas-font'

})
