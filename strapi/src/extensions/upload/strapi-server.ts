export default (plugin) => {
  // Override the upload routes to use custom authentication policies
  plugin.routes['content-api'].routes = plugin.routes['content-api'].routes.map((route) => {
    // Main upload endpoint - POST /api/upload
    if (route.method === 'POST' && route.path === '/') {
      return {
        ...route,
        config: {
          ...route.config,
          auth: false,
          policies: [
            // Only content creators can upload
            'global::is-content-creator',
          ],
        },
      };
    }

    // Upload to specific entry - POST /api/upload?id=:id
    if (route.method === 'POST' && route.path === '/id/:id') {
      return {
        ...route,
        config: {
          ...route.config,
          auth: false,
          policies: ['global::is-content-creator'],
        },
      };
    }

    // Get file info - GET /api/upload/files/:id
    if (route.method === 'GET' && route.path === '/files/:id') {
      return {
        ...route,
        config: {
          ...route.config,
          auth: false,
          policies: ['global::is-student-or-content-creator'],
        },
      };
    }

    // Get all files - GET /api/upload/files
    if (route.method === 'GET' && route.path === '/files') {
      return {
        ...route,
        config: {
          ...route.config,
          auth: false,
          policies: ['global::is-student-or-content-creator'],
        },
      };
    }

    // Delete file - DELETE /api/upload/files/:id
    if (route.method === 'DELETE' && route.path === '/files/:id') {
      return {
        ...route,
        config: {
          ...route.config,
          auth: false,
          policies: ['global::is-content-creator'],
        },
      };
    }

    // Return unmodified route for any other endpoints
    return route;
  });

  return plugin;
};

