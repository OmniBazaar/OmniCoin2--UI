const execGitCmd = require('run-git-command');
const fs = require('fs');

const path = './app/package.json';
const data = require(path);

execGitCmd(['rev-list', '--count', 'HEAD'])
  .then((res)=>{
    const versioning = data['version'].split('.');
    const gitCount = res.trim();
    if (versioning[2] === gitCount) {
      console.log("Version is up to date");
    } else {
      data['version'] = versioning[0] + '.' + versioning[1] + '.' + gitCount;
    }
    fs.writeFile(path, JSON.stringify(data, null, 2), function(err) {
      if (err) {
        console.log(err);
      }
    });
  }).catch((err)=>{
  console.log("Err", err)
});
