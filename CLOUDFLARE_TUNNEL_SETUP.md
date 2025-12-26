# 使用本地 MySQL + Cloudflare Tunnel 设置指南

通过 Cloudflare Tunnel，您可以将本地 MySQL 数据库安全地暴露到公网，让 Vercel 能够访问。

**优点:**
- ✅ 完全免费
- ✅ 使用现有的本地 MySQL 数据库
- ✅ 不需要迁移数据
- ✅ 安全的加密连接

**缺点:**
- ⚠️ 需要本地电脑持续运行
- ⚠️ 电脑关机后网站无法访问
- ⚠️ 不适合生产环境（适合学习、测试、演示）

---

## 第一步：安装 Cloudflare Tunnel

### macOS 安装

```bash
brew install cloudflare/cloudflare/cloudflared
```

### 其他系统

访问下载页面: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

- **Windows**: 下载 .exe 文件
- **Linux**: 下载对应的包

---

## 第二步：配置 MySQL 允许远程连接

### 1. 创建远程访问用户

打开终端，登录 MySQL:

```bash
mysql -u root -p
# 输入密码: ljx123456
```

在 MySQL 中执行:

```sql
-- 创建专门用于 Vercel 访问的用户
CREATE USER 'vercel'@'%' IDENTIFIED BY 'YourSecurePassword123!';

-- 授予 myblog 数据库的所有权限
GRANT ALL PRIVILEGES ON myblog.* TO 'vercel'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- 验证用户已创建
SELECT user, host FROM mysql.user WHERE user = 'vercel';

-- 退出
EXIT;
```

**重要**: 将 `YourSecurePassword123!` 替换为一个强密码！

### 2. 配置 MySQL 监听所有接口

编辑 MySQL 配置文件:

```bash
# 查找 MySQL 配置文件位置
mysql --help | grep "Default options" -A 1

# 通常在以下位置之一:
# macOS (Homebrew): /opt/homebrew/etc/my.cnf 或 /usr/local/etc/my.cnf
# Linux: /etc/mysql/my.cnf 或 /etc/my.cnf
```

编辑配置文件:

```bash
# 使用 nano 或 vim 编辑
sudo nano /opt/homebrew/etc/my.cnf
```

找到 `bind-address` 行，修改为:

```ini
[mysqld]
bind-address = 0.0.0.0
```

如果找不到这一行，添加到 `[mysqld]` 部分。

### 3. 重启 MySQL

```bash
# macOS (Homebrew)
brew services restart mysql

# 或者
sudo /usr/local/mysql/support-files/mysql.server restart

# Linux (systemd)
sudo systemctl restart mysql
```

### 4. 验证 MySQL 监听端口

```bash
# 检查 MySQL 是否在监听 0.0.0.0:3306
sudo lsof -i :3306
# 或
netstat -an | grep 3306
```

应该看到类似输出:
```
*:3306    (LISTEN)
```

---

## 第三步：设置 Cloudflare Tunnel

### 1. 登录 Cloudflare

```bash
cloudflared tunnel login
```

这会打开浏览器，选择您的域名（如果没有，需要先在 Cloudflare 添加一个域名）。

**没有域名？**
- 可以注册免费域名: https://www.freenom.com
- 或使用现有域名，在 Cloudflare 添加: https://dash.cloudflare.com

### 2. 创建隧道

```bash
# 创建名为 myblog-db 的隧道
cloudflared tunnel create myblog-db
```

输出会显示隧道 ID，类似:
```
Tunnel credentials written to /Users/yourname/.cloudflared/UUID.json
```

**保存这个隧道 ID！**

### 3. 创建配置文件

创建配置文件 `~/.cloudflared/config.yml`:

```bash
nano ~/.cloudflared/config.yml
```

添加以下内容（替换 `YOUR-TUNNEL-ID` 为实际的隧道 ID）:

```yaml
tunnel: YOUR-TUNNEL-ID
credentials-file: /Users/yourname/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: mysql.yourdomain.com
    service: tcp://localhost:3306
  - service: http_status:404
```

**重要**:
- 替换 `YOUR-TUNNEL-ID` 为实际的隧道 ID
- 替换 `mysql.yourdomain.com` 为您想要的子域名
- 替换 `/Users/yourname/` 为实际的用户路径

### 4. 配置 DNS 记录

```bash
# 创建 DNS 记录，将子域名指向隧道
cloudflared tunnel route dns myblog-db mysql.yourdomain.com
```

### 5. 启动隧道（测试）

```bash
cloudflared tunnel run myblog-db
```

保持这个终端运行。如果看到 "Connection registered" 消息，说明隧道已成功建立！

---

## 第四步：测试连接

在另一个终端窗口测试连接:

```bash
# 从本地测试（应该成功）
mysql -h mysql.yourdomain.com -u vercel -p myblog
# 输入刚才设置的密码
```

如果连接成功，说明隧道工作正常！

---

## 第五步：配置 Vercel 环境变量

### 1. 构造连接字符串

```
mysql://vercel:YourSecurePassword123!@mysql.yourdomain.com:3306/myblog
```

### 2. 在 Vercel 设置环境变量

1. 访问 Vercel Dashboard → 您的项目
2. Settings → Environment Variables
3. 添加变量:
   - **Key**: `DATABASE_URL`
   - **Value**: 上面的连接字符串
   - **Environments**: 勾选 Production, Preview, Development
4. 保存

### 3. 重新部署

Deployments → 最新部署 → Redeploy

---

## 第六步：设置开机自启动（可选）

### macOS 使用 LaunchAgent

创建文件 `~/Library/LaunchAgents/com.cloudflare.tunnel.myblog.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cloudflare.tunnel.myblog</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/cloudflared</string>
        <string>tunnel</string>
        <string>run</string>
        <string>myblog-db</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/cloudflared.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/cloudflared.error.log</string>
</dict>
</plist>
```

加载服务:

```bash
launchctl load ~/Library/LaunchAgents/com.cloudflare.tunnel.myblog.plist
```

### Linux 使用 systemd

创建文件 `/etc/systemd/system/cloudflared-tunnel.service`:

```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=youruser
ExecStart=/usr/local/bin/cloudflared tunnel run myblog-db
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

启动服务:

```bash
sudo systemctl enable cloudflared-tunnel
sudo systemctl start cloudflared-tunnel
sudo systemctl status cloudflared-tunnel
```

---

## 管理命令

```bash
# 查看所有隧道
cloudflared tunnel list

# 查看隧道信息
cloudflared tunnel info myblog-db

# 停止隧道（如果在前台运行）
Ctrl+C

# 删除隧道（谨慎！）
cloudflared tunnel delete myblog-db
```

---

## 安全建议

1. **使用强密码**: MySQL 用户密码应该复杂且唯一
2. **限制权限**: 只授予 `myblog` 数据库的权限，不要授予所有数据库
3. **定期备份**: 使用 mysqldump 定期备份数据
4. **监控日志**: 定期检查 `/tmp/cloudflared.log`
5. **防火墙**: 确保本地防火墙允许 localhost:3306

---

## 故障排查

### 问题: 隧道无法启动
- 检查配置文件路径是否正确
- 验证隧道 ID 是否正确
- 查看日志: `cloudflared tunnel run myblog-db --loglevel debug`

### 问题: MySQL 连接被拒绝
- 检查 MySQL 是否运行: `brew services list | grep mysql`
- 验证用户权限: `SELECT user, host FROM mysql.user WHERE user='vercel';`
- 检查 bind-address 配置

### 问题: Vercel 无法连接
- 确认隧道正在运行
- 测试 DNS 解析: `nslookup mysql.yourdomain.com`
- 检查 Vercel 环境变量是否正确

---

## 成本对比

| 项目 | 成本 |
|------|------|
| Cloudflare Tunnel | ✅ 免费 |
| 域名 (Freenom) | ✅ 免费 |
| 本地 MySQL | ✅ 免费 |
| 电费 (24/7 运行) | 💰 约 ¥10-30/月 |

---

## 下一步

1. ✅ 安装 Cloudflare Tunnel
2. ✅ 配置 MySQL 远程访问
3. ✅ 创建并启动隧道
4. ✅ 配置 Vercel 环境变量
5. ✅ 测试并部署

完成这些步骤后，您的 Vercel 博客就能访问本地 MySQL 数据库了！

**提示**: 这个方案适合学习和测试。如果需要生产环境，建议使用云数据库服务（如 Railway）。
