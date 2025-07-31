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

// Learning commands
program
  .command('predict <language> <code>')
  .description('Predict success probability for code suggestion')
  .option('-c, --context <context>', 'Code context', 'general')
  .option('-p, --purpose <purpose>', 'Code purpose', 'testing')
  .option('--confidence <confidence>', 'Initial confidence score', '0.8')
  .action(async (language: string, code: string, options: any) => {
    try {
      console.log(chalk.blue('🔮 Predicting code success probability...'));
      
      const suggestion = {
        code,
        language: language as any,
        context: options.context,
        purpose: options.purpose,
        confidence: parseFloat(options.confidence),
        metadata: {
          source: 'cli',
          timestamp: new Date().toISOString()
        }
      };
      
      const result = await agentOS.predictSuccess(suggestion);
      
      if (result.success && result.data) {
        const prediction = result.data;
        console.log(chalk.green('✅ Success prediction completed'));
        console.log();
        
        console.log(chalk.cyan(`🎯 Success Probability: ${(prediction.successProbability * 100).toFixed(1)}%`));
        console.log(chalk.cyan(`🔒 Confidence Level: ${(prediction.confidence * 100).toFixed(1)}%`));
        console.log();
        
        if (prediction.riskFactors && prediction.riskFactors.length > 0) {
          console.log(chalk.yellow('⚠️  Risk Factors:'));
          prediction.riskFactors.forEach((risk: any) => {
            console.log(chalk.gray(`   • ${risk.description} (${risk.severity})`));
          });
          console.log();
        }
        
        if (prediction.recommendations && prediction.recommendations.length > 0) {
          console.log(chalk.blue('💡 Recommendations:'));
          prediction.recommendations.forEach((rec: any) => {
            console.log(chalk.gray(`   • ${rec.suggestion}`));
          });
          console.log();
        }
        
        console.log(chalk.gray(`🔬 Model Version: ${prediction.modelVersion}`));
        console.log(chalk.gray(`⏰ Prediction ID: ${prediction.predictionId}`));
        
      } else {
        console.log(chalk.red('❌ Prediction failed'));
        console.log(chalk.red(`   Error: ${result.error?.message}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error}`));
    }
  });

program
  .command('learn-stats')
  .description('Show learning engine statistics and performance')
  .action(async () => {
    try {
      console.log(chalk.blue('🧠 AgentOS Learning Statistics'));
      console.log();
      
      const result = await agentOS.getLearningStats();
      
      if (result.success && result.data) {
        const stats = result.data;
        
        console.log(chalk.green('📊 Model Performance:'));
        console.log(chalk.gray(`   Model Accuracy: ${(stats.modelAccuracy * 100).toFixed(1)}%`));
        console.log(chalk.gray(`   Training Data Points: ${stats.trainingDataPoints}`));
        console.log(chalk.gray(`   Average Error: ${stats.averageError?.toFixed(3) || 'N/A'}`));
        console.log();
        
        console.log(chalk.green('🎯 Learning Progress:'));
        console.log(chalk.gray(`   Patterns Learned: ${stats.patternsLearned}`));
        console.log(chalk.gray(`   Last Model Update: ${stats.lastModelUpdate ? new Date(stats.lastModelUpdate).toLocaleString() : 'Never'}`));
        console.log(chalk.gray(`   System Initialized: ${stats.initialized ? '✅' : '❌'}`));
        console.log();
        
        // Performance indicators
        if (stats.modelAccuracy > 0.8) {
          console.log(chalk.green('🏆 Model Performance: Excellent'));
        } else if (stats.modelAccuracy > 0.6) {
          console.log(chalk.yellow('📈 Model Performance: Good - Improving'));
        } else {
          console.log(chalk.blue('🚀 Model Performance: Learning - Need more data'));
        }
        
      } else {
        console.log(chalk.red('❌ Failed to get learning statistics'));
        console.log(chalk.red(`   Error: ${result.error?.message}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error}`));
    }
  });

program
  .command('workflow <language> <code>')
  .description('Run complete AgentOS workflow: predict → execute → learn')
  .option('-c, --context <context>', 'Code context', 'general')
  .option('-p, --purpose <purpose>', 'Code purpose', 'testing')
  .option('-t, --timeout <timeout>', 'Execution timeout in seconds', '30')
  .action(async (language: string, code: string, options: any) => {
    try {
      console.log(chalk.blue('🚀 Running Complete AgentOS Workflow'));
      console.log(chalk.gray('Predict → Execute → Learn → Remember'));
      console.log();
      
      const suggestion = {
        code,
        language: language as any,
        context: options.context,
        purpose: options.purpose,
        confidence: 0.8,
        metadata: {
          source: 'workflow_cli',
          timestamp: new Date().toISOString()
        }
      };
      
      // Step 1: Predict
      console.log(chalk.blue('1️⃣ 🔮 Predicting success probability...'));
      const predictionResult = await agentOS.predictSuccess(suggestion);
      
      if (predictionResult.success && predictionResult.data) {
        const probability = predictionResult.data.successProbability;
        console.log(chalk.cyan(`   Predicted Success: ${(probability * 100).toFixed(1)}%`));
        
        if (probability < 0.3) {
          console.log(chalk.yellow('   ⚠️  Low success probability - proceed with caution'));
        }
      }
      
      // Step 2: Execute
      console.log(chalk.blue('2️⃣ ⚡ Executing code...'));
      const executionResult = await agentOS.execute({
        language: language as any,
        code,
        timeout: parseInt(options.timeout) * 1000,
        context: {
          purpose: options.purpose,
          metadata: { workflow: true }
        }
      });
      
      if (executionResult.success && executionResult.data) {
        const execution = executionResult.data;
        console.log(chalk.green(`   Execution Status: ${execution.status}`));
        console.log(chalk.gray(`   Execution Time: ${execution.result.executionTime}ms`));
        console.log(chalk.gray(`   Performance: ${execution.analysis.performance}`));
        
        // Step 3: Learn
        console.log(chalk.blue('3️⃣ 🧠 Learning from execution...'));
        const learningResult = await agentOS.learnFromExecution(suggestion, execution);
        
        if (learningResult.success) {
          console.log(chalk.green('   ✅ Learning completed successfully'));
        } else {
          console.log(chalk.yellow('   ⚠️  Learning encountered issues'));
        }
        
        // Step 4: Remember
        console.log(chalk.blue('4️⃣ 💾 Storing workflow outcome...'));
        const memoryResult = await agentOS.remember({
          content: `Workflow: ${language} code execution ${execution.status} with ${execution.analysis.performance} performance`,
          context: 'workflow',
          type: 'solution',
          metadata: {
            tags: ['workflow', language, execution.status, execution.analysis.performance],
            source: 'workflow_cli',
            confidence: execution.analysis.success ? 0.9 : 0.5,
            validation: 'validated',
            importance: 0.8,
            category: 'workflow'
          },
          relationships: []
        });
        
        if (memoryResult.success) {
          console.log(chalk.green('   ✅ Workflow outcome stored in memory'));
        }
        
        console.log();
        console.log(chalk.green('🎉 Complete workflow finished successfully!'));
        console.log(chalk.gray(`   Memory ID: ${memoryResult.data?.id || 'N/A'}`));
        console.log(chalk.gray(`   Execution ID: ${execution.executionId}`));
        
      } else {
        console.log(chalk.red('❌ Execution failed'));
        console.log(chalk.red(`   Error: ${executionResult.error?.message}`));
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Workflow error: ${error}`));
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
  console.log(chalk.gray('Sprint 1.4 - Complete MVP with Learning Engine'));
  console.log();
  console.log(chalk.yellow('💾 Memory Commands:'));
  console.log('  $ agentos remember "Fixed authentication bug with JWT validation"');
  console.log('  $ agentos recall "authentication bug" --context security');
  console.log();
  console.log(chalk.yellow('⚡ Execution Commands:'));
  console.log('  $ agentos execute javascript "console.log(\'Hello World\')"');
  console.log();
  console.log(chalk.yellow('🧠 Learning Commands (NEW):'));
  console.log('  $ agentos predict javascript "const add = (a,b) => a + b"');
  console.log('  $ agentos learn-stats');
  console.log('  $ agentos workflow javascript "function test() { return true; }"');
  console.log();
  console.log(chalk.yellow('📊 System Commands:'));
  console.log('  $ agentos status');
  console.log('  $ agentos init');
  console.log();
  console.log(chalk.blue('🚀 Complete Workflow Example:'));
  console.log('  $ agentos workflow python "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)"');
  console.log();
  console.log(chalk.gray('Built with ❤️  by AI agents, for AI agents'));
  console.log(chalk.gray('The first operating system designed for AI coding agents'));
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
