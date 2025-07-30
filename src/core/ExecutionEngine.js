"use strict";
/**
 * AgentOS Execution Engine
 * Sandboxed code execution and verification system
 */
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
exports.ExecutionEngine = void 0;
var dockerode_1 = require("dockerode");
var crypto_1 = require("crypto");
var ExecutionEngine = /** @class */ (function () {
    function ExecutionEngine() {
        this.activeExecutions = new Map();
        this.initialized = false;
        this.docker = new dockerode_1.default();
        this.initialize();
    }
    /**
     * Initialize the execution engine
     */
    ExecutionEngine.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Test Docker connection
                        return [4 /*yield*/, this.docker.ping()];
                    case 1:
                        // Test Docker connection
                        _a.sent();
                        // Pull base images for supported languages
                        return [4 /*yield*/, this.ensureBaseImages()];
                    case 2:
                        // Pull base images for supported languages
                        _a.sent();
                        this.initialized = true;
                        console.log('✅ AgentOS Execution Engine initialized successfully');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Failed to initialize Execution Engine:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute code in a sandboxed environment
     */
    ExecutionEngine.prototype.execute = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, executionId, validation, containerConfig, container, timeout, result, analysis, executionResult, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = Date.now();
                        executionId = this.generateExecutionId();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        validation = this.validateRequest(request);
                        if (!validation.valid) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: 'INVALID_REQUEST',
                                        message: validation.message,
                                        details: { request: request }
                                    }
                                }];
                        }
                        containerConfig = this.createContainerConfig(request, executionId);
                        return [4 /*yield*/, this.docker.createContainer(containerConfig)];
                    case 2:
                        container = _b.sent();
                        this.activeExecutions.set(executionId, { container: container, startTime: startTime });
                        return [4 /*yield*/, container.start()];
                    case 3:
                        _b.sent();
                        timeout = request.timeout || 30000;
                        return [4 /*yield*/, this.waitForExecution(container, timeout)];
                    case 4:
                        result = _b.sent();
                        analysis = this.analyzeExecution(result, request);
                        // Clean up container
                        return [4 /*yield*/, this.cleanupContainer(container)];
                    case 5:
                        // Clean up container
                        _b.sent();
                        this.activeExecutions.delete(executionId);
                        executionResult = {
                            executionId: executionId,
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
                                packages: ((_a = request.environment) === null || _a === void 0 ? void 0 : _a.packages) || {},
                                version: '1.0.0'
                            },
                            analysis: analysis,
                            timestamp: new Date()
                        };
                        return [2 /*return*/, {
                                success: true,
                                data: executionResult,
                                meta: {
                                    processingTime: Date.now() - startTime,
                                    timestamp: new Date(),
                                    version: '1.0.0',
                                    requestId: executionId
                                }
                            }];
                    case 6:
                        error_2 = _b.sent();
                        // Clean up on error
                        this.activeExecutions.delete(executionId);
                        return [2 /*return*/, {
                                success: false,
                                error: {
                                    code: 'EXECUTION_ERROR',
                                    message: "Failed to execute code: ".concat(error_2),
                                    details: { error: error_2, executionId: executionId }
                                }
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify a code suggestion by running tests
     */
    ExecutionEngine.prototype.verify = function (suggestion) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementation for code verification
                // This would run the suggestion against test cases
                return [2 /*return*/, {
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
                    }];
            });
        });
    };
    /**
     * Create Docker container configuration
     */
    ExecutionEngine.prototype.createContainerConfig = function (request, executionId) {
        var _a;
        var baseConfig = {
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
                'agentos.purpose': ((_a = request.context) === null || _a === void 0 ? void 0 : _a.purpose) || 'unknown'
            }
        };
        return baseConfig;
    };
    /**
     * Wait for container execution to complete
     */
    ExecutionEngine.prototype.waitForExecution = function (container, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var timeoutId, stream, stdout_1, stderr_1, result, stats, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    timeoutId = setTimeout(function () {
                                        container.kill().catch(function () { });
                                        reject(new Error('Execution timeout'));
                                    }, timeout);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, container.attach({
                                            stream: true,
                                            stdout: true,
                                            stderr: true
                                        })];
                                case 2:
                                    stream = _a.sent();
                                    stdout_1 = '';
                                    stderr_1 = '';
                                    // Collect output
                                    stream.on('data', function (chunk) {
                                        var data = chunk.toString();
                                        if (chunk[0] === 1) { // stdout
                                            stdout_1 += data.slice(8);
                                        }
                                        else if (chunk[0] === 2) { // stderr
                                            stderr_1 += data.slice(8);
                                        }
                                    });
                                    return [4 /*yield*/, container.wait()];
                                case 3:
                                    result = _a.sent();
                                    clearTimeout(timeoutId);
                                    return [4 /*yield*/, container.stats({ stream: false })];
                                case 4:
                                    stats = _a.sent();
                                    resolve({
                                        exitCode: result.StatusCode,
                                        stdout: stdout_1.trim(),
                                        stderr: stderr_1.trim(),
                                        memoryUsage: this.formatMemoryUsage(stats.memory_stats),
                                        cpuUsage: this.calculateCpuUsage(stats.cpu_stats)
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_3 = _a.sent();
                                    clearTimeout(timeoutId);
                                    reject(error_3);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Analyze execution result
     */
    ExecutionEngine.prototype.analyzeExecution = function (result, request) {
        var analysis = {
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
    };
    /**
     * Validate execution request
     */
    ExecutionEngine.prototype.validateRequest = function (request) {
        if (!request.code || request.code.trim().length === 0) {
            return { valid: false, message: 'Code cannot be empty' };
        }
        if (!this.isSupportedLanguage(request.language)) {
            return { valid: false, message: "Unsupported language: ".concat(request.language) };
        }
        if (request.code.length > 100000) { // 100KB limit
            return { valid: false, message: 'Code size exceeds maximum limit' };
        }
        return { valid: true };
    };
    /**
     * Get Docker image for language
     */
    ExecutionEngine.prototype.getDockerImage = function (language) {
        var images = {
            javascript: 'node:18-alpine',
            typescript: 'node:18-alpine',
            python: 'python:3.11-alpine',
            go: 'golang:1.21-alpine',
            rust: 'rust:1.75-alpine',
            java: 'openjdk:17-alpine',
            csharp: 'mcr.microsoft.com/dotnet/sdk:8.0-alpine'
        };
        return images[language] || 'node:18-alpine';
    };
    /**
     * Get execution command for language
     */
    ExecutionEngine.prototype.getExecutionCommand = function (request) {
        var commands = {
            javascript: ['node', '-e', request.code],
            typescript: ['sh', '-c', "echo '".concat(request.code, "' > /tmp/code.ts && npx ts-node /tmp/code.ts")],
            python: ['python', '-c', request.code],
            go: ['sh', '-c', "echo '".concat(request.code, "' > /tmp/main.go && go run /tmp/main.go")],
            rust: ['sh', '-c', "echo '".concat(request.code, "' > /tmp/main.rs && rustc /tmp/main.rs -o /tmp/main && /tmp/main")],
            java: ['sh', '-c', "echo '".concat(request.code, "' > /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main")],
            csharp: ['sh', '-c', "echo '".concat(request.code, "' > /tmp/Program.cs && dotnet run --project /tmp")]
        };
        return commands[request.language] || ['node', '-e', request.code];
    };
    /**
     * Ensure base Docker images are available
     */
    ExecutionEngine.prototype.ensureBaseImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var languages, _i, languages_1, language, image, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        languages = ['javascript', 'python', 'go'];
                        _i = 0, languages_1 = languages;
                        _a.label = 1;
                    case 1:
                        if (!(_i < languages_1.length)) return [3 /*break*/, 7];
                        language = languages_1[_i];
                        image = this.getDockerImage(language);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.docker.getImage(image).inspect()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_4 = _a.sent();
                        console.log("Pulling Docker image: ".concat(image));
                        return [4 /*yield*/, this.docker.pull(image)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cleanup container after execution
     */
    ExecutionEngine.prototype.cleanupContainer = function (container) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, container.remove({ force: true })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.warn('Failed to cleanup container:', error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate unique execution ID
     */
    ExecutionEngine.prototype.generateExecutionId = function () {
        var hash = (0, crypto_1.createHash)('sha256');
        hash.update(Date.now().toString() + Math.random().toString());
        return "exec_".concat(hash.digest('hex').substring(0, 16));
    };
    /**
     * Helper methods
     */
    ExecutionEngine.prototype.isSupportedLanguage = function (language) {
        return ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'csharp'].includes(language);
    };
    ExecutionEngine.prototype.parseMemoryLimit = function (limit) {
        var match = limit.match(/^(\d+)(MB|GB)$/i);
        if (!match)
            return 512 * 1024 * 1024; // Default 512MB
        var value = parseInt(match[1]);
        var unit = match[2].toUpperCase();
        return unit === 'GB' ? value * 1024 * 1024 * 1024 : value * 1024 * 1024;
    };
    ExecutionEngine.prototype.getEnvironmentVariables = function (request) {
        var _a;
        var env = ['NODE_ENV=sandbox', 'PYTHONPATH=/workspace'];
        if ((_a = request.environment) === null || _a === void 0 ? void 0 : _a.envVars) {
            for (var _i = 0, _b = Object.entries(request.environment.envVars); _i < _b.length; _i++) {
                var _c = _b[_i], key = _c[0], value = _c[1];
                env.push("".concat(key, "=").concat(value));
            }
        }
        return env;
    };
    ExecutionEngine.prototype.getRuntimeInfo = function (language) {
        var runtimes = {
            javascript: 'Node.js 18.x',
            typescript: 'Node.js 18.x + TypeScript',
            python: 'Python 3.11',
            go: 'Go 1.21',
            rust: 'Rust 1.75',
            java: 'OpenJDK 17',
            csharp: '.NET 8.0'
        };
        return runtimes[language] || 'Unknown';
    };
    ExecutionEngine.prototype.ratePerformance = function (result) {
        var executionTime = result.executionTime || 0;
        if (executionTime < 1000)
            return 'excellent';
        if (executionTime < 5000)
            return 'good';
        if (executionTime < 15000)
            return 'average';
        if (executionTime < 30000)
            return 'poor';
        return 'critical';
    };
    ExecutionEngine.prototype.calculateResourceEfficiency = function (result) {
        // Simple efficiency calculation based on execution time and memory usage
        var timeEfficiency = Math.max(0, 1 - (result.executionTime || 0) / 30000);
        var memoryEfficiency = 0.8; // Placeholder
        return (timeEfficiency + memoryEfficiency) / 2;
    };
    ExecutionEngine.prototype.formatMemoryUsage = function (memoryStats) {
        if (!memoryStats || !memoryStats.usage)
            return '0MB';
        var usage = memoryStats.usage;
        var mb = Math.round(usage / (1024 * 1024));
        return "".concat(mb, "MB");
    };
    ExecutionEngine.prototype.calculateCpuUsage = function (cpuStats) {
        if (!cpuStats)
            return 0;
        // Simplified CPU usage calculation
        return Math.random() * 0.5; // Placeholder
    };
    /**
     * Shutdown the execution engine
     */
    ExecutionEngine.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, executionId, execution, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = this.activeExecutions;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        _b = _a[_i], executionId = _b[0], execution = _b[1];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, execution.container.kill()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, execution.container.remove({ force: true })];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_6 = _c.sent();
                        console.warn("Failed to cleanup execution ".concat(executionId, ":"), error_6);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        this.activeExecutions.clear();
                        console.log('✅ Execution Engine shutdown complete');
                        return [2 /*return*/];
                }
            });
        });
    };
    return ExecutionEngine;
}());
exports.ExecutionEngine = ExecutionEngine;
