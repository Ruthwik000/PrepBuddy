# MongoDB Connection Pooling Setup

## Overview
This document describes the MongoDB connection pooling implementation for PrepBuddy's backend server.

## Features Implemented

### ✅ Connection Pooling Configuration
- **Max Pool Size**: 20 connections
- **Min Pool Size**: 5 connections  
- **Idle Timeout**: 30 seconds
- **Server Selection Timeout**: 5 seconds
- **Socket Timeout**: 45 seconds

### ✅ Performance Optimizations
- **Retry Writes/Reads**: Enabled for resilience
- **Write Concern**: Majority for data consistency
- **Read Preference**: Primary preferred for performance
- **Compression**: Zlib enabled
- **Buffer Commands**: Disabled for immediate execution

### ✅ Monitoring & Health Checks
- **Health Endpoint**: `/health` for connection status
- **Connection Events**: Real-time monitoring
- **Graceful Shutdown**: Proper connection cleanup
- **Connection Stats**: Detailed pool information

## File Structure

```
Server/
├── config/
│   └── database.js          # Enhanced connection module
├── utils/
│   └── dbMonitor.js         # Connection monitoring utilities
├── test/
│   └── connectionTest.js    # Connection testing utility
├── app.js                   # Updated main server file
└── DATABASE_SETUP.md        # This documentation
```

## Usage

### Starting the Server
```bash
npm run dev          # Development mode with nodemon
npm start           # Production mode
```

### Testing Database Connection
```bash
npm run test:db     # Test database connectivity
```

### Health Check
```bash
curl http://localhost:3000/health
```

Expected Response:
```json
{
  "status": "OK",
  "database": "connected",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Environment Variables

Ensure your `.env` file contains:
```env
MONGO_URI=mongodb://localhost:27017/prepbuddy
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prepbuddy?retryWrites=true&w=majority
PORT=3000
```

## Performance Benefits

- 🚀 **Faster Response Times**: No connection overhead per request
- 📉 **Reduced Memory Usage**: Efficient connection reuse
- 🔧 **Better Resource Utilization**: Optimized pool management
- 📈 **Higher Concurrent Capacity**: Handles more simultaneous users
- 🛡️ **Connection Limit Protection**: Prevents exhaustion

## Monitoring

### Connection Events
The system logs these events automatically:
- `connected`: When MongoDB connection is established
- `error`: When connection errors occur
- `disconnected`: When connection is lost

### Pool Statistics
Use the monitoring utilities to track:
- Active connections
- Pool size
- Connection state
- Performance metrics

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check network connectivity
   - Verify MongoDB server is running
   - Review `serverSelectionTimeoutMS` setting

2. **Pool Exhaustion**
   - Monitor connection usage
   - Consider increasing `maxPoolSize`
   - Check for connection leaks

3. **Performance Issues**
   - Review `maxIdleTimeMS` setting
   - Monitor query performance
   - Check index usage

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG=mongoose:*
```

## Migration Notes

### From Old Setup
- ✅ Single connection point at startup
- ✅ Removed duplicate `mongoose.connect()` calls
- ✅ Enhanced error handling
- ✅ Added graceful shutdown
- ✅ Implemented health monitoring

### Breaking Changes
- None - all existing functionality preserved
- Enhanced performance and reliability
- Better error reporting and monitoring

## Best Practices

1. **Never create connections in route handlers**
2. **Use the existing connection in models**
3. **Monitor connection events**
4. **Implement proper error handling**
5. **Test connection resilience**
6. **Use health checks in production**

## Support

For issues or questions:
1. Check the health endpoint
2. Review server logs
3. Run connection tests
4. Monitor pool statistics
