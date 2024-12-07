
# Front End <!-- Front End -->
    ### Admin <!-- ADMIN -->
    [x] Schema Generated for MVP
    [x] Neon as Postgres DB
    [x] Drizzle Connected as ORM
    [x] Add Infer Types in Shcema
    [] create a `template.md` to help you understand how template works.
[x] User Auth pages created
[x] Create a template (`components/template/modern-yellow`) - TEST
[x] Create a hook to get the current user from DB `hooks/use-user.ts`
[x] Call proper API in `select-template/page.tsx` <- creating workspace
[x] Setup template-preview: so when a new tempalte is created, a developer could view that tempalte with dummy data on a rotue /dev/testing/preview/[tempalte-name]
[] Setup the application flow and upload data to the Db inside `select-template`
[] Redirect the user to his created template on his own Page `linkp.co/workspace-slug`




# Back End <!-- Back End -->
[x] User is created in the DB after signup
[x] Create user API Rotue
[x] Create Workspace API Route
[x] Create /create route to create Workspace

# Middleware <!-- Middleware -->
[] Create a middleware
[] Block Access to all `/onboarding` routes with no auth
[] Create public routes `/`, `public/template/*`, `article/help/*`



# Remember <!-- Remember -->
[] we are not using the `onboarding/link` page at the moment in the flow
[] current flow `onboarding/welcome` -> `onboarding/workspace` -> `onboarding/select-template` -> CALL THE API ----> SEND USER TO THEIR LINK IN BIO PAGE