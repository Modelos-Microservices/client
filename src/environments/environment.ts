export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    keycloak: {
      url: 'http://localhost:8080',
      realm: 'ecommerce',
      clientId: 'angular-client'
    },
    metabase: {
      url: 'http://localhost:3100',
      siteUrl: 'http://localhost:3100',
      token: '615832aa47ebef5bb1604242071472cfe9e4c5b1ec0383d44661606a6e18063c',
      dashboardId: 1, // Replace with your actual dashboard ID
      cardId: 1 // Replace with your actual card ID 
    }
  };
  