#!/usr/bin/env node

/**
 * AgentOS Command Line Interface
 * CLI for AI agents to interact with AgentOS
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { AgentOS } from './core/AgentOS';
import { SupportedLanguage } from './types';

const program = new Command();
let agentOS: AgentOS;

// Initialize AgentOS instance
async function initializeAgentOS(): Promise<void> {
  if (!agentOS) {
    agentOS = new AgentOS({
      logLevel: 'info',
      enableExecution: true,
      enableLearning: true
    });
    await agentOS.initialize();
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n🛑 Shutting down AgentOS...'));
  if (agentOS) {
    await agentOS.shutdown();
  }
  process.exit(0);
});

// Main program configuration
program
  .name('agentos')
  .description('🤖 AgentOS - Operating System for AI Coding Agents')
  .version('0.1.0')
  .hook('preAction', async () => {
    await initializeAgentOS();
  });

// Memory commands
program
  .command('remember <content>')
  .description('Store a memory for persistent intelligence')
  .option('-c, --context <context>', 'Memory context', 'general')
  .option('-t, --type <type>', 'Memory type', 'insight')
  .option('--tags <tags>', 'Comma-separated tags')
  .option('--importance <importance>', 'Importance score (0-1)', '0.5')
  .action(async (content: string, options: any) => {
    try {
      console.log(chalk.blue('💾 Storing memory...'));
      
      const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [];
      
      const result = await agentOS.remember({
        content,
        context: options.context,
        type: options.type,
        metadata: {
          tags,
          source: 'user_input',
          confidence: 0.9,
          validation: 'pending',
          importance: parseFloat(options.importance),
          category: options.context
        },
        relationships: []
      });
      
      if (result.success) {
        console.log(chalk.green('✅ Memory stored successfully'));
        console.log(chalk.gray(`   ID: ${result.data?.id}`));
        console.log(chalk.gray(`   Context: ${result.data?.context}`));
        console.log(chalk.gray(`   Type: ${result.data?.type}`));
      } else {
        console.log(chalk.red('❌ Failed to store memory'));
        console.log(chalk.red(`   Error: ${result.error?.message}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error}`));
    }
  });

program
  .command('recall <query>')
  .description('Search memories using intelligent retrieval')
  .option('-l, --limit <limit>', 'Maximum results to return', '10')
  .option('-c, --context <context>', 'Filter by context')
  .option('-t, --type <type>', 'Filter by memory type')
  .action(async (query: string, options: any) => {
    try {
      console.log(chalk.blue(`🔍 Searching memories for: "${query}"`));
      
      const searchQuery = {
        query,
        limit: parseInt(options.limit),
        context: options.context ? [options.context] : undefined,
        type: options.type ? [options.type] : undefined
      };
      
      const result = await agentOS.recall(searchQuery);
      
      if (result.success && result.data) {
        console.log(chalk.green(`✅ Found ${result.data.length} memories`));
        console.log();
        
        result.data.forEach((searchResult: any, index: number) => {
          const memory = searchResult.memory;
          console.log(chalk.cyan(`${index + 1}. ${memory.content.substring(0, 80)}...`));
          console.log(chalk.gray(`   Context: ${memory.context} | Type: ${memory.type}`));
          console.log(chalk.gray(`   Match Score: ${searchResult.matchScore.toFixed(2)} | Relevance: ${searchResult.relevanceScore.toFixed(2)}`));
          console.log(chalk.gray(`   Created: ${new Date(memory.created).toLocaleDateString()}`));
          console.log();
        });
      } else {
        console.log(chalk.yellow('📭 No memories found'));
        if (result.error) {
          console.log(chalk.red(`   Error: ${result.error.message}`));
        }
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error}`));
    }
  });

// Execution commands
program
  .command('execute <language> <code>')
  .description('Execute code in a sandboxed environment')
  .option('-t, --timeout <timeout>', 'Execution timeout in seconds', '30')
  .option('-m, --memory <memory>', 'Memory limit', '512MB')
  .option('--purpose <purpose>', 'Execution purpose', 'exploration')
  .action(async (language: string, code: string, options: any) => {
    try {
      console.log(chalk.blue(`⚡ Executing ${language} code...`));
      
      const result = await agentOS.execute({
        language: language as SupportedLanguage,
        code,
        timeout: parseInt(options.timeout) * 1000,
        memoryLimit: options.memory,
        context: {
          purpose: options.purpose,
          metadata: {}
        }
      });
      
      if (result.success && result.data) {
        const execution = result.data;
        console.log(chalk.green(`✅ Execution ${execution.status}`));
        console.log();
        
        if (execution.result.stdout) {
          console.log(chalk.white('📤 Output:'));
          console.log(execution.result.stdout);
          console.log();
        }
        
        if (execution.result.stderr) {
          console.log(chalk.red('📤 Errors:'));
          console.log(execution.result.stderr);
          console.log();
        }
        
        console.log(chalk.gray(`⏱️  Execution Time: ${execution.result.executionTime}ms`));
        console.log(chalk.gray(`💾 Memory Usage: ${execution.result.memoryUsage}`));
        console.log(chalk.gray(`🔧 Performance: ${execution.analysis.performance}`));
        console.log(chalk.gray(`🛡️  Security Score: ${execution.analysis.securityScore}`));
        
      } else {
        console.log(chalk.red('❌ Execution failed'));
        console.log(chalk.red(`   Error: ${result.error?.message}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error}`));
    }
  });

// System commands
program
  .command('status')
  .description('Show AgentOS system status')
  .action(async () => {
    try {
      console.log(chalk.blue('📊 AgentOS System Status'));
      console.log();
      
      const result = await agentOS.getStatus();
      
      if (result.success && result.data) {
        const status = result.data;
        
        console.log(chalk.green('🤖 Agent Information:'));
        console.log(chalk.gray(`   Agent ID: ${status.agentId}`));
        console.log(chalk.gray(`   Project ID: ${status.projectId}`));
        console.log(chalk.gray(`   Version: ${status.version}`));
        console.log(chalk.gray(`   Uptime: ${Math.floor(status.uptime)}s`));
        console.log();
        
        console.log(chalk.green('⚙️  Capabilities:'));
        console.log(chalk.gray(`   Memory: ${status.capabilities.memory ? '✅' : '❌'}`));
        console.log(chalk.gray(`   Execution: ${status.capabilities.execution ? '✅' : '❌'}`));
        console.log(chalk.gray(`   Learning: ${status.capabilities.learning ? '✅' : '❌'}`));
        console.log();
        
        console.log(chalk.green('💾 Memory Statistics:'));
        console.log(chalk.gray(`   Total Memories: ${status.memory.totalMemories}`));
        console.log(chalk.gray(`   Average Confidence: ${(status.memory.averageConfidence * 100).toFixed(1)}%`));
        console.log(chalk.gray(`   Last Accessed: ${new Date(status.memory.lastAccessed).toLocaleString()}`));
        
      } else {
        console.log(chalk.red('❌ Failed to get status'));
        console.log(chalk.red(`   Error: ${result.error?.message}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error}`));
    }
  });

program
  .command('init')
  .description('Initialize AgentOS for the current project')
  .option('--force', 'Force reinitialization')
  .action(async (options: any) => {
    try {
      console.log(chalk.blue('🚀 Initializing AgentOS...'));
      
      // AgentOS is already initialized in the preAction hook
      console.log(chalk.green('✅ AgentOS initialized successfully'));
      console.log();
      console.log(chalk.cyan('🎯 Ready for AI agent operations:'));
      console.log(chalk.gray('   • agentos remember "your insight"'));
      console.log(chalk.gray('   • agentos recall "search query"'));
      console.log(chalk.gray('   • agentos execute javascript "console.log(\'Hello AgentOS\')"'));
      console.log(chalk.gray('   • agentos status'));
      console.log();
      console.log(chalk.yellow('💡 AgentOS is designed for AI agents - use it programmatically for best results!'));
      
    } catch (error) {
      console.log(chalk.red(`❌ Initialization failed: ${error}`));
    }
  });

// Help command enhancement
program.on('--help', () => {
  console.log();
  console.log(chalk.cyan('🤖 AgentOS - Operating System for AI Coding Agents'));
  console.log();
  console.log(chalk.yellow('Examples:'));
  console.log('  $ agentos remember "Fixed authentication bug with JWT validation"');
  console.log('  $ agentos recall "authentication bug" --context security');
  console.log('  $ agentos execute javascript "console.log(\'Hello World\')"');
  console.log('  $ agentos status');
  console.log();
  console.log(chalk.gray('Built with ❤️  by AI agents, for AI agents'));
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
