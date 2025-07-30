"use strict";
/**
 * AgentOS Core System
 * The main orchestrator for the AI Agent Operating System
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOS = void 0;
var MemoryEngine_1 = require("./MemoryEngine");
var ExecutionEngine_1 = require("./ExecutionEngine");
var AgentOS = /** @class */ (function () {
    function AgentOS(config) {
        if (config === void 0) { config = {}; }
        var _a, _b;
        this.initialized = false;
        this.config = {
            memoryDbPath: config.memoryDbPath || './agentos-memory.db',
            agentId: config.agentId || this.generateAgentId(),
            projectId: config.projectId || 'default',
            enableExecution: (_a = config.enableExecution) !== null && _a !== void 0 ? _a : true,
            enableLearning: (_b = config.enableLearning) !== null && _b !== void 0 ? _b : true,
            logLevel: config.logLevel || 'info'
        };
        this.memoryEngine = new MemoryEngine_1.MemoryEngine(this.config.memoryDbPath);
        this.executionEngine = new ExecutionEngine_1.ExecutionEngine();
    }
    /**
     * Initialize AgentOS
     */
    AgentOS.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.log('info', '🚀 Initializing AgentOS...');
                        // Memory engine is initialized in constructor
                        // Execution engine initialization is handled internally
                        this.initialized = true;
                        this.log('info', '✅ AgentOS initialized successfully');
                        // Store initialization memory
                        return [4 /*yield*/, this.remember({
                                content: "AgentOS initialized for agent ".concat(this.config.agentId),
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
                            })];
                    case 1:
                        // Store initialization memory
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.log('error', "\u274C Failed to initialize AgentOS: ".concat(error_1));
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store a memory (enhanced AntiGoldfishMode functionality)
     */
    AgentOS.prototype.remember = function (memory) {
        return __awaiter(this, void 0, void 0, function () {
            var enhancedMemory, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.ensureInitialized();
                        enhancedMemory = __assign(__assign({}, memory), { metadata: __assign(__assign({}, memory.metadata), { agentId: memory.metadata.agentId || this.config.agentId, projectId: memory.metadata.projectId || this.config.projectId }) });
                        return [4 /*yield*/, this.memoryEngine.store(enhancedMemory)];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            this.log('debug', "\uD83D\uDCBE Stored memory: ".concat(memory.content.substring(0, 50), "..."));
                        }
                        else {
                            this.log('error', "\u274C Failed to store memory: ".concat((_a = result.error) === null || _a === void 0 ? void 0 : _a.message));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Search memories (enhanced AntiGoldfishMode functionality)
     */
    AgentOS.prototype.recall = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var searchQuery, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.ensureInitialized();
                        searchQuery = typeof query === 'string'
                            ? {
                                query: query,
                                projectId: this.config.projectId,
                                agentId: this.config.agentId,
                                limit: 10
                            }
                            : __assign(__assign({}, query), { projectId: query.projectId || this.config.projectId, agentId: query.agentId || this.config.agentId });
                        return [4 /*yield*/, this.memoryEngine.search(searchQuery)];
                    case 1:
                        result = _c.sent();
                        if (result.success) {
                            this.log('debug', "\uD83D\uDD0D Found ".concat(((_a = result.data) === null || _a === void 0 ? void 0 : _a.length) || 0, " memories for query"));
                        }
                        else {
                            this.log('error', "\u274C Failed to search memories: ".concat((_b = result.error) === null || _b === void 0 ? void 0 : _b.message));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Execute code in sandboxed environment
     */
    AgentOS.prototype.execute = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var enhancedRequest, result;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        this.ensureInitialized();
                        if (!this.config.enableExecution) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: 'EXECUTION_DISABLED',
                                        message: 'Code execution is disabled in this AgentOS instance'
                                    }
                                }];
                        }
                        enhancedRequest = __assign(__assign({}, request), { context: __assign(__assign({}, request.context), { projectId: ((_a = request.context) === null || _a === void 0 ? void 0 : _a.projectId) || this.config.projectId, metadata: __assign(__assign({}, (_b = request.context) === null || _b === void 0 ? void 0 : _b.metadata), { agentId: this.config.agentId }) }) });
                        return [4 /*yield*/, this.executionEngine.execute(enhancedRequest)];
                    case 1:
                        result = _f.sent();
                        if (!(result.success && this.config.enableLearning)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.remember({
                                content: "Executed ".concat(request.language, " code: ").concat(request.code.substring(0, 100), "..."),
                                context: 'execution',
                                type: 'solution',
                                metadata: {
                                    agentId: this.config.agentId,
                                    projectId: this.config.projectId,
                                    tags: ['execution', request.language, ((_c = result.data) === null || _c === void 0 ? void 0 : _c.status) || 'unknown'],
                                    source: 'execution_result',
                                    confidence: ((_d = result.data) === null || _d === void 0 ? void 0 : _d.analysis.success) ? 0.9 : 0.3,
                                    validation: 'pending',
                                    importance: 0.7,
                                    category: 'execution'
                                },
                                relationships: []
                            })];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        if (result.success) {
                            this.log('debug', "\u26A1 Executed ".concat(request.language, " code successfully"));
                        }
                        else {
                            this.log('error', "\u274C Failed to execute code: ".concat((_e = result.error) === null || _e === void 0 ? void 0 : _e.message));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Verify code suggestion
     */
    AgentOS.prototype.verify = function (suggestion) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.ensureInitialized();
                        if (!this.config.enableExecution) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: 'EXECUTION_DISABLED',
                                        message: 'Code verification requires execution to be enabled'
                                    }
                                }];
                        }
                        return [4 /*yield*/, this.executionEngine.verify(suggestion)];
                    case 1:
                        result = _d.sent();
                        if (!(result.success && this.config.enableLearning)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.remember({
                                content: "Verified code suggestion with ".concat(((_a = result.data) === null || _a === void 0 ? void 0 : _a.successProbability) * 100, "% success probability"),
                                context: 'verification',
                                type: 'pattern',
                                metadata: {
                                    agentId: this.config.agentId,
                                    projectId: this.config.projectId,
                                    tags: ['verification', 'code-suggestion', ((_b = result.data) === null || _b === void 0 ? void 0 : _b.overallResult) || 'unknown'],
                                    source: 'execution_result',
                                    confidence: ((_c = result.data) === null || _c === void 0 ? void 0 : _c.successProbability) || 0.5,
                                    validation: 'validated',
                                    importance: 0.8,
                                    category: 'verification'
                                },
                                relationships: []
                            })];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get system status
     */
    AgentOS.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var memoryStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMemoryStats()];
                    case 1:
                        memoryStats = _a.sent();
                        return [2 /*return*/, {
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
                            }];
                }
            });
        });
    };
    /**
     * Learn from execution outcomes
     */
    AgentOS.prototype.learn = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureInitialized();
                        if (!this.config.enableLearning) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: 'LEARNING_DISABLED',
                                        message: 'Learning is disabled in this AgentOS instance'
                                    }
                                }];
                        }
                        // Store learning data as memory
                        return [4 /*yield*/, this.remember({
                                content: "Learning data: ".concat(JSON.stringify(data).substring(0, 200), "..."),
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
                            })];
                    case 1:
                        // Store learning data as memory
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    learned: true,
                                    patterns: [],
                                    improvements: []
                                }
                            }];
                }
            });
        });
    };
    /**
     * Shutdown AgentOS
     */
    AgentOS.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log('info', '🛑 Shutting down AgentOS...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!this.config.enableExecution) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.executionEngine.shutdown()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.memoryEngine.close();
                        this.log('info', '✅ AgentOS shutdown complete');
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        this.log('error', "\u274C Error during shutdown: ".concat(error_2));
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Private helper methods
     */
    AgentOS.prototype.ensureInitialized = function () {
        if (!this.initialized) {
            throw new Error('AgentOS not initialized. Call initialize() first.');
        }
    };
    AgentOS.prototype.generateAgentId = function () {
        return "agent_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 8));
    };
    AgentOS.prototype.generateRequestId = function () {
        return "req_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 8));
    };
    AgentOS.prototype.getMemoryStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allMemories;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.recall({ limit: 1000 })];
                    case 1:
                        allMemories = _b.sent();
                        return [2 /*return*/, {
                                totalMemories: ((_a = allMemories.data) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                byType: {},
                                byContext: {},
                                averageConfidence: 0.8,
                                lastAccessed: new Date()
                            }];
                }
            });
        });
    };
    AgentOS.prototype.log = function (level, message) {
        var levels = { debug: 0, info: 1, warn: 2, error: 3 };
        var configLevel = levels[this.config.logLevel];
        var messageLevel = levels[level];
        if (messageLevel >= configLevel) {
            var timestamp = new Date().toISOString();
            console.log("[".concat(timestamp, "] [").concat(level.toUpperCase(), "] [AgentOS] ").concat(message));
        }
    };
    return AgentOS;
}());
exports.AgentOS = AgentOS;
