# AI 客服系统 - 部署指南

## 系统架构

```
用户 → Shopify 网站 → 嵌入式聊天窗口 → 后端 API → GPT-4 → 回复用户
                                    ↓
                              无法回答 → 发送邮件到你的邮箱
```

## 技术栈

- **前端**：嵌入式 JavaScript 聊天窗口
- **后端**：Python Flask/FastAPI
- **AI**：OpenAI GPT-4 API
- **部署**：Render / Railway / VPS
- **工单**：邮件通知（999huamao@gmail.com）

---

## 快速部署（Render - 免费）

### 1. 创建 Render 账户
1. 访问 https://render.com
2. 用 GitHub 登录
3. 创建 New Web Service

### 2. 部署代码

创建以下文件，上传到 GitHub 仓库：

**requirements.txt**
```
flask==3.0.0
openai==1.3.0
gunicorn==21.2.0
python-dotenv==1.0.0
```

**app.py**
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# 配置
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
EMAIL_USER = os.getenv('EMAIL_USER', '999huamao@gmail.com')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')  # 应用专用密码
openai.api_key = OPENAI_API_KEY

# 知识库
KNOWLEDGE_BASE = """
You are a customer service assistant for Vintage Watch Co., an online watch retailer.

PRODUCTS:
1. The Heritage 42 - €79 - 42mm vintage dress watch, automatic movement, genuine leather strap
2. The Classic Chrono - €89 - 40mm chronograph, quartz movement, stainless steel
3. The Minimalist - €69 - 38mm minimalist watch, Japanese quartz, mesh band

SHIPPING:
- Free shipping on orders over €79
- Delivery to UK, Germany, France, Italy, Spain: 9-12 business days
- Other EU countries: 10-15 business days
- Shipping cost: €6-10 depending on country

RETURNS:
- 30-day return policy
- Items must be unworn with original packaging
- Contact support for return label

CONTACT:
- Email: support@vintagewatchco.com
- Human support available for complex issues

POLICY:
- Always be polite and professional
- Answer in the customer's language (English, German, French, Spanish, Italian)
- For questions you cannot answer, collect: name, email, order number (if applicable), and question
- Do not make up information about orders or shipping status
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    conversation_history = data.get('history', [])
    
    # 构建消息
    messages = [
        {"role": "system", "content": KNOWLEDGE_BASE}
    ]
    
    for msg in conversation_history:
        messages.append({"role": msg['role'], "content": msg['content']})
    
    messages.append({"role": "user", "content": user_message})
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        reply = response.choices[0].message.content
        
        # 检测是否需要转人工
        if "[ESCALATE]" in reply.upper() or "contact support" in reply.lower():
            send_escalation_email(user_message, conversation_history)
        
        return jsonify({
            "reply": reply,
            "escalate": "[ESCALATE]" in reply.upper()
        })
        
    except Exception as e:
        return jsonify({"reply": "I'm sorry, I'm having trouble connecting. Please try again or contact support@vintagewatchco.com", "error": str(e)})

def send_escalation_email(user_message, history):
    """发送工单邮件到 999huamao@gmail.com"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_USER  # 发给自己
        msg['Subject'] = f"[Vintage Watch Co.] Customer Support Request - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        
        body = f"""
A customer needs human assistance.

Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

CONVERSATION HISTORY:
"""
        for msg in history:
            role = msg.get('role', 'unknown')
            content = msg.get('content', '')
            body += f"\n{role.upper()}: {content}\n"
        
        body += f"\nCURRENT MESSAGE:\n{user_message}\n"
        body += "\n---\nPlease respond to this customer inquiry.\n"
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "vintage-watch-chatbot"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

**chat-widget.js**
```javascript
(function() {
    // 配置
    const API_URL = 'https://your-service.onrender.com/chat'; // 替换为你的 Render URL
    
    // 创建聊天窗口 HTML
    const chatHTML = `
        <div id="vwc-chat-widget" style="position:fixed;bottom:20px;right:20px;width:350px;height:500px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;z-index:9999;">
            <div style="background:#8B4513;color:#fff;padding:16px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-weight:600;">Vintage Watch Co.</div>
                    <div style="font-size:12px;opacity:0.9;">Customer Support</div>
                </div>
                <button onclick="toggleChat()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:20px;">×</button>
            </div>
            <div id="vwc-chat-messages" style="flex:1;overflow-y:auto;padding:16px;background:#f8f8f8;">
                <div style="background:#e3f2fd;padding:12px;border-radius:8px;margin-bottom:12px;font-size:14px;max-width:85%;">
                    👋 Hi! I'm here to help with questions about our vintage watches. How can I assist you today?
                </div>
            </div>
            <div style="padding:12px;border-top:1px solid #e0e0e0;background:#fff;border-radius:0 0 12px 12px;">
                <div style="display:flex;gap:8px;">
                    <input type="text" id="vwc-chat-input" placeholder="Type your message..." style="flex:1;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;" onkeypress="if(event.key==='Enter')sendMessage()">
                    <button onclick="sendMessage()" style="background:#8B4513;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:500;">Send</button>
                </div>
            </div>
        </div>
        <button id="vwc-chat-button" onclick="toggleChat()" style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#8B4513;color:#fff;border:none;border-radius:50%;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:24px;z-index:9998;">
            💬
        </button>
    `;
    
    // 插入到页面
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);
    
    // 对话历史
    let conversationHistory = [];
    
    // 切换聊天窗口
    window.toggleChat = function() {
        const widget = document.getElementById('vwc-chat-widget');
        const button = document.getElementById('vwc-chat-button');
        if (widget.style.display === 'none') {
            widget.style.display = 'flex';
            button.style.display = 'none';
        } else {
            widget.style.display = 'none';
            button.style.display = 'block';
        }
    };
    
    // 发送消息
    window.sendMessage = async function() {
        const input = document.getElementById('vwc-chat-input');
        const message = input.value.trim();
        if (!message) return;
        
        // 显示用户消息
        addMessage(message, 'user');
        input.value = '';
        
        // 添加到历史
        conversationHistory.push({role: 'user', content: message});
        
        // 调用 API
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: message, history: conversationHistory})
            });
            
            const data = await response.json();
            
            // 显示回复
            addMessage(data.reply, 'assistant');
            conversationHistory.push({role: 'assistant', content: data.reply});
            
        } catch (error) {
            addMessage("Sorry, I'm having trouble connecting. Please try again.", 'assistant');
        }
    };
    
    // 添加消息到界面
    function addMessage(text, role) {
        const container = document.getElementById('vwc-chat-messages');
        const div = document.createElement('div');
        div.style.cssText = role === 'user' 
            ? 'background:#8B4513;color:#fff;padding:12px;border-radius:8px;margin-bottom:12px;font-size:14px;max-width:85%;margin-left:auto;'
            : 'background:#e3f2fd;padding:12px;border-radius:8px;margin-bottom:12px;font-size:14px;max-width:85%;';
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
})();
```

### 3. 环境变量配置

在 Render 的 Environment 设置：

```
OPENAI_API_KEY=sk-your-openai-api-key
EMAIL_USER=999huamao@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

### 4. 嵌入 Shopify

1. Shopify Admin → Online Store → Themes → Edit code
2. 找到 `theme.liquid` 文件
3. 在 `</body>` 前添加：

```html
<script src="https://your-service.onrender.com/static/chat-widget.js"></script>
```

---

## Gmail 应用专用密码设置

1. 访问 https://myaccount.google.com/security
2. 开启两步验证（如果还没开）
3. 搜索 "App passwords"
4. 生成新密码（选择 "Mail" 和 "Other"）
5. 复制生成的 16 位密码到 EMAIL_PASSWORD

---

## 测试

1. 打开你的 Shopify 店铺
2. 点击右下角聊天按钮
3. 发送测试消息
4. 检查 999huamao@gmail.com 是否收到工单邮件

---

## 后续优化

- [ ] 添加多语言支持（检测用户语言）
- [ ] 接入订单查询 API
- [ ] 添加满意度评价
- [ ] 优化知识库（基于真实 FAQ）
