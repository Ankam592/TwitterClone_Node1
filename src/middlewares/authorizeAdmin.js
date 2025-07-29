import jwt from 'jsonwebtoken'
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret key

// Middleware to check if user is authenticated and has the 'admin' role
// this middleware is called when a user is trying to open profiles
const authorizeAdmin = (req, res, next) => {
    const token = req.cookies.token; // Get the JWT token from the cookie

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token,'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTQ4NTE5MSwiaWF0IjoxNzI1NDg1MTkxfQ.1PC4lxzqGzLlYYEhmDuprB8kCJhuVadBeAiyLgin354');

        // Check if the user's role is 'admin'
        if (decoded.role == 'user') {
            return res.status(403).send('Access denied. Admins and Editors only.');
        }

        // If the user is an admin, allow the request to continue
        req.user = decoded; // Attach the decoded token (user info) to the request
        next();
    } catch (err) {
        return res.status(400).send('Invalid token.');
    }
};




export {authorizeAdmin};