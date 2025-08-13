module.exports = {
  devServer: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN 
        ? {
            hostname: new URL(`https://${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`).hostname,
            pathname: '/ws',
            port: 443,
            protocol: 'wss'
          }
        : {
            hostname: '0.0.0.0',
            pathname: '/ws',
            port: process.env.PORT || 3000
          }
    }
  }
}