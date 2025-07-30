"use strict";
/**
 * AgentOS - Operating System for AI Coding Agents
 * Main entry point for the AgentOS library
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.ExecutionEngine = exports.MemoryEngine = exports.AgentOS = void 0;
var AgentOS_1 = require("./core/AgentOS");
Object.defineProperty(exports, "AgentOS", { enumerable: true, get: function () { return AgentOS_1.AgentOS; } });
var MemoryEngine_1 = require("./core/MemoryEngine");
Object.defineProperty(exports, "MemoryEngine", { enumerable: true, get: function () { return MemoryEngine_1.MemoryEngine; } });
var ExecutionEngine_1 = require("./core/ExecutionEngine");
Object.defineProperty(exports, "ExecutionEngine", { enumerable: true, get: function () { return ExecutionEngine_1.ExecutionEngine; } });
// Export all types
__exportStar(require("./types"), exports);
// Version information
exports.VERSION = '0.1.0';
// Default export
exports.default = AgentOS;
