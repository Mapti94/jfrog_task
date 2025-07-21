const _ = require('lodash');
const moment = require('moment');
const validator = require('validator');

/**
 * Format user data for API responses
 * Uses safe lodash version patterns
 */
function formatUserData(user) {
  return _.pick(user, ['id', 'username', 'email', 'createdAt', 'updatedAt']);
}

/**
 * Validate request body contains required fields
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 */
function validateRequest(body, requiredFields) {
  if (!_.isObject(body)) {
    return false;
  }
  
  return _.every(requiredFields, field => {
    return _.has(body, field) && !_.isEmpty(_.toString(body[field]));
  });
}

/**
 * Generate a random user for testing
 * Demonstrates various lodash utilities
 */
function generateRandomUser() {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica', 'Ryan', 'Ashley'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['example.com', 'test.org', 'sample.net', 'demo.co'];
  
  const firstName = _.sample(firstNames);
  const lastName = _.sample(lastNames);
  const username = _.toLower(`${firstName}${lastName}${_.random(100, 999)}`);
  const email = `${username}@${_.sample(domains)}`;
  
  return {
    username,
    email,
    createdAt: moment().subtract(_.random(1, 100), 'days').toISOString(),
    profile: {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      joinDate: moment().subtract(_.random(1, 365), 'days').format('YYYY-MM-DD')
    }
  };
}

/**
 * Sanitize user input (basic implementation)
 * Uses safe validator patterns
 */
function sanitizeInput(input) {
  if (!_.isString(input)) {
    return '';
  }
  
  // Basic sanitization - in reality this should be more comprehensive
  return _.trim(input).replace(/[<>]/g, '');
}

/**
 * Check if string is a valid username
 * @param {string} username 
 */
function isValidUsername(username) {
  if (!_.isString(username)) {
    return false;
  }
  
  // Basic validation using lodash
  return username.length >= 3 && 
         username.length <= 20 && 
         /^[a-zA-Z0-9_]+$/.test(username);
}

/**
 * Deep clone object using safe alternative
 * Prevents prototype pollution
 */
function deepCloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge user data with defaults
 * Uses safe merge (prototype pollution resistant)
 */
function mergeUserDefaults(userData) {
  const defaults = {
    role: 'user',
    active: true,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    },
    metadata: {
      lastLogin: null,
      loginCount: 0,
      createdBy: 'system'
    }
  };
  
  // Safe shallow merge with field whitelisting
  return {
    ...defaults,
    ...(_.pick(userData, ['role', 'active'])),
    preferences: {
      ...defaults.preferences,
      ...(_.pick(userData.preferences || {}, ['theme', 'notifications', 'language']))
    },
    metadata: {
      ...defaults.metadata,
      ...(_.pick(userData.metadata || {}, ['lastLogin', 'loginCount', 'createdBy']))
    }
  };
}

/**
 * Get user statistics using various lodash methods
 */
function getUserStats(users) {
  if (!_.isArray(users)) {
    return null;
  }
  
  const now = moment();
  const activeUsers = _.filter(users, user => {
    const lastActive = moment(user.updatedAt || user.createdAt);
    return now.diff(lastActive, 'days') <= 30;
  });
  
  return {
    total: users.length,
    active: activeUsers.length,
    inactive: users.length - activeUsers.length,
    newest: _.maxBy(users, user => moment(user.createdAt).unix()),
    oldest: _.minBy(users, user => moment(user.createdAt).unix()),
    byDomain: _.countBy(users, user => {
      const email = user.email || '';
      return email.includes('@') ? email.split('@')[1] : 'unknown';
    })
  };
}

/**
 * Process external API data
 * Demonstrates safe data processing (prototype pollution resistant)
 */
function processExternalData(data) {
  if (!_.isArray(data)) {
    return [];
  }
  
  return _.map(data, item => {
    const safeItem = _.pick(item, ['id', 'name', 'email', 'metadata']);
    const metadata = _.pick(safeItem.metadata || {}, ['lastLogin', 'loginCount', 'createdBy']);
    
    return {
      id: safeItem.id,
      name: safeItem.name,
      email: safeItem.email,
      processedAt: moment().toISOString(),
      metadata
    };
  });
}

module.exports = {
  formatUserData,
  validateRequest,
  generateRandomUser,
  sanitizeInput,
  isValidUsername,
  deepCloneObject,
  mergeUserDefaults,
  getUserStats,
  processExternalData
};
