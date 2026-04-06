import { Link } from 'react-router-dom';

const pains = [
  {
    title: '投放增长与利润脱节',
    detail: '平台报表看似健康，但真实贡献利润持续下滑，预算扩张无法沉淀长期资产。'
  },
  {
    title: '归因链路不完整',
    detail: '点击、加购、支付与复购数据分散在多个系统，管理层无法建立统一决策口径。'
  },
  {
    title: '内容与广告协同失效',
    detail: '素材生产节奏依赖个人经验，缺少实验机制，增长曲线高度波动。'
  },
  {
    title: '团队能力不可复制',
    detail: '关键岗位一旦离岗即触发业绩回撤，缺乏可传递、可复用的增长SOP。'
  }
];

const architecture = [
  ['增长战略层', '完成市场优先级、SKU角色与渠道职责划分，明确90天执行路径。'],
  ['数据底盘层', '部署GTM/UTM/S2S归因结构，建立真实ROI口径与增长诊断模型。'],
  ['投放引擎层', '重构账户架构、预算分配与素材测试，形成稳定扩量机制。'],
  ['内容系统层', '搭建脚本库、素材库与产能节奏，提升高质量创意供给稳定性。'],
  ['实验决策层', '建立A/B测试看板与周度复盘机制，让每次预算投入可验证、可迭代。']
];

const roadmap = [
  {
    phase: '第1阶段｜增长诊断与基线校准（第1-3周）',
    tasks: ['完成全链路增长诊断', '定位核心风险指标', '输出系统重构优先级地图']
  },
  {
    phase: '第2阶段｜系统重构与执行路径部署（第4-8周）',
    tasks: ['落地数据归因与BI指挥舱', '建立广告与内容双周实验机制', '同步组织协同节奏与会议机制']
  },
  {
    phase: '第3阶段｜放大验证与SOP交付（第9-13周）',
    tasks: ['聚焦高ROI路径放量', '形成岗位化SOP与监控阈值', '完成管理层决策驾驶舱交接']
  }
];

const deliverables = [
  '企业级增长诊断报告（含风险分级与修复优先级）',
  '增长指挥舱指标体系与BI看板结构设计',
  '广告账户结构重构方案与预算模型',
  '素材测试矩阵、脚本库与复盘模板',
  '90天执行路径甘特图与周度作战机制',
  '跨部门增长SOP手册与交接标准'
];

const audience = [
  '年营收已过验证期、但增长效率开始失速的品牌出海团队',
  '高度依赖单一平台流量、存在渠道风险暴露的业务单元',
  '需要构建CEO可读增长指挥舱的创始人与经营团队',
  '希望将增长能力从“人治”升级为“系统治理”的企业'
];

export function HomePage() {
  return (
    <div className="site-shell">
      <header className="top-bar">
        <div className="logo">增长引擎验证舱</div>
        <nav>
          <a href="#architecture">解决方案架构</a>
          <a href="#roadmap">90天执行路径</a>
          <a href="#deliverables">交付库</a>
          <Link to="/onboarding" className="nav-cta">
            客户入舱表单
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero card-grid">
          <div>
            <p className="kicker">品牌出海加速器｜增长引擎验证舱（90天）</p>
            <h1>用增长系统重构，替代碎片化投放执行</h1>
            <p>
              这不是代运营外包，而是一套面向经营层的增长操作系统建设。
              我们在90天内完成增长诊断、归因校准、实验部署与SOP交付，
              让企业获得可复制、可扩展、可审计的增长能力。
            </p>
            <div className="hero-actions">
              <a href="#value" className="btn-primary">
                查看价值框架
              </a>
              <Link to="/onboarding" className="btn-ghost">
                启动签约入舱
              </Link>
            </div>
          </div>
          <div className="metric-panel">
            <h3>增长指挥舱快照</h3>
            <ul>
              <li>
                <span>真实ROI口径</span>
                <strong>已对齐利润模型</strong>
              </li>
              <li>
                <span>实验节奏</span>
                <strong>双周迭代机制</strong>
              </li>
              <li>
                <span>关键指标可视化</span>
                <strong>CEO级驾驶舱</strong>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="pain">
          <h2>核心风险诊断：增长为何失真</h2>
          <div className="grid-2">
            {pains.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="architecture">
          <h2>解决方案架构：从战术执行到系统治理</h2>
          <div className="stack">
            {architecture.map(([title, detail]) => (
              <div key={title} className="rail-item">
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="roadmap">
          <h2>交互式90天执行路径</h2>
          <div className="timeline">
            {roadmap.map((phase) => (
              <details key={phase.phase} open>
                <summary>{phase.phase}</summary>
                <ul>
                  {phase.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <section className="section" id="deliverables">
          <h2>交付库：每一项都服务于经营决策</h2>
          <div className="card-grid-sm">
            {deliverables.map((item) => (
              <article key={item} className="card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>适配客户画像</h2>
          <ul className="bullet-list">
            {audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>运营模型对比</h2>
          <div className="comparison">
            <article className="card">
              <h3>传统代投模式</h3>
              <ul>
                <li>以广告执行为中心</li>
                <li>依赖平台数据口径</li>
                <li>结果归因模糊、可复制性弱</li>
              </ul>
            </article>
            <article className="card accent">
              <h3>增长引擎验证舱</h3>
              <ul>
                <li>以增长系统重构为中心</li>
                <li>统一经营数据与归因标准</li>
                <li>输出可放大的执行路径与SOP</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section" id="value">
          <h2>价值框架：购买确定性，而非购买人力</h2>
          <div className="value-strip">
            <p>缩短试错周期</p>
            <p>提升预算有效性</p>
            <p>建立可复制增长机制</p>
            <p>沉淀企业自有数据资产</p>
          </div>
        </section>

        <section className="section final-cta">
          <h2>如果你希望在下一个季度完成系统级跃迁，现在进入增长指挥舱。</h2>
          <p>签约后将进入多步入舱流程，确保战略目标、执行条件与权限清单一次对齐。</p>
          <Link to="/onboarding" className="btn-primary">
            进入客户入舱页面
          </Link>
        </section>
      </main>

      <footer className="footer">
        <p>品牌出海加速器｜增长引擎验证舱（90天）</p>
        <p>面向跨境品牌的增长诊断、系统重构与执行路径交付</p>
      </footer>
    </div>
  );
}
