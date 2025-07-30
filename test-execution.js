/**
 * Test AgentOS ExecutionEngine
 * Quick test to verify the execution system works
 */

const { AgentOS } = require('./dist/core/AgentOS');

async function testExecution() {
  console.log('🧪 Testing AgentOS ExecutionEngine...');
  
  const agentOS = new AgentOS({
    enableExecution: true,
    logLevel: 'info'
  });
  
  try {
    await agentOS.initialize();
    
    // Test JavaScript execution
    console.log('\n📝 Testing JavaScript execution...');
    const jsResult = await agentOS.execute({
      language: 'javascript',
      code: 'console.log("Hello from AgentOS!"); console.log(2 + 2);',
      context: {
        purpose: 'testing',
        metadata: { test: 'js-execution' }
      }
    });
    
    if (jsResult.success) {
      console.log('✅ JavaScript execution successful:');
      console.log('  Output:', jsResult.data.result.stdout);
      console.log('  Execution time:', jsResult.data.result.executionTime + 'ms');
    } else {
      console.log('❌ JavaScript execution failed:', jsResult.error.message);
    }
    
    // Test Python execution
    console.log('\n🐍 Testing Python execution...');
    const pythonResult = await agentOS.execute({
      language: 'python',
      code: 'print("Hello from Python!"); print(3 * 7)',
      context: {
        purpose: 'testing',
        metadata: { test: 'python-execution' }
      }
    });
    
    if (pythonResult.success) {
      console.log('✅ Python execution successful:');
      console.log('  Output:', pythonResult.data.result.stdout);
      console.log('  Execution time:', pythonResult.data.result.executionTime + 'ms');
    } else {
      console.log('❌ Python execution failed:', pythonResult.error.message);
    }
    
    // Test error handling
    console.log('\n💥 Testing error handling...');
    const errorResult = await agentOS.execute({
      language: 'javascript',
      code: 'throw new Error("Test error");',
      context: {
        purpose: 'testing',
        metadata: { test: 'error-handling' }
      }
    });
    
    if (!errorResult.success || errorResult.data.status === 'failed') {
      console.log('✅ Error handling works:');
      console.log('  Status:', errorResult.data?.status || 'failed');
      console.log('  Error output:', errorResult.data?.result.stderr || errorResult.error?.message);
    } else {
      console.log('❌ Error handling failed - should have caught error');
    }
    
    // Test verification system
    console.log('\n🔍 Testing code verification...');
    const verifyResult = await agentOS.verify({
      code: 'console.log("Valid code");',
      language: 'javascript',
      context: 'testing'
    });
    
    if (verifyResult.success) {
      console.log('✅ Code verification successful:');
      console.log('  Success probability:', verifyResult.data.successProbability);
      console.log('  Overall result:', verifyResult.data.overallResult);
    } else {
      console.log('❌ Code verification failed:', verifyResult.error.message);
    }
    
    console.log('\n📊 Getting system status...');
    const status = await agentOS.getStatus();
    if (status.success) {
      console.log('✅ System status:');
      console.log('  Agent ID:', status.data.agentId);
      console.log('  Capabilities:', JSON.stringify(status.data.capabilities));
      console.log('  Memory stats:', status.data.memory.totalMemories, 'memories');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await agentOS.shutdown();
    console.log('\n✅ AgentOS ExecutionEngine testing complete!');
  }
}

testExecution();