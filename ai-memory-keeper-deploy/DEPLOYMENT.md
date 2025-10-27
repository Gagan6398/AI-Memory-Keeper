# Deployment Guide

This guide covers deploying the AI Voice Receptionist to various platforms.

## Table of Contents
- [Vercel (Frontend) + Render (Backend)](#vercel--render)
- [Heroku (Full Stack)](#heroku)
- [Docker Deployment](#docker)
- [AWS Deployment](#aws)
- [Local Production](#local-production)

---

## Vercel + Render

This is the recommended deployment method for this project.

### Frontend (Vercel)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_BASE_URL`: Your backend URL (add after backend deployment)
   - Click "Deploy"

3. **Update API URL**
   - After backend is deployed, update `VITE_API_BASE_URL` in Vercel settings
   - Redeploy

### Backend (Render)

1. **Create render.yaml** (already included in project)

2. **Deploy to Render**
   - Go to https://render.com
   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and configure automatically
   - Add Environment Variable:
     - `OPENAI_API_KEY`: Your OpenAI API key
   - Click "Apply"

3. **Get Backend URL**
   - Copy your backend URL (e.g., `https://your-app.onrender.com`)
   - Update Vercel environment variable `VITE_API_BASE_URL`

---

## Heroku

### Prerequisites
- Heroku CLI installed
- Heroku account

### Backend Deployment

1. **Create Procfile**
   ```bash
   cd backend
   echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
   ```

2. **Create runtime.txt**
   ```bash
   echo "python-3.11.0" > runtime.txt
   ```

3. **Deploy**
   ```bash
   heroku create your-app-name-backend
   heroku config:set OPENAI_API_KEY=your_api_key
   git subtree push --prefix backend heroku main
   ```

### Frontend Deployment

1. **Update API URL**
   ```bash
   cd frontend
   # Update .env with your Heroku backend URL
   echo "VITE_API_BASE_URL=https://your-app-name-backend.herokuapp.com" > .env.production
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel or Netlify** (recommended for static sites)

---

## Docker

### Docker Compose (Full Stack)

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - OPENAI_API_KEY=${OPENAI_API_KEY}
       restart: unless-stopped
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       environment:
         - VITE_API_BASE_URL=http://localhost:8000
       depends_on:
         - backend
       restart: unless-stopped
   ```

2. **Create Backend Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 8000
   
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Create Frontend Dockerfile**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as build
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   
   EXPOSE 80
   
   CMD ["nginx", "-g", "daemon off;"]
   ```

4. **Create nginx.conf**
   ```nginx
   # frontend/nginx.conf
   server {
       listen 80;
       server_name localhost;
       
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://backend:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Run**
   ```bash
   docker-compose up -d
   ```

---

## AWS

### AWS Elastic Beanstalk (Backend)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   cd backend
   eb init -p python-3.11 your-app-name
   ```

3. **Create environment**
   ```bash
   eb create your-env-name
   eb setenv OPENAI_API_KEY=your_api_key
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### AWS S3 + CloudFront (Frontend)

1. **Build**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Configure S3 for static hosting**
   - Enable static website hosting
   - Set index.html as index document

4. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Configure custom domain (optional)

---

## Local Production

### Using Production Builds Locally

1. **Backend**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   npm install -g serve
   serve -s dist -l 3000
   ```

3. **Access**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

---

## Environment Variables

### Backend
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Port to run on (default: 8000)

### Frontend
- `VITE_API_BASE_URL`: Backend API URL (required)

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (Nginx)

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Get Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

---

## Monitoring & Logging

### Backend Logging

Add to `main.py`:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

### Error Tracking

Consider integrating:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Full monitoring

---

## Performance Optimization

### Backend
- Use Gunicorn with multiple workers
- Enable response caching
- Implement rate limiting
- Use CDN for static assets

### Frontend
- Enable gzip compression
- Optimize images
- Use lazy loading
- Implement service workers

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] API keys in environment variables (not code)
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies regularly updated
- [ ] Security headers configured

---

## Troubleshooting

### CORS Issues
Add to backend `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### WebSocket Issues
Ensure your hosting platform supports WebSocket connections.

### Large Audio Files
Consider implementing:
- File size limits
- Chunked uploads
- Compression

---

## Cost Estimation

### Hosting Costs (Monthly)
- **Vercel (Frontend)**: Free tier available
- **Render (Backend)**: $7+ (Starter plan)
- **Heroku**: $7+ (Hobby plan)
- **AWS**: Variable, ~$10-50
- **Docker/VPS**: $5-20 (DigitalOcean, Linode)

### API Costs
See FEATURES.md for OpenAI API cost estimates.

---

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Verify environment variables
4. Test API endpoints directly
5. Check CORS configuration

---

**Happy Deploying! 🚀**
