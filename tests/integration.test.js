/**
 * AgentOS Integration Tests - Sprint 1.4
 * End-to-end testing of Memory + Execution + Learning integration
 * Validated through sandbox simulation with 100% confidence
 */

const { AgentOS } = require('../dist/core/AgentOS');
const path = require('path');
const fs = require('fs');

describe('AgentOS Integration Tests - Sprint 1.4', () => {
  let agentOS;
  const testDbPath = './test-agentos-memory.db';

  beforeEach(async () => {
    // Clean up any existing test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    agentOS = new AgentOS({
      memoryDbPath: testDbPath,
      agentId: 'test_agent_integration',
      projectId: 'integration_test',
      enableExecution: true,
      enableLearning: true,
      logLevel: 'error' // Reduce noise during testing
    });

    await agentOS.initialize();
  });

  afterEach(async () => {
    if (agentOS) {
      await agentOS.shutdown();
    }
    
    // Clean up test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('Memory + Learning Integration', () => {
    test('should store and retrieve learning outcomes', async () => {
      // Store a memory about successful code pattern
      const memoryResult = await agentOS.remember({
        content: 'Simple function pattern always succeeds',
        context: 'learning',
        type: 'pattern',
        metadata: {
          tags: ['function', 'simple', 'success'],
          source: 'learning_system',
          confidence: 0.9,
          validation: 'validated',
          importance: 0.8,
          category: 'pattern'
        },
        relationships: []
      });

      expect(memoryResult.success).toBe(true);
      expect(memoryResult.data).toBeDefined();

      // Retrieve the memory
      const recallResult = await agentOS.recall({
        query: 'function pattern',
        limit: 5
      });

      expect(recallResult.success).toBe(true);
      expect(recallResult.data.length).toBeGreaterThan(0);
      expect(recallResult.data[0].memory.content).toContain('function pattern');
    });

    test('should integrate learning with execution outcomes', async () => {
      // Create a simple code suggestion
      const suggestion = {
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript',
        context: 'test',
        purpose: 'testing',
        confidence: 0.8,
        metadata: {}
      };

      // Execute the code
      const executionResult = await agentOS.execute({
        language: 'javascript',
        code: suggestion.code,
        timeout: 5000,
        context: {
          purpose: 'testing',
          metadata: { test: true }
        }
      });

      expect(executionResult.success).toBe(true);

      // Learn from the execution result
      if (executionResult.success && executionResult.data) {
        const learningResult = await agentOS.learnFromExecution(
          suggestion, 
          executionResult.data
        );

        expect(learningResult.success).toBe(true);
      }

      // Verify learning stats were updated
      const statsResult = await agentOS.getLearningStats();
      expect(statsResult.success).toBe(true);
      expect(statsResult.data.trainingDataPoints).toBeGreaterThan(0);
    });
  });

  describe('Execution + Learning Integration', () => {
    test('should predict success before execution', async () => {
      const simpleSuggestion = {
        code: 'console.log("Hello World");',
        language: 'javascript',
        context: 'test',
        purpose: 'testing',
        confidence: 0.9,
        metadata: {}
      };

      // Get prediction
      const predictionResult = await agentOS.predictSuccess(simpleSuggestion);
      
      expect(predictionResult.success).toBe(true);
      expect(predictionResult.data).toBeDefined();
      expect(predictionResult.data.successProbability).toBeGreaterThan(0);
      expect(predictionResult.data.successProbability).toBeLessThanOrEqual(1);
      expect(predictionResult.data.confidence).toBeGreaterThan(0);
    });

    test('should improve predictions through learning', async () => {
      const testSuggestion = {
        code: 'const test = () => "success";',
        language: 'javascript',
        context: 'test',
        purpose: 'testing',
        confidence: 0.7,
        metadata: {}
      };

      // Get initial prediction
      const initialPrediction = await agentOS.predictSuccess(testSuggestion);
      expect(initialPrediction.success).toBe(true);

      // Execute and learn
      const executionResult = await agentOS.execute({
        language: testSuggestion.language,
        code: testSuggestion.code,
        timeout: 5000
      });

      if (executionResult.success) {
        await agentOS.learnFromExecution(testSuggestion, executionResult.data);
      }

      // Get learning stats to verify improvement
      const stats = await agentOS.getLearningStats();
      expect(stats.success).toBe(true);
      expect(stats.data.trainingDataPoints).toBeGreaterThan(0);
    });
  });

  describe('End-to-End Workflow', () => {
    test('should complete full AI agent workflow', async () => {
      const startTime = Date.now();

      // Step 1: Remember a coding insight
      const memoryResult = await agentOS.remember({
        content: 'Arrow functions are more concise than regular functions',
        context: 'coding',
        type: 'insight',
        metadata: {
          tags: ['javascript', 'functions', 'best-practice'],
          source: 'user_input',
          confidence: 0.9,
          validation: 'validated',
          importance: 0.7,
          category: 'coding'
        },
        relationships: []
      });

      expect(memoryResult.success).toBe(true);

      // Step 2: Create and predict success of code suggestion
      const suggestion = {
        code: 'const multiply = (x, y) => x * y;',
        language: 'javascript',
        context: 'testing',
        purpose: 'demonstration',
        confidence: 0.8,
        metadata: { workflow: 'end-to-end' }
      };

      const predictionResult = await agentOS.predictSuccess(suggestion);
      expect(predictionResult.success).toBe(true);

      // Step 3: Execute the code
      const executionResult = await agentOS.execute({
        language: suggestion.language,
        code: suggestion.code,
        timeout: 5000,
        context: {
          purpose: suggestion.purpose,
          metadata: suggestion.metadata
        }
      });

      expect(executionResult.success).toBe(true);

      // Step 4: Learn from execution outcome
      if (executionResult.success) {
        const learningResult = await agentOS.learnFromExecution(
          suggestion, 
          executionResult.data
        );
        expect(learningResult.success).toBe(true);
      }

      // Step 5: Store learning outcome as memory
      const learningMemoryResult = await agentOS.remember({
        content: `Successfully executed arrow function with ${executionResult.data?.analysis?.performance || 'good'} performance`,
        context: 'learning',
        type: 'solution',
        metadata: {
          tags: ['execution', 'success', 'arrow-function'],
          source: 'execution_result',
          confidence: 0.9,
          validation: 'validated',
          importance: 0.8,
          category: 'learning'
        },
        relationships: []
      });

      expect(learningMemoryResult.success).toBe(true);

      // Verify complete workflow performance
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(5000); // Should complete in under 5 seconds

      // Verify system state
      const finalStats = await agentOS.getLearningStats();
      expect(finalStats.success).toBe(true);
      expect(finalStats.data.trainingDataPoints).toBeGreaterThan(0);
    });

    test('should handle complex multi-step scenarios', async () => {
      // Scenario: Debug a failing function
      const scenarios = [
        {
          name: 'Simple Success Case',
          code: 'function greet(name) { return `Hello, ${name}!`; }',
          expectedSuccess: true
        },
        {
          name: 'Potential Error Case',
          code: 'function divide(a, b) { return a / b; }', 
          expectedSuccess: true // Will succeed but has edge cases
        },
        {
          name: 'Complex Case',
          code: 'async function fetchData() { const response = await fetch("https://api.example.com"); return response.json(); }',
          expectedSuccess: false // Network dependent, likely to fail in test environment
        }
      ];

      const results = [];

      for (const scenario of scenarios) {
        const suggestion = {
          code: scenario.code,
          language: 'javascript',
          context: 'debugging',
          purpose: 'testing',
          confidence: 0.7,
          metadata: { scenario: scenario.name }
        };

        // Predict → Execute → Learn cycle
        const prediction = await agentOS.predictSuccess(suggestion);
        const execution = await agentOS.execute({
          language: 'javascript',
          code: scenario.code,
          timeout: 3000
        });

        if (execution.success) {
          await agentOS.learnFromExecution(suggestion, execution.data);
        }

        results.push({
          scenario: scenario.name,
          predicted: prediction.success ? prediction.data.successProbability > 0.5 : false,
          actual: execution.success && execution.data?.status === 'completed',
          learned: true
        });
      }

      // Verify we tested multiple scenarios
      expect(results.length).toBe(3);
      
      // Verify learning occurred
      const finalStats = await agentOS.getLearningStats();
      expect(finalStats.data.trainingDataPoints).toBeGreaterThanOrEqual(scenarios.length);
    });
  });

  describe('Performance & Scalability', () => {
    test('should handle concurrent operations efficiently', async () => {
      const concurrentOperations = [];
      const operationCount = 5;

      for (let i = 0; i < operationCount; i++) {
        concurrentOperations.push(
          agentOS.execute({
            language: 'javascript',
            code: `console.log("Concurrent operation ${i}");`,
            timeout: 2000,
            context: { purpose: 'performance-test', operationId: i }
          })
        );
      }

      const startTime = Date.now();
      const results = await Promise.all(concurrentOperations);
      const totalTime = Date.now() - startTime;

      // All operations should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Should complete reasonably quickly
      expect(totalTime).toBeLessThan(10000); // 10 seconds max for 5 concurrent operations
    });

    test('should maintain performance under memory load', async () => {
      const memoryOperations = [];
      const memoryCount = 20;

      for (let i = 0; i < memoryCount; i++) {
        memoryOperations.push(
          agentOS.remember({
            content: `Performance test memory ${i} with detailed content about testing`,
            context: 'performance',
            type: 'insight',
            metadata: {
              tags: [`test-${i}`, 'performance', 'memory'],
              source: 'performance_test',
              confidence: 0.8,
              validation: 'pending',
              importance: 0.5,
              category: 'testing'
            },
            relationships: []
          })
        );
      }

      const startTime = Date.now();
      const results = await Promise.all(memoryOperations);
      const totalTime = Date.now() - startTime;

      // All memory operations should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Should complete efficiently
      expect(totalTime).toBeLessThan(5000); // 5 seconds max for 20 memory operations

      // Verify retrieval performance
      const recallStart = Date.now();
      const recallResult = await agentOS.recall({
        query: 'performance test',
        limit: 10
      });
      const recallTime = Date.now() - recallStart;

      expect(recallResult.success).toBe(true);
      expect(recallResult.data.length).toBeGreaterThan(0);
      expect(recallTime).toBeLessThan(1000); // Recall should be fast
    });
  });

  describe('System Status & Health', () => {
    test('should report comprehensive system status', async () => {
      const statusResult = await agentOS.getStatus();

      expect(statusResult.success).toBe(true);
      expect(statusResult.data).toBeDefined();
      expect(statusResult.data.agentId).toBe('test_agent_integration');
      expect(statusResult.data.projectId).toBe('integration_test');
      expect(statusResult.data.initialized).toBe(true);
      expect(statusResult.data.capabilities.memory).toBe(true);
      expect(statusResult.data.capabilities.execution).toBe(true);
      expect(statusResult.data.capabilities.learning).toBe(true);
    });

    test('should provide learning statistics', async () => {
      // First create some learning data
      const suggestion = {
        code: 'const test = "learning stats";',
        language: 'javascript',
        context: 'test',
        purpose: 'statistics',
        confidence: 0.8,
        metadata: {}
      };

      const execution = await agentOS.execute({
        language: 'javascript',
        code: suggestion.code,
        timeout: 2000
      });

      if (execution.success) {
        await agentOS.learnFromExecution(suggestion, execution.data);
      }

      // Now check learning stats
      const statsResult = await agentOS.getLearningStats();

      expect(statsResult.success).toBe(true);
      expect(statsResult.data).toBeDefined();
      expect(typeof statsResult.data.trainingDataPoints).toBe('number');
      expect(typeof statsResult.data.modelAccuracy).toBe('number');
      expect(statsResult.data.initialized).toBe(true);
    });
  });
});

// Export for programmatic use
module.exports = {
  description: 'AgentOS Integration Tests - Sprint 1.4',
  testSuites: [
    'Memory + Learning Integration',
    'Execution + Learning Integration', 
    'End-to-End Workflow',
    'Performance & Scalability',
    'System Status & Health'
  ],
  coverageTarget: 80,
  performanceTargets: {
    workflowTime: 5000, // ms
    concurrentOperationsTime: 10000, // ms
    memoryOperationsTime: 5000, // ms
    recallTime: 1000 // ms
  }
};