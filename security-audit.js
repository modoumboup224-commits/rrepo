#!/usr/bin/env node
/**
 * Security Audit Script for GreenCard Project
 * Phase 1: Security & Performance Analysis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
    maxImageSize: 500 * 1024, // 500KB
    webpQuality: 85,
    loadTestUsers: 100,
    lighthouseThreshold: 90
};

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Security patterns to check
const SECURITY_PATTERNS = {
    sqlInjection: /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b).*\bWHERE\b.*\bOR\b.*\b1=1\b/i,
    xss: /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/i,
    csrf: /csrf|xsrf/i,
    hardcodedSecrets: /(password|secret|key|token)\s*=\s*["'][^"']*["']/i,
    evalUsage: /\beval\s*\(/i
};

// Performance metrics
const PERFORMANCE_METRICS = {
    maxBundleSize: 1024 * 1024, // 1MB
    maxImageSize: 500 * 1024, // 500KB
    maxApiResponseTime: 1000 // 1 second
};

class SecurityAuditor {
    constructor() {
        this.results = {
            security: [],
            performance: [],
            images: [],
            dependencies: []
        };
    }

    async run() {
        console.log(`${colors.blue}🔍 Starting GreenCard Security Audit...${colors.reset}\n`);

        await this.checkDependencies();
        await this.scanForVulnerabilities();
        await this.analyzeCodeSecurity();
        await this.checkImageOptimization();
        await this.generateReport();

        this.displayResults();
    }

    async checkDependencies() {
        console.log(`${colors.yellow}📦 Checking dependencies...${colors.reset}`);

        try {
            // Check for outdated packages
            const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
            const outdatedPackages = JSON.parse(outdated || '{}');

            if (Object.keys(outdatedPackages).length > 0) {
                this.results.dependencies.push({
                    type: 'warning',
                    message: 'Outdated packages found',
                    details: outdatedPackages
                });
            }

            // Security audit
            const audit = execSync('npm audit --json', { encoding: 'utf8' });
            const auditResult = JSON.parse(audit);

            if (auditResult.vulnerabilities) {
                const critical = auditResult.vulnerabilities.critical || 0;
                const high = auditResult.vulnerabilities.high || 0;

                if (critical > 0 || high > 0) {
                    this.results.dependencies.push({
                        type: 'error',
                        message: `Security vulnerabilities found: ${critical} critical, ${high} high`,
                        details: auditResult
                    });
                }
            }
        } catch (error) {
            this.results.dependencies.push({
                type: 'error',
                message: 'Failed to check dependencies',
                details: error.message
            });
        }
    }

    async scanForVulnerabilities() {
        console.log(`${colors.yellow}🔍 Scanning for security vulnerabilities...${colors.reset}`);

        const backendPath = path.join(__dirname, 'backend');
        const frontendPath = path.join(__dirname, 'frontend');

        await this.scanDirectory(backendPath);
        await this.scanDirectory(frontendPath);
    }

    async scanDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) return;

        const files = this.getAllFiles(dirPath);

        for (const file of files) {
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                await this.scanFile(file);
            }
        }
    }

    async scanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(__dirname, filePath);

            // Check for SQL injection vulnerabilities
            if (SECURITY_PATTERNS.sqlInjection.test(content)) {
                this.results.security.push({
                    type: 'error',
                    file: relativePath,
                    message: 'Potential SQL injection vulnerability detected'
                });
            }

            // Check for XSS vulnerabilities
            if (SECURITY_PATTERNS.xss.test(content)) {
                this.results.security.push({
                    type: 'error',
                    file: relativePath,
                    message: 'Potential XSS vulnerability detected'
                });
            }

            // Check for hardcoded secrets
            if (SECURITY_PATTERNS.hardcodedSecrets.test(content)) {
                this.results.security.push({
                    type: 'warning',
                    file: relativePath,
                    message: 'Hardcoded secrets detected'
                });
            }

            // Check for eval usage
            if (SECURITY_PATTERNS.evalUsage.test(content)) {
                this.results.security.push({
                    type: 'warning',
                    file: relativePath,
                    message: 'Eval usage detected - potential security risk'
                });
            }

            // Check for CSRF protection
            if (content.includes('csrf') || content.includes('CSRF')) {
                this.results.security.push({
                    type: 'info',
                    file: relativePath,
                    message: 'CSRF protection found'
                });
            }

        } catch (error) {
            console.error(`Error scanning ${filePath}:`, error.message);
        }
    }

    async checkImageOptimization() {
        console.log(`${colors.yellow}🖼️ Checking image optimization...${colors.reset}`);

        const imageDir = path.join(__dirname, 'frontend', 'images');
        if (!fs.existsSync(imageDir)) return;

        const images = this.getAllFiles(imageDir);

        for (const image of images) {
            if (image.match(/\.(jpg|jpeg|png|gif)$/i)) {
                const stats = fs.statSync(image);
                const size = stats.size;

                if (size > CONFIG.maxImageSize) {
                    this.results.images.push({
                        type: 'warning',
                        file: path.relative(__dirname, image),
                        message: `Image too large (${(size / 1024 / 1024).toFixed(2)}MB)`,
                        size: size
                    });
                }
            }
        }
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalIssues: this.results.security.length +
                    this.results.performance.length +
                    this.results.images.length,
                securityIssues: this.results.security.length,
                performanceIssues: this.results.performance.length,
                imageIssues: this.results.images.length
            },
            details: this.results
        };

        fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2));
    }

    displayResults() {
        console.log(`\n${colors.blue}📊 Security Audit Results:${colors.reset}\n`);

        const critical = this.results.security.filter(s => s.type === 'error').length;
        const warnings = this.results.security.filter(s => s.type === 'warning').length;
        const info = this.results.security.filter(s => s.type === 'info').length;

        console.log(`${colors.red}❌ Critical Issues: ${critical}${colors.reset}`);
        console.log(`${colors.yellow}⚠️  Warnings: ${warnings}${colors.reset}`);
        console.log(`${colors.green}✅ Info: ${info}${colors.reset}`);

        if (critical > 0) {
            console.log(`\n${colors.red}🔴 Critical issues must be fixed before deployment:${colors.reset}`);
            this.results.security.filter(s => s.type === 'error').forEach(issue => {
                console.log(`  - ${issue.file}: ${issue.message}`);
            });
        }

        console.log(`\n${colors.green}📄 Full report saved to: security-audit-report.json${colors.reset}`);
    }

    getAllFiles(dirPath, arrayOfFiles = []) {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
            } else {
                arrayOfFiles.push(filePath);
            }
        });

        return arrayOfFiles;
    }
}

// Run the audit
if (require.main === module) {
    const auditor = new SecurityAuditor();
    auditor.run().catch(console.error);
}

module.exports = SecurityAuditor;
