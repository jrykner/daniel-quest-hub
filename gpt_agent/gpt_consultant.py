#!/usr/bin/env python3
"""
GPT Consultant Agent
A flexible agent for getting second opinions, task assistance, and collaboration with GPT-5 (default)
Created for Jeremie Rykner's projects and consulting work
"""

import os
import json
import requests
import argparse
import sys
from datetime import datetime
from typing import Dict, List, Optional, Any

class GPTConsultant:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """
        Initialize GPT Consultant Agent
        
        Args:
            api_key: OpenAI API key (if not provided, will look for environment variable)
            model: Model to use (defaults to gpt-5)
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable or provide via parameter.")
        
        # Use different endpoints based on model
        if model and model.startswith("gpt-5"):
            self.base_url = "https://api.openai.com/v1/responses"
        else:
            self.base_url = "https://api.openai.com/v1/chat/completions"
        # Try GPT-5 first, fallback to available models if needed
        self.model = model or "gpt-5"
        self.conversation_history = []
        self.session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
    def set_system_context(self, context: str) -> None:
        """Set the system context for the conversation"""
        self.conversation_history = [{
            "role": "system",
            "content": context
        }]
    
    def add_context_files(self, file_paths: List[str]) -> str:
        """
        Add context from files to the conversation
        
        Args:
            file_paths: List of file paths to include as context
            
        Returns:
            String containing all file contents with headers
        """
        context_content = "\n\n=== CONTEXT FILES ===\n"
        
        for file_path in file_paths:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    context_content += f"\n--- {file_path} ---\n{content}\n"
            except Exception as e:
                context_content += f"\n--- {file_path} (ERROR) ---\nCould not read file: {e}\n"
        
        return context_content
    
    def consult(self, 
                query: str, 
                context_files: Optional[List[str]] = None,
                temperature: float = 0.7,
                max_tokens: int = 16000,
                verbosity: Optional[str] = None,
                reasoning_effort: Optional[str] = None) -> Dict[str, Any]:
        """
        Send a query to GPT and get a response
        
        Args:
            query: The question or task to send to GPT
            context_files: Optional list of files to include as context
            temperature: Response creativity (0.0 to 1.0)
            max_tokens: Maximum response length (GPT-5 supports up to 128,000 output tokens)
            verbosity: GPT-5 verbosity level ("low", "medium", "high")
            reasoning_effort: GPT-5 reasoning effort ("minimal", "low", "medium", "high")
            
        Returns:
            Dictionary containing response and metadata
        """
        try:
            # Add context files if provided
            full_query = query
            if context_files:
                file_context = self.add_context_files(context_files)
                full_query = f"{file_context}\n\n=== QUERY ===\n{query}"
            
            # Add user message to conversation history
            self.conversation_history.append({
                "role": "user",
                "content": full_query
            })
            
            # Prepare API request
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Different payload structure for GPT-5 responses API
            if self.model.startswith("gpt-5"):
                payload = {
                    "model": self.model,
                    "input": self.conversation_history,
                    "max_output_tokens": max_tokens,
                    "text": {
                        "verbosity": verbosity if verbosity else "medium"
                    },
                }
                
                # Add reasoning effort parameter
                if reasoning_effort:
                    payload["reasoning"] = {"effort": reasoning_effort}
                else:
                    payload["reasoning"] = {"effort": "low"}
            else:
                # Traditional chat completions API
                payload = {
                    "model": self.model,
                    "messages": self.conversation_history,
                    "stream": False,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
            
            # Make API request
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            
            # Extract response content - different structure for GPT-5 responses API
            if self.model.startswith("gpt-5"):
                # Responses API structure - extract text from output array
                gpt_response = ""
                if 'output' in result and result['output']:
                    for output_item in result['output']:
                        if output_item.get('type') == 'message':
                            content = output_item.get('content', [])
                            for content_item in content:
                                if content_item.get('type') == 'output_text':
                                    gpt_response += content_item.get('text', '')
                
                if not gpt_response:
                    gpt_response = "GPT-5 responded but no text content was found."
            else:
                # Chat completions API structure
                gpt_response = result['choices'][0]['message']['content']
            
            # Check for GPT-5 reasoning tokens
            reasoning_info = ""
            if self.model.startswith("gpt-5"):
                # Responses API uses different usage structure
                usage_details = result.get('usage', {}).get('output_tokens_details', {})
                reasoning_tokens = usage_details.get('reasoning_tokens', 0)
                if reasoning_tokens > 0:
                    reasoning_info = f" (including {reasoning_tokens} reasoning tokens)"
            
            # Add GPT response to conversation history
            self.conversation_history.append({
                "role": "assistant", 
                "content": gpt_response
            })
            
            # Prepare return data
            return {
                "success": True,
                "response": gpt_response,
                "usage": result.get('usage', {}),
                "model": result.get('model', self.model),
                "session_id": self.session_id,
                "timestamp": datetime.now().isoformat()
            }
            
        except requests.exceptions.RequestException as e:
            error_detail = str(e)
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_json = e.response.json()
                    error_detail = f"{str(e)}\nAPI Error: {error_json.get('error', {}).get('message', 'Unknown API error')}"
                except:
                    error_detail = f"{str(e)}\nResponse: {e.response.text[:500]}"
            
            return {
                "success": False,
                "error": f"API request failed: {error_detail}",
                "session_id": self.session_id,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "session_id": self.session_id,
                "timestamp": datetime.now().isoformat()
            }
    
    def save_conversation(self, filepath: str) -> bool:
        """
        Save the conversation history to a file
        
        Args:
            filepath: Path to save the conversation
            
        Returns:
            True if successful, False otherwise
        """
        try:
            conversation_data = {
                "session_id": self.session_id,
                "timestamp": datetime.now().isoformat(),
                "model": self.model,
                "conversation": self.conversation_history
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(conversation_data, f, indent=2, ensure_ascii=False)
            
            return True
        except Exception as e:
            print(f"Error saving conversation: {e}")
            return False
    
    def load_conversation(self, filepath: str) -> bool:
        """
        Load a previous conversation from a file
        
        Args:
            filepath: Path to the conversation file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.conversation_history = data.get('conversation', [])
            self.session_id = data.get('session_id', self.session_id)
            
            return True
        except Exception as e:
            print(f"Error loading conversation: {e}")
            return False
    
    def clear_conversation(self) -> None:
        """Clear the conversation history"""
        self.conversation_history = []
        self.session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

# Predefined consultation templates
CONSULTATION_TEMPLATES = {
    "strategy_review": """
You are an expert strategic consultant reviewing a business plan or project strategy.
Please analyze the provided content and provide:
1. Strengths and opportunities in the current approach
2. Potential risks and weaknesses to address
3. Specific recommendations for improvement
4. Priority actions to take immediately

Be direct, actionable, and business-focused in your response.
""",
    
    "vc_pitch_review": """
You are a senior venture capital partner reviewing a startup pitch or investment opportunity.
Please evaluate the provided content and provide:
1. Investment attractiveness assessment
2. Key concerns or red flags
3. Questions that need to be addressed
4. Market positioning and competitive analysis
5. Recommendations for strengthening the opportunity

Focus on practical VC decision-making criteria.
""",
    
    "document_analysis": """
You are a senior business analyst reviewing important documents.
Please analyze the provided content and provide:
1. Key insights and main takeaways
2. Critical information that stands out
3. Potential issues or concerns
4. Recommendations for action
5. Questions that should be investigated further

Be thorough and analytical in your assessment.
""",
    
    "second_opinion": """
You are an experienced business advisor providing a second opinion on important decisions.
Please review the provided information and provide:
1. Your assessment of the proposed approach
2. Alternative perspectives to consider
3. Potential blind spots or overlooked factors
4. Risk assessment and mitigation strategies
5. Final recommendation with reasoning

Provide balanced, thoughtful advice as if consulting for a high-stakes business decision.
""",
    
    "creative_brainstorm": """
You are a creative strategic thinker helping to generate innovative solutions and ideas.
Please review the challenge or opportunity presented and provide:
1. Creative approaches and unconventional solutions
2. Innovative angles that might not be obvious
3. Cross-industry insights and analogies
4. Breakthrough possibilities to explore
5. Next steps for testing promising ideas

Think outside the box while remaining practical and actionable.
"""
}

def main():
    """Command line interface for GPT Consultant"""
    parser = argparse.ArgumentParser(description="GPT Consultant Agent - Get second opinions and task assistance")
    parser.add_argument("query", help="Your question or task for GPT")
    parser.add_argument("--template", "-t", choices=list(CONSULTATION_TEMPLATES.keys()), 
                       help="Use a predefined consultation template")
    parser.add_argument("--context", "-c", nargs="+", help="File paths to include as context")
    parser.add_argument("--temperature", type=float, default=0.7, help="Response creativity (0.0-1.0)")
    parser.add_argument("--max-tokens", type=int, default=16000, help="Maximum response length (GPT-5 supports up to 128,000)")
    parser.add_argument("--save", "-s", help="Save conversation to file")
    parser.add_argument("--load", "-l", help="Load previous conversation from file")
    parser.add_argument("--api-key", help="OpenAI API key (or use OPENAI_API_KEY env var)")
    parser.add_argument("--model", "-m", default="gpt-5", help="Model to use (default: gpt-5)")
    parser.add_argument("--verbosity", choices=["low", "medium", "high"], help="GPT-5 verbosity level")
    parser.add_argument("--reasoning-effort", choices=["minimal", "low", "medium", "high"], help="GPT-5 reasoning effort")
    
    args = parser.parse_args()
    
    try:
        # Initialize GPT Consultant
        consultant = GPTConsultant(api_key=args.api_key, model=args.model)
        
        # Load previous conversation if specified
        if args.load:
            if consultant.load_conversation(args.load):
                print(f"✓ Loaded conversation from {args.load}")
            else:
                print(f"✗ Could not load conversation from {args.load}")
                return 1
        
        # Set system context if template is specified
        if args.template:
            consultant.set_system_context(CONSULTATION_TEMPLATES[args.template])
            print(f"📋 Using template: {args.template}")
        
        print(f"🤖 Consulting GPT on: {args.query[:100]}{'...' if len(args.query) > 100 else ''}")
        if args.context:
            print(f"📁 Including context from {len(args.context)} files")
        
        # Get GPT response
        result = consultant.consult(
            query=args.query,
            context_files=args.context,
            temperature=args.temperature,
            max_tokens=args.max_tokens,
            verbosity=args.verbosity,
            reasoning_effort=getattr(args, 'reasoning_effort', None)
        )
        
        if result["success"]:
            print("\n" + "="*80)
            print("GPT CONSULTANT RESPONSE")
            print("="*80)
            print(result["response"])
            print("\n" + "="*80)
            
            # Print usage information
            usage = result.get("usage", {})
            if usage:
                # Different usage structure for GPT-5 Responses API
                model_used = result.get("model", "unknown")
                if model_used.startswith("gpt-5"):
                    # Responses API usage structure
                    total_tokens = usage.get('total_tokens', usage.get('input_tokens', 0) + usage.get('output_tokens', 0))
                    input_tokens = usage.get('input_tokens', 'N/A')
                    output_tokens = usage.get('output_tokens', 'N/A')
                    base_msg = f"📊 Tokens used: {total_tokens} (input: {input_tokens}, output: {output_tokens})"
                    
                    # Add reasoning token info
                    if 'output_tokens_details' in usage:
                        reasoning_tokens = usage['output_tokens_details'].get('reasoning_tokens', 0)
                        if reasoning_tokens > 0:
                            base_msg += f", reasoning: {reasoning_tokens}"
                else:
                    # Chat completions API usage structure
                    base_msg = f"📊 Tokens used: {usage.get('total_tokens', 'N/A')} (prompt: {usage.get('prompt_tokens', 'N/A')}, completion: {usage.get('completion_tokens', 'N/A')})"
                    
                    if 'completion_tokens_details' in usage:
                        reasoning_tokens = usage['completion_tokens_details'].get('reasoning_tokens', 0)
                        if reasoning_tokens > 0:
                            base_msg += f", reasoning: {reasoning_tokens}"
                
                print(base_msg)
            
            print(f"🕒 Session: {result['session_id']}")
            
            # Save conversation if requested
            if args.save:
                if consultant.save_conversation(args.save):
                    print(f"💾 Conversation saved to {args.save}")
                else:
                    print(f"✗ Could not save conversation to {args.save}")
            
        else:
            print(f"\n❌ Error: {result['error']}")
            return 1
            
    except Exception as e:
        print(f"\n💥 Failed to initialize GPT Consultant: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())