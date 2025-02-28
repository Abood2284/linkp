
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
[x] Setup the application flow and upload data to the Db inside `select-template`
[x] after `select-template` this page should be redirected to dashboard.
[x] Learn about SWR
[x] add SWR to get current workspace `useWorkspace` at `lib/swr/use-workspace.ts`


# Dashboard
[] Dashboard should be on `/dashboard/[workspae-slug]`
[] `/dashboard` will get user from session and workspace-slug will be the session users workspace
[] `/dashboard/testting-4` only validates if current session user has this workspace name


[] Make sure user adds his links, and on top you show the preview URL of their workspace
[] Redirect the user to his created template on his own Page `linkp.co/workspace-slug` New Tab



# Back End <!-- Back End -->
[x] User is created in the DB after signup
[x] Create user API Rotue
[x] Create Workspace API Route
[x] Create /create route to create Workspace

# Middleware <!-- Middleware -->
[x] Create a middleware
[x] Block Access to all `/creator` routes with no auth
[x] Create public routes `/`, `public/template/*`, `article/help/*`


# Creator <!-- Creator -->
[x] Onboarding Complete
[] Make onboarding Faster, currently you are waiting for the API's to return status 200. then only you proceed to next page, Instead.... Validate the Data inputted in Form on client Side - If you validated, call the API and navigate the user to next screen...if the data is validated, it very unlikely that API will fail to upload that data ( trust your API ) or you can implement retry logic in your API... if the data fails to be inserted it must because of some error in the backend, since the data passed from frontend is clean... so just make sure you keep retrying after every 5 second in case of fail.
[] Time to add the links you add to your selected Template for that workspace ( @app/(public)/[workspace]/page.tsx)
[] 


# Remember <!-- Remember -->
[] we are not using the `onboarding/link` page at the moment in the flow
[] current flow `onboarding/welcome` -> `onboarding/workspace` -> `onboarding/select-template` -> CALL THE API ----> SEND USER TO THEIR LINK IN BIO PAGE