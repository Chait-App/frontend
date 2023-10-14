module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: 'http://localhost:3000',
      },
    ]
  },
  experimental: {
    // Remove or modify the appDir property if present
    appDocumentPreloading: true, // An example of an allowed property
    adjustFontFallbacks: true, // Another example of an allowed property
    // ... other allowed properties
  },
  // ... other configuration options
};