# GPT Consultant Model Information

*Last Updated: August 10, 2025*

## 🤖 **Default Model Behavior**

The GPT Consultant Agent is configured to use **GPT-5 by default**, with intelligent fallback to GPT-4o when GPT-5 is not available.

### **Model Selection Priority:**

1. **GPT-5** (default) - Attempts to use OpenAI's latest model
2. **GPT-4o** (fallback) - Falls back automatically if GPT-5 unavailable
3. **Custom Model** - Can be specified with `--model` parameter

## 🔧 **How It Works**

### **Automatic Fallback**
```bash
# This will try GPT-5 first, fallback to GPT-4o if needed
gpt-consult "Your question here"
```

When GPT-5 is not available, you'll see:
```
⚠️ GPT-5 not available, falling back to gpt-4o
```

### **Manual Model Selection**
```bash
# Force specific model
gpt-consult "Your question" --model gpt-4o
gpt-consult "Your question" --model gpt-4-turbo
gpt-consult "Your question" --model gpt-3.5-turbo
```

## 📋 **Available Models**

### **GPT-5 Series**
- `gpt-5` - Latest OpenAI model (when available)

### **GPT-4 Series**
- `gpt-4o` - GPT-4 Omni (current fallback)
- `gpt-4-turbo` - GPT-4 Turbo
- `gpt-4` - Standard GPT-4

### **GPT-3.5 Series**
- `gpt-3.5-turbo` - GPT-3.5 Turbo (budget option)

## 💡 **Model Selection Tips**

### **For Strategic Analysis**
- Use **GPT-5** (default) for most sophisticated analysis
- Fallback to **GPT-4o** works excellently for business strategy

### **For Cost Optimization**
- Use `gpt-3.5-turbo` for simple questions or large volume usage
```bash
gpt-consult "Simple question" --model gpt-3.5-turbo
```

### **For Specific Capabilities**
- **GPT-5/4o**: Best for complex reasoning, analysis, and creative work
- **GPT-4-turbo**: Good balance of capability and speed
- **GPT-3.5-turbo**: Fast and economical for straightforward tasks

## 🎯 **Usage Examples**

### **Default Usage (GPT-5 with fallback)**
```bash
# Uses GPT-5, falls back to GPT-4o automatically
gpt-consult "Analyze my VC strategy" --template strategy_review --context project.md
```

### **Budget-Conscious Usage**
```bash
# Use cheaper model for simple tasks
gpt-consult "Quick question about market trends" --model gpt-3.5-turbo
```

### **Maximum Performance**
```bash
# Ensure using latest available model
gpt-consult "Complex strategic analysis needed" --model gpt-5 --context multiple_files.md
```

## 📊 **Cost Considerations**

**Approximate Token Costs (as of Aug 2025):**
- GPT-5: Premium pricing (when available)
- GPT-4o: ~$0.005 per 1K tokens
- GPT-4-turbo: ~$0.01 per 1K tokens  
- GPT-3.5-turbo: ~$0.001 per 1K tokens

**Cost Optimization Tips:**
1. Use shorter queries when possible
2. Use `--max-tokens` to limit response length
3. Use cheaper models for simple questions
4. Leverage templates for consistent, efficient prompting

## 🔄 **Model Availability Updates**

The agent will automatically attempt GPT-5 and fallback as needed. As OpenAI releases new models or updates availability, the agent will adapt accordingly.

**Current Status:**
- ✅ GPT-4o: Fully available and tested
- ⚠️ GPT-5: May not be available via API yet, fallback active
- ✅ Fallback system: Working correctly

## 🛠️ **Troubleshooting Model Issues**

### **"Model not available" errors**
```bash
# Try specifying a known working model
gpt-consult "Your question" --model gpt-4o
```

### **Unexpected costs**
```bash
# Use budget model
gpt-consult "Your question" --model gpt-3.5-turbo --max-tokens 500
```

### **Performance issues**
```bash
# Use fastest model
gpt-consult "Your question" --model gpt-3.5-turbo --temperature 0.3
```

---

*The GPT Consultant Agent is designed to always use the best available model while providing flexibility and cost control when needed.*