# 如何让 Vercel 访问本地 MySQL（不推荐）

## ⚠️ 重要警告

**强烈不建议**将本地数据库暴露到公网，原因：
- 安全风险极高（root 密码暴露）
- 需要电脑 24/7 开机
- 网络不稳定会导致服务中断
- 家庭网络带宽限制影响性能

**推荐方案**：使用 Railway/PlanetScale/Neon 等云数据库（参考 `RAILWAY_SETUP.md`）

---

## 如果你坚持要暴露本地数据库

### 步骤 1: 配置 MySQL 允许远程连接

1. 编辑 MySQL 配置文件：
   ```bash
   # macOS (Homebrew)
   nano /opt/homebrew/etc/my.cnf

   # 或者
   nano /usr/local/etc/my.cnf
   ```

2. 添加或修改：
   ```ini
   [mysqld]
   bind-address = 0.0.0.0
   ```

3. 重启 MySQL：
   ```bash
   brew services restart mysql
   ```

### 步骤 2: 创建允许远程访问的用户

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建新用户（不要用 root）
CREATE USER 'vercel'@'%' IDENTIFIED BY '你的强密码';

-- 授权访问 myblog 数据库
GRANT ALL PRIVILEGES ON myblog.* TO 'vercel'@'%';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 步骤 3: 配置路由器端口转发

这一步**最关键**，需要进入你的路由器管理界面：

1. 打开浏览器访问路由器管理页面（通常是 `192.168.1.1` 或 `192.168.0.1`）
2. 找到"端口转发"或"虚拟服务器"设置
3. 添加规则：
   - 外部端口: `3306`
   - 内部 IP: `172.24.24.242`
   - 内部端口: `3306`
   - 协议: `TCP`
4. 保存并启用

### 步骤 4: 配置防火墙

**macOS:**
```bash
# 检查防火墙状态
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# 允许 MySQL 连接
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/opt/mysql/bin/mysqld
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/opt/mysql/bin/mysqld
```

### 步骤 5: 测试连接

从外部测试（使用手机热点或其他网络）：
```bash
mysql -h 155.117.34.200 -u vercel -p myblog
```

### 步骤 6: 更新 Vercel 环境变量

```
DATABASE_URL=mysql://vercel:你的强密码@155.117.34.200:3306/myblog
```

---

## 更好的替代方案

### 方案 A: Cloudflare Tunnel（推荐用于本地数据库）

参考 `LOCAL_DATABASE_OPTIONS.md` 中的 Cloudflare Tunnel 方案：
- ✅ 不需要暴露端口
- ✅ 免费
- ✅ 安全加密
- ✅ 不需要公网 IP

### 方案 B: Railway 云数据库（最推荐）

参考 `RAILWAY_SETUP.md`：
- ✅ 5 分钟设置完成
- ✅ 免费 $5/月额度
- ✅ 专业数据库服务
- ✅ 无需担心网络和安全
- ✅ 自动备份

### 方案 C: ngrok 临时测试

如果只是临时测试：
```bash
brew install ngrok

# 注册并获取 authtoken
ngrok config add-authtoken YOUR_TOKEN

# 转发 MySQL 端口
ngrok tcp 3306
```

会得到类似 `tcp://0.tcp.ngrok.io:12345` 的地址，然后：
```
DATABASE_URL=mysql://root:ljx123456@0.tcp.ngrok.io:12345/myblog
```

⚠️ 注意：ngrok 免费版每次重启地址都会变化

---

## 总结

| 方案 | 难度 | 安全性 | 稳定性 | 推荐度 |
|------|------|--------|--------|--------|
| 端口转发 | 🔴 高 | ❌ 差 | ❌ 差 | ⛔ 不推荐 |
| Cloudflare Tunnel | 🟡 中 | ✅ 好 | 🟡 中 | 🟢 可用 |
| Railway | 🟢 易 | ✅ 好 | ✅ 好 | ⭐ 最推荐 |
| ngrok | 🟢 易 | 🟡 中 | ❌ 差 | 🟡 仅测试 |

**我强烈建议你使用 Railway 云数据库**，这是最简单、最安全、最稳定的方案。
