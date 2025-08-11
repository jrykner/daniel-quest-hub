#!/usr/bin/env python3
"""
Vercel Deployment Helper
Simplifies Vercel deployments with common configurations
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Any

class VercelDeployer:
    def __init__(self, token: Optional[str] = None):
        self.token = token or os.getenv('VERCEL_TOKEN')
        if not self.token:
            print("⚠️  No Vercel token found. Set VERCEL_TOKEN environment variable or provide --token")
            sys.exit(1)
    
    def run_command(self, cmd: List[str], cwd: Optional[str] = None) -> Dict[str, Any]:
        """Run a command and return the result"""
        try:
            # Add token to command
            if '--token' not in cmd:
                cmd.extend(['--token', self.token])
            
            print(f"🚀 Running: {' '.join(cmd[:3])}...")  # Don't show full command with token
            
            result = subprocess.run(
                cmd,
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            return {
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'stdout': '',
                'stderr': 'Command timed out after 5 minutes',
                'returncode': -1
            }
        except Exception as e:
            return {
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'returncode': -1
            }
    
    def detect_framework(self, project_path: str) -> Optional[str]:
        """Detect the framework type of a project"""
        project_path = Path(project_path)
        
        # Check for package.json
        package_json = project_path / 'package.json'
        if package_json.exists():
            try:
                with open(package_json, 'r') as f:
                    package_data = json.load(f)
                
                # Check dependencies for framework indicators
                deps = {**package_data.get('dependencies', {}), **package_data.get('devDependencies', {})}
                
                if 'next' in deps:
                    return 'nextjs'
                elif 'nuxt' in deps:
                    return 'nuxtjs'
                elif 'react-scripts' in deps:
                    return 'create-react-app'
                elif '@angular/core' in deps:
                    return 'angular'
                elif 'vue' in deps:
                    return 'vue'
                elif 'svelte' in deps:
                    return 'svelte'
                elif 'astro' in deps:
                    return 'astro'
            except json.JSONDecodeError:
                pass
        
        # Check for static files
        if (project_path / 'index.html').exists():
            return 'static'
        
        return None
    
    def create_vercel_config(self, project_path: str, config: Dict[str, Any]) -> None:
        """Create or update vercel.json configuration"""
        vercel_config_path = Path(project_path) / 'vercel.json'
        
        default_config = {
            "version": 2
        }
        
        # Merge with provided config
        final_config = {**default_config, **config}
        
        with open(vercel_config_path, 'w') as f:
            json.dump(final_config, f, indent=2)
        
        print(f"📝 Created vercel.json configuration")
    
    def deploy(self, 
               project_path: str = '.', 
               production: bool = False,
               alias: Optional[str] = None,
               env_vars: Optional[Dict[str, str]] = None,
               build_env_vars: Optional[Dict[str, str]] = None,
               framework: Optional[str] = None,
               prebuilt: bool = False) -> Dict[str, Any]:
        """Deploy a project to Vercel"""
        
        project_path = os.path.abspath(project_path)
        
        if not os.path.exists(project_path):
            return {
                'success': False,
                'error': f'Project path does not exist: {project_path}'
            }
        
        # Build deployment command
        cmd = ['vercel']
        
        if production:
            cmd.append('--prod')
        
        if prebuilt:
            cmd.append('--prebuilt')
        
        if framework:
            cmd.extend(['--framework', framework])
        elif not prebuilt:
            # Auto-detect framework
            detected_framework = self.detect_framework(project_path)
            if detected_framework and detected_framework != 'static':
                cmd.extend(['--framework', detected_framework])
                print(f"🔍 Detected framework: {detected_framework}")
        
        # Add environment variables
        if env_vars:
            for key, value in env_vars.items():
                cmd.extend(['--env', f'{key}={value}'])
        
        if build_env_vars:
            for key, value in build_env_vars.items():
                cmd.extend(['--build-env', f'{key}={value}'])
        
        # Add JSON output for parsing
        cmd.append('--json')
        
        # Run deployment
        result = self.run_command(cmd, cwd=project_path)
        
        if not result['success']:
            return {
                'success': False,
                'error': result['stderr'] or 'Deployment failed',
                'output': result['stdout']
            }
        
        # Parse deployment result
        try:
            deployment_data = json.loads(result['stdout'])
            url = deployment_data.get('url', '')
            if url and not url.startswith('http'):
                url = f'https://{url}'
            
            deployment_result = {
                'success': True,
                'url': url,
                'deployment_id': deployment_data.get('id', ''),
                'inspector_url': deployment_data.get('inspectorUrl', ''),
                'data': deployment_data
            }
            
            print(f"✅ Deployment successful!")
            print(f"🌐 URL: {url}")
            
            # Handle alias if provided
            if alias and production:
                alias_result = self.set_alias(url, alias)
                if alias_result['success']:
                    deployment_result['alias'] = alias
                    deployment_result['alias_url'] = f'https://{alias}'
                    print(f"🎯 Alias set: https://{alias}")
            
            return deployment_result
            
        except json.JSONDecodeError:
            return {
                'success': False,
                'error': 'Could not parse deployment result',
                'output': result['stdout']
            }
    
    def set_alias(self, deployment_url: str, alias: str) -> Dict[str, Any]:
        """Set an alias for a deployment"""
        cmd = ['vercel', 'alias', deployment_url, alias]
        result = self.run_command(cmd)
        
        return {
            'success': result['success'],
            'output': result['stdout'],
            'error': result['stderr'] if not result['success'] else None
        }
    
    def list_deployments(self, limit: int = 10) -> Dict[str, Any]:
        """List recent deployments"""
        cmd = ['vercel', 'ls', '--json']
        result = self.run_command(cmd)
        
        if not result['success']:
            return {
                'success': False,
                'error': result['stderr']
            }
        
        try:
            data = json.loads(result['stdout'])
            return {
                'success': True,
                'deployments': data.get('deployments', [])[:limit]
            }
        except json.JSONDecodeError:
            return {
                'success': False,
                'error': 'Could not parse deployment list'
            }
    
    def get_deployment_logs(self, deployment_url: str) -> Dict[str, Any]:
        """Get logs for a deployment"""
        cmd = ['vercel', 'logs', deployment_url]
        result = self.run_command(cmd)
        
        return {
            'success': result['success'],
            'logs': result['stdout'],
            'error': result['stderr'] if not result['success'] else None
        }

def main():
    parser = argparse.ArgumentParser(description='Vercel Deployment Helper')
    parser.add_argument('command', choices=['deploy', 'list', 'logs', 'alias'], 
                       help='Command to execute')
    parser.add_argument('--path', default='.', help='Project path to deploy')
    parser.add_argument('--prod', action='store_true', help='Deploy to production')
    parser.add_argument('--alias', help='Set alias for deployment')
    parser.add_argument('--token', help='Vercel API token')
    parser.add_argument('--framework', help='Specify framework')
    parser.add_argument('--prebuilt', action='store_true', help='Deploy pre-built project')
    parser.add_argument('--env', action='append', help='Environment variables (KEY=value)')
    parser.add_argument('--build-env', action='append', help='Build environment variables (KEY=value)')
    parser.add_argument('--url', help='Deployment URL (for logs/alias commands)')
    
    args = parser.parse_args()
    
    deployer = VercelDeployer(token=args.token)
    
    if args.command == 'deploy':
        # Parse environment variables
        env_vars = {}
        build_env_vars = {}
        
        if args.env:
            for env in args.env:
                if '=' in env:
                    key, value = env.split('=', 1)
                    env_vars[key] = value
        
        if args.build_env:
            for env in args.build_env:
                if '=' in env:
                    key, value = env.split('=', 1)
                    build_env_vars[key] = value
        
        result = deployer.deploy(
            project_path=args.path,
            production=args.prod,
            alias=args.alias,
            env_vars=env_vars or None,
            build_env_vars=build_env_vars or None,
            framework=args.framework,
            prebuilt=args.prebuilt
        )
        
        if result['success']:
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Deployment failed: {result['error']}")
            sys.exit(1)
    
    elif args.command == 'list':
        result = deployer.list_deployments()
        if result['success']:
            for deployment in result['deployments']:
                print(f"• {deployment.get('url', 'Unknown')} - {deployment.get('state', 'Unknown')}")
        else:
            print(f"❌ Failed to list deployments: {result['error']}")
    
    elif args.command == 'logs':
        if not args.url:
            print("❌ --url required for logs command")
            sys.exit(1)
        
        result = deployer.get_deployment_logs(args.url)
        if result['success']:
            print(result['logs'])
        else:
            print(f"❌ Failed to get logs: {result['error']}")
    
    elif args.command == 'alias':
        if not args.url or not args.alias:
            print("❌ --url and --alias required for alias command")
            sys.exit(1)
        
        result = deployer.set_alias(args.url, args.alias)
        if result['success']:
            print(f"✅ Alias set: https://{args.alias}")
        else:
            print(f"❌ Failed to set alias: {result['error']}")

if __name__ == '__main__':
    main()