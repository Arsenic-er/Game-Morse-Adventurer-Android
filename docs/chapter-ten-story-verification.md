# 第十章 Galgame 接入验证（2026-10-08）

## 范围

在既有第一至十五章玩法上，接入第十章“空中的拥挤 / 五分钟竞赛”的 Galgame 演出。第一至十章接入正式剧情入口；第十一至十五章的本轮演出尚待继续。已有玩法与完成 Galgame 演出是两回事。

- 服务器分支 agent/chapter-10-story，基于 a78c2de。
- 五幕、七语言；主页与任务中心入口、实际结算后的续读、接受时间与本局通联绑定的书签、设置与章节媒体/世界时间路由。
- 台词按 humanizer-zh 编辑，以摆放计时器、检查流水号和休息手腕的具体动作衔接，不预写金牌或名次。
- 素材库 main 20955ea 无改动；没有新增图像、配音、音乐或音效。
- 不合并、不推送、不发布，不更新本机游戏本体。

## 完成条件与记录

- 五分钟内至少 6 个不同台站、RUN / S&P 各至少 2 个、至少 3 个地区。符合条件后可提前结束；10 个台站封顶。
- 呼号、RST、流水号、地区与功率仍按原协议验证。网页缺少桌面接口时回退到普通本地语义解释器；接口明确返回不安全时不覆盖。
- 本章演出只读取同一局已结算记录，不使用 personalBest 替代本局。每条通联必须在接受任务之后，不在旧日志基线中，属于当前玩家、正确事件模式并在通联结算账本里。
- 沿用 verifiedContestCompletion 核对每条证明与人物/台站身份、虚构标记、地区、零资金和关系时间；核验时将候选局单独限定，避免另一有效局替代当前候选。
- 成绩记录归一化额外检查 RUN/S&P/地区数量与逐条证明一致，联系时间有序且不晚于结算记录；得分、等级与现有公式的可行范围一致。历史记录没有保存 cleanExchanges，不能据此重建精确的每次操作轨迹。
- 已完成但未结算不触发结尾；缺少任一通联、关系、记录或结算 ID，不生成结尾。重接排除旧局，领奖后重玩不覆盖已固定的剧情记录。
- 旧任务已达标但演出账本缺失时，仍可在任务中心领取。
- 竞赛结算资金为 0；章节一次性奖励 1100 资金 + 5 科技点，开放竞赛重玩与第十一章。独立成就奖励另计。
- 结尾展示 UTC、得分、通联/地区数、RUN/S&P 数、重发/错呼号/打断次数、等级、记录 ID，以及各台呼号、流水号、模式、地区和功率。没有把固定 599 或原有 100 分摘要说成玩家实测成绩。

## 修复

- 打开设置、离开确认或窗口失焦时暂停计时、停止正在发出的按键/音频并阻止新电键输入。原离开弹窗没有计时门控，设置停止声音的条件也不正确。
- 异步语义结果使用当前活动状态，保留等待期间的用时；超时、重试、切换到另一台站或另一个流水号后，旧结果不能回写。卸载后不写入。
- 异步结算有进行中门控，成功后按钮禁用；未结算不允许续读。
- 10 个台站都使用单一模式时，原逻辑无条件生成 COMPLETED，但不满足归一化的通关条件，可能丢失活动。现在生成可保存的 FAILED / MINIMUM_NOT_MET，重试沿用固定台站池并换新局 ID。
- 小屏幕顶部、模式按钮、候选台站和长交换文本可换行；竞赛活动中不展示人物立绘。

## 验证

### 自动测试与构建

- 定向测试 36/36 通过，日志 /home/ubuntu/cwgame-development-20261008/chapter-ten-targeted.log。
- 两轮全量均为 872/872 通过，无失败、跳过或取消；最终日志 chapter-ten-tests-final.log，耗时 62908.60 ms；首轮日志 chapter-ten-tests.log。
- 构建通过；总输出 163840294 bytes，最大自有 JS assets/index-CtU-elfB.js 为 511876 / 512000 bytes，日志 chapter-ten-build-1.log。
- 当前 JS 预算只余 124 bytes；继续第十一章之前需处理打包余量。本次没有提高预算阈值。
- 测试覆盖存档迁移、五幕顺序、完整成绩证据、错字段、重复台站、AGN/QRS、计时超时/放弃/重试、单一模式封顶、过期异步结果、固定本局而非最佳成绩、领奖一次性、旧存档与七语言 SSR。

### 布局

- 七语言 × 1440×900 / 390×844 × 剧情/活动，28 项通过；14 张活动截图。页面横向溢出与运行异常均为 0。
- /home/ubuntu/cwgame-development-20261008/chapter-ten-layout-1/evidence.json。
- SHA-256：1fbee9d722615931b88eae57ecb51e42ab1d1031a122f75c3456fbc40aa23754。
- 明确使用种子存档，只证明布局，不是通关证据。

### 连续游玩

- 第一至十章由新建 BH1QA 空存档串行通关，没有预置已完成任务、通联或奖励。前九章 22 WPM；第十章通过设置中的增速按钮调整为 30 WPM，仍使用真实键盘事件与解码链。
- 测试世界时起点 2026-10-04T22:15:00Z。证据记录时间 2026-10-08T00:22:28.964Z（北京时间 08:22:28），97 张截图，运行异常 0。
- 证据 /home/ubuntu/cwgame-development-20261008/chapter-ten-live-22/evidence.json，日志同级 chapter-ten-live-22.log。
- SHA-256：161f48b7494c7b5eec0916b316b56a695b73376b10c9230d03888c73e991f7dd。
- 本局 contest:bae5987d，成绩记录 contest-record:bae5987d；正式通联 contest-qso:bae5987d:001 至 :006。
- 有效用时 184819 ms，6 台、6 地区，其中 RUN 2 台、S&P 4 台；得分 1080，silver。台站依次为 SIMJ92K、SIMUCBV、SIMC38A、SIMGUCJ、SIMHGCH、SIMFT25。
- 故意把第一笔 NR 001 发成 NR 002，被拒绝且仍保留当前台站和流水号。QRS 使 replyWpm 22 → 19；错误与恢复后刷新仍能继续同一交换。第二次呼叫已完成台站被记为重复尝试，不增加通联。
- 设置和离开确认期间注入电键输入不产生脉冲，活动状态与有效计时冻结。离开回剧情并刷新后，固定台站池、已选台站、流水号及错误历史保持一致。
- 开场、交换中、完成但未结算、剧情结尾均经过刷新续读。正式日志直到正常结算才新增 6 条；结算时资金与科技点不变，结算后按钮禁用，才出现剧情续读。
- 演出及记录弹窗包含本局得分、记录 ID 和六个真实呼号。领奖后资金 9165 → 10265、科技点 69 → 74；没有额外成就奖励。再次刷新数值不变，story-10 只领取一次。
- 竞赛重玩入口可见，第十一章为 available；回到第一章审阅模式不会改变资金。
- 隔离配置 /tmp/cw-chapter-one-live-1791417805997 已确认清理。仅停止了本次创建并核对 cwd/命令行的 4176 预览进程。

## 复现

在服务器 /home/ubuntu/cwgame 使用已有 Node 24.21.0、pnpm 10.12.1 与 Chromium。先构建并启动 127.0.0.1:4176 预览，浏览器任务串行运行。

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
pnpm test
pnpm build
# 另开终端：pnpm preview --host 127.0.0.1 --port 4176 --strictPort
CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261008/chapter-ten-layout-new node scripts/qa-contest-layout.mjs
CWGAME_QA_CHAPTER_TEN=1 CWGAME_QA_WPM=22 CWGAME_QA_UTC=2026-10-04T22:15:00Z CWGAME_QA_RECOVERY='AGN K' CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261008/chapter-ten-live-new node scripts/qa-chapter-one-story.mjs
```

用新输出目录保留每次结果。Chromium 沙盒保持启用。第十章通过正常设置按钮切到 30 WPM，不改变成绩或计时。

## 素材与待人工验收

- 第十章 scene.png 2120025 bytes、portrait.png 1970428 bytes、illustration.png 2258455 bytes、ambience.wav / music.wav 各 384044 bytes，使用既有章节媒体与场景效果。
- 旧章节回归的 qaCapture 展示盲听目标并跳过音频播放；电键流程仍经过键盘事件、AutomaticKeyer、解码、协议校验与正常存档结算。第六章保持原结构化输入/按钮，第七至九章接收回应保持原文字/按钮。
- 第十章用可见的候选台与交换文本进行电键测试，不证明玩家盲听能力。没有人工试听现有候选台音频；QRS 只验证状态中的 replyWpm，不声称已经听验其速度。
- 七语言结构和字段有自动测试，但非中文文学表达仍待母语编辑。音画、可用性和 Windows 游戏包尚未人工验收。
- humanizer-zh 台词评分是自检，不是独立审计。
- 源码、依赖、构建、日志、截图都在服务器；没有向本机下载项目文件。
