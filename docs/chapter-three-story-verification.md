# 第三章 Galgame 正式剧情验收（2026-10-04）

本轮在 `gpu-821560-ts` 的 `/home/ubuntu/cwgame` 开发，分支 `agent/chapter-03-story`，基于 `b7aa800`。没有在 Windows 新增仓库、依赖、构建目录或下载源码与证据；没有合并、推送或发布新游戏包。

## 本轮完成

第三章“不同的节奏”接入五幕 Galgame 演出：先听、留一栏、再次呼叫、对照三条记录、收尾。七种语言均包含完整台词、按钮、任务提示和七种操作员风格的名称。

- 第二章领取后显示第三章入口，任务中心也可继续。游戏通联保存后能回到当前第三章，不回到已经领取的前两章。
- 未集齐时显示真实的 1/3、2/3 进度和对应记录；可返回电台继续。相同风格重复通联不增加种类，同一个 QSO ID 也不能被算成三种风格。
- 满三种后才进入对照与结尾，书签固定对应三条记录；继续通联或重新加载不会随意替换这三条。
- 原有任务目标与奖励不变：接受后完成三种 operatorProfileId 的通联；任务奖励 300 金钱、1 科技点，领取后第四章可用。
- 旧存档只加空书签，不改余额、不补发奖励。缺少演出核验凭证的旧达标任务仍可走任务中心领取。
- 第二、三章的设置和世界时钟入口均覆盖；打开设置时叙事不可操作。
- 使用既有第三章场景、插图及场景效果，未生成新素材。没有把固定人物肖像当成随机遇到的三位对方。

中文台词按 humanizer-zh 检查，以戴耳机、留空格、核对日志等动作承接情绪；没有预写固定对方呼号或未发生的发报内容。单独审阅稿：`docs/reviews/chapter-three-dialogue-script-zh-CN.md`。

## 核验与必要的共用代码

新增 `contactStoryPresentation.js`，为前三章共用书签规范化、接受时间/基线过滤、普通 QSO 检查，以及已保存日志、已结算 ID、任务事件之间的精确匹配。章节条件仍各自保留：

- 第一章：一条正式通联；原先允许回退开场的行为保留。
- 第二章：SIM3RA 且有成功的 AGN K 重发记录。
- 第三章：三条不同真实操作员风格的记录，逐条保留 UTC、呼号、RST、频率；只接受现有风格定义，不以未知字符串构造演出。

书签不生成 QSO、不修改任务完成状态、不结算奖励。第三章用的是接任务后合格记录，前两章日志不补算；放弃再接会排除旧记录。

另修复了返回剧情再进电台时呼叫序号从 0 重置的问题：新会话以存档的已完成通联总数起步。仍使用原有传播条件和选台逻辑，不强制返回缺失的风格，也未降低解码或通关要求。

## 验证结果

- `pnpm test`：782/782 通过，0 失败、0 跳过（包含测试辅助文件的加载检查）。
- `pnpm build`：通过。最大自有 JavaScript 分块 511,553 字节，低于 512,000 字节；没有上调预算。剩余 447 字节，后续扩章须继续注意代码分块。
- 与 `b7aa800` 中第一、二章旧实现做了 416 次差分比较：核心模型字段、前进/回退结果和书签规范化一致。原有测试与完整浏览器前置章节流程也通过。
- 18 WPM 额外独立运行了第一、二章全链路，证明共用核验代码未破坏前两章。
- 22 WPM 与最终 18 WPM 均从空白隔离存档开始，完成第一、二章再接受第三章；第三章的每次接触均通过原有键事件、解码、协议和保存结算。
- 检查了 0/3 → 部分进度 → 3/3、刷新续读、真实记录显示、结束但未保存不可继续剧情、一次性奖励、第四章解锁与再次刷新。22 WPM 实际出现重复风格，进度仍保持 2/3，之后才达到 3/3。
- 中文界面窄屏检查为 390 像素，无页面横向溢出，主按钮可滚动到达；场景图片加载成功。设置打开时页面 inert，关闭后可继续。
- 22 WPM 流程后，仅把七语台词中“重复风格也留在日志”改成条件句，避免暗示每次游玩必定遇到重复风格；最终文案再次通过构建、测试和 18 WPM 全链路。

- 22 WPM：4 次第三章通联、3 种风格、34 张截图、0 运行时异常；任务奖励差额 300，科技点 +1。
  evidence.json SHA-256：23b54d46683dd0be570a99635dc4aa83ec687c6644cc7f8bdef97d72f9626109。
- 18 WPM：7 次第三章通联、3 种风格、37 张截图、0 运行时异常；任务奖励差额 300，科技点 +1。
  evidence.json SHA-256：e274811c9784bfe8e7170c8e1dc93481bc62d61b7de726898eabb46817fffd11。

## 服务器证据

全部保留在 `/home/ubuntu/cwgame-development-20261004/`：

- `chapter-three-tests-final.log`、`chapter-three-build-final.log`。
- `chapter-three-live-22/evidence.json` 与同目录截图。
- `chapter-three-final-18/evidence.json` 与同目录截图。
- `chapter-three-prerequisites-18/evidence.json` 是额外的前两章验收。
- 每轮同名前缀的 `.log` 保存输入和实际操作员风格。

## 复现

服务器终端一：

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
cd /home/ubuntu/cwgame
pnpm build
pnpm preview --host 127.0.0.1 --port 4176 --strictPort
```

服务器终端二，设置同样的 Node 路径：

```sh
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
CWGAME_QA_CHAPTER_THREE=1 CWGAME_QA_WPM=18 CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261004/chapter-three-rerun-18 node scripts/qa-chapter-one-story.mjs
```

第三章开关自动包含前两章。只设 `CWGAME_QA_CHAPTER_TWO=1` 仍只跑到第二章；两者都不设仍是第一章验收。

## 范围限制与下一步

浏览器验收沿用 `qaCapture`，暴露测试用对方呼号并跳过接收音频时长，没有注入目标风格、解码文本、成功阶段或完成存档。因此本轮不是人工听感验收，也不是实际无线电通联测试。没有把服务器截图下载到本机人工审图，布局结论仅来自自动断言。

本机游戏包未更新；第四至十五章本轮 Galgame 叙事接入尚未完成。下一步是第四章的弱信号剧情：接入既有 SIM2DX、弱信号、天气交换和重发恢复记录，不重做原有通关规则。
