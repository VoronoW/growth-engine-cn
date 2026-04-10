const deliverables = [
  { icon: '🎯', title: '明确的品牌战略方向', desc: '品牌定位战略文档、品牌切入点 & 差异化价值主张、核心价值提炼设计' },
  { icon: '📋', title: '可落地的营销4P方案', desc: '包含定价/渠道/推广/产品组合方案、渠道合作方案、推广策略地图' },
  { icon: '🚀', title: '跑通的增长引擎', desc: '投放模型验证与优化、全链路数据追踪 (GTM/UTM)、增长出投回报看板' },
  { icon: '👥', title: '用户资产管理系统', desc: '用户标签体系 & 分群、用户生命周期管理、首1000用户深度画像' },
  { icon: '📊', title: '品牌数据化管理系统', desc: '品牌健康度追踪看板、15个关键指标核心、BI数据看板 & 月对比报告' },
  { icon: '🔧', title: '完整SOP & 工具包', desc: '10套标准化SOP、20+可直接使用模板、广告投放与内容制作入库流程' },
  { icon: '🏆', title: '会做品牌的团队（最重要）', desc: '掌握品牌战略方法论、掌握增长引擎运营能力、不再依赖外部，增长能力永久属于企业' },
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
            从品牌战略到增长引擎，从数据体系到团队能力，
            用12个月帮企业建立可复制、可放大的品牌增长能力。
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
              <p>帮助企业明确品牌定位、构建差异化价值体系，输出可落地的战略执行路径。</p>
            </article>
            <article className="module-card">
              <span className="module-tag">MODULE 02</span>
              <h3>ZAPEX 品牌增长引擎™</h3>
              <p className="module-keys">验证 · 放大 · 复制</p>
              <p>建立数据驱动的增长验证体系，跑通增长模型后规模化复制，让增长能力属于企业自身。</p>
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
                <div className="deliver-icon">{d.icon}</div>
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
