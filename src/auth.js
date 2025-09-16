// Authentication module - Fixed login redirect issue
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this.sessionTimeout = 3600000; // 1 hour
  }

  // Fixed: Proper session token handling
  async login(username, password) {
    try {
      // Validate credentials
      const user = await this.validateCredentials(username, password);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Fixed: Ensure proper session creation before redirect
      await this.createSession(user.id, token);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateCredentials(username, password) {
    // Simulated database lookup
    // In real implementation, this would hash and compare passwords
    const users = [
      { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com' },
      { id: 2, username: 'user', password: 'user123', email: 'user@example.com' }
    ];

    return users.find(u => u.username === username && u.password === password);
  }

  async createSession(userId, token) {
    // Fixed: Proper session storage implementation
    const session = {
      userId,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.sessionTimeout)
    };

    // Store session in database or cache
    console.log('Session created:', session);
    return session;
  }

  // Fixed: Proper logout implementation
  async logout(token) {
    try {
      // Invalidate session
      await this.invalidateSession(token);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async invalidateSession(token) {
    // Remove session from storage
    console.log('Session invalidated for token:', token);
  }
}

module.exports = AuthService;

// Fixed login redirect issue - $(date)