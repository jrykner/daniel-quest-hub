# GPT Consultant Agent
## AI-Powered Second Opinions and Strategic Analysis

*Created: August 10, 2025*

---

## 🤖 **Overview**

The GPT Consultant Agent is a powerful command-line tool that provides AI-powered strategic analysis, second opinions, and creative insights for business decisions. Built specifically for Jeremie Rykner's consulting and VC transition work, but flexible enough for any strategic business analysis.

### **Key Features**

✅ **Secure API Key Management** - Encrypted storage with master password protection  
✅ **Specialized Templates** - 10+ pre-built consultation templates  
✅ **File Context Integration** - Include multiple files as context for analysis  
✅ **Conversation Memory** - Save and resume strategic discussions  
✅ **Flexible Interface** - Command-line tool with extensive customization  

---

## 🚀 **Quick Start**

### **1. Setup**
```bash
# The agent is already set up and ready to use!
# Just store your OpenAI API key:
gpt-keys setup YOUR_OPENAI_API_KEY_HERE

# Verify setup:
gpt-keys test
```

### **2. Basic Usage**
```bash
# Simple question (uses GPT-5 by default)
gpt-consult "What are the key success factors for venture capital partnerships?"

# With context file
gpt-consult "Review this business plan" --context /path/to/plan.md

# Using specialized template
gpt-consult "Analyze my strategy" --template strategy_review --context project.md

# Specify different model
gpt-consult "Your question" --model gpt-4o
```

---

## 📋 **Available Templates**

### **Business Strategy & Analysis**
- **`strategy_review`** - Comprehensive business strategy analysis
- **`second_opinion`** - Independent perspective on important decisions  
- **`document_analysis`** - Thorough document review and recommendations
- **`creative_brainstorm`** - Innovative solution generation

### **Investment & Finance**
- **`vc_pitch_review`** - Venture capital pitch evaluation
- **`ai_investment_analysis`** - AI startup investment analysis
- **`financial_analysis`** - Financial modeling and valuation

### **Market & Competition**
- **`market_research`** - Market analysis and customer research
- **`competitor_analysis`** - Competitive landscape mapping
- **`israeli_startup_analysis`** - Israeli ecosystem analysis

---

## 💡 **Common Use Cases**

### **Strategic Decision Making**
```bash
# Get second opinion on major decisions
gpt-consult "Should I focus on US or European VC firms?" \
  --template second_opinion \
  --context strategy.md market_research.md
```

### **Document Review & Improvement**
```bash
# Review and improve important documents
gpt-consult "Review my pitch deck for potential improvements" \
  --template document_analysis \
  --context pitch_deck.md
```

### **Creative Problem Solving**
```bash
# Generate innovative approaches
gpt-consult "How can I uniquely leverage my AI expertise for VC positioning?" \
  --template creative_brainstorm \
  --context background.md target_firms.md
```

### **Market Analysis**
```bash
# Analyze market opportunities
gpt-consult "Analyze the Israeli AI startup market opportunity" \
  --template market_research \
  --context israeli_market_data.md
```

---

## 🔧 **Advanced Features**

### **Conversation Management**
```bash
# Save important discussions
gpt-consult "Strategic planning session" \
  --save strategy_session_$(date +%Y%m%d).json

# Resume previous conversations  
gpt-consult "Continue our discussion" \
  --load strategy_session_20250810.json
```

### **Creativity Control**
```bash
# High creativity for brainstorming
gpt-consult "Generate creative ideas" --temperature 0.9

# Low creativity for analytical work
gpt-consult "Analyze financial data" --temperature 0.3
```

### **Context-Rich Analysis**
```bash
# Include multiple files for comprehensive analysis
gpt-consult "Comprehensive strategic review" \
  --template strategy_review \
  --context project.md financials.md market_data.md competitors.md
```

---

## 🔐 **Security & Key Management**

### **API Key Commands**
```bash
# Initial setup
gpt-keys setup YOUR_API_KEY

# Check status
gpt-keys status

# Test key functionality
gpt-keys test

# Update key
gpt-keys update NEW_API_KEY

# Remove key
gpt-keys remove
```

### **Security Features**
- **Encrypted Storage**: Keys encrypted with master password
- **Local Storage**: No external key transmission except to OpenAI
- **Access Control**: Master password required for key access
- **Easy Rotation**: Simple key update process

---

## 📊 **Templates Reference**

### **Strategy & Planning Templates**

#### **`strategy_review`**
Comprehensive business strategy analysis covering:
- Strategic strengths and positioning
- Market and competitive assessment  
- Execution and risk analysis
- Specific improvement recommendations
- Priority next steps

#### **`second_opinion`**
Independent business advisor perspective providing:
- Situation assessment and alternatives
- Risk-benefit analysis
- Decision-making framework
- Implementation recommendations

#### **`creative_brainstorm`**
Innovation-focused creative thinking including:
- Problem reframing and assumptions
- Cross-industry inspiration
- Unconventional solutions
- Implementation pathways

### **Investment & Finance Templates**

#### **`vc_pitch_review`**
Venture capital evaluation framework covering:
- Market assessment and opportunity
- Business model and unit economics
- Team and execution capability
- Investment recommendation

#### **`financial_analysis`**
Financial modeling and analysis including:
- Revenue model and growth assumptions
- Profitability and cash flow analysis
- Funding requirements and valuation
- Financial risk assessment

#### **`ai_investment_analysis`**
AI-specific investment analysis covering:
- Technology and innovation assessment
- AI market positioning
- AI-specific business model evaluation
- Technical and market risks

### **Market & Research Templates**

#### **`market_research`**
Comprehensive market analysis including:
- Market size and growth analysis
- Customer segmentation and analysis
- Market trends and drivers
- Entry strategy recommendations

#### **`competitor_analysis`**
Competitive intelligence covering:
- Competitive landscape mapping
- Competitor strengths and weaknesses
- Positioning and differentiation
- Strategic response recommendations

#### **`israeli_startup_analysis`**
Israeli ecosystem-specific analysis including:
- Israeli ecosystem advantages
- International expansion strategies
- Scaling considerations
- Investment perspectives

### **General Analysis Templates**

#### **`document_analysis`**
Thorough document review providing:
- Executive summary and key insights
- Content and structure analysis
- Strategic implications
- Improvement recommendations

---

## 🎯 **Best Practices**

### **Getting Better Results**

1. **Use Appropriate Templates**: Choose the template that best matches your analysis needs
2. **Provide Rich Context**: Include relevant files and background information
3. **Be Specific**: Ask focused questions rather than vague requests
4. **Iterate**: Build on previous conversations and refine your approach
5. **Combine Perspectives**: Use multiple templates for complex decisions

### **Workflow Integration**

**Daily Planning:**
```bash
gpt-consult "What should I prioritize today?" --context todo.md
```

**Weekly Strategy:**
```bash
gpt-consult "Weekly strategic review" --template strategy_review --context project_files/*
```

**Decision Support:**
```bash
gpt-consult "Help me decide between options A and B" --template second_opinion
```

**Creative Sessions:**
```bash
gpt-consult "Generate new approaches to challenge X" --template creative_brainstorm
```

---

## 🚀 **Example Workflows**

### **VC Transition Strategy Review**
```bash
# Comprehensive strategy analysis
gpt-consult "Analyze my VC partner transition strategy and suggest improvements" \
  --template strategy_review \
  --context /root/VC/project.md /root/VC/target_firms_research.md

# Creative networking approaches
gpt-consult "Generate creative ways to leverage my OpenAI and academic connections" \
  --template creative_brainstorm \
  --context /root/VC/project.md

# Second opinion on target prioritization
gpt-consult "Should I focus on US AI VCs or European expansion firms?" \
  --template second_opinion \
  --context /root/VC/target_firms_research.md
```

### **Business Plan Development**
```bash
# Document review and improvement
gpt-consult "Review my business plan for potential improvements" \
  --template document_analysis \
  --context business_plan.md

# Market opportunity analysis
gpt-consult "Analyze the market opportunity for my business" \
  --template market_research \
  --context market_data.md

# Financial model review
gpt-consult "Review my financial projections and assumptions" \
  --template financial_analysis \
  --context financial_model.md
```

---

## 🔄 **Troubleshooting**

### **Common Issues**

**"No API key found"**
```bash
# Setup your API key
gpt-keys setup YOUR_API_KEY
```

**"Could not retrieve API key"**
```bash
# Check if key exists
gpt-keys status

# Test key functionality
gpt-keys test

# Update if needed
gpt-keys update NEW_API_KEY
```

**"Template not found"**
```bash
# List available templates
python3 /root/gpt_agent/templates.py

# Use without template
gpt-consult "Your question" --context file.md
```

**"File not found"**
```bash
# Check file paths are correct
ls -la /path/to/your/file.md

# Use absolute paths
gpt-consult "Question" --context /full/path/to/file.md
```

---

## 📞 **Support**

### **Getting Help**
- Use `gpt-consult --help` for usage information
- Use `gpt-keys --help` for key management help  
- Check file permissions if context files aren't loading
- Verify API key has sufficient credits/permissions

### **Feature Requests**
The agent is designed to be easily extensible. Additional templates or features can be added based on your specific needs and use cases.

---

*The GPT Consultant Agent is designed to enhance your strategic thinking and decision-making with AI-powered insights. Use it regularly for the best results!*