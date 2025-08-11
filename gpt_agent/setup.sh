#!/bin/bash
# GPT Consultant Agent Setup Script
# Installs dependencies and sets up the agent

set -e

echo "🚀 Setting up GPT Consultant Agent..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Install required Python packages
echo "📦 Installing Python dependencies..."
pip3 install requests cryptography --quiet

# Make scripts executable
chmod +x /root/gpt_agent/gpt_consultant.py
chmod +x /root/gpt_agent/api_key_manager.py

# Create convenience symlinks in /usr/local/bin if they don't exist
if [ ! -f /usr/local/bin/gpt-consult ]; then
    echo "🔗 Creating convenience commands..."
    ln -s /root/gpt_agent/gpt_consultant.py /usr/local/bin/gpt-consult
    ln -s /root/gpt_agent/api_key_manager.py /usr/local/bin/gpt-keys
fi

echo "✅ GPT Consultant Agent setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Store your OpenAI API key: gpt-keys setup YOUR_API_KEY"
echo "2. Test the agent: gpt-consult 'What is the capital of France?'"
echo ""
echo "💡 Usage examples:"
echo "   gpt-consult 'Review my business plan' --context /path/to/plan.md"
echo "   gpt-consult 'Give me a second opinion on this strategy' --template second_opinion"
echo "   gpt-consult 'Analyze this VC pitch' --template vc_pitch_review --context pitch.md"
echo ""
echo "🔧 Available templates:"
echo "   - strategy_review: Business strategy analysis"
echo "   - vc_pitch_review: Venture capital pitch evaluation"  
echo "   - document_analysis: Document review and analysis"
echo "   - second_opinion: Get alternative perspectives"
echo "   - creative_brainstorm: Generate innovative ideas"