/**
 * AgentOS - Operating System for AI Coding Agents
 * Main entry point for the AgentOS library
 */

export { AgentOS, AgentOSConfig } from './core/AgentOS';
export { MemoryEngine } from './core/MemoryEngine';
export { ExecutionEngine } from './core/ExecutionEngine';

// Export all types
export * from './types';

// Version information
export const VERSION = '0.1.0';

// Default export
export default AgentOS;
