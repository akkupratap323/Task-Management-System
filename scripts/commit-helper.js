const { execSync } = require('child_process');

function commitChanges(message) {
  try {
    console.log('🔄 Committing changes to GitHub...');
    
    // Add all changes
    execSync('git add .', { stdio: 'pipe' });
    
    // Check if there are changes to commit
    try {
      execSync('git diff --cached --exit-code', { stdio: 'pipe' });
      console.log('ℹ️  No changes to commit');
      return false;
    } catch (error) {
      // There are changes, continue with commit
    }
    
    // Commit with proper message
    const commitMessage = `${message}

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>`;
    
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Push to remote
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Changes committed and pushed to GitHub successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Error during commit:', error.message);
    return false;
  }
}

module.exports = commitChanges;

// Example usage:
// const commit = require('./scripts/commit-helper');
// commit('Add new feature: Agent login system');