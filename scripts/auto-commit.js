const { execSync } = require('child_process');
const path = require('path');

function autoCommit(message = 'Auto-commit: Updates and improvements') {
  try {
    const projectDir = path.join(__dirname, '..');
    
    console.log('🔄 Auto-committing changes...');
    
    // Add all changes
    execSync('git add .', { cwd: projectDir, stdio: 'inherit' });
    
    // Check if there are changes to commit
    try {
      execSync('git diff --cached --exit-code', { cwd: projectDir, stdio: 'pipe' });
      console.log('ℹ️  No changes to commit');
      return;
    } catch (error) {
      // There are changes, continue with commit
    }
    
    // Commit with timestamp
    const timestamp = new Date().toISOString();
    const commitMessage = `${message}

Updated: ${timestamp}

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>`;
    
    execSync(`git commit -m "${commitMessage}"`, { cwd: projectDir, stdio: 'inherit' });
    
    // Push to remote
    execSync('git push origin main', { cwd: projectDir, stdio: 'inherit' });
    
    console.log('✅ Changes committed and pushed successfully!');
    
  } catch (error) {
    console.error('❌ Error during auto-commit:', error.message);
  }
}

// If called directly
if (require.main === module) {
  const message = process.argv[2] || 'Auto-commit: Updates and improvements';
  autoCommit(message);
}

module.exports = autoCommit;