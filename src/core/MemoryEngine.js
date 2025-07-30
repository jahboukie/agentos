"use strict";
/**
 * AgentOS Memory Engine
 * Enhanced persistent intelligence system for AI agents
 * Built on the proven AntiGoldfishMode foundation
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
exports.MemoryEngine = void 0;
var better_sqlite3_1 = require("better-sqlite3");
var crypto_1 = require("crypto");
var MemoryEngine = /** @class */ (function () {
    function MemoryEngine(dbPath) {
        if (dbPath === void 0) { dbPath = './agentos-memory.db'; }
        this.dbPath = dbPath;
        this.initialized = false;
        this.db = new better_sqlite3_1.default(dbPath);
        this.initializeDatabase();
    }
    /**
     * Initialize the enhanced memory database schema
     */
    MemoryEngine.prototype.initializeDatabase = function () {
        try {
            // Enable WAL mode for better concurrent access
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('synchronous = NORMAL');
            this.db.pragma('cache_size = 1000');
            this.db.pragma('temp_store = memory');
            // Create memories table with enhanced schema
            this.db.exec("\n        CREATE TABLE IF NOT EXISTS memories (\n          id TEXT PRIMARY KEY,\n          content TEXT NOT NULL,\n          context TEXT NOT NULL,\n          type TEXT NOT NULL,\n          project_id TEXT,\n          agent_id TEXT,\n          session_id TEXT,\n          tags TEXT, -- JSON array\n          source TEXT NOT NULL,\n          confidence REAL NOT NULL,\n          validation_status TEXT DEFAULT 'pending',\n          importance REAL DEFAULT 0.5,\n          category TEXT DEFAULT 'general',\n          embeddings BLOB, -- Vector embeddings for semantic search\n          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n          accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n          access_count INTEGER DEFAULT 0,\n          relevance_score REAL DEFAULT 0.0\n        )\n      ");
            // Create memory relationships table
            this.db.exec("\n        CREATE TABLE IF NOT EXISTS memory_relationships (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          source_memory_id TEXT NOT NULL,\n          target_memory_id TEXT NOT NULL,\n          relationship_type TEXT NOT NULL,\n          strength REAL NOT NULL,\n          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n          FOREIGN KEY (source_memory_id) REFERENCES memories (id) ON DELETE CASCADE,\n          FOREIGN KEY (target_memory_id) REFERENCES memories (id) ON DELETE CASCADE,\n          UNIQUE(source_memory_id, target_memory_id, relationship_type)\n        )\n      ");
            // Create indexes for performance
            this.db.exec("\n        CREATE INDEX IF NOT EXISTS idx_memories_context ON memories(context);\n        CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);\n        CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);\n        CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(agent_id);\n        CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(created_at);\n        CREATE INDEX IF NOT EXISTS idx_memories_relevance ON memories(relevance_score DESC);\n        CREATE INDEX IF NOT EXISTS idx_relationships_source ON memory_relationships(source_memory_id);\n        CREATE INDEX IF NOT EXISTS idx_relationships_target ON memory_relationships(target_memory_id);\n      ");
            // Enable FTS5 for full-text search
            this.db.exec("\n        CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(\n          id UNINDEXED,\n          content,\n          context,\n          tags,\n          content='memories',\n          content_rowid='rowid'\n        );\n      ");
            // Create triggers to keep FTS in sync
            this.db.exec("\n        CREATE TRIGGER IF NOT EXISTS memories_fts_insert AFTER INSERT ON memories BEGIN\n          INSERT INTO memories_fts(id, content, context, tags) \n          VALUES (new.id, new.content, new.context, new.tags);\n        END;\n\n        CREATE TRIGGER IF NOT EXISTS memories_fts_delete AFTER DELETE ON memories BEGIN\n          DELETE FROM memories_fts WHERE id = old.id;\n        END;\n\n        CREATE TRIGGER IF NOT EXISTS memories_fts_update AFTER UPDATE ON memories BEGIN\n          DELETE FROM memories_fts WHERE id = old.id;\n          INSERT INTO memories_fts(id, content, context, tags) \n          VALUES (new.id, new.content, new.context, new.tags);\n        END;\n      ");
            this.initialized = true;
            console.log('✅ AgentOS Memory Engine initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Memory Engine:', error);
            throw error;
        }
    };
    /**
     * Store a new memory with enhanced metadata
     */
    MemoryEngine.prototype.store = function (memory) {
        return __awaiter(this, void 0, void 0, function () {
            var memoryId, now, stmt, result, storedMemory, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        memoryId = this.generateMemoryId(memory.content, memory.context);
                        now = new Date();
                        stmt = this.db.prepare("\n        INSERT OR REPLACE INTO memories (\n          id, content, context, type, project_id, agent_id, session_id,\n          tags, source, confidence, validation_status, importance, category,\n          embeddings, created_at, updated_at, accessed_at, access_count, relevance_score\n        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n      ");
                        result = stmt.run(memoryId, memory.content, memory.context, memory.type, memory.metadata.projectId || null, memory.metadata.agentId || null, memory.metadata.sessionId || null, JSON.stringify(memory.metadata.tags), memory.metadata.source, memory.metadata.confidence, memory.metadata.validation, memory.metadata.importance || 0.5, memory.metadata.category || 'general', memory.embeddings ? Buffer.from(new Float32Array(memory.embeddings).buffer) : null, now.toISOString(), now.toISOString(), now.toISOString(), 0, this.calculateRelevanceScore(memory));
                        if (!(memory.relationships && memory.relationships.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storeRelationships(memoryId, memory.relationships)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.retrieve(memoryId)];
                    case 3:
                        storedMemory = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: storedMemory,
                                meta: {
                                    processingTime: Date.now() - now.getTime(),
                                    timestamp: now,
                                    version: '1.0.0',
                                    requestId: memoryId
                                }
                            }];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: {
                                    code: 'MEMORY_STORE_ERROR',
                                    message: "Failed to store memory: ".concat(error_1),
                                    details: { error: error_1 }
                                }
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve a specific memory by ID
     */
    MemoryEngine.prototype.retrieve = function (memoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, row, relationships, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        stmt = this.db.prepare("\n        SELECT * FROM memories WHERE id = ?\n      ");
                        row = stmt.get(memoryId);
                        if (!row)
                            return [2 /*return*/, null];
                        // Update access tracking
                        this.updateAccessTracking(memoryId);
                        return [4 /*yield*/, this.getRelationships(memoryId)];
                    case 1:
                        relationships = _a.sent();
                        return [2 /*return*/, this.rowToMemory(row, relationships)];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Failed to retrieve memory:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Enhanced semantic search with multiple strategies
     */
    MemoryEngine.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, sql, params, stmt, rows, results, _i, rows_1, row, relationships, memory, searchResult, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = Date.now();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        sql = "\n        SELECT m.*, \n               COALESCE(fts.rank, 0) as fts_score,\n               CASE \n                 WHEN m.context = ? THEN 1.0 \n                 ELSE 0.5 \n               END as context_match_score\n        FROM memories m\n        LEFT JOIN memories_fts fts ON m.id = fts.id\n        WHERE 1=1\n      ";
                        params = [((_a = query.context) === null || _a === void 0 ? void 0 : _a[0]) || ''];
                        // Add search conditions
                        if (query.query) {
                            sql += " AND fts.memories_fts MATCH ?";
                            params.push(query.query);
                        }
                        if (query.context && query.context.length > 0) {
                            sql += " AND m.context IN (".concat(query.context.map(function () { return '?'; }).join(','), ")");
                            params.push.apply(params, query.context);
                        }
                        if (query.type && query.type.length > 0) {
                            sql += " AND m.type IN (".concat(query.type.map(function () { return '?'; }).join(','), ")");
                            params.push.apply(params, query.type);
                        }
                        if (query.projectId) {
                            sql += " AND m.project_id = ?";
                            params.push(query.projectId);
                        }
                        if (query.agentId) {
                            sql += " AND m.agent_id = ?";
                            params.push(query.agentId);
                        }
                        if (query.confidenceRange) {
                            sql += " AND m.confidence BETWEEN ? AND ?";
                            params.push(query.confidenceRange.min, query.confidenceRange.max);
                        }
                        if (query.dateRange) {
                            sql += " AND m.created_at BETWEEN ? AND ?";
                            params.push(query.dateRange.start.toISOString(), query.dateRange.end.toISOString());
                        }
                        // Order by relevance
                        sql += " ORDER BY \n                 (fts_score * 0.4 + \n                  context_match_score * 0.3 + \n                  m.relevance_score * 0.2 + \n                  m.importance * 0.1) DESC";
                        if (query.limit) {
                            sql += " LIMIT ?";
                            params.push(query.limit);
                        }
                        if (query.offset) {
                            sql += " OFFSET ?";
                            params.push(query.offset);
                        }
                        stmt = this.db.prepare(sql);
                        rows = stmt.all.apply(stmt, params);
                        results = [];
                        _i = 0, rows_1 = rows;
                        _b.label = 2;
                    case 2:
                        if (!(_i < rows_1.length)) return [3 /*break*/, 5];
                        row = rows_1[_i];
                        return [4 /*yield*/, this.getRelationships(row.id)];
                    case 3:
                        relationships = _b.sent();
                        memory = this.rowToMemory(row, relationships);
                        searchResult = {
                            memory: memory,
                            matchScore: row.fts_score || 0,
                            relevanceScore: row.relevance_score,
                            contextMatch: row.context_match_score > 0.9,
                            highlights: this.extractHighlights(memory.content, query.query || '')
                        };
                        results.push(searchResult);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            success: true,
                            data: results,
                            meta: {
                                processingTime: Date.now() - startTime,
                                timestamp: new Date(),
                                version: '1.0.0',
                                requestId: this.generateRequestId()
                            }
                        }];
                    case 6:
                        error_3 = _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: {
                                    code: 'MEMORY_SEARCH_ERROR',
                                    message: "Failed to search memories: ".concat(error_3),
                                    details: { error: error_3, query: query }
                                }
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store memory relationships
     */
    MemoryEngine.prototype.storeRelationships = function (memoryId, relationships) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, _i, relationships_1, rel;
            return __generator(this, function (_a) {
                stmt = this.db.prepare("\n      INSERT OR REPLACE INTO memory_relationships \n      (source_memory_id, target_memory_id, relationship_type, strength, created_at)\n      VALUES (?, ?, ?, ?, ?)\n    ");
                for (_i = 0, relationships_1 = relationships; _i < relationships_1.length; _i++) {
                    rel = relationships_1[_i];
                    stmt.run(memoryId, rel.targetMemoryId, rel.relationshipType, rel.strength, rel.created.toISOString());
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get relationships for a memory
     */
    MemoryEngine.prototype.getRelationships = function (memoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, rows;
            return __generator(this, function (_a) {
                stmt = this.db.prepare("\n      SELECT * FROM memory_relationships \n      WHERE source_memory_id = ? OR target_memory_id = ?\n    ");
                rows = stmt.all(memoryId, memoryId);
                return [2 /*return*/, rows.map(function (row) { return ({
                        targetMemoryId: row.source_memory_id === memoryId ? row.target_memory_id : row.source_memory_id,
                        relationshipType: row.relationship_type,
                        strength: row.strength,
                        created: new Date(row.created_at)
                    }); })];
            });
        });
    };
    /**
     * Convert database row to Memory object
     */
    MemoryEngine.prototype.rowToMemory = function (row, relationships) {
        return {
            id: row.id,
            content: row.content,
            context: row.context,
            type: row.type,
            metadata: {
                projectId: row.project_id,
                agentId: row.agent_id,
                sessionId: row.session_id,
                tags: JSON.parse(row.tags || '[]'),
                source: row.source,
                confidence: row.confidence,
                validation: row.validation_status,
                importance: row.importance,
                category: row.category
            },
            embeddings: row.embeddings ? Array.from(new Float32Array(row.embeddings.buffer)) : undefined,
            relationships: relationships,
            created: new Date(row.created_at),
            updated: new Date(row.updated_at),
            accessed: new Date(row.accessed_at),
            accessCount: row.access_count,
            relevanceScore: row.relevance_score
        };
    };
    /**
     * Generate unique memory ID
     */
    MemoryEngine.prototype.generateMemoryId = function (content, context) {
        var hash = (0, crypto_1.createHash)('sha256');
        hash.update(content + context + Date.now().toString());
        return "mem_".concat(hash.digest('hex').substring(0, 16));
    };
    /**
     * Generate request ID
     */
    MemoryEngine.prototype.generateRequestId = function () {
        return "req_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 8));
    };
    /**
     * Calculate relevance score based on memory attributes
     */
    MemoryEngine.prototype.calculateRelevanceScore = function (memory) {
        var score = 0.5; // Base score
        // Boost score based on confidence
        score += memory.metadata.confidence * 0.3;
        // Boost score based on importance
        score += (memory.metadata.importance || 0.5) * 0.2;
        // Boost score for validated memories
        if (memory.metadata.validation === 'validated') {
            score += 0.1;
        }
        return Math.min(1.0, Math.max(0.0, score));
    };
    /**
     * Update access tracking for a memory
     */
    MemoryEngine.prototype.updateAccessTracking = function (memoryId) {
        var stmt = this.db.prepare("\n      UPDATE memories \n      SET accessed_at = CURRENT_TIMESTAMP, access_count = access_count + 1\n      WHERE id = ?\n    ");
        stmt.run(memoryId);
    };
    /**
     * Extract highlights from content based on query
     */
    MemoryEngine.prototype.extractHighlights = function (content, query) {
        if (!query)
            return [];
        var words = query.toLowerCase().split(/\s+/);
        var highlights = [];
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            var regex = new RegExp("(.{0,30}".concat(word, ".{0,30})"), 'gi');
            var matches = content.match(regex);
            if (matches) {
                highlights.push.apply(highlights, matches.slice(0, 3)); // Limit to 3 highlights per word
            }
        }
        return highlights.slice(0, 5); // Limit total highlights
    };
    /**
     * Close database connection
     */
    MemoryEngine.prototype.close = function () {
        if (this.db) {
            this.db.close();
        }
    };
    return MemoryEngine;
}());
exports.MemoryEngine = MemoryEngine;
