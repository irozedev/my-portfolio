# Netlify Redirects for SPA routing
# Це забезпечує правильний роутинг для React SPA

# OAuth callback routes - важливо для Google Auth
/auth/callback  /  200
/dashboard      /  200
/profile        /  200

# Catch all - редірект всіх requests на index.html (SPA routing)
/*  /index.html  200
