# 第二章 Galgame 正式剧情验收（2026-10-04）

本轮在服务器 `gpu-821560-ts` 的 `/home/ubuntu/cwgame` 开发，分支为 `agent/chapter-02-story`，基于 `c26393f`。没有向 Windows 下载源码、素材、证据或新建开发环境；没有合并主线、推送仓库或重新发布游戏包。

## 完成范围

第二章“纸页上的呼号”接入正式存档和既有 Galgame 舞台，共五幕：纸页、抄录、呼叫、核对、记入新日志。前三幕是接任务后的准备，后两幕由合格的游戏通联记录解锁。

- 主界面在第一章领取后显示第二章入口；任务中心可以继续已接受或已完成但未领取的第二章。
- 通联结算仅对当前可继续的章节显示对应入口，不会回到已领取的第一章。
- 书签随存档保存；退出和刷新可续读。放弃后重新接任务会重新核对接受时间，不复用旧通联。
- 使用既有第二章场景、肖像、插图及场景效果，不增加或改写素材。肖像只用于电台外演出。
- 接入第二章的存档设置和世界时钟，设置窗口打开时演出不可操作。
- 七种现有语言均包含五幕文本、任务提示和按钮文案。中文按 humanizer-zh 的原则落在具体动作上，不代替 NPC 编造未发出的内容。台词单独保存在 `docs/reviews/chapter-two-dialogue-script-zh-CN.md`。

## 规则与兼容性

既有 `story-02` 规则未修改：第一章已领取；接受第二章后，与 SIM3RA 完成通联；至少有一次成功的 `AGN K` 重发请求；保存通联后才能领取任务奖励。

演出结尾还会核对：普通通联、有效呼号与 RST/频率、接受任务后的时间、非基线日志、已结算 ID，以及同一 ID/呼号/时间的任务进展事件。只有重发次数、QRS、失败的 AGN、错误呼号、缺失结算或任务事件，都不会生成结尾。

书签自身不推进任务、不写入 QSO、不发钱。旧存档仅增加空书签，余额和任务状态保持不变；记录不完整但原任务已经达标的旧存档仍可在任务中心按旧流程领奖。

奖励分别记账：

- 第二章任务：220 金钱、1 科技点。
- 首次获知姓名时的既有 `first-name` 成就：100 金钱。它不是第二次章节奖励。
- 两者各有一次性账本，刷新不会重复领取。第二章领取后解锁第三章。

## 自动验证结果

- `pnpm test`：768/768 通过，0 跳过。
- `pnpm build`：通过。最大自有 JS 分块 511,113 字节，预算 512,000 字节；未上调预算。后续扩章需要留意这部分余量。
- 18 WPM 与 22 WPM：从新的隔离存档开始，实际完成第一章，再接受并完成第二章；没有注入章节完成状态或成功 QSO。
- 第二章实际键控经过 CQ、SIM3RA 回复、AGN K 重发、RST/73、可选交换、完成未保存、保存、结尾、读档、领取和第三章开放。
- 每轮核对场景图片加载、390 像素窄屏横向溢出/按钮可达性、设置暂停、任务记录中的真实 RST、奖励分账、刷新后的余额和独立第一章审阅不改存档。
- 浏览器两轮结果和截图数量见下面的服务器证据摘要。

## 服务器证据

所有图片、完整日志和 JSON 均留在 `/home/ubuntu/cwgame-development-20261004/`：

- `chapter-two-tests-final.log`、`chapter-two-build.log`。
- `chapter-two-verified-18/evidence.json` 与同目录截图。
- `chapter-two-verified-22/evidence.json` 与同目录截图。
- 两轮命令日志为同名前缀的 `.log`。

- 18 WPM：24 张截图；异常 0；第二章奖励差额 320（任务 220 + 成就 100），科技点 +1。evidence.json SHA-256：559dc3d4bc8e03bb89d3e46628f195a767b662aae0d6f300f59c0d6198ff51de。
- 22 WPM：24 张截图；异常 0；第二章奖励差额 320（任务 220 + 成就 100），科技点 +1。evidence.json SHA-256：014e696eb8ad94069ea9633ccf2130a6bddca00907f503c64ac5a42750b3a016。

调试阶段失败结果也保留：早期脚本错误要求第二次显示新手引导、未计入既有 first-name 成就、未关闭遮住管理中心工具栏的成就提示。最终脚本按实际 UI 操作关闭提示，并分别核对任务与成就账本；没有为通过测试而修改发报、任务判定或奖励规则。

## 复现

先在服务器项目目录启动生产预览：

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
pnpm build
pnpm preview --host 127.0.0.1 --port 4176 --strictPort
```

另一个服务器终端设置相同 Node 路径，再执行：

```sh
export LD_LIBRARY_PATH=/home/ubuntu/.local/share/cwgame-tools/browser-libs/usr/lib/x86_64-linux-gnu
export CWGAME_QA_CHROME=/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
CWGAME_QA_CHAPTER_TWO=1 CWGAME_QA_WPM=18 CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261004/chapter-two-rerun-18 node scripts/qa-chapter-one-story.mjs
CWGAME_QA_CHAPTER_TWO=1 CWGAME_QA_WPM=22 CWGAME_QA_OUTPUT=/home/ubuntu/cwgame-development-20261004/chapter-two-rerun-22 node scripts/qa-chapter-one-story.mjs
```

未设置 `CWGAME_QA_CHAPTER_TWO=1` 时，原脚本仍只验收第一章。

## 尚未覆盖

`qaCapture` 会显示验收所需的对方呼号并跳过接收音频时长；发送仍经过原有键事件、AutomaticKeyer、解码、协议和正常存档结算。本轮不是人工听感验收，不是 Windows 离线包重发，也没有下载服务器截图进行人工视觉审阅。图片加载和窄屏结果是自动化断言。

第三至十五章的这轮 Galgame 叙事接入不在本次完成范围内。下一步为第三章“不同的节奏”的演出与真实多操作员通联记录绑定；已有第三章及后续玩法未重置。
