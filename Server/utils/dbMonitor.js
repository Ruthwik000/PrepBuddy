import mongoose from 'mongoose';

export const getConnectionStats = () => {
  const connection = mongoose.connection;
  
  return {
    readyState: connection.readyState,
    host: connection.host,
    port: connection.port,
    name: connection.name,
    // Get connection pool stats if available
    poolSize: connection.db?.serverConfig?.poolSize || 'N/A',
    activeConnections: connection.db?.serverConfig?.connections?.length || 'N/A'
  };
};

export const logConnectionStats = () => {
  const stats = getConnectionStats();
  console.log('📊 DB Connection Stats:', stats);
};

// Optional: Set up periodic monitoring
export const startConnectionMonitoring = (intervalMs = 60000) => {
  setInterval(() => {
    logConnectionStats();
  }, intervalMs);
};
