# Vercel Deployment Commands Reference
*Quick reference for deploying with Claude Code*

## 🚀 **Quick Start Commands**

### **Set Your Vercel Token (Required First)**
```bash
# Set environment variable
export VERCEL_TOKEN="your_vercel_api_token_here"

# Add to bash profile for persistence
echo 'export VERCEL_TOKEN="your_vercel_token"' >> ~/.bashrc
source ~/.bashrc

# Test authentication
vercel whoami --token $VERCEL_TOKEN
```

## 📦 **Basic Deployment Commands**

### **Deploy Current Directory**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# With token (if not set as env var)
vercel --prod --token your_token
```

### **Deploy Specific Directory**
```bash
# Deploy a specific project folder
vercel /path/to/project --prod

# Deploy with custom name
vercel --prod --name my-awesome-app
```

## 🎯 **Framework-Specific Deployments**

### **Static Sites (HTML/CSS/JS)**
```bash
# Simple static site
vercel --prod

# Static site with custom config
vercel --prod --framework static
```

### **React Applications**
```bash
# Create React App (auto-detected)
vercel --prod

# Custom React build
vercel build --prod --framework react
```

### **Next.js Applications**
```bash
# Next.js (auto-detected)
vercel --prod

# With environment variables
vercel --prod --env DATABASE_URL=your_db_url --env API_KEY=your_key
```

### **Vue.js Applications**
```bash
# Vue CLI project
vercel --prod --framework vue

# Nuxt.js (auto-detected)
vercel --prod
```

## 🔧 **Advanced Deployment Options**

### **Environment Variables**
```bash
# Runtime environment variables
vercel --prod --env NODE_ENV=production --env API_URL=https://api.example.com

# Build-time environment variables
vercel --prod --build-env NODE_ENV=production --build-env BUILD_MODE=static

# Multiple environment variables
vercel --prod \
  --env DATABASE_URL=$DATABASE_URL \
  --env API_KEY=$API_KEY \
  --build-env NODE_ENV=production
```

### **Custom Domains & Aliases**
```bash
# Deploy with alias
vercel --prod --alias mydomain.com

# Set alias after deployment
vercel alias https://my-deployment-url.vercel.app mydomain.com

# Multiple aliases
vercel alias DEPLOYMENT_URL www.mydomain.com
vercel alias DEPLOYMENT_URL mydomain.com
```

### **Pre-built Deployments**
```bash
# Deploy already built project
vercel --prebuilt --prod

# Deploy specific build output
vercel dist --prod --prebuilt
vercel build --prod --prebuilt
```

## 📊 **Management Commands**

### **List Deployments**
```bash
# List recent deployments
vercel ls

# List deployments as JSON
vercel ls --json

# List specific project deployments
vercel ls my-project
```

### **Deployment Logs**
```bash
# Get deployment logs
vercel logs DEPLOYMENT_URL

# Real-time logs during deployment
vercel --prod --logs
```

### **Deployment Information**
```bash
# Get deployment details
vercel inspect DEPLOYMENT_URL

# Get deployment URL from last deployment
vercel ls --json | jq -r '.deployments[0].url'
```

## 🏗️ **Project Configuration**

### **Create vercel.json**
```bash
# Using helper script
python3 /root/vercel_deploy_helper.py create-config --framework nextjs

# Manual vercel.json for static site
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ]
}
EOF
```

### **Environment Variables Management**
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# Add for specific environment
vercel env add DATABASE_URL production
vercel env add API_URL preview
vercel env add DEBUG_MODE development

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

## 🤖 **Claude Code Helper Commands**

### **Using the Python Helper**
```bash
# Deploy with helper script
python3 /root/vercel_deploy_helper.py deploy --path /path/to/project --prod

# Deploy with environment variables
python3 /root/vercel_deploy_helper.py deploy \
  --path . \
  --prod \
  --env NODE_ENV=production \
  --env API_URL=https://api.example.com

# Deploy with custom framework
python3 /root/vercel_deploy_helper.py deploy \
  --path . \
  --prod \
  --framework nextjs \
  --alias mydomain.com

# List deployments
python3 /root/vercel_deploy_helper.py list

# Get deployment logs
python3 /root/vercel_deploy_helper.py logs --url DEPLOYMENT_URL
```

## 🚦 **Common Deployment Workflows**

### **Static Website Deployment**
```bash
# 1. Navigate to project
cd /path/to/static/site

# 2. Deploy to preview
vercel

# 3. Deploy to production
vercel --prod

# 4. Set custom domain
vercel alias DEPLOYMENT_URL yourdomain.com
```

### **React App Deployment**
```bash
# 1. Build the app (if needed)
npm run build

# 2. Deploy production build
vercel build --prod

# 3. Or let Vercel handle the build
vercel --prod
```

### **Next.js Full Deployment**
```bash
# 1. Deploy with environment variables
vercel --prod \
  --env DATABASE_URL=$DATABASE_URL \
  --env NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# 2. Set up custom domain
vercel alias DEPLOYMENT_URL myapp.com
```

## 🔍 **Troubleshooting Commands**

### **Debug Deployment Issues**
```bash
# Verbose deployment output
vercel --prod --debug

# Check authentication
vercel whoami

# Clear local configuration
rm -rf .vercel

# Re-authenticate
vercel logout
vercel login
```

### **Check Deployment Status**
```bash
# Get deployment status
vercel inspect DEPLOYMENT_URL

# Check recent deployments
vercel ls --limit 5

# Get build logs
vercel logs DEPLOYMENT_URL --follow
```

## 📋 **Quick Reference Examples**

### **Most Common Commands**
```bash
# Deploy to preview
vercel

# Deploy to production  
vercel --prod

# Deploy with custom domain
vercel --prod --alias mydomain.com

# Deploy with env vars
vercel --prod --env API_KEY=abc123

# List deployments
vercel ls

# Get logs
vercel logs URL
```

### **Framework Detection**
- **Next.js**: Auto-detected from `next` dependency
- **React**: Auto-detected from `react-scripts`
- **Vue**: Auto-detected from `vue` dependency
- **Static**: Auto-detected from `index.html`

### **File Structure Examples**
```
Static Site:
├── index.html
├── style.css
└── script.js

React App:
├── package.json
├── public/
└── src/

Next.js App:
├── package.json
├── pages/
└── components/
```

---

**🎯 Ready to deploy! Provide your Vercel API token to start using these commands.**