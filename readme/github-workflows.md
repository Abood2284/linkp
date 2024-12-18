# Project Deployment Workflows Documentation

## Overview
This project uses three GitHub Actions workflows to manage deployments:
1. Preview Deployment (on Pull Requests)
2. Production Deployment (on Main Branch Push)
3. Preview Cleanup (when Pull Request is closed)

## Workflow Execution Order
1. `deploy-preview.yml` - Runs when a Pull Request is created
2. `deploy-production.yml` - Runs when changes are pushed to the main branch
3. `cleanup-preview.yml` - Runs when a Pull Request is closed

## 1. Preview Deployment Workflow (`deploy-previre.yml`)

### Trigger
- Activated on every Pull Request

### Key Steps:
1. **Setup and Dependencies**
   - Checks out repository
   - Sets up pnpm
   - Installs project dependencies

2. **Database Preparation**
   - Creates a new Neon database branch for the PR
   - Runs database migrations on the new branch

3. **Project Build**
   - Builds the NextJS website with Cloudflare Pages configuration
   - Sets Cloudflare Pages environment variables

4. **Deployment**
   - Deploys NextJS frontend to Cloudflare Pages
   - Deploys Worker to Cloudflare Workers (staging environment)
   - Sets database URL and CORS origins for the preview deployment

5. **PR Notification**
   - Comments on the Pull Request with deployment details

### Important Secrets Used:
- `NEON_API_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEON_PROJECT_ID`
- `GH_TOKEN`

## 2. Production Deployment Workflow (`deploy-production.yml`)

### Trigger
- Activated when changes are pushed to the `main` branch

### Key Steps:
1. **Setup and Dependencies**
   - Checks out repository
   - Sets up pnpm
   - Installs project dependencies

2. **Database Migration**
   - Runs database migrations using production DATABASE_URL

3. **Project Build**
   - Builds NextJS website with production configuration

4. **Deployment**
   - Deploys NextJS frontend to Cloudflare Pages
   - Deploys Worker to Cloudflare Workers (production environment)
   - Sets production DATABASE_URL as a secret

5. **Deployment Logging**
   - Outputs deployment success message with URLs

### Important Secrets Used:
- `DATABASE_URL`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `GH_TOKEN`

## 3. Preview Cleanup Workflow (`cleanup-preview.yml`)

### Trigger
- Activated when a Pull Request is closed

### Key Steps:
1. **Worker Cleanup**
   - Deletes the staging worker deployment

2. **Database Branch Cleanup**
   - Deletes the Neon database branch created for the PR

3. **Verification**
   - Logs cleanup summary

### Important Secrets Used:
- `NEON_API_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEON_PROJECT_ID`

## 🚨 Development Considerations and TODOs

### Secrets Management
- **Critical TODO**: When changing `DATABASE_URL`:
  1. Update in GitHub Secrets for both preview and production workflows
  2. Update in local `.env` files
  3. Ensure the new database connection string is valid
  4. Test migrations with the new database URL

### Database Workflow Tips
- Always run migrations before deployment
- Verify database branch creation in Neon console
- Check migration logs for any potential issues

### Deployment Best Practices
- Always test preview deployments thoroughly before merging
- Verify CORS settings for preview and production environments
- Monitor Cloudflare deployment logs for any issues

### Performance and Cost Optimization
- Consider implementing deployment caching
- Monitor Cloudflare Pages and Workers usage
- Optimize build and deployment scripts

## Potential Improvements
1. Add more comprehensive error handling
2. Implement automated testing in workflows
3. Create a staging environment workflow
4. Add deployment rollback mechanism

## Troubleshooting
- If preview deployment fails, check:
  1. Database migration logs
  2. Build output
  3. Cloudflare deployment logs
- Verify all required secrets are correctly set

## Contact and Support
For workflow-related issues, contact the DevOps or infrastructure team.

---

**Last Updated**: December 18, 2024
**Version**: 1.0.0