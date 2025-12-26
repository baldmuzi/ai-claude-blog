#!/bin/bash

echo "================================"
echo "检查本地网络配置"
echo "================================"
echo ""

# 1. 检查本地 IP
echo "1️⃣  本地 IP 地址:"
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
echo ""

# 2. 检查公网 IP
echo "2️⃣  公网 IP 地址:"
curl -s ifconfig.me
echo ""
echo ""

# 3. 检查 MySQL 是否运行
echo "3️⃣  MySQL 状态:"
if lsof -i :3306 > /dev/null 2>&1; then
    echo "✅ MySQL 正在运行 (端口 3306)"
    lsof -i :3306 | grep LISTEN
else
    echo "❌ MySQL 未运行"
fi
echo ""

# 4. 检查防火墙
echo "4️⃣  防火墙状态:"
if command -v ufw &> /dev/null; then
    sudo ufw status
elif [[ $(uname) == "Darwin" ]]; then
    echo "macOS 防火墙状态:"
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
else
    echo "未检测到防火墙工具"
fi
echo ""

echo "================================"
echo "判断结果"
echo "================================"
echo ""
echo "如果您的公网 IP 和本地 IP 不同，"
echo "说明您在路由器后面（需要端口转发）"
echo ""
echo "如果公网 IP 和本地 IP 相同，"
echo "说明您有固定公网 IP（可以直接使用）"
