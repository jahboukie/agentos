# 🔌 AgentOS API Specification

**Comprehensive API documentation for AI coding agents**

## 🎯 API Design Principles

### 1. AI-Agent-First Design
- **Machine-readable responses** with structured data
- **Predictable schemas** for reliable parsing
- **Rich metadata** for context preservation
- **Batch operations** for efficiency

### 2. RESTful Architecture
- **Resource-based URLs** for intuitive navigation
- **HTTP methods** for semantic operations
- **Status codes** for clear error handling
- **Consistent response formats**

### 3. Real-time Capabilities
- **WebSocket connections** for live updates
- **Server-sent events** for notifications
- **Streaming responses** for large datasets
- **Real-time collaboration** features

## 🏗️ API Architecture

### Base URL Structure
```
Production:  https://api.agentos.dev/v1
Staging:     https://staging-api.agentos.dev/v1
Development: http://localhost:8080/v1
```

### Authentication
```http
Authorization: Bearer <jwt_token>
X-Agent-ID: <agent_identifier>
X-Project-ID: <project_identifier>
```

## 🧠 Memory API

### Store Memory
```http
POST /memory
Content-Type: application/json

{
  "content": "Fixed authentication bug by updating JWT validation logic",
  "context": "authentication",
  "type": "solution",
  "metadata": {
    "projectId": "proj_123",
    "agentId": "agent_456",
    "tags": ["jwt", "auth", "bugfix"],
    "confidence": 0.95,
    "source": "execution_result"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "memoryId": "mem_789",
    "content": "Fixed authentication bug by updating JWT validation logic",
    "context": "authentication",
    "type": "solution",
    "metadata": {
      "projectId": "proj_123",
      "agentId": "agent_456",
      "tags": ["jwt", "auth", "bugfix"],
      "confidence": 0.95,
      "source": "execution_result"
    },
    "created": "2024-01-15T10:30:00Z",
    "relevanceScore": 0.92
  },
  "meta": {
    "processingTime": 45,
    "indexingStatus": "completed"
  }
}
```

### Search Memories
```http
GET /memory/search?q=authentication%20bug&limit=10&context=authentication

{
  "query": "authentication bug",
  "filters": {
    "context": ["authentication", "security"],
    "type": ["solution", "pattern"],
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-15T23:59:59Z"
    },
    "confidence": {
      "min": 0.8
    }
  },
  "sort": {
    "field": "relevanceScore",
    "order": "desc"
  },
  "limit": 10,
  "offset": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "memoryId": "mem_789",
        "content": "Fixed authentication bug by updating JWT validation logic",
        "context": "authentication",
        "type": "solution",
        "relevanceScore": 0.95,
        "matchScore": 0.87,
        "created": "2024-01-15T10:30:00Z",
        "metadata": {
          "tags": ["jwt", "auth", "bugfix"],
          "confidence": 0.95
        }
      }
    ],
    "totalCount": 1,
    "hasMore": false
  },
  "meta": {
    "searchTime": 23,
    "queryAnalysis": {
      "intent": "problem_solution",
      "entities": ["authentication", "bug"],
      "confidence": 0.92
    }
  }
}
```

### Memory Relationships
```http
GET /memory/{memoryId}/relationships

{
  "memoryId": "mem_789",
  "relationshipTypes": ["similar", "related", "prerequisite", "consequence"],
  "maxDepth": 2,
  "includeMetadata": true
}
```

## 🚀 Execution API

### Execute Code
```http
POST /execution/run
Content-Type: application/json

{
  "language": "javascript",
  "code": "console.log('Hello, AgentOS!'); const result = 2 + 2; console.log(result);",
  "environment": {
    "runtime": "node:18",
    "packages": ["lodash", "axios"],
    "timeout": 30,
    "memoryLimit": "512MB"
  },
  "context": {
    "projectId": "proj_123",
    "purpose": "verification",
    "metadata": {
      "suggestion_id": "sugg_456"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "exec_789",
    "status": "completed",
    "result": {
      "stdout": "Hello, AgentOS!\n4\n",
      "stderr": "",
      "exitCode": 0,
      "executionTime": 1.23,
      "memoryUsage": "45MB",
      "cpuUsage": 0.15
    },
    "environment": {
      "runtime": "node:18.17.0",
      "packages": {
        "lodash": "4.17.21",
        "axios": "1.6.0"
      }
    },
    "analysis": {
      "success": true,
      "performance": "excellent",
      "resourceEfficiency": 0.92,
      "securityScore": 1.0
    }
  },
  "meta": {
    "sandboxId": "sandbox_abc",
    "processingTime": 1250,
    "queueTime": 45
  }
}
```

### Verify Code Suggestion
```http
POST /execution/verify
Content-Type: application/json

{
  "suggestion": {
    "code": "function authenticateUser(token) { return jwt.verify(token, process.env.JWT_SECRET); }",
    "language": "javascript",
    "context": "authentication function",
    "purpose": "JWT token validation"
  },
  "testCases": [
    {
      "input": "validToken123",
      "expectedOutput": "decoded_payload",
      "description": "Valid token should decode successfully"
    },
    {
      "input": "invalidToken",
      "expectedOutput": "error",
      "description": "Invalid token should throw error"
    }
  ],
  "environment": {
    "runtime": "node:18",
    "packages": ["jsonwebtoken"],
    "envVars": {
      "JWT_SECRET": "test_secret_key"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verificationId": "verify_789",
    "overallResult": "passed",
    "successProbability": 0.94,
    "testResults": [
      {
        "testCase": 1,
        "status": "passed",
        "executionTime": 0.15,
        "output": "decoded_payload",
        "expected": "decoded_payload",
        "match": true
      },
      {
        "testCase": 2,
        "status": "passed",
        "executionTime": 0.12,
        "output": "JsonWebTokenError: invalid token",
        "expected": "error",
        "match": true
      }
    ],
    "codeAnalysis": {
      "syntaxValid": true,
      "securityScore": 0.95,
      "performanceScore": 0.88,
      "maintainabilityScore": 0.92,
      "issues": []
    },
    "recommendations": [
      {
        "type": "improvement",
        "message": "Consider adding input validation for token parameter",
        "severity": "low",
        "confidence": 0.85
      }
    ]
  },
  "meta": {
    "verificationTime": 2340,
    "resourcesUsed": {
      "cpu": 0.23,
      "memory": "67MB"
    }
  }
}
```

## 🧠 Learning API

### Submit Learning Data
```http
POST /learning/submit
Content-Type: application/json

{
  "type": "execution_result",
  "data": {
    "suggestion": {
      "code": "function authenticateUser(token) { return jwt.verify(token, process.env.JWT_SECRET); }",
      "context": "authentication",
      "confidence": 0.85
    },
    "execution": {
      "success": true,
      "executionTime": 1.23,
      "testsPassed": 2,
      "testsTotal": 2
    },
    "outcome": {
      "success": true,
      "userFeedback": "positive",
      "actualUsage": "implemented"
    }
  },
  "context": {
    "projectId": "proj_123",
    "agentId": "agent_456",
    "sessionId": "session_789"
  }
}
```

### Get Predictions
```http
POST /learning/predict
Content-Type: application/json

{
  "suggestion": {
    "code": "const users = await User.findAll({ where: { active: true } });",
    "language": "javascript",
    "context": "database query",
    "purpose": "fetch active users"
  },
  "projectContext": {
    "projectId": "proj_123",
    "technologies": ["node.js", "sequelize", "postgresql"],
    "patterns": ["orm", "async/await"]
  },
  "historicalContext": {
    "similarSuggestions": 15,
    "successRate": 0.87,
    "commonIssues": ["performance", "n+1 queries"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "predictionId": "pred_789",
    "successProbability": 0.91,
    "confidence": 0.88,
    "riskFactors": [
      {
        "factor": "performance",
        "severity": "medium",
        "probability": 0.23,
        "description": "Query may be slow with large datasets"
      }
    ],
    "recommendations": [
      {
        "type": "optimization",
        "suggestion": "Consider adding pagination or limit clause",
        "confidence": 0.82,
        "impact": "performance"
      }
    ],
    "similarPatterns": [
      {
        "patternId": "pattern_456",
        "similarity": 0.94,
        "successRate": 0.89,
        "description": "Database query with filtering"
      }
    ]
  },
  "meta": {
    "modelVersion": "v2.1.0",
    "predictionTime": 67,
    "featuresUsed": 23
  }
}
```

## 📊 Project Intelligence API

### Analyze Project
```http
POST /project/analyze
Content-Type: application/json

{
  "projectPath": "/path/to/project",
  "analysisType": "full",
  "options": {
    "includeDependencies": true,
    "includeMetrics": true,
    "includeSecurityScan": true,
    "depth": "deep"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysisId": "analysis_789",
    "projectInfo": {
      "name": "my-awesome-app",
      "type": "web_application",
      "language": "javascript",
      "framework": "express",
      "version": "1.2.3"
    },
    "structure": {
      "totalFiles": 156,
      "codeFiles": 89,
      "testFiles": 23,
      "configFiles": 12,
      "directories": 15
    },
    "dependencies": {
      "total": 45,
      "direct": 12,
      "dev": 8,
      "outdated": 3,
      "vulnerable": 1
    },
    "metrics": {
      "linesOfCode": 12450,
      "complexity": {
        "average": 3.2,
        "max": 15,
        "distribution": {
          "low": 0.78,
          "medium": 0.18,
          "high": 0.04
        }
      },
      "testCoverage": 0.87,
      "maintainabilityIndex": 0.82
    },
    "healthScore": 0.89,
    "recommendations": [
      {
        "type": "security",
        "priority": "high",
        "message": "Update lodash to fix security vulnerability",
        "action": "npm update lodash"
      }
    ]
  },
  "meta": {
    "analysisTime": 15670,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🔄 Real-time API (WebSocket)

### Connection
```javascript
const ws = new WebSocket('wss://api.agentos.dev/v1/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'jwt_token_here',
  agentId: 'agent_456',
  projectId: 'proj_123'
}));
```

### Subscribe to Events
```javascript
// Subscribe to execution updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'execution',
  filters: {
    projectId: 'proj_123',
    agentId: 'agent_456'
  }
}));

// Subscribe to learning updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'learning',
  filters: {
    modelUpdates: true,
    predictionResults: true
  }
}));
```

### Event Types
```javascript
// Execution completed
{
  "type": "execution_completed",
  "data": {
    "executionId": "exec_789",
    "status": "success",
    "result": { /* execution result */ }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Learning model updated
{
  "type": "model_updated",
  "data": {
    "modelId": "model_123",
    "version": "v2.1.1",
    "improvements": {
      "accuracy": 0.02,
      "performance": 0.15
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Project health alert
{
  "type": "health_alert",
  "data": {
    "projectId": "proj_123",
    "alertType": "security_vulnerability",
    "severity": "high",
    "message": "New security vulnerability detected in dependency",
    "action": "update_dependency"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📚 SDK Examples

### JavaScript/Node.js SDK
```javascript
import { AgentOS } from '@agentos/sdk';

const agent = new AgentOS({
  apiKey: 'your_api_key',
  agentId: 'agent_456',
  projectId: 'proj_123'
});

// Store memory
const memory = await agent.memory.store({
  content: 'Fixed authentication bug',
  context: 'authentication',
  type: 'solution'
});

// Execute code
const result = await agent.execution.run({
  language: 'javascript',
  code: 'console.log("Hello, AgentOS!");'
});

// Get prediction
const prediction = await agent.learning.predict({
  suggestion: {
    code: 'const users = await User.findAll();',
    context: 'database query'
  }
});
```

### Python SDK
```python
from agentos import AgentOS

agent = AgentOS(
    api_key='your_api_key',
    agent_id='agent_456',
    project_id='proj_123'
)

# Store memory
memory = agent.memory.store(
    content='Fixed authentication bug',
    context='authentication',
    type='solution'
)

# Execute code
result = agent.execution.run(
    language='python',
    code='print("Hello, AgentOS!")'
)

# Get prediction
prediction = agent.learning.predict(
    suggestion={
        'code': 'users = User.objects.filter(active=True)',
        'context': 'database query'
    }
)
```

---

**This API specification provides comprehensive documentation for AI agents to interact with AgentOS services effectively.**
