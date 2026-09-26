const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    }
    catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const tsxFiles = walkSync(directoryPath).filter(file => file.endsWith('.tsx'));

let changedFiles = 0;
let totalReplacements = 0;
let summary = [];

tsxFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Initial count of occurrences
  let matchCount = (content.match(/emerald|teal|amber/gi) || []).length;
  
  if (matchCount === 0) return;

  // Active nav states (bg-emerald-500)
  newContent = newContent.replace(/bg-emerald-500/g, 'bg-gradient-to-r from-violet-500 to-blue-500');

  // Gradients
  newContent = newContent.replace(/from-emerald-400\s+via-teal-300\s+to-indigo-400/g, 'from-violet-400 via-blue-400 to-pink-400');
  newContent = newContent.replace(/from-emerald-600\s+to-teal-400/g, 'from-violet-600 to-blue-500');
  newContent = newContent.replace(/from-emerald-950\s+via-slate-950\s+to-teal-950/g, 'from-violet-950 via-slate-950 to-blue-950');

  // Specific text overrides
  newContent = newContent.replace(/hover:text-emerald-400/g, 'hover:text-violet-400');
  newContent = newContent.replace(/text-emerald-400/g, 'text-violet-400');

  // Primary Color Changes (emerald -> violet)
  newContent = newContent.replace(/emerald/g, 'violet');

  // Accent/Secondary Color Changes (teal -> blue)
  newContent = newContent.replace(/teal-300/g, 'blue-400');
  newContent = newContent.replace(/teal-400/g, 'blue-500');
  newContent = newContent.replace(/teal-500/g, 'blue-500');
  newContent = newContent.replace(/teal-950/g, 'blue-950');
  newContent = newContent.replace(/teal/g, 'blue'); // Any other teal -> blue

  // Gold/Amber Accent Changes (amber -> pink)
  newContent = newContent.replace(/amber/g, 'pink');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    
    // We can just estimate replacements based on initial matchCount, 
    // or recount. Let's just use the matchCount as an approximation of replacements made.
    totalReplacements += matchCount;
    changedFiles++;
    
    const relPath = path.relative(__dirname, file);
    summary.push(`- ${relPath}: ${matchCount} replacements`);
    console.log(`Updated ${relPath} (${matchCount} replacements)`);
  }
});

console.log(`\nSUMMARY:\n${summary.join('\n')}`);
console.log(`\nTotal files changed: ${changedFiles}`);
console.log(`Total replacements made: ${totalReplacements}`);
