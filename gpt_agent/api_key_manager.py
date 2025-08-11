#!/usr/bin/env python3
"""
Secure API Key Manager for GPT Consultant
Handles secure storage and retrieval of OpenAI API keys
"""

import os
import json
import getpass
import base64
from cryptography.fernet import Fernet
from pathlib import Path
import argparse
import sys

class APIKeyManager:
    def __init__(self, config_dir: str = None):
        """
        Initialize API Key Manager
        
        Args:
            config_dir: Directory to store encrypted config (defaults to ~/.gpt_agent)
        """
        self.config_dir = Path(config_dir or os.path.expanduser("~/.gpt_agent"))
        self.config_dir.mkdir(exist_ok=True)
        self.key_file = self.config_dir / "key.enc"
        self.config_file = self.config_dir / "config.enc"
        self._encryption_key = None
    
    def _get_master_password(self, confirm: bool = False) -> str:
        """Get master password from user input"""
        password = getpass.getpass("Enter master password: ")
        if confirm:
            confirm_password = getpass.getpass("Confirm master password: ")
            if password != confirm_password:
                raise ValueError("Passwords do not match")
        return password
    
    def _derive_key(self, password: str) -> bytes:
        """Derive encryption key from password"""
        # Simple key derivation - in production, use PBKDF2 or similar
        key_material = password.encode('utf-8')
        # Pad or truncate to 32 bytes for Fernet
        key_material = key_material[:32].ljust(32, b'\0')
        return base64.urlsafe_b64encode(key_material)
    
    def _get_cipher(self, password: str = None) -> Fernet:
        """Get Fernet cipher for encryption/decryption"""
        if password is None:
            password = self._get_master_password()
        key = self._derive_key(password)
        return Fernet(key)
    
    def setup(self, api_key: str, password: str = None) -> bool:
        """
        Initial setup: encrypt and store API key
        
        Args:
            api_key: OpenAI API key to store
            password: Master password (will prompt if not provided)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if password is None:
                password = self._get_master_password(confirm=True)
            
            cipher = self._get_cipher(password)
            
            # Encrypt API key
            encrypted_key = cipher.encrypt(api_key.encode('utf-8'))
            
            # Store encrypted key
            with open(self.key_file, 'wb') as f:
                f.write(encrypted_key)
            
            # Create config
            config = {
                "created": "2025-08-10",
                "description": "GPT Consultant API key storage"
            }
            
            encrypted_config = cipher.encrypt(json.dumps(config).encode('utf-8'))
            with open(self.config_file, 'wb') as f:
                f.write(encrypted_config)
            
            print("✓ API key stored securely")
            return True
            
        except Exception as e:
            print(f"✗ Setup failed: {e}")
            return False
    
    def get_api_key(self, password: str = None) -> str:
        """
        Retrieve decrypted API key
        
        Args:
            password: Master password (will prompt if not provided)
            
        Returns:
            Decrypted API key
        """
        try:
            if not self.key_file.exists():
                raise FileNotFoundError("No API key found. Run setup first.")
            
            if password is None:
                password = self._get_master_password()
            
            cipher = self._get_cipher(password)
            
            # Read and decrypt API key
            with open(self.key_file, 'rb') as f:
                encrypted_key = f.read()
            
            api_key = cipher.decrypt(encrypted_key).decode('utf-8')
            return api_key
            
        except Exception as e:
            raise ValueError(f"Could not retrieve API key: {e}")
    
    def update_api_key(self, new_api_key: str, password: str = None) -> bool:
        """
        Update stored API key
        
        Args:
            new_api_key: New OpenAI API key
            password: Master password (will prompt if not provided)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if password is None:
                password = self._get_master_password()
            
            # Verify current password by trying to decrypt existing key
            self.get_api_key(password)
            
            # Encrypt and store new key
            cipher = self._get_cipher(password)
            encrypted_key = cipher.encrypt(new_api_key.encode('utf-8'))
            
            with open(self.key_file, 'wb') as f:
                f.write(encrypted_key)
            
            print("✓ API key updated successfully")
            return True
            
        except Exception as e:
            print(f"✗ Update failed: {e}")
            return False
    
    def is_configured(self) -> bool:
        """Check if API key is already configured"""
        return self.key_file.exists() and self.config_file.exists()
    
    def remove(self) -> bool:
        """Remove stored API key and config"""
        try:
            if self.key_file.exists():
                self.key_file.unlink()
            if self.config_file.exists():
                self.config_file.unlink()
            
            print("✓ API key removed successfully")
            return True
            
        except Exception as e:
            print(f"✗ Remove failed: {e}")
            return False

def main():
    """Command line interface for API Key Manager"""
    parser = argparse.ArgumentParser(description="GPT Consultant API Key Manager")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Setup command
    setup_parser = subparsers.add_parser('setup', help='Setup API key storage')
    setup_parser.add_argument('api_key', help='OpenAI API key to store')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update stored API key')
    update_parser.add_argument('api_key', help='New OpenAI API key')
    
    # Test command
    subparsers.add_parser('test', help='Test API key retrieval')
    
    # Status command
    subparsers.add_parser('status', help='Check configuration status')
    
    # Remove command
    subparsers.add_parser('remove', help='Remove stored API key')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    manager = APIKeyManager()
    
    if args.command == 'setup':
        if manager.is_configured():
            response = input("API key already configured. Overwrite? (y/N): ")
            if response.lower() != 'y':
                print("Setup cancelled")
                return 0
        
        success = manager.setup(args.api_key)
        return 0 if success else 1
    
    elif args.command == 'update':
        if not manager.is_configured():
            print("✗ No API key configured. Run setup first.")
            return 1
        
        success = manager.update_api_key(args.api_key)
        return 0 if success else 1
    
    elif args.command == 'test':
        if not manager.is_configured():
            print("✗ No API key configured. Run setup first.")
            return 1
        
        try:
            api_key = manager.get_api_key()
            print(f"✓ API key retrieved successfully (starts with: {api_key[:10]}...)")
            return 0
        except Exception as e:
            print(f"✗ Test failed: {e}")
            return 1
    
    elif args.command == 'status':
        if manager.is_configured():
            print("✓ API key is configured")
            print(f"📁 Config directory: {manager.config_dir}")
            return 0
        else:
            print("✗ No API key configured")
            print(f"📁 Config directory: {manager.config_dir}")
            return 1
    
    elif args.command == 'remove':
        if not manager.is_configured():
            print("✗ No API key configured")
            return 1
        
        response = input("Are you sure you want to remove the stored API key? (y/N): ")
        if response.lower() == 'y':
            success = manager.remove()
            return 0 if success else 1
        else:
            print("Remove cancelled")
            return 0
    
    return 0

if __name__ == "__main__":
    sys.exit(main())