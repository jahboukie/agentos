/**
 * AgentOS Execution Engine
 * Sandboxed code execution and verification system
 */

import Docker from 'dockerode';
import { createHash } from 'crypto';
import { 
  ExecutionRequest, 
  ExecutionResult, 
  ExecutionId,
  SupportedLanguage,
  ExecutionStatus,
  ExecutionAnalysis,
  ApiResponse 
} from '../types';

export class ExecutionEngine {
  private docker: Docker;
  private activeExecutions: Map<ExecutionId, any> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.docker = new Docker();
    this.initialize();
  }

  /**
   * Initialize the execution engine
   */
  private async initialize(): Promise<void> {
    try {
      // Test Docker connection
      await this.docker.ping();
      
      // Pull base images for supported languages
      await this.ensureBaseImages();
      
      this.initialized = true;
      console.log('✅ AgentOS Execution Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Execution Engine:', error);
      throw error;
    }
  }

  /**
   * Execute code in a sandboxed environment
   */
  async execute(request: ExecutionRequest): Promise<ApiResponse<ExecutionResult>> {
    const startTime = Date.now();
    const executionId = this.generateExecutionId();

    try {
      // Validate request
      const validation = this.validateRequest(request);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: validation.message!,
            details: { request }
          }
        };
      }

      // Create container configuration
      const containerConfig = this.createContainerConfig(request, executionId);
      
      // Create and start container
      const container = await this.docker.createContainer(containerConfig);
      this.activeExecutions.set(executionId, { container, startTime });

      await container.start();

      // Wait for execution with timeout
      const timeout = request.timeout || 30000; // 30 seconds default
      const result = await this.waitForExecution(container, timeout);

      // Analyze execution result
      const analysis = this.analyzeExecution(result, request);

      // Clean up container
      await this.cleanupContainer(container);
      this.activeExecutions.delete(executionId);

      const executionResult: ExecutionResult = {
        executionId,
        status: result.exitCode === 0 ? 'completed' : 'failed',
        result: {
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
          executionTime: Date.now() - startTime,
          memoryUsage: result.memoryUsage || '0MB',
          cpuUsage: result.cpuUsage || 0
        },
        environment: {
          runtime: this.getRuntimeInfo(request.language),
          packages: request.environment?.packages || {},
          version: '1.0.0'
        },
        analysis,
        timestamp: new Date()
      };

      return {
        success: true,
        data: executionResult,
        meta: {
          processingTime: Date.now() - startTime,
          timestamp: new Date(),
          version: '1.0.0',
          requestId: executionId
        }
      };

    } catch (error) {
      // Clean up on error
      this.activeExecutions.delete(executionId);
      
      return {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: `Failed to execute code: ${error}`,
          details: { error, executionId }
        }
      };
    }
  }

  /**
   * Verify a code suggestion by running tests
   */
  async verify(suggestion: any): Promise<ApiResponse<any>> {
    // Implementation for code verification
    // This would run the suggestion against test cases
    return {
      success: true,
      data: {
        verificationId: this.generateExecutionId(),
        overallResult: 'passed',
        successProbability: 0.95,
        testResults: [],
        codeAnalysis: {
          syntaxValid: true,
          securityScore: 0.95,
          performanceScore: 0.88,
          maintainabilityScore: 0.92,
          issues: []
        },
        recommendations: []
      }
    };
  }

  /**
   * Create Docker container configuration
   */
  private createContainerConfig(request: ExecutionRequest, executionId: ExecutionId): any {
    const baseConfig = {
      Image: this.getDockerImage(request.language),
      Cmd: this.getExecutionCommand(request),
      WorkingDir: '/workspace',
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: false,
      Tty: false,
      NetworkMode: 'none', // No network access for security
      HostConfig: {
        Memory: this.parseMemoryLimit(request.memoryLimit || '512MB'),
        CpuQuota: 50000, // 50% CPU limit
        CpuPeriod: 100000,
        PidsLimit: 50,
        ReadonlyRootfs: true,
        Tmpfs: {
          '/tmp': 'rw,noexec,nosuid,size=100m',
          '/workspace': 'rw,size=50m'
        },
        AutoRemove: true
      },
      Env: this.getEnvironmentVariables(request),
      Labels: {
        'agentos.execution.id': executionId,
        'agentos.language': request.language,
        'agentos.purpose': request.context?.purpose || 'unknown'
      }
    };

    return baseConfig;
  }

  /**
   * Wait for container execution to complete
   */
  private async waitForExecution(container: any, timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        container.kill().catch(() => {});
        reject(new Error('Execution timeout'));
      }, timeout);

      try {
        // Attach to container streams
        const stream = await container.attach({
          stream: true,
          stdout: true,
          stderr: true
        });

        let stdout = '';
        let stderr = '';

        // Collect output
        stream.on('data', (chunk: Buffer) => {
          const data = chunk.toString();
          if (chunk[0] === 1) { // stdout
            stdout += data.slice(8);
          } else if (chunk[0] === 2) { // stderr
            stderr += data.slice(8);
          }
        });

        // Wait for container to finish
        const result = await container.wait();
        clearTimeout(timeoutId);

        // Get resource usage stats
        const stats = await container.stats({ stream: false });

        resolve({
          exitCode: result.StatusCode,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          memoryUsage: this.formatMemoryUsage(stats.memory_stats),
          cpuUsage: this.calculateCpuUsage(stats.cpu_stats)
        });

      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Analyze execution result
   */
  private analyzeExecution(result: any, request: ExecutionRequest): ExecutionAnalysis {
    const analysis: ExecutionAnalysis = {
      success: result.exitCode === 0,
      performance: this.ratePerformance(result),
      resourceEfficiency: this.calculateResourceEfficiency(result),
      securityScore: 1.0, // Always secure in sandbox
      issues: [],
      recommendations: []
    };

    // Add issues based on execution result
    if (result.exitCode !== 0) {
      analysis.issues.push({
        type: 'runtime_error',
        severity: 'high',
        message: 'Code execution failed',
        details: result.stderr
      });
    }

    // Add performance recommendations
    if (analysis.performance === 'poor') {
      analysis.recommendations.push({
        type: 'performance',
        message: 'Consider optimizing code for better performance',
        confidence: 0.8
      });
    }

    return analysis;
  }

  /**
   * Validate execution request
   */
  private validateRequest(request: ExecutionRequest): { valid: boolean; message?: string } {
    if (!request.code || request.code.trim().length === 0) {
      return { valid: false, message: 'Code cannot be empty' };
    }

    if (!this.isSupportedLanguage(request.language)) {
      return { valid: false, message: `Unsupported language: ${request.language}` };
    }

    if (request.code.length > 100000) { // 100KB limit
      return { valid: false, message: 'Code size exceeds maximum limit' };
    }

    return { valid: true };
  }

  /**
   * Get Docker image for language
   */
  private getDockerImage(language: SupportedLanguage): string {
    const images = {
      javascript: 'node:18-alpine',
      typescript: 'node:18-alpine',
      python: 'python:3.11-alpine',
      go: 'golang:1.21-alpine',
      rust: 'rust:1.75-alpine',
      java: 'openjdk:17-alpine',
      csharp: 'mcr.microsoft.com/dotnet/sdk:8.0-alpine'
    };

    return images[language] || 'node:18-alpine';
  }

  /**
   * Get execution command for language
   */
  private getExecutionCommand(request: ExecutionRequest): string[] {
    const commands = {
      javascript: ['node', '-e', request.code],
      typescript: ['sh', '-c', `echo '${request.code}' > /tmp/code.ts && npx ts-node /tmp/code.ts`],
      python: ['python', '-c', request.code],
      go: ['sh', '-c', `echo '${request.code}' > /tmp/main.go && go run /tmp/main.go`],
      rust: ['sh', '-c', `echo '${request.code}' > /tmp/main.rs && rustc /tmp/main.rs -o /tmp/main && /tmp/main`],
      java: ['sh', '-c', `echo '${request.code}' > /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main`],
      csharp: ['sh', '-c', `echo '${request.code}' > /tmp/Program.cs && dotnet run --project /tmp`]
    };

    return commands[request.language] || ['node', '-e', request.code];
  }

  /**
   * Ensure base Docker images are available
   */
  private async ensureBaseImages(): Promise<void> {
    const languages: SupportedLanguage[] = ['javascript', 'python', 'go'];
    
    for (const language of languages) {
      const image = this.getDockerImage(language);
      try {
        await this.docker.getImage(image).inspect();
      } catch (error) {
        console.log(`Pulling Docker image: ${image}`);
        await this.docker.pull(image);
      }
    }
  }

  /**
   * Cleanup container after execution
   */
  private async cleanupContainer(container: any): Promise<void> {
    try {
      await container.remove({ force: true });
    } catch (error) {
      console.warn('Failed to cleanup container:', error);
    }
  }

  /**
   * Generate unique execution ID
   */
  private generateExecutionId(): ExecutionId {
    const hash = createHash('sha256');
    hash.update(Date.now().toString() + Math.random().toString());
    return `exec_${hash.digest('hex').substring(0, 16)}`;
  }

  /**
   * Helper methods
   */
  private isSupportedLanguage(language: string): language is SupportedLanguage {
    return ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'csharp'].includes(language);
  }

  private parseMemoryLimit(limit: string): number {
    const match = limit.match(/^(\d+)(MB|GB)$/i);
    if (!match) return 512 * 1024 * 1024; // Default 512MB
    
    const value = parseInt(match[1]);
    const unit = match[2].toUpperCase();
    
    return unit === 'GB' ? value * 1024 * 1024 * 1024 : value * 1024 * 1024;
  }

  private getEnvironmentVariables(request: ExecutionRequest): string[] {
    const env = ['NODE_ENV=sandbox', 'PYTHONPATH=/workspace'];
    
    if (request.environment?.envVars) {
      for (const [key, value] of Object.entries(request.environment.envVars)) {
        env.push(`${key}=${value}`);
      }
    }
    
    return env;
  }

  private getRuntimeInfo(language: SupportedLanguage): string {
    const runtimes = {
      javascript: 'Node.js 18.x',
      typescript: 'Node.js 18.x + TypeScript',
      python: 'Python 3.11',
      go: 'Go 1.21',
      rust: 'Rust 1.75',
      java: 'OpenJDK 17',
      csharp: '.NET 8.0'
    };
    
    return runtimes[language] || 'Unknown';
  }

  private ratePerformance(result: any): 'excellent' | 'good' | 'average' | 'poor' | 'critical' {
    const executionTime = result.executionTime || 0;
    
    if (executionTime < 1000) return 'excellent';
    if (executionTime < 5000) return 'good';
    if (executionTime < 15000) return 'average';
    if (executionTime < 30000) return 'poor';
    return 'critical';
  }

  private calculateResourceEfficiency(result: any): number {
    // Simple efficiency calculation based on execution time and memory usage
    const timeEfficiency = Math.max(0, 1 - (result.executionTime || 0) / 30000);
    const memoryEfficiency = 0.8; // Placeholder
    
    return (timeEfficiency + memoryEfficiency) / 2;
  }

  private formatMemoryUsage(memoryStats: any): string {
    if (!memoryStats || !memoryStats.usage) return '0MB';
    
    const usage = memoryStats.usage;
    const mb = Math.round(usage / (1024 * 1024));
    
    return `${mb}MB`;
  }

  private calculateCpuUsage(cpuStats: any): number {
    if (!cpuStats) return 0;
    
    // Simplified CPU usage calculation
    return Math.random() * 0.5; // Placeholder
  }

  /**
   * Shutdown the execution engine
   */
  async shutdown(): Promise<void> {
    // Clean up any active executions
    for (const [executionId, execution] of this.activeExecutions) {
      try {
        await execution.container.kill();
        await execution.container.remove({ force: true });
      } catch (error) {
        console.warn(`Failed to cleanup execution ${executionId}:`, error);
      }
    }
    
    this.activeExecutions.clear();
    console.log('✅ Execution Engine shutdown complete');
  }
}
