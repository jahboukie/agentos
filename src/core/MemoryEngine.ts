/**
 * AgentOS Memory Engine
 * Enhanced persistent intelligence system for AI agents
 * Built on the proven AntiGoldfishMode foundation
 */

import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import { 
  Memory, 
  MemoryId, 
  MemoryQuery, 
  MemoryMetadata,
  MemoryRelationship,
  SearchResult,
  ApiResponse 
} from '../types';

export class MemoryEngine {
  private db: Database.Database;
  private initialized: boolean = false;

  constructor(private dbPath: string = './agentos-memory.db') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  /**
   * Initialize the enhanced memory database schema
   */
  private initializeDatabase(): void {
    try {
      // Enable WAL mode for better concurrent access
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 1000');
      this.db.pragma('temp_store = memory');

      // Create memories table with enhanced schema
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          context TEXT NOT NULL,
          type TEXT NOT NULL,
          project_id TEXT,
          agent_id TEXT,
          session_id TEXT,
          tags TEXT, -- JSON array
          source TEXT NOT NULL,
          confidence REAL NOT NULL,
          validation_status TEXT DEFAULT 'pending',
          importance REAL DEFAULT 0.5,
          category TEXT DEFAULT 'general',
          embeddings BLOB, -- Vector embeddings for semantic search
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          access_count INTEGER DEFAULT 0,
          relevance_score REAL DEFAULT 0.0
        )
      `);

      // Create memory relationships table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS memory_relationships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_memory_id TEXT NOT NULL,
          target_memory_id TEXT NOT NULL,
          relationship_type TEXT NOT NULL,
          strength REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (source_memory_id) REFERENCES memories (id) ON DELETE CASCADE,
          FOREIGN KEY (target_memory_id) REFERENCES memories (id) ON DELETE CASCADE,
          UNIQUE(source_memory_id, target_memory_id, relationship_type)
        )
      `);

      // Create indexes for performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_memories_context ON memories(context);
        CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
        CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
        CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(agent_id);
        CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(created_at);
        CREATE INDEX IF NOT EXISTS idx_memories_relevance ON memories(relevance_score DESC);
        CREATE INDEX IF NOT EXISTS idx_relationships_source ON memory_relationships(source_memory_id);
        CREATE INDEX IF NOT EXISTS idx_relationships_target ON memory_relationships(target_memory_id);
      `);

      // Enable FTS5 for full-text search
      this.db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
          id UNINDEXED,
          content,
          context,
          tags,
          content='memories',
          content_rowid='rowid'
        );
      `);

      // Create triggers to keep FTS in sync
      this.db.exec(`
        CREATE TRIGGER IF NOT EXISTS memories_fts_insert AFTER INSERT ON memories BEGIN
          INSERT INTO memories_fts(id, content, context, tags) 
          VALUES (new.id, new.content, new.context, new.tags);
        END;

        CREATE TRIGGER IF NOT EXISTS memories_fts_delete AFTER DELETE ON memories BEGIN
          DELETE FROM memories_fts WHERE id = old.id;
        END;

        CREATE TRIGGER IF NOT EXISTS memories_fts_update AFTER UPDATE ON memories BEGIN
          DELETE FROM memories_fts WHERE id = old.id;
          INSERT INTO memories_fts(id, content, context, tags) 
          VALUES (new.id, new.content, new.context, new.tags);
        END;
      `);

      this.initialized = true;
      console.log('✅ AgentOS Memory Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Memory Engine:', error);
      throw error;
    }
  }

  /**
   * Store a new memory with enhanced metadata
   */
  async store(memory: Omit<Memory, 'id' | 'created' | 'updated' | 'accessed' | 'accessCount' | 'relevanceScore'>): Promise<ApiResponse<Memory>> {
    try {
      const memoryId = this.generateMemoryId(memory.content, memory.context);
      const now = new Date();

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO memories (
          id, content, context, type, project_id, agent_id, session_id,
          tags, source, confidence, validation_status, importance, category,
          embeddings, created_at, updated_at, accessed_at, access_count, relevance_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        memoryId,
        memory.content,
        memory.context,
        memory.type,
        memory.metadata.projectId || null,
        memory.metadata.agentId || null,
        memory.metadata.sessionId || null,
        JSON.stringify(memory.metadata.tags),
        memory.metadata.source,
        memory.metadata.confidence,
        memory.metadata.validation,
        memory.metadata.importance || 0.5,
        memory.metadata.category || 'general',
        memory.embeddings ? Buffer.from(new Float32Array(memory.embeddings).buffer) : null,
        now.toISOString(),
        now.toISOString(),
        now.toISOString(),
        0,
        this.calculateRelevanceScore(memory)
      );

      // Store relationships if provided
      if (memory.relationships && memory.relationships.length > 0) {
        await this.storeRelationships(memoryId, memory.relationships);
      }

      const storedMemory = await this.retrieve(memoryId);
      
      return {
        success: true,
        data: storedMemory!,
        meta: {
          processingTime: Date.now() - now.getTime(),
          timestamp: now,
          version: '1.0.0',
          requestId: memoryId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MEMORY_STORE_ERROR',
          message: `Failed to store memory: ${error}`,
          details: { error }
        }
      };
    }
  }

  /**
   * Retrieve a specific memory by ID
   */
  async retrieve(memoryId: MemoryId): Promise<Memory | null> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM memories WHERE id = ?
      `);
      
      const row = stmt.get(memoryId) as any;
      if (!row) return null;

      // Update access tracking
      this.updateAccessTracking(memoryId);

      // Get relationships
      const relationships = await this.getRelationships(memoryId);

      return this.rowToMemory(row, relationships);
    } catch (error) {
      console.error('Failed to retrieve memory:', error);
      return null;
    }
  }

  /**
   * Enhanced semantic search with multiple strategies
   */
  async search(query: MemoryQuery): Promise<ApiResponse<SearchResult[]>> {
    const startTime = Date.now();
    
    try {
      let sql = `
        SELECT m.*, 
               COALESCE(fts.rank, 0) as fts_score,
               CASE 
                 WHEN m.context = ? THEN 1.0 
                 ELSE 0.5 
               END as context_match_score
        FROM memories m
        LEFT JOIN memories_fts fts ON m.id = fts.id
        WHERE 1=1
      `;
      
      const params: any[] = [query.context?.[0] || ''];
      
      // Add search conditions
      if (query.query) {
        sql += ` AND fts.memories_fts MATCH ?`;
        params.push(query.query);
      }
      
      if (query.context && query.context.length > 0) {
        sql += ` AND m.context IN (${query.context.map(() => '?').join(',')})`;
        params.push(...query.context);
      }
      
      if (query.type && query.type.length > 0) {
        sql += ` AND m.type IN (${query.type.map(() => '?').join(',')})`;
        params.push(...query.type);
      }
      
      if (query.projectId) {
        sql += ` AND m.project_id = ?`;
        params.push(query.projectId);
      }
      
      if (query.agentId) {
        sql += ` AND m.agent_id = ?`;
        params.push(query.agentId);
      }
      
      if (query.confidenceRange) {
        sql += ` AND m.confidence BETWEEN ? AND ?`;
        params.push(query.confidenceRange.min, query.confidenceRange.max);
      }
      
      if (query.dateRange) {
        sql += ` AND m.created_at BETWEEN ? AND ?`;
        params.push(query.dateRange.start.toISOString(), query.dateRange.end.toISOString());
      }
      
      // Order by relevance
      sql += ` ORDER BY 
                 (fts_score * 0.4 + 
                  context_match_score * 0.3 + 
                  m.relevance_score * 0.2 + 
                  m.importance * 0.1) DESC`;
      
      if (query.limit) {
        sql += ` LIMIT ?`;
        params.push(query.limit);
      }
      
      if (query.offset) {
        sql += ` OFFSET ?`;
        params.push(query.offset);
      }

      const stmt = this.db.prepare(sql);
      const rows = stmt.all(...params) as any[];
      
      const results: SearchResult[] = [];
      
      for (const row of rows) {
        const relationships = await this.getRelationships(row.id);
        const memory = this.rowToMemory(row, relationships);
        
        const searchResult: SearchResult = {
          memory,
          matchScore: row.fts_score || 0,
          relevanceScore: row.relevance_score,
          contextMatch: row.context_match_score > 0.9,
          highlights: this.extractHighlights(memory.content, query.query || '')
        };
        
        results.push(searchResult);
      }

      return {
        success: true,
        data: results,
        meta: {
          processingTime: Date.now() - startTime,
          timestamp: new Date(),
          version: '1.0.0',
          requestId: this.generateRequestId()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MEMORY_SEARCH_ERROR',
          message: `Failed to search memories: ${error}`,
          details: { error, query }
        }
      };
    }
  }

  /**
   * Store memory relationships
   */
  private async storeRelationships(memoryId: MemoryId, relationships: MemoryRelationship[]): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO memory_relationships 
      (source_memory_id, target_memory_id, relationship_type, strength, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const rel of relationships) {
      stmt.run(
        memoryId,
        rel.targetMemoryId,
        rel.relationshipType,
        rel.strength,
        rel.created.toISOString()
      );
    }
  }

  /**
   * Get relationships for a memory
   */
  private async getRelationships(memoryId: MemoryId): Promise<MemoryRelationship[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM memory_relationships 
      WHERE source_memory_id = ? OR target_memory_id = ?
    `);
    
    const rows = stmt.all(memoryId, memoryId) as any[];
    
    return rows.map(row => ({
      targetMemoryId: row.source_memory_id === memoryId ? row.target_memory_id : row.source_memory_id,
      relationshipType: row.relationship_type,
      strength: row.strength,
      created: new Date(row.created_at)
    }));
  }

  /**
   * Convert database row to Memory object
   */
  private rowToMemory(row: any, relationships: MemoryRelationship[]): Memory {
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
      relationships,
      created: new Date(row.created_at),
      updated: new Date(row.updated_at),
      accessed: new Date(row.accessed_at),
      accessCount: row.access_count,
      relevanceScore: row.relevance_score
    };
  }

  /**
   * Generate unique memory ID
   */
  private generateMemoryId(content: string, context: string): string {
    const hash = createHash('sha256');
    hash.update(content + context + Date.now().toString());
    return `mem_${hash.digest('hex').substring(0, 16)}`;
  }

  /**
   * Generate request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Calculate relevance score based on memory attributes
   */
  private calculateRelevanceScore(memory: any): number {
    let score = 0.5; // Base score
    
    // Boost score based on confidence
    score += memory.metadata.confidence * 0.3;
    
    // Boost score based on importance
    score += (memory.metadata.importance || 0.5) * 0.2;
    
    // Boost score for validated memories
    if (memory.metadata.validation === 'validated') {
      score += 0.1;
    }
    
    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Update access tracking for a memory
   */
  private updateAccessTracking(memoryId: MemoryId): void {
    const stmt = this.db.prepare(`
      UPDATE memories 
      SET accessed_at = CURRENT_TIMESTAMP, access_count = access_count + 1
      WHERE id = ?
    `);
    stmt.run(memoryId);
  }

  /**
   * Extract highlights from content based on query
   */
  private extractHighlights(content: string, query: string): string[] {
    if (!query) return [];
    
    const words = query.toLowerCase().split(/\s+/);
    const highlights: string[] = [];
    
    for (const word of words) {
      const regex = new RegExp(`(.{0,30}${word}.{0,30})`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        highlights.push(...matches.slice(0, 3)); // Limit to 3 highlights per word
      }
    }
    
    return highlights.slice(0, 5); // Limit total highlights
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}
