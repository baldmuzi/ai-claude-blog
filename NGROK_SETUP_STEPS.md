# Ngrok 设置步骤

## 第三步：注册 Ngrok 账号

1. **访问 Ngrok 官网**: https://ngrok.com
2. **注册免费账号**:
   - 点击右上角 "Sign up"
   - 可以使用 GitHub/Google 账号快速登录
   - 或者使用邮箱注册

3. **获取 Authtoken**:
   - 登录后，会自动跳转到 Dashboard
   - 或访问: https://dashboard.ngrok.com/get-started/your-authtoken
   - 复制显示的 authtoken (类似: `2abc123def456ghi789jkl...`)

4. **认证 Ngrok**:
   在终端运行:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```

   替换 `YOUR_AUTHTOKEN_HERE` 为您复制的 token

---

## 完成认证后

告诉我，我会帮您启动 Ngrok 隧道！
