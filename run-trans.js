const { exec } = require('child_process');
exec('npx tsx translate-careers-fast.ts > trans-log.txt 2>&1', (err, stdout, stderr) => {
  if (err) console.error(err);
});
