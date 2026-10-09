# 第十一章 Galgame 接入验证（2026-10-10）

## 范围

在既有第一至十五章玩法上，接入第十一章“听不见的人”的 Galgame 演出。第一至十一章已有正式剧情入口；第十二至十五章的本轮演出接入尚待继续。已有玩法与完成 Galgame 演出是两回事。

- 服务器分支 agent/chapter-11-story，基于 dcdc3a6。
- 五幕、七语言；主页与任务中心入口、已结算监听记录后的续读、按接受时间绑定的书签、设置与章节媒体/世界时间路由。
- 台词按 humanizer-zh 编辑，用翻页、核对呼号、停笔和松开电键表达等待，不替 SIM11LS 生成任何回复，不解释对方未回应的原因。
- 素材库 main 20955ea 无改动；没有新增图像、配音、音乐或音效。
- 不合并、不推送、不发布，不更新本机游戏本体。

## 完成条件与记录

- 依次查看三个既有监听窗口，使用电键发送对 SIM11LS 的定向呼叫。等待后可直接记录静默，或进行最后一次呼叫；最多两次。
- 窗口是固定的传播/噪声事实和按钮观察流程，不是新增音频听辨测试。活动不生成对方回复。
- 网页缺少桌面接口时使用普通本地语义解释器；明确返回不安全的结果仍被拒绝。
- 结尾要求同一次监听的摘要、归档、结算凭证和 settledRunId 全部匹配；呼号属于当前玩家，完成时间不早于本次接受，且不在接受时的旧局基线中。
- 每个候选记录单独验证，不能借另一条有效归档补足本条缺失的证明。
- 已完成但未结算时仍停在活动入口，不显示结尾；重接排除旧记录。结尾书签使用 recordId 而非 qsoId，因为本章不创建 QSO。
- 结尾显示 UTC、目标呼号、呼叫次数、观察窗口数、有效时间、记录 ID 和“本次未收到回应”。有效秒数由已保存毫秒数向上取整。
- 监听结算资金与科技点均为 0，不增加 QSO 或人物关系；章节一次性奖励 1200 资金 + 5 科技点，开放守听重玩与第十二章。独立成就奖励另计。

## 修复

- 第二次呼叫会清空上次等候完成时间。旧逻辑保留旧时间，可能早于新的 lastCallAt，导致 WAITING 状态无法通过存档归一化而丢失活动。
- 归一化要求完成摘要的呼叫次数、有效时间与活动一致，终态与完成时间一致，完成时间不早于最近等候结束。
- 任务证明增加当前玩家绑定，不能用全套来自另一个玩家的监听记录完成本任务。
- 已领取章节且开放守听重玩后，可以保存新的零奖励监听记录；旧结算代码只接受活动任务，重玩无法保存。仍须匹配当前 activeRun 和玩家，不是放宽到任意完成记录。
- 设置、离开确认和窗口失焦时暂停有效计时、停止当前电键输入并阻止新输入。待机回调检查挂载、暂停、runId、呼叫次数与 WAITING 阶段。
- 暂停或刷新后的本次等候重新计满四秒；只保存活动阶段和有效时间，不声称精确恢复四秒倒计时剩余量。普通计时刷新不会不断重启等候。
- 异步语义结果应用到当前活动，保留解释期间经过的时间；过期结果不能复活超时或重试前的尝试。卸载/暂停后不回写。
- 结算有进行中门控，成功后禁用按钮；只有匹配本次已结算 runId 才显示剧情续读。活动结果显示可读结论，不再直接向玩家展示内部 conclusionKey。
- 小屏标题、按钮、窗口标签与长台站 ID 可换行；监听活动中不展示人物立绘。
- 连续回归在通关后的重玩入口发现：主页守听按钮 bottom:316px 与竞赛按钮 bottom:308px 重叠，实际鼠标点击进入了竞赛。固定错开位置后，窄屏西班牙语换行仍发生重叠；最终将两入口包在正常文档流的纵向容器内，按实际高度排列，并补充矩形、命中元素和实际鼠标页面跳转检查。

## 验证

### 自动测试与构建

- 三轮全量分别为 884/884、885/885、885/885 通过，无失败、跳过或取消。新增主页入口正常流布局回归。最终日志 /home/ubuntu/cwgame-development-20261010/chapter-eleven-tests-group.log，耗时 62296.19 ms；较早日志 chapter-eleven-tests.log 与 chapter-eleven-tests-final.log。
- 首轮定向检查有一项新测试误以为第三次调用应保持 DECISION；既有规则实际以 CALL_LIMIT_EXCEEDED 终止。修正断言后纳入全量通过，未更改第三次呼叫的领域规则。
- 构建通过；总输出 163870881 bytes，最大自有 JS assets/index-DG6LAexc.js 为 458028 / 512000 bytes。最终布局分组构建日志 chapter-eleven-build-group.log；较早日志 chapter-eleven-build.log 与 chapter-eleven-build-final.log。
- 将第八至十章的部分玩法与完成验证模块合入已有 continuation engine chunk；预算阈值未变。相较第十章最大块 511876 bytes，恢复了分块余量。这是代码分块调整，不代表总下载大小大幅下降。
- 测试覆盖书签迁移、顺序与解锁、摘要/记录/凭证缺失或篡改、跨玩家证明、重接/重玩与奖励、第二次呼叫的刷新恢复、规则回退与拒绝、异步计时保护、七语言 SSR。

### 布局

- 七语言 × 1440×900 / 390×844 × 剧情/活动/主页重玩入口，42 项通过；28 张活动与主页截图。页面横向溢出和运行异常均为 0。
- 14 个主页组合确认两个重玩按钮无矩形重叠，中心命中实际守听按钮，并通过真实鼠标协议点击进入 BRIEFING 后离开。没有用 DOM .click() 绕过遮挡。
- 最终证据 /home/ubuntu/cwgame-development-20261010/chapter-eleven-layout-4/evidence.json。
- SHA-256：b53608c322f9d64e59f26ebfc8188a65cc569e27bc6f70a4bae3ad17302c6842。
- 使用种子存档，只证明布局/点击入口，不是通关证据。
- layout-1 为最初 28 项通过；layout-2 在手机视口切回启动页时发生测试点击失效；layout-3 发现西班牙语窄屏换行导致固定间距仍重叠。修复启动视口与入口容器后，layout-4 完整通过，前序失败证据均保留。

### 连续游玩

- 第一轮 chapter-eleven-live-22 从空存档完成第一至十一章领奖，直到第十二章解锁；随后重玩入口被竞赛按钮遮挡，整轮返回失败。失败 JSON、日志与截图保留，不作为整轮通过证据。
- 修复后的 chapter-eleven-live-30 从新建 BH1QA 空存档完整跑通第一至十一章及第十一章重玩。全程 30 WPM；按键事件经过普通电键、解码、规则与结算链，没有预置已完成章节、通联或奖励。
- 证据 /home/ubuntu/cwgame-development-20261010/chapter-eleven-live-30/evidence.json，日志同级 chapter-eleven-live-30.log。记录时间 2026-10-09T21:57:34.501Z；109 张截图，运行异常 0。
- SHA-256：5e82209eb617c132f28f80b45753a64243ab0466cbbb614e3b431523672de777。
- 第十一章记录 listening-record:listening:cb31e4ac，目标 SIM11LS；3 个窗口、2 次呼叫、有效时间 32756 ms。结论为本次未收到回应。
- 错误目标呼号不消耗呼叫次数。三窗口观察中的刷新、第二次呼叫 WAITING 中的离开/刷新、已完成但未结算的刷新、结尾刷新均保持对应活动和记录。
- 设置与离开确认各停留超过四秒，注入电键输入不产生脉冲，有效计时和 WAITING 状态冻结；恢复后重新等候四秒。第二次呼叫后不再提供第三次呼叫按钮。
- 结算前没有结尾；结算后记录、摘要、凭证与 settledRunId 匹配。监听结算没有新增 QSO、人物关系、资金或科技点，保存按钮禁用后才允许续读。
- 领奖资金 10265 → 11465，科技点 74 → 79；额外成就资金 0、科技点 0。刷新后数值不变，story-11 只领取一次，第十二章 available。
- 从主页实际点击守听重玩进入正确页面，完成 1 次呼叫并保存 listening-record:listening:7cf44ab2。新记录独立保存；资金、科技点、QSO 与人物关系不变，剧情书签仍固定原记录。重玩不显示未完成章节的续读按钮。
- 最后返回第一章审阅模式，资金保持不变。隔离浏览器配置 /tmp/cw-chapter-one-live-1791582020293 已确认清理。已核对 cwd 与命令行，仅停止本次创建的 4176 预览进程（PID 1011994）。

## 复现

在服务器 /home/ubuntu/cwgame 使用已有 Node 24.21.0、pnpm 10.12.1 与 Chromium。先构建并启动 127.0.0.1:4176 预览，浏览器任务串行运行。

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
pnpm test
pnpm build
# 另开终端：pnpm preview --host 127.0.0.1 --port 4176 --strictPort
CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261010/chapter-eleven-layout-new node scripts/qa-listening-layout.mjs
CWGAME_QA_CHAPTER_ELEVEN=1 CWGAME_QA_WPM=30 CWGAME_QA_UTC=2026-10-04T22:15:00Z CWGAME_QA_RECOVERY='AGN K' CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261010/chapter-eleven-live-new node scripts/qa-chapter-one-story.mjs
```

使用新输出目录保留各次结果。Chromium 沙盒保持启用。最终复测从 30 WPM 开始，竞赛前仍通过正常设置界面确认速度；不注入通关结果或跳过等待。

## 素材与待人工验收

- 第十一章 scene.png 2295226 bytes、portrait.png 1900700 bytes、illustration.png 2349118 bytes，ambience.wav / music.wav 各 384044 bytes，均复用现有章节媒体。
- 场景配置沿用远景、薄雾、水面、星光、设备灯光，以及 forest-night / lake / silent-watch 的既有音景路由。本次没有逐帧美术审阅或人工试听。
- 旧章节回归使用 qaCapture 展示盲听目标并跳过音频播放。电键仍经过键盘事件、AutomaticKeyer、解码、协议验证和正常结算。第六章保留结构化输入/按钮，第七至九章接收回应保留文字/按钮。
- 本章监听窗口和“未收到回应”是游戏状态；本次测试不证明玩家实际听辨能力，也不宣称音频质量验收通过。
- 七语言结构、占位符和布局通过自动检查；非中文文学表达仍待母语编辑。Windows 游戏包未生成、未人工验收。
- humanizer-zh 台词评分是自检，不是独立审计。中文审阅稿见 docs/reviews/chapter-eleven-dialogue-script-zh-CN.md。
- 源码、依赖、构建、日志、截图都在服务器；没有向本机下载项目文件。
