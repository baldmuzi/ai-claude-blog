#!/bin/bash

echo "================================"
echo "配置 MySQL 远程访问"
echo "================================"
echo ""

# MySQL 连接信息
MYSQL_USER="root"
MYSQL_PASS="ljx123456"
MYSQL_DB="myblog"

# 新用户信息
REMOTE_USER="vercel"
REMOTE_PASS="Vercel2025Secure!"

echo "正在创建远程访问用户..."
echo ""

mysql -u$MYSQL_USER -p$MYSQL_PASS <<SQL
-- 创建远程用户
CREATE USER IF NOT EXISTS '${REMOTE_USER}'@'%' IDENTIFIED BY '${REMOTE_PASS}';

-- 授予权限
GRANT ALL PRIVILEGES ON ${MYSQL_DB}.* TO '${REMOTE_USER}'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- 显示创建的用户
SELECT user, host FROM mysql.user WHERE user = '${REMOTE_USER}';
SQL

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ MySQL 用户创建成功！"
    echo ""
    echo "用户名: ${REMOTE_USER}"
    echo "密码: ${REMOTE_PASS}"
    echo "数据库: ${MYSQL_DB}"
    echo ""
    echo "⚠️  请保存这些信息！"
else
    echo ""
    echo "❌ 创建用户失败，请检查 MySQL 密码"
fi
