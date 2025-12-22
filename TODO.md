# TODO: Update Backend Server for Render Deployment

## Steps to Complete
- [x] Update backend/package.json: Add "type": "module" to enable ES6 imports
- [x] Refactor backend/server.js: Convert all require statements to ES6 import statements
- [x] Configure CORS in backend/server.js: Move CORS middleware after app = express(), set origin to "https://rrepo-vu83.vercel.app", remove credentials
- [x] Update port configuration in backend/server.js: Change default port to 3000, move app.listen to the end
- [x] Adjust database connection in backend/server.js: Modify startServer to only handle DB connection
- [x] Update exports in backend/server.js: Change from module.exports to ES6 export
- [x] Update route and model imports in backend/server.js: Convert remaining require statements to import
- [x] Convert route files to ES6 modules (auth.js, auth-producteur.js, etc.) to fully support ES6 - Partially done, but requires model files conversion too
