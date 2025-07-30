/**
 * AgentOS Core Types
 * Type definitions for the AI Agent Operating System
 */

// ============================================================================
// MEMORY SYSTEM TYPES
// ============================================================================

export interface Memory {
  id: MemoryId;
  content: string;
  context: string;
  type: MemoryType;
  metadata: MemoryMetadata;
  embeddings?: number[];
  relationships: MemoryRelationship[];
  created: Date;
  updated: Date;
  accessed: Date;
  accessCount: number;
  relevanceScore: number;
}

export interface MemoryMetadata {
  projectId?: string;
  agentId?: string;
  sessionId?: string;
  tags: string[];
  source: MemorySource;
  confidence: number;
  validation: ValidationStatus;
  importance: number;
  category: string;
}

export interface MemoryRelationship {
  targetMemoryId: MemoryId;
  relationshipType: RelationshipType;
  strength: number;
  created: Date;
}

export interface MemoryQuery {
  query?: string;
  context?: string[];
  type?: MemoryType[];
  tags?: string[];
  projectId?: string;
  agentId?: string;
  dateRange?: DateRange;
  confidenceRange?: NumberRange;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  memory: Memory;
  matchScore: number;
  relevanceScore: number;
  contextMatch: boolean;
  highlights: string[];
}

// ============================================================================
// EXECUTION SYSTEM TYPES
// ============================================================================

export interface ExecutionRequest {
  language: SupportedLanguage;
  code: string;
  environment?: EnvironmentSpec;
  context?: ExecutionContext;
  timeout?: number;
  memoryLimit?: string;
}

export interface ExecutionResult {
  executionId: ExecutionId;
  status: ExecutionStatus;
  result: {
    stdout: string;
    stderr: string;
    exitCode: number;
    executionTime: number;
    memoryUsage: string;
    cpuUsage: number;
  };
  environment: EnvironmentInfo;
  analysis: ExecutionAnalysis;
  timestamp: Date;
}

export interface ExecutionContext {
  projectId?: string;
  purpose: ExecutionPurpose;
  metadata: Record<string, any>;
  parentExecutionId?: ExecutionId;
}

export interface ExecutionAnalysis {
  success: boolean;
  performance: PerformanceRating;
  resourceEfficiency: number;
  securityScore: number;
  issues: ExecutionIssue[];
  recommendations: ExecutionRecommendation[];
}

// ============================================================================
// LEARNING SYSTEM TYPES
// ============================================================================

export interface LearningData {
  type: LearningDataType;
  data: {
    suggestion: CodeSuggestion;
    execution?: ExecutionResult;
    outcome: LearningOutcome;
  };
  context: LearningContext;
  timestamp: Date;
}

export interface CodeSuggestion {
  code: string;
  language: SupportedLanguage;
  context: string;
  purpose: string;
  confidence: number;
  metadata: Record<string, any>;
}

export interface LearningOutcome {
  success: boolean;
  userFeedback?: UserFeedback;
  actualUsage?: UsageType;
  performanceMetrics?: PerformanceMetrics;
  issues?: string[];
}

export interface Pattern {
  patternId: PatternId;
  type: PatternType;
  description: string;
  examples: PatternExample[];
  successRate: number;
  confidence: number;
  metadata: PatternMetadata;
  created: Date;
  updated: Date;
}

export interface PredictionResult {
  predictionId: PredictionId;
  successProbability: number;
  confidence: number;
  riskFactors: RiskFactor[];
  recommendations: PredictionRecommendation[];
  similarPatterns: SimilarPattern[];
  modelVersion: string;
  timestamp: Date;
}

// ============================================================================
// PROJECT INTELLIGENCE TYPES
// ============================================================================

export interface ProjectAnalysis {
  analysisId: AnalysisId;
  projectInfo: ProjectInfo;
  structure: ProjectStructure;
  dependencies: DependencyAnalysis;
  metrics: ProjectMetrics;
  healthScore: number;
  recommendations: ProjectRecommendation[];
  timestamp: Date;
}

export interface ProjectInfo {
  name: string;
  type: ProjectType;
  language: SupportedLanguage;
  framework?: string;
  version: string;
  description?: string;
}

export interface DependencyAnalysis {
  total: number;
  direct: number;
  dev: number;
  outdated: number;
  vulnerable: number;
  graph: DependencyGraph;
  healthScore: number;
}

// ============================================================================
// AGENT COORDINATION TYPES
// ============================================================================

export interface AgentMessage {
  messageId: MessageId;
  fromAgentId: AgentId;
  toAgentId: AgentId;
  type: MessageType;
  content: any;
  priority: MessagePriority;
  timestamp: Date;
  requiresResponse: boolean;
}

export interface AgentCapability {
  capabilityId: CapabilityId;
  name: string;
  description: string;
  version: string;
  supportedLanguages: SupportedLanguage[];
  performanceMetrics: CapabilityMetrics;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type MemoryId = string;
export type ExecutionId = string;
export type PredictionId = string;
export type PatternId = string;
export type AnalysisId = string;
export type AgentId = string;
export type MessageId = string;
export type CapabilityId = string;
export type ProjectId = string;

export type MemoryType = 'conversation' | 'solution' | 'pattern' | 'error' | 'insight' | 'context';
export type MemorySource = 'user_input' | 'execution_result' | 'learning_system' | 'external_api' | 'system';
export type ValidationStatus = 'pending' | 'validated' | 'rejected' | 'expired';
export type RelationshipType = 'similar' | 'related' | 'prerequisite' | 'consequence' | 'alternative';

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'go' | 'rust' | 'java' | 'csharp';
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'timeout' | 'cancelled';
export type ExecutionPurpose = 'verification' | 'testing' | 'exploration' | 'production';
export type PerformanceRating = 'excellent' | 'good' | 'average' | 'poor' | 'critical';

export type LearningDataType = 'execution_result' | 'user_feedback' | 'pattern_recognition' | 'performance_metric';
export type UserFeedback = 'positive' | 'negative' | 'neutral';
export type UsageType = 'implemented' | 'modified' | 'rejected' | 'saved_for_later';

export type PatternType = 'code_pattern' | 'error_pattern' | 'success_pattern' | 'performance_pattern';
export type ProjectType = 'web_application' | 'api_service' | 'library' | 'cli_tool' | 'mobile_app';

export type MessageType = 'request' | 'response' | 'notification' | 'coordination' | 'status_update';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface NumberRange {
  min: number;
  max: number;
}

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  successRate: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ResponseMetadata {
  processingTime: number;
  timestamp: Date;
  version: string;
  requestId: string;
}

// ============================================================================
// MISSING INTERFACE DEFINITIONS
// ============================================================================

export interface EnvironmentSpec {
  runtime?: string;
  packages?: string[];
  timeout?: number;
  memoryLimit?: string;
  envVars?: Record<string, string>;
}

export interface EnvironmentInfo {
  runtime: string;
  packages: Record<string, string>;
  version: string;
}

export interface ExecutionIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: string;
}

export interface ExecutionRecommendation {
  type: string;
  message: string;
  confidence: number;
}

export interface LearningContext {
  projectId?: string;
  agentId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface PatternExample {
  code: string;
  context: string;
  outcome: string;
}

export interface PatternMetadata {
  language?: SupportedLanguage;
  framework?: string;
  complexity: number;
  tags: string[];
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  description: string;
}

export interface PredictionRecommendation {
  type: string;
  suggestion: string;
  confidence: number;
  impact: string;
}

export interface SimilarPattern {
  patternId: PatternId;
  similarity: number;
  successRate: number;
  description: string;
}

export interface ProjectStructure {
  totalFiles: number;
  codeFiles: number;
  testFiles: number;
  configFiles: number;
  directories: number;
}

export interface ProjectMetrics {
  linesOfCode: number;
  complexity: {
    average: number;
    max: number;
    distribution: Record<string, number>;
  };
  testCoverage: number;
  maintainabilityIndex: number;
}

export interface ProjectRecommendation {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action?: string;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  name: string;
  version: string;
  type: 'direct' | 'dev' | 'peer';
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'requires' | 'optional';
}

export interface CapabilityMetrics {
  accuracy: number;
  performance: number;
  reliability: number;
  lastUpdated: Date;
}
