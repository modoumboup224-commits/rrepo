#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const collectionPath = path.join(__dirname, 'GreenCard-Dashboard-API-Collection.json');
const environmentPath = path.join(__dirname, 'GreenCard-Environment.json');

const commands = {
    'all': `newman run "${collectionPath}" -e "${environmentPath}"`,
    'dashboard': `newman run "${collectionPath}" -e "${environmentPath}" --folder "Dashboard - Secured Endpoints"`,
    'auth': `newman run "${collectionPath}" -e "${environmentPath}" --folder "Authentication"`,
    'orders': `newman run "${collectionPath}" -e "${environmentPath}" --folder "Orders - Secured Endpoints"`,
    'products': `newman run "${collectionPath}" -e "${environmentPath}" --folder "Products - Secured Endpoints"`,
    'errors': `newman run "${collectionPath}" -e "${environmentPath}" --folder "Error Handling Tests"`,
    'report': `newman run "${collectionPath}" -e "${environmentPath}" -r cli,html --reporter-html-export report.html`
};

function runCommand(commandName) {
    const command = commands[commandName] || commands['all'];
    console.log(`Running: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
}

const args = process.argv.slice(2);
const command = args[0] || 'all';

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node test-runner.js [command]

Commands:
  all       Run all tests (default)
  dashboard Run dashboard endpoints tests
  auth      Run authentication tests
  orders    Run orders endpoints tests
  products  Run products endpoints tests
  errors    Run error handling tests
  report    Run all tests with HTML report

Examples:
  node test-runner.js dashboard
  node test-runner.js report
  `);
} else {
    runCommand(command);
}
