# 如何修改 Vercel 项目的 DATABASE_URL

## 🎯 快速步骤

### 方法 1: 通过 Vercel Dashboard（推荐）

#### 1. 登录 Vercel
访问: https://vercel.com/dashboard

#### 2. 选择您的项目
点击您的博客项目（`my-blog` 或类似名称）

#### 3. 进入设置
点击顶部导航栏的 **"Settings"** 标签

#### 4. 找到环境变量
- 在左侧菜单中点击 **"Environment Variables"**
- 或直接访问: `https://vercel.com/your-username/your-project/settings/environment-variables`

#### 5. 修改 DATABASE_URL
找到 `DATABASE_URL` 这一行：

**选项 A: 直接编辑**
1. 点击右侧的 **"⋯" (三个点)** 菜单
2. 选择 **"Edit"**
3. 修改 Value 为新的连接字符串
4. 确保勾选了所有环境（Production, Preview, Development）
5. 点击 **"Save"**

**选项 B: 删除后重新添加**
1. 点击 **"⋯"** → **"Remove"**
2. 点击 **"Add New"**
3. **Key**: `DATABASE_URL`
4. **Value**: 粘贴新的连接字符串
5. **Environments**: 勾选 Production, Preview, Development
6. 点击 **"Save"**

#### 6. 重新部署
**重要**: 修改环境变量后，需要重新部署才能生效！

1. 点击顶部的 **"Deployments"** 标签
2. 找到最新的部署
3. 点击右侧的 **"⋯" (三个点)**
4. 选择 **"Redeploy"**
5. 确认重新部署

或者：
- 只需推送一个新的 commit 到 GitHub，Vercel 会自动部署

#### 7. 验证
- 等待部署完成（通常1-2分钟）
- 访问您的网站 URL
- 检查数据库是否正常连接

---

### 方法 2: 使用 Vercel CLI

如果您喜欢命令行：

```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm install -g vercel

# 2. 登录
vercel login

# 3. 链接到项目
cd /Users/cd-20240527-002/Desktop/test_2025/my-blog
vercel link

# 4. 添加/更新环境变量
vercel env add DATABASE_URL production
# 粘贴新的连接字符串，按回车

# 对 Preview 和 Development 环境重复
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# 5. 重新部署
vercel --prod
```

---

## 📝 DATABASE_URL 格式

### 本地 MySQL（需要隧道）
```bash
# Cloudflare Tunnel
DATABASE_URL="mysql://vercel:password@mysql.yourdomain.com:3306/myblog"

# Ngrok（需要信用卡）
DATABASE_URL="mysql://vercel:password@0.tcp.ngrok.io:12345/myblog"

# 公网IP + 端口转发（不推荐）
DATABASE_URL="mysql://vercel:password@155.117.34.200:3306/myblog"
```

### Railway 云数据库（推荐）
```bash
# Railway 提供的完整连接字符串
DATABASE_URL="mysql://root:password@containers-us-west-123.railway.app:7123/railway"
```

### 其他云数据库
```bash
# PlanetScale
DATABASE_URL="mysql://user:pass@aws.connect.psdb.cloud/myblog?sslaccept=strict"

# Neon (PostgreSQL)
DATABASE_URL="postgres://user:pass@ep-xxx.aws.neon.tech/myblog?sslmode=require"
```

---

## ⚠️ 重要提示

### 1. 安全性
- ❌ 不要使用 root 用户直接连接
- ✅ 创建专门的应用用户
- ✅ 使用强密码
- ✅ 限制用户权限（只授予特定数据库）

### 2. 环境选择
修改环境变量时，建议勾选所有环境：
- ✅ **Production**: 生产环境
- ✅ **Preview**: 预览部署（PR）
- ✅ **Development**: 开发环境

### 3. 重新部署是必须的
- 环境变量的更改**不会自动生效**
- 必须重新部署才能使用新的连接字符串

### 4. 测试连接
修改后测试：
```bash
# 在本地测试新连接
DATABASE_URL="新的连接字符串" npx prisma db push

# 如果成功，说明连接字符串正确
```

---

## 🔍 常见问题

### Q1: 修改后网站显示"数据库连接失败"
**原因**: 可能忘记重新部署
**解决**: 在 Vercel Dashboard → Deployments → Redeploy

### Q2: 重新部署后还是失败
**检查清单**:
1. ✅ DATABASE_URL 格式正确（没有 `http://`）
2. ✅ 数据库服务器正在运行
3. ✅ 网络可达（如果是本地数据库，隧道是否运行）
4. ✅ 用户名密码正确
5. ✅ 数据库名称正确

### Q3: 如何验证环境变量已更新
在部署日志中查看（不会显示完整值，但会显示是否加载）:
```
Loading env variables...
✓ DATABASE_URL
```

### Q4: 可以同时使用多个数据库吗
可以！添加多个环境变量：
```
DATABASE_URL          # 主数据库
DATABASE_URL_REPLICA  # 只读副本
CACHE_DATABASE_URL    # Redis 缓存
```

---

## 📋 完整操作检查清单

- [ ] 登录 Vercel Dashboard
- [ ] 进入项目 → Settings → Environment Variables
- [ ] 找到 DATABASE_URL 并修改
- [ ] 确保勾选所有环境（Production, Preview, Development）
- [ ] 保存更改
- [ ] 重新部署（Deployments → Redeploy）
- [ ] 等待部署完成
- [ ] 访问网站验证
- [ ] 检查数据库连接是否正常

---

## 🚀 下一步

修改 DATABASE_URL 后，您可能还需要：

1. **运行数据库迁移**（如果切换到新数据库）:
   ```bash
   DATABASE_URL="新连接" npx prisma db push
   ```

2. **导入数据**（如果需要）:
   ```bash
   DATABASE_URL="新连接" npx tsx scripts/seed.ts
   ```

3. **更新本地 .env**（保持同步）:
   ```bash
   echo 'DATABASE_URL="新连接"' > .env
   ```

---

准备好修改了吗？告诉我您要：
1. 使用哪个数据库方案（Railway / Cloudflare Tunnel / 其他）
2. 我会提供相应的连接字符串格式！
