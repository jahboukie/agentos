/**
 * AgentOS Core System
 * The main orchestrator for the AI Agent Operating System
 */

import { MemoryEngine } from './MemoryEngine';
import { ExecutionEngine } from './ExecutionEngine';
import { 
  Memory, 
  MemoryQuery, 
  ExecutionRequest, 
  ApiResponse,
  AgentId,
  ProjectId 
} from '../types';

export interface AgentOSConfig {
  memoryDbPath?: string;
  agentId?: AgentId;
  projectId?: ProjectId;
  enableExecution?: boolean;
  enableLearning?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export class AgentOS {
  private memoryEngine: MemoryEngine;
  private executionEngine: ExecutionEngine;
  private config: Required<AgentOSConfig>;
  private initialized: boolean = false;

  constructor(config: AgentOSConfig = {}) {
    this.config = {
      memoryDbPath: config.memoryDbPath || './agentos-memory.db',
      agentId: config.agentId || this.generateAgentId(),
      projectId: config.projectId || 'default',
      enableExecution: config.enableExecution ?? true,
      enableLearning: config.enableLearning ?? true,
      logLevel: config.logLevel || 'info'
    };

    this.memoryEngine = new MemoryEngine(this.config.memoryDbPath);
    this.executionEngine = new ExecutionEngine();
  }

  /**
   * Initialize AgentOS
   */
  async initialize(): Promise<void> {
    try {
      this.log('info', '🚀 Initializing AgentOS...');
      
      // Memory engine is initialized in constructor
      // Execution engine initialization is handled internally
      
      this.initialized = true;
      this.log('info', '✅ AgentOS initialized successfully');
      
      // Store initialization memory
      await this.remember({
        content: `AgentOS initialized for agent ${this.config.agentId}`,
        context: 'system',
        type: 'insight',
        metadata: {
          agentId: this.config.agentId,
          projectId: this.config.projectId,
          tags: ['initialization', 'system'],
          source: 'system',
          confidence: 1.0,
          validation: 'validated',
          importance: 0.8,
          category: 'system'
        },
        relationships: []
      });
      
    } catch (error) {
      this.log('error', `❌ Failed to initialize AgentOS: ${error}`);
      throw error;
    }
  }

  /**
   * Store a memory (enhanced AntiGoldfishMode functionality)
   */
  async remember(memory: Omit<Memory, 'id' | 'created' | 'updated' | 'accessed' | 'accessCount' | 'relevanceScore'>): Promise<ApiResponse<Memory>> {
    this.ensureInitialized();
    
    // Enhance memory with agent/project context
    const enhancedMemory = {
      ...memory,
      metadata: {
        ...memory.metadata,
        agentId: memory.metadata.agentId || this.config.agentId,
        projectId: memory.metadata.projectId || this.config.projectId
      }
    };
    
    const result = await this.memoryEngine.store(enhancedMemory);
    
    if (result.success) {
      this.log('debug', `💾 Stored memory: ${memory.content.substring(0, 50)}...`);
    } else {
      this.log('error', `❌ Failed to store memory: ${result.error?.message}`);
    }
    
    return result;
  }

  /**
   * Search memories (enhanced AntiGoldfishMode functionality)
   */
  async recall(query: string | MemoryQuery): Promise<ApiResponse<any>> {
    this.ensureInitialized();
    
    const searchQuery: MemoryQuery = typeof query === 'string' 
      ? { 
          query, 
          projectId: this.config.projectId,
          agentId: this.config.agentId,
          limit: 10 
        }
      : {
          ...query,
          projectId: query.projectId || this.config.projectId,
          agentId: query.agentId || this.config.agentId
        };
    
    const result = await this.memoryEngine.search(searchQuery);
    
    if (result.success) {
      this.log('debug', `🔍 Found ${result.data?.length || 0} memories for query`);
    } else {
      this.log('error', `❌ Failed to search memories: ${result.error?.message}`);
    }
    
    return result;
  }

  /**
   * Execute code in sandboxed environment
   */
  async execute(request: ExecutionRequest): Promise<ApiResponse<any>> {
    this.ensureInitialized();
    
    if (!this.config.enableExecution) {
      return {
        success: false,
        error: {
          code: 'EXECUTION_DISABLED',
          message: 'Code execution is disabled in this AgentOS instance'
        }
      };
    }
    
    // Enhance request with context
    const enhancedRequest = {
      ...request,
      context: {
        ...request.context,
        projectId: request.context?.projectId || this.config.projectId,
        metadata: {
          ...request.context?.metadata,
          agentId: this.config.agentId
        }
      }
    };
    
    const result = await this.executionEngine.execute(enhancedRequest);
    
    // Store execution result as memory for learning
    if (result.success && this.config.enableLearning) {
      await this.remember({
        content: `Executed ${request.language} code: ${request.code.substring(0, 100)}...`,
        context: 'execution',
        type: 'solution',
        metadata: {
          agentId: this.config.agentId,
          projectId: this.config.projectId,
          tags: ['execution', request.language, result.data?.status || 'unknown'],
          source: 'execution_result',
          confidence: result.data?.analysis.success ? 0.9 : 0.3,
          validation: 'pending',
          importance: 0.7,
          category: 'execution'
        },
        relationships: []
      });
    }
    
    if (result.success) {
      this.log('debug', `⚡ Executed ${request.language} code successfully`);
    } else {
      this.log('error', `❌ Failed to execute code: ${result.error?.message}`);
    }
    
    return result;
  }

  /**
   * Verify code suggestion
   */
  async verify(suggestion: any): Promise<ApiResponse<any>> {
    this.ensureInitialized();
    
    if (!this.config.enableExecution) {
      return {
        success: false,
        error: {
          code: 'EXECUTION_DISABLED',
          message: 'Code verification requires execution to be enabled'
        }
      };
    }
    
    const result = await this.executionEngine.verify(suggestion);
    
    // Store verification result as memory
    if (result.success && this.config.enableLearning) {
      await this.remember({
        content: `Verified code suggestion with ${result.data?.successProbability * 100}% success probability`,
        context: 'verification',
        type: 'pattern',
        metadata: {
          agentId: this.config.agentId,
          projectId: this.config.projectId,
          tags: ['verification', 'code-suggestion', result.data?.overallResult || 'unknown'],
          source: 'execution_result',
          confidence: result.data?.successProbability || 0.5,
          validation: 'validated',
          importance: 0.8,
          category: 'verification'
        },
        relationships: []
      });
    }
    
    return result;
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<ApiResponse<any>> {
    const memoryStats = await this.getMemoryStats();
    
    return {
      success: true,
      data: {
        agentId: this.config.agentId,
        projectId: this.config.projectId,
        initialized: this.initialized,
        capabilities: {
          memory: true,
          execution: this.config.enableExecution,
          learning: this.config.enableLearning
        },
        memory: memoryStats,
        version: '0.1.0',
        uptime: process.uptime()
      },
      meta: {
        processingTime: 0,
        timestamp: new Date(),
        version: '1.0.0',
        requestId: this.generateRequestId()
      }
    };
  }

  /**
   * Learn from execution outcomes
   */
  async learn(data: any): Promise<ApiResponse<any>> {
    this.ensureInitialized();
    
    if (!this.config.enableLearning) {
      return {
        success: false,
        error: {
          code: 'LEARNING_DISABLED',
          message: 'Learning is disabled in this AgentOS instance'
        }
      };
    }
    
    // Store learning data as memory
    await this.remember({
      content: `Learning data: ${JSON.stringify(data).substring(0, 200)}...`,
      context: 'learning',
      type: 'pattern',
      metadata: {
        agentId: this.config.agentId,
        projectId: this.config.projectId,
        tags: ['learning', 'pattern-recognition'],
        source: 'learning_system',
        confidence: 0.8,
        validation: 'pending',
        importance: 0.9,
        category: 'learning'
      },
      relationships: []
    });
    
    return {
      success: true,
      data: {
        learned: true,
        patterns: [],
        improvements: []
      }
    };
  }

  /**
   * Shutdown AgentOS
   */
  async shutdown(): Promise<void> {
    this.log('info', '🛑 Shutting down AgentOS...');
    
    try {
      if (this.config.enableExecution) {
        await this.executionEngine.shutdown();
      }
      
      this.memoryEngine.close();
      
      this.log('info', '✅ AgentOS shutdown complete');
    } catch (error) {
      this.log('error', `❌ Error during shutdown: ${error}`);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('AgentOS not initialized. Call initialize() first.');
    }
  }

  private generateAgentId(): AgentId {
    return `agent_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private async getMemoryStats(): Promise<any> {
    // Get basic memory statistics
    const allMemories = await this.recall({ limit: 1000 });
    
    return {
      totalMemories: allMemories.data?.length || 0,
      byType: {},
      byContext: {},
      averageConfidence: 0.8,
      lastAccessed: new Date()
    };
  }

  private log(level: string, message: string): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const configLevel = levels[this.config.logLevel];
    const messageLevel = levels[level as keyof typeof levels];
    
    if (messageLevel >= configLevel) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] [AgentOS] ${message}`);
    }
  }
}
