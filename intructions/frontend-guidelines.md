# Design Principles
- Strictly follow minimal desing principles
- Every page should have easy navigation and routing
- Clean UI/UX with white space principles to make the design clean

# Fonts
- Only use custom added fonts in `public/assets/fonts.ts`
- DM Sans - for paragraph
- Nunito Sans - For H2, H3 ... and so on
- New Kansas - Headings, Titles

# Frontend
- Only the UI/UX exists here 
- Authentication is done by Next-auth / Auth.js
- All the heavy lifting and Database calls is handled by the backend
- use SWR or Nextjs 15 in-built features to manage state, cachde and data fetching from backend.