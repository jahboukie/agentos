#!/usr/bin/env node
"use strict";
/**
 * AgentOS Command Line Interface
 * CLI for AI agents to interact with AgentOS
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
var commander_1 = require("commander");
var chalk_1 = require("chalk");
var AgentOS_1 = require("./core/AgentOS");
var program = new commander_1.Command();
var agentOS;
// Initialize AgentOS instance
function initializeAgentOS() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!agentOS) return [3 /*break*/, 2];
                    agentOS = new AgentOS_1.AgentOS({
                        logLevel: 'info',
                        enableExecution: true,
                        enableLearning: true
                    });
                    return [4 /*yield*/, agentOS.initialize()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Graceful shutdown
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(chalk_1.default.yellow('\n🛑 Shutting down AgentOS...'));
                if (!agentOS) return [3 /*break*/, 2];
                return [4 /*yield*/, agentOS.shutdown()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
// Main program configuration
program
    .name('agentos')
    .description('🤖 AgentOS - Operating System for AI Coding Agents')
    .version('0.1.0')
    .hook('preAction', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initializeAgentOS()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Memory commands
program
    .command('remember <content>')
    .description('Store a memory for persistent intelligence')
    .option('-c, --context <context>', 'Memory context', 'general')
    .option('-t, --type <type>', 'Memory type', 'insight')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--importance <importance>', 'Importance score (0-1)', '0.5')
    .action(function (content, options) { return __awaiter(void 0, void 0, void 0, function () {
    var tags, result, error_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                console.log(chalk_1.default.blue('💾 Storing memory...'));
                tags = options.tags ? options.tags.split(',').map(function (t) { return t.trim(); }) : [];
                return [4 /*yield*/, agentOS.remember({
                        content: content,
                        context: options.context,
                        type: options.type,
                        metadata: {
                            tags: tags,
                            source: 'user_input',
                            confidence: 0.9,
                            validation: 'pending',
                            importance: parseFloat(options.importance),
                            category: options.context
                        },
                        relationships: []
                    })];
            case 1:
                result = _e.sent();
                if (result.success) {
                    console.log(chalk_1.default.green('✅ Memory stored successfully'));
                    console.log(chalk_1.default.gray("   ID: ".concat((_a = result.data) === null || _a === void 0 ? void 0 : _a.id)));
                    console.log(chalk_1.default.gray("   Context: ".concat((_b = result.data) === null || _b === void 0 ? void 0 : _b.context)));
                    console.log(chalk_1.default.gray("   Type: ".concat((_c = result.data) === null || _c === void 0 ? void 0 : _c.type)));
                }
                else {
                    console.log(chalk_1.default.red('❌ Failed to store memory'));
                    console.log(chalk_1.default.red("   Error: ".concat((_d = result.error) === null || _d === void 0 ? void 0 : _d.message)));
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _e.sent();
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_1)));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
program
    .command('recall <query>')
    .description('Search memories using intelligent retrieval')
    .option('-l, --limit <limit>', 'Maximum results to return', '10')
    .option('-c, --context <context>', 'Filter by context')
    .option('-t, --type <type>', 'Filter by memory type')
    .action(function (query, options) { return __awaiter(void 0, void 0, void 0, function () {
    var searchQuery, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(chalk_1.default.blue("\uD83D\uDD0D Searching memories for: \"".concat(query, "\"")));
                searchQuery = {
                    query: query,
                    limit: parseInt(options.limit),
                    context: options.context ? [options.context] : undefined,
                    type: options.type ? [options.type] : undefined
                };
                return [4 /*yield*/, agentOS.recall(searchQuery)];
            case 1:
                result = _a.sent();
                if (result.success && result.data) {
                    console.log(chalk_1.default.green("\u2705 Found ".concat(result.data.length, " memories")));
                    console.log();
                    result.data.forEach(function (searchResult, index) {
                        var memory = searchResult.memory;
                        console.log(chalk_1.default.cyan("".concat(index + 1, ". ").concat(memory.content.substring(0, 80), "...")));
                        console.log(chalk_1.default.gray("   Context: ".concat(memory.context, " | Type: ").concat(memory.type)));
                        console.log(chalk_1.default.gray("   Match Score: ".concat(searchResult.matchScore.toFixed(2), " | Relevance: ").concat(searchResult.relevanceScore.toFixed(2))));
                        console.log(chalk_1.default.gray("   Created: ".concat(new Date(memory.created).toLocaleDateString())));
                        console.log();
                    });
                }
                else {
                    console.log(chalk_1.default.yellow('📭 No memories found'));
                    if (result.error) {
                        console.log(chalk_1.default.red("   Error: ".concat(result.error.message)));
                    }
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_2)));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Execution commands
program
    .command('execute <language> <code>')
    .description('Execute code in a sandboxed environment')
    .option('-t, --timeout <timeout>', 'Execution timeout in seconds', '30')
    .option('-m, --memory <memory>', 'Memory limit', '512MB')
    .option('--purpose <purpose>', 'Execution purpose', 'exploration')
    .action(function (language, code, options) { return __awaiter(void 0, void 0, void 0, function () {
    var result, execution, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log(chalk_1.default.blue("\u26A1 Executing ".concat(language, " code...")));
                return [4 /*yield*/, agentOS.execute({
                        language: language,
                        code: code,
                        timeout: parseInt(options.timeout) * 1000,
                        memoryLimit: options.memory,
                        context: {
                            purpose: options.purpose,
                            metadata: {}
                        }
                    })];
            case 1:
                result = _b.sent();
                if (result.success && result.data) {
                    execution = result.data;
                    console.log(chalk_1.default.green("\u2705 Execution ".concat(execution.status)));
                    console.log();
                    if (execution.result.stdout) {
                        console.log(chalk_1.default.white('📤 Output:'));
                        console.log(execution.result.stdout);
                        console.log();
                    }
                    if (execution.result.stderr) {
                        console.log(chalk_1.default.red('📤 Errors:'));
                        console.log(execution.result.stderr);
                        console.log();
                    }
                    console.log(chalk_1.default.gray("\u23F1\uFE0F  Execution Time: ".concat(execution.result.executionTime, "ms")));
                    console.log(chalk_1.default.gray("\uD83D\uDCBE Memory Usage: ".concat(execution.result.memoryUsage)));
                    console.log(chalk_1.default.gray("\uD83D\uDD27 Performance: ".concat(execution.analysis.performance)));
                    console.log(chalk_1.default.gray("\uD83D\uDEE1\uFE0F  Security Score: ".concat(execution.analysis.securityScore)));
                }
                else {
                    console.log(chalk_1.default.red('❌ Execution failed'));
                    console.log(chalk_1.default.red("   Error: ".concat((_a = result.error) === null || _a === void 0 ? void 0 : _a.message)));
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_3)));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// System commands
program
    .command('status')
    .description('Show AgentOS system status')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, status_1, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log(chalk_1.default.blue('📊 AgentOS System Status'));
                console.log();
                return [4 /*yield*/, agentOS.getStatus()];
            case 1:
                result = _b.sent();
                if (result.success && result.data) {
                    status_1 = result.data;
                    console.log(chalk_1.default.green('🤖 Agent Information:'));
                    console.log(chalk_1.default.gray("   Agent ID: ".concat(status_1.agentId)));
                    console.log(chalk_1.default.gray("   Project ID: ".concat(status_1.projectId)));
                    console.log(chalk_1.default.gray("   Version: ".concat(status_1.version)));
                    console.log(chalk_1.default.gray("   Uptime: ".concat(Math.floor(status_1.uptime), "s")));
                    console.log();
                    console.log(chalk_1.default.green('⚙️  Capabilities:'));
                    console.log(chalk_1.default.gray("   Memory: ".concat(status_1.capabilities.memory ? '✅' : '❌')));
                    console.log(chalk_1.default.gray("   Execution: ".concat(status_1.capabilities.execution ? '✅' : '❌')));
                    console.log(chalk_1.default.gray("   Learning: ".concat(status_1.capabilities.learning ? '✅' : '❌')));
                    console.log();
                    console.log(chalk_1.default.green('💾 Memory Statistics:'));
                    console.log(chalk_1.default.gray("   Total Memories: ".concat(status_1.memory.totalMemories)));
                    console.log(chalk_1.default.gray("   Average Confidence: ".concat((status_1.memory.averageConfidence * 100).toFixed(1), "%")));
                    console.log(chalk_1.default.gray("   Last Accessed: ".concat(new Date(status_1.memory.lastAccessed).toLocaleString())));
                }
                else {
                    console.log(chalk_1.default.red('❌ Failed to get status'));
                    console.log(chalk_1.default.red("   Error: ".concat((_a = result.error) === null || _a === void 0 ? void 0 : _a.message)));
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_4)));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
program
    .command('init')
    .description('Initialize AgentOS for the current project')
    .option('--force', 'Force reinitialization')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            console.log(chalk_1.default.blue('🚀 Initializing AgentOS...'));
            // AgentOS is already initialized in the preAction hook
            console.log(chalk_1.default.green('✅ AgentOS initialized successfully'));
            console.log();
            console.log(chalk_1.default.cyan('🎯 Ready for AI agent operations:'));
            console.log(chalk_1.default.gray('   • agentos remember "your insight"'));
            console.log(chalk_1.default.gray('   • agentos recall "search query"'));
            console.log(chalk_1.default.gray('   • agentos execute javascript "console.log(\'Hello AgentOS\')"'));
            console.log(chalk_1.default.gray('   • agentos status'));
            console.log();
            console.log(chalk_1.default.yellow('💡 AgentOS is designed for AI agents - use it programmatically for best results!'));
        }
        catch (error) {
            console.log(chalk_1.default.red("\u274C Initialization failed: ".concat(error)));
        }
        return [2 /*return*/];
    });
}); });
// Help command enhancement
program.on('--help', function () {
    console.log();
    console.log(chalk_1.default.cyan('🤖 AgentOS - Operating System for AI Coding Agents'));
    console.log();
    console.log(chalk_1.default.yellow('Examples:'));
    console.log('  $ agentos remember "Fixed authentication bug with JWT validation"');
    console.log('  $ agentos recall "authentication bug" --context security');
    console.log('  $ agentos execute javascript "console.log(\'Hello World\')"');
    console.log('  $ agentos status');
    console.log();
    console.log(chalk_1.default.gray('Built with ❤️  by AI agents, for AI agents'));
});
// Parse command line arguments
program.parse();
// If no command provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
