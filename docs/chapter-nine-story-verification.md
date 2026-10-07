# 第九章 Galgame 接入验证（2026-10-08）

## 范围

本次在既有第一至十五章玩法上接入第九章“坐标中继”的 Galgame 演出。第一至九章已接入正式剧情入口，第十至十五章的这轮演出尚待继续；已有玩法不等于完整 Galgame 演出。

- 服务器分支：agent/chapter-09-story，基于 60d8281。
- 五幕演出、七语言台词、主页/任务中心入口、结算后续读、接受时间绑定的书签、设置与世界时间路由。
- 复用素材库 20955ea 的第九章场景、立绘、插画、环境声和音乐；素材库没有修改。
- 按 humanizer-zh 写具体的抄记和核对动作，不替玩家编造定位结果或现实救助行为。台本直接从源码提取至 reviews/chapter-nine-dialogue-script-zh-CN.md。
- 不合并、不推送、不发布，不更新本机游戏包。

## 玩法和证据约束

- 完成第八章后接本章。进入原坐标中继玩法：抄收 SIM9CR 的固定报文，电键完整复诵，再将同一报文转发给 SIM9RL，收到确认后结算。
- MSG、GRID、TIME、PEOPLE、CHECK 均经过既有解析器的格式、顺序与精确字段匹配。PX 始终是游戏虚构网格，不接入真实地图或现实应急服务。
- 网页没有桌面接口时，使用普通 QSO 的本地语义解释器；GRID 作为 LOCATION 关键词识别。接口明确拒绝时不覆盖。识别 GRID 不等于跳过逐字段校验。
- 演出复用 verifiedCoordinateRelayCompletion，核对同一报文对应的源台和中继台两条日志、两个关系记录、人物/电台身份、虚构标记、时间与已结算活动。额外要求两条日志都属于当前玩家、已登记通联结算 ID、接受任务之后、正确事件模式且字段有效。
- 完成但未结算不触发结尾。只保留一边的通联、删除账本、修改校验数或混接另一活动，不生成结尾。
- 结尾展示真实报文号、PX 网格、报文 UTC、人数、校验数、两个呼号及报文记录 ID；不把既有固定 599/100 分摘要写成玩家实测成绩。
- 书签绑定接受时间与中继通联 ID；重接不使用旧局，重玩不覆盖已固定结尾。旧任务已达标但演出账本不完整时，仍可在任务中心领取。
- 中继结算资金为 0；章节一次性奖励为 950 资金与 4 科技点，开放结构化报文工具和第十章。独立成就奖励另计。

## 恢复与界面修复

- 原转发阶段请求 AGN/QRS 或字段错误后，会退回接收/纠错阶段，却残留“已复诵”时间；旧归一化认为阶段矛盾，可能丢失活动。现在回到源台重核时明确清除失效阶段标记，保留固定报文、错误历史与恢复动作。
- 在已复诵或等待中继确认时超时/放弃，终止状态允许保留已经发生的阶段时间；仍检查时序一致性，重试同一报文但创建新活动 ID。
- 异步语义结果使用当前活动状态，保留等待期间的累计用时；不能复活超时状态或覆盖另一轮活动。卸载后的回应不写存档。
- 设置、离开确认与失焦暂停计时及电键输入。增加设置和续读按钮，完成结算后禁用重复结算。
- 窄屏顶部和按钮允许换行，长报文字段在容器内换行。活动阶段继续不显示人物肖像。

## 验证

### 单元、存档与 SSR

- 最终全量：858/858 通过，无失败、取消或跳过；日志 /home/ubuntu/cwgame-development-20261008/chapter-nine-tests-final.log，耗时 62144.95 ms。
- 新增覆盖两条日志的完整证据链、缺记录/篡改、书签顺序与重接、旧存档领取、结算后奖励一次性、结构化工具/第十章解锁、五字段错误、网页解释器回退、AGN/QRS 转发阶段恢复、超时/放弃/重试、异步回应过期和七语言 SSR。
- 构建通过；输出 163810232 bytes，最大自有 JS assets/index-BlGXKoo_.js 为 507111 / 512000 bytes。预算仅余 4889 bytes，接入第十章时需继续关注，不把本次通过理解为余量充足。日志 chapter-nine-build-final.log。

### 布局检查

- 七语言 × 1440×900 / 390×844 × 剧情/活动，共 28 项通过；活动页面 14 张截图，横向溢出和运行异常均为 0。
- 证据：/home/ubuntu/cwgame-development-20261008/chapter-nine-layout-2/evidence.json。
- SHA-256：df9b43834ab1bc3ce5149810438edf255570abad38bb7f14be0beadf7c20a6c5。
- 此项使用明确标记的种子存档，只证明布局，不证明通关。
- 首轮 layout-1 在游戏检查前因测试脚本把 height 误写为 hnine 而失败，保留失败证据；修正脚本后 layout-2 通过。没有用后一次结果覆盖前一次失败。

### 连续游玩

- 从新建 BH1QA 空存档起，第一至第九章串行通过；无预写已完成任务、通联、奖励或第九章工具状态。自动电键 22 WPM，测试世界时起点 2026-10-04T22:15:00Z。
- 最终证据时间 2026-10-07T22:16:20.352Z（北京时间 2026-10-08 06:16:20）；88 张截图，运行异常 0。
- 证据 /home/ubuntu/cwgame-development-20261008/chapter-nine-live-22/evidence.json，日志同级 chapter-nine-live-22.log。
- SHA-256：f765eac316d67fe347d510dee5b78d2f2f463204217163678a5ad79920f6da53。
- 本章活动 coordinate-relay:029:16ec290d；源台日志 coordinate-source-qso:029:16ec290d，中继日志 coordinate-relay-qso:029:16ec290d；同一报文记录 coordinate-packet:029:16ec290d。
- 实测报文 MSG 029 / GRID PX-2978-0767 / TIME 0118Z / PEOPLE 79 / CHECK 10。先发送错误 CHECK 11 被拒绝，再正确复诵；转发阶段发送 QRS，回到接收阶段后刷新，仍保留同一报文与错误历史。replyWpm 从 16 变为 13。
- 开场、转发阶段、QRS 恢复后、完成但未结算、结尾书签均经过刷新续读；设置和离开确认冻结活动时间与电键输入。最终有效计时 148531 ms。
- 结算保存两条通联且资金不变，重复结算按钮禁用；续读展示实际报文和记录 ID。
- 章节领奖资金 8215 → 9165，科技点 65 → 69；本次没有新增独立成就奖励。领奖后再次刷新数值不变，只存在一次 story-09 领取记录。
- 结构化报文工具打开后可见此次网格与编号；第十章任务为 available。已领取后主页移除章节入口但保留重玩入口。
- 回到第一章审阅模式后保存资金仍不变。隔离浏览器配置 /tmp/cw-chapter-one-live-1791410439644 已确认清理；只停止了本次创建且核对过 cwd/命令行的 4176 预览进程。

## 复现

在服务器 /home/ubuntu/cwgame 执行，使用已有 Node 24.21.0 / pnpm 10.12.1 与隔离的 Chromium 配置。先构建并在 127.0.0.1:4176 启动 preview；浏览器任务串行运行。

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
pnpm test
pnpm build
# 在另一终端运行 pnpm preview --host 127.0.0.1 --port 4176 --strictPort
CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261008/chapter-nine-layout-new node scripts/qa-coordinate-relay-layout.mjs
CWGAME_QA_CHAPTER_NINE=1 CWGAME_QA_WPM=22 CWGAME_QA_UTC=2026-10-04T22:15:00Z CWGAME_QA_RECOVERY='AGN K' CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261008/chapter-nine-live-new node scripts/qa-chapter-one-story.mjs
```

新运行使用新的输出目录，不覆盖已有证据。Chromium 沙盒未关闭。

## 素材与边界

- 素材库 main 20955ea 无改动。现有第九章 scene.png 1980316 bytes、illustration.png 2240383 bytes、portrait.png 2389778 bytes、ambience.wav 与 music.wav 各 384044 bytes。
- 这些素材接入了既有章节媒体和场景效果；没有生成新图、新配音或新音效。
- 连续回归的 qaCapture 会展示盲听目标并跳过旧章节的音频播放；电键章节仍经键盘事件、AutomaticKeyer、解码和协议校验，不是直接注入通联结果。第六章保持既有结构化输入/按钮。
- 第七至九章接收回应仍是既有文字与按钮；QRS 只验证 replyWpm 状态，并未证明听觉播放速度。尚未进行全程人工听音和美术审阅。
- 非中文文本没有母语编辑审校；humanizer-zh 台本评分属于自检，不是独立审计。
- 既有 readbackAttempts 记录的是失败复诵数加 1，不是包含 QRS 后重做在内的所有复诵总次数；本次没有改写历史统计口径。
- 未构建 Windows 安装包、未更新本机游戏本体；代码、依赖、构建、测试日志与截图均保留在服务器。
