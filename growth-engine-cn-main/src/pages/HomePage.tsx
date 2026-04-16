const deliverables = [
  { num: '01', title: '定品牌战略', desc: '明确品牌定位与差异化方向，让每一步都有战略依据' },
  { num: '02', title: '全球化品牌落地打法', desc: '从市场选择到渠道组合，输出可执行的全球化路径' },
  { num: '03', title: '可落地、可复制的增长模型', desc: '验证增长引擎并形成可规模化复制的投放与转化体系' },
  { num: '04', title: '企业自己的品牌体系和团队能力', desc: '将品牌能力沉淀为组织能力，不再依赖外部' },
  { num: '05', title: '品牌增长飞轮', desc: '构建"内容—流量—转化—复购"自驱循环' },
  { num: '06', title: '品牌工具、SOP、模型库', desc: '标准化流程与模板，确保团队可独立运转' },
  { num: '07', title: '数据化的品牌资产管理', desc: '用户资产与内容资产全量追踪，用数据驱动品牌决策' },
];

const phases = [
  {
    step: '01',
    label: '免费诊断',
    title: '30分钟品牌现状诊断',
    sub: '无论品牌是否合作，这30分钟对你都有很大价值',
    tasks: ['诊断品牌现状和卡点', '给出下一步方向'],
  },
  {
    step: '02',
    label: '启动落地',
    title: '2周项目启动，认知对齐',
    sub: '对齐认知，统一团队方向，打好基础',
    tasks: ['核心团队深度咨询', '培训认知对齐'],
  },
  {
    step: '03',
    label: '项目陪跑',
    title: '6-12个月深度陪跑',
    sub: '分阶段交付，每个里程碑都能验证成果',
    tasks: [
      'ZAPEX品牌战略模块™ 定方向',
      'ZAPEX增长引擎™ 跑增长模型',
      'ZAPEX品牌增长引擎™ 规模化复制',
    ],
  },
];

export function HomePage() {
  return (
    <div className="site-shell">
      {/* ── Banner ── */}
      <div className="banner">
        <div className="banner-inner">
          <h1 className="banner-title">峥锐 ZAPEX｜品牌出海加速器</h1>
          <p className="banner-sub">品牌战略 + 增长引擎 双驱动</p>
          <p className="banner-tagline">
            用12个月，建立企业用几年才能跑出来的<strong>品牌增长系统</strong>
          </p>
        </div>
      </div>

      {/* ── 导航 ── */}
      <header className="top-bar">
        <div className="logo">ZAPEX</div>
        <nav>
          <a href="#deliverables">核心交付</a>
          <a href="#roadmap">合作流程</a>
          <a href="/growth-forms.html" className="nav-cta">数据表单</a>
          <a href="/.netlify/functions/feishu-auth-start" className="nav-cta nav-feishu">飞书登录</a>
        </nav>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="hero-simple">
          <p className="kicker">不是代运营，不是单次咨询</p>
          <h2>我们交付的是一套完整的品牌增长系统</h2>
          <p className="hero-desc">
            战略定方向，引擎跑增长。12个月，让品牌增长能力真正属于你的团队。
          </p>
          <div className="hero-actions">
            <a href="/growth-forms.html" className="btn-primary">进入客户工作台</a>
            <a href="/.netlify/functions/feishu-auth-start" className="btn-ghost">使用飞书账号登录</a>
          </div>
        </section>

        {/* ── 两大模块（简化版） ── */}
        <section className="section" id="modules">
          <div className="grid-2">
            <article className="module-card">
              <span className="module-tag">MODULE 01</span>
              <h3>ZAPEX 品牌战略模块™</h3>
              <p className="module-keys">定方向 · 建体系 · 落执行</p>
              <p>明确定位，构建差异化价值体系，输出战略执行路径。</p>
            </article>
            <article className="module-card">
              <span className="module-tag">MODULE 02</span>
              <h3>ZAPEX 品牌增长引擎™</h3>
              <p className="module-keys">验证 · 放大 · 复制</p>
              <p>跑通增长模型，验证后规模化复制，让增长能力属于企业。</p>
            </article>
          </div>
        </section>

        {/* ── 7大核心交付 ── */}
        <section className="section" id="deliverables">
          <h2>7大核心交付，全链路覆盖</h2>
          <p className="section-sub">战略 → 落地 → 数据 → 能力，每一个交付都是可验证的成果</p>
          <div className="grid-7">
            {deliverables.map((d) => (
              <article key={d.title} className="deliver-card">
                <div className="deliver-num">{d.num}</div>
                <h4>{d.title}</h4>
                <p>{d.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 合作流程 ── */}
        <section className="section" id="roadmap">
          <h2>合作流程</h2>
          <div className="phase-row">
            {phases.map((p) => (
              <article key={p.step} className="phase-card">
                <div className="phase-step">{p.step}</div>
                <span className="phase-label">{p.label}</span>
                <h4>{p.title}</h4>
                <p className="phase-sub">{p.sub}</p>
                <ul>
                  {p.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section final-cta">
          <h2>开始你的品牌增长之旅</h2>
          <p>登录飞书账号，进入数据工作台，开始品牌增长第一步。</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <a href="/growth-forms.html" className="btn-primary">进入客户工作台</a>
            <a href="/.netlify/functions/feishu-auth-start" className="btn-ghost">使用飞书账号登录</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>峥锐 ZAPEX｜品牌出海加速器</p>
        <p>品牌战略 + 增长引擎 双驱动</p>
      </footer>
    </div>
  );
}
