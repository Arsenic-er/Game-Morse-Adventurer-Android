# 第一章服务器回归验收（2026-10-04）

开发和验证均在 `gpu-821560` 的 `/home/ubuntu/cwgame` 执行。本轮没有在 Windows 下载源码、安装依赖或构建游戏，也没有合并主线、推送或发布安装包。

## 修复范围

- 第一章独立审阅启动入口先判断浏览器环境，避免服务端渲染时直接读取不存在的 `window`。正式游戏及独立审阅的启动条件不变。
- 章节素材测试使用文件 URL 读取资源，移除 Windows 专用反斜杠路径。15 章素材和共享雷声仍按原清单核对。
- 第一章浏览器验收从实际台站读取自动键 WPM；同一字符的点划连续送入原有 Z/X 事件处理，字符间等待采用已有打包验收的计时方式。未改变玩家电键、解码阈值、QSO 判定或结算。
- 新增 `CWGAME_QA_WPM` 和 `CWGAME_QA_OUTPUT`，分别控制测试存档键速和证据目录。浏览器启动错误保留简短诊断，避免只报一个没有上下文的端口断言失败。

## 已验证

- `pnpm test`：757/757 通过，没有跳过测试。
- `pnpm build`：通过；最大自有 JavaScript 分块 506,433 字节，低于 512,000 字节预算。
- 18 WPM、22 WPM 两轮隔离存档浏览器验收均通过，每轮 14 张新截图，运行时异常 0。
- 两轮均完成：无效输入拒绝与重试、Z/X 键控 CQ、真实呼号/RST 交换、可选交换、通联完成但未保存、保存日志、真实剧情结尾、刷新续读、领取一次章节奖励、第二章解锁、再次刷新及独立审阅不改变奖励。
- 每轮章节奖励差额均为 150；记录只有一条通联，没有重复结算。
- 指向不存在的浏览器可执行文件时，脚本退出码为 1，证据明确记录 `ENOENT`，不会写入通过结果。

## 服务器证据

`/home/ubuntu/cwgame-development-20261004/` 保存完整结果和日志：

- `qa-final-18/evidence.json` 与同目录截图。
- `qa-final-22/evidence.json` 与同目录截图。
- `FINAL_QA_SUMMARY.json` 包含逐张截图 SHA-256 和两轮结算摘要。
- `all-tests-final.log`、`build.log`、`qa-launch-failure/evidence.json`。

## 复现

在服务器项目目录执行，先在另一个终端保持生产预览运行：

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
pnpm build
pnpm preview --host 127.0.0.1 --port 4176 --strictPort
# 在另一终端设置相同环境后运行；下一轮更换输出目录，避免覆盖上一轮证据。
CWGAME_QA_WPM=18 CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261004/qa-rerun-18 node scripts/qa-chapter-one-story.mjs
CWGAME_QA_WPM=22 CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261004/qa-rerun-22 node scripts/qa-chapter-one-story.mjs
```

## 验收边界

浏览器流程仍使用既有 `qaCapture`：显示测试所需的对方呼号，并跳过接收音频播放时长；发报经过原有键事件、AutomaticKeyer、解码、协议和存档结算，不注入解码文本、成功阶段或完成日志。本轮结果不是人工听感验收，也不是 Windows 离线包重发或第二至十五章 Galgame 演出完成的证明。
