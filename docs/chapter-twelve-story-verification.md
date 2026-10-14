# 第十二章「风暴中继」Galgame 接入与验证

开发位置：服务器 /home/ubuntu/cwgame；分支 agent/chapter-12-story，基于 f400bb0。没有下载源码、素材、构建或测试证据到本机。本轮不合并、不推送、不发布 Windows 包。

## 实现范围

- 五幕 rain / copies / verify / relayed / log，七语言。复用第十二章场景、插画、立绘与既有音景。
- 主页、任务中心、进入发射台与活动结束均能进入本章剧情。未完成第十一章不能接取；领奖后隐藏章节入口，保留重玩。
- 新增 chapterTwelvePresentation，旧存档安全补默认值；书签绑定本次接取时间与实际结算记录。
- 结尾要求当前玩家的两条已结算事件 QSO、摘要、归档、settlementProof 与 settledRunId 匹配。跨玩家、旧接取轮次、未结算活动、缺失凭证不会显示结尾。
- 日志逐项展示本次 MSG / REV / GRID / PEOPLE / ITEM / QTY / CHECK 与记录编号；重玩不替换已完成剧情的记录。
- 网页缺少桌面语义接口或接口不可用时走现有本地 rules-v1。桌面明确拒绝仍被保留，不以回退绕过。补齐普通本地规则中 QRS → SPEED_REQUEST 的识别；错误报文编号仍被协议层拒绝。
- 异步发送使用当前活动状态，保留请求期间累计的有效时间；过期、重试或阶段已变化的请求不能回写旧状态。
- 设置、离开确认及失焦时暂停计时并停止电键；接收、清空、发送、重试与结算按钮采用统一阻断条件。结算成功后禁用重复保存。
- 报到及待接收阶段不显示报文卡；冲突阶段显示两份旧版，核实后才显示修订版二及 CHECK。
- 修复重玩无法保存：仅同时有 story-12 已领取与 taskTreeUnlocked 才允许重玩结算。每次新活动增加两条零收益事件 QSO，章节奖励仍只领取一次。
- 主页竞赛、守听与风暴重玩入口共用纵向容器，避免翻译换行引起覆盖。修复德语活动标题在 390px 下越界。
- 离开提示改为保留当前进度，与实际存档行为一致。

## 自动验证

### 单元与组件

- 最终 pnpm test：896 / 896，通过；日志 chapter-twelve-tests-final.log，耗时 61907.151898 ms。首轮日志 chapter-twelve-tests.log 亦保留。
- 本章针对性测试 17 / 17：书签迁移、顺序、玩家绑定、缺失/伪造证据、各阶段刷新、未结算结尾阻断、重复领奖、重玩保存、本地规则回退、错误数量拒绝、迟到响应等。
- 七语言组件渲染与占位符检查通过。UI 测试不把 DOM 静态渲染当作实际游玩。

### 构建

- pnpm build 通过，日志 chapter-twelve-build-final2.log。
- 总输出 163900050 bytes；最大自有 JS 为 assets/index-Dp0LE-7M.js，461876 / 512000 bytes。未提高预算。
- 总输出包括既有图像与音频，并非首屏网络下载量。

### 浏览器布局与入口

- 1440×900、390×844，zh-CN / zh-TW / en / ja / es / de / ru。
- 最终 42 项检查通过，28 张截图，运行异常 0。活动页使用已核实的完整三份报文，不仅是初始报到页。
- 14 次主页重玩入口中心点命中和实际鼠标点击均进入 CHECK_IN，未被相邻按钮截获。
- 使用种子存档，仅作为布局和入口证据，不冒充从空存档通关。
- 证据 /home/ubuntu/cwgame-development-20261013/chapter-twelve-layout-4/evidence.json。
- SHA-256：eadddaa4c41d5132aadcb84ef9f61b99bd530bfe10dd592c2b59daf61e1f0b64。
- layout-1 检出德语长标题越界；修正换行并扩大完整报文覆盖后，layout-2 通过。修订 QRS 后的 layout-3 在主页按钮尚未就绪时读取位置，暴露测试同步缺口；增加显式等待后 layout-4 完整通过。各轮证据均保留。

### 连续游玩

第一轮 chapter-twelve-live-30 在进行前置章节时，离线补查发现本地规则拒绝 QRS。为修正并复测，主动关闭本轮专属 QA 浏览器；该轮作为中断记录保留，不作为通过证据。隔离配置 /tmp/cw-chapter-one-live-1791901626737 已清理。

- 修正版 chapter-twelve-live-30-2 从新建 BH1QA 空存档跑通第一至十二章，随后完成第十二章重玩。发送走 30 WPM 普通电键、解码、本地协议与正常结算；未预置完成章节或奖励。
- 证据 /home/ubuntu/cwgame-development-20261013/chapter-twelve-live-30-2/evidence.json；记录时间 2026-10-13T14:56:39.014Z；121 张截图，运行异常 0。SHA-256：7fc1ede18040c1c11d5be8c83e840b053bc9b4248a619dde8c4a8798e6a159cb。
- 首轮记录 storm-record:storm-relay:4fc9feea；MSG 214 / REV 2 / GRID PX-31 / PEOPLE 8 / ITEM WATER / QTY 6 / CHECK 13。两条联络：storm-control-qso:4fc9feea、storm-relay-qso:4fc9feea。
- 报文按阶段显示；QRS 被记录，错误报文编号及错误数量被拒绝，修正后可继续。设置与离开确认期间注入电键不会产生脉冲，计时冻结。开场、冲突阶段、已核实报文、完成未结算及结尾均经过刷新恢复。
- 结算只新增两条零收益事件 QSO，不发章节奖励；保存按钮禁用后才允许续读。结尾与日志读取同一实际记录，不声称物资已送达。
- 领奖资金 11465 → 12815，科技点 79 → 85；独立成就资金 0、科技点 0。story-12 仅领取一次，story-13 available。
- 主页实际点击重玩并保存 storm-record:storm-relay:7efa4dd5，新增两条事件 QSO，但资金与科技点不变。剧情书签仍固定原记录，重玩不显示待完成章节的续读入口。
- 最后进入第一章审阅模式，资金保持不变。隔离配置 /tmp/cw-chapter-one-live-1791902218745 已确认清理。核对 cwd 与命令行后，仅停止本轮创建的 4176 预览进程 PID 1172596。

## 复现

使用服务器现有 Node 24.21.0、pnpm 10.12.1、Chromium。浏览器任务串行运行，Chromium 沙盒保持启用。

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
pnpm test
pnpm build
# 另开终端：pnpm preview --host 127.0.0.1 --port 4176 --strictPort
CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261013/chapter-twelve-layout-new node scripts/qa-storm-relay-layout.mjs
CWGAME_QA_CHAPTER_TWELVE=1 CWGAME_QA_WPM=30 CWGAME_QA_UTC=2026-10-04T22:15:00Z CWGAME_QA_RECOVERY='AGN K' CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261013/chapter-twelve-live-new node scripts/qa-chapter-one-story.mjs
```

使用新的输出目录保留每次记录。时钟起点为自动测试的固定游戏时间，不是实际测试日期；有效活动计时未快进。

## 素材与人工验收边界

- scene.png 2287366 bytes、portrait.png 2407376 bytes、illustration.png 2457857 bytes，ambience.wav / music.wav 各 384044 bytes，均复用现有素材。
- 沿用远景、云、水面、雨、设备灯光、闪电、灯塔与 heavy-rain / ocean-waves / thunder 音景配置；本轮没有逐帧美术审阅、人工试听或声光同步验收。
- 连续回归使用 qaCapture 暴露部分盲听目标并跳过音频播放；发送经过按键事件、AutomaticKeyer、解码、协议判断和正常结算。第六章保留结构化输入/按钮，第七至九章及第十二章接收使用文字/按钮。
- 本章“接收冲突报文”是文本展示，不宣称测试者实际听懂了摩尔斯；AGN / QRS 记录恢复操作，不等同于人工听觉验收。
- 中文稿见 docs/reviews/chapter-twelve-dialogue-script-zh-CN.md。humanizer-zh 通过具体动作与未知结果边界约束叙事，44/50 为自检分数，不是独立审计。
- 七语言结构与布局已检查；非中文文学表达仍待母语编辑。Windows 游戏包未生成或更新。
- 素材库保持 main / 20955ea，未修改。
