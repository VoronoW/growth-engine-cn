import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type FormState = {
  companyName: string;
  marketFocus: string;
  annualRevenue: string;
  channelMix: string;
  adPlatforms: string;
  attributionMaturity: string;
  skuStructure: string;
  heroSkuRatio: string;
  contentCapacity: string;
  creativeRhythm: string;
  teamStructure: string;
  decisionCycle: string;
  goal90: string;
  accessChecklist: string;
  priorityIssues: string;
};

const initialState: FormState = {
  companyName: '',
  marketFocus: '',
  annualRevenue: '',
  channelMix: '',
  adPlatforms: '',
  attributionMaturity: '',
  skuStructure: '',
  heroSkuRatio: '',
  contentCapacity: '',
  creativeRhythm: '',
  teamStructure: '',
  decisionCycle: '',
  goal90: '',
  accessChecklist: '',
  priorityIssues: ''
};

type StepConfig = {
  title: string;
  fields: Array<{ key: keyof FormState; label: string; hint: string }>;
};

const steps: StepConfig[] = [
  {
    title: '企业画像与营收结构',
    fields: [
      { key: 'companyName', label: '企业名称与品牌矩阵', hint: '填写核心品牌与业务线' },
      { key: 'marketFocus', label: '核心国家/市场', hint: '例如：北美、欧盟、东南亚' },
      { key: 'annualRevenue', label: '近12个月营收区间', hint: '例如：3000万-5000万人民币' }
    ]
  },
  {
    title: '渠道与投放归因状态',
    fields: [
      { key: 'channelMix', label: '渠道占比结构', hint: '概述广告、自然流量、私域占比' },
      { key: 'adPlatforms', label: '当前投放平台', hint: '例如：Meta、TikTok、Google、Amazon' },
      { key: 'attributionMaturity', label: '归因成熟度', hint: '说明GTM/UTM/S2S部署现状' }
    ]
  },
  {
    title: 'SKU与内容生产系统',
    fields: [
      { key: 'skuStructure', label: 'SKU分层结构', hint: '区分引流款、利润款、长尾款' },
      { key: 'heroSkuRatio', label: '头部SKU收入占比', hint: '填写前20% SKU贡献比例' },
      { key: 'contentCapacity', label: '月度内容产能', hint: '填写月均素材数量与形式' }
    ]
  },
  {
    title: '团队结构与90天目标',
    fields: [
      { key: 'creativeRhythm', label: '素材测试节奏', hint: '例如：周更、双周更、按活动触发' },
      { key: 'teamStructure', label: '增长团队结构', hint: '说明投放、内容、数据岗位配置' },
      { key: 'decisionCycle', label: '经营决策周期', hint: '例如：日监控、周复盘、月战略会' }
    ]
  },
  {
    title: '入舱权限与优先议题',
    fields: [
      { key: 'goal90', label: '90天核心目标', hint: '明确目标指标与期望变化幅度' },
      { key: 'accessChecklist', label: '系统访问清单', hint: '列出广告账户、分析平台、店铺后台权限' },
      { key: 'priorityIssues', label: '优先修复议题', hint: '描述当前最关键的增长阻塞点' }
    ]
  }
];

export function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);

  const current = steps[stepIndex];

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setStepIndex((prev: number) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStepIndex((prev: number) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="site-shell onboarding-shell">
      <header className="top-bar">
        <div className="logo">客户入舱流程</div>
        <nav>
          <Link to="/" className="nav-cta">
            返回增长主站
          </Link>
        </nav>
      </header>

      <main className="onboarding-main">
        <section className="section">
          <h1>签约客户入舱表单</h1>
          <p>
            该表单用于在项目启动前统一经营口径、执行条件与权限边界，保障90天执行路径可直接进入实战。
          </p>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-text">
            当前阶段：{stepIndex + 1} / {steps.length} ｜ {current.title}
          </p>
        </section>

        <section className="section card">
          {submitted ? (
            <div className="submit-panel">
              <h2>入舱信息已提交</h2>
              <p>
                顾问团队将在1个工作日内完成预诊断并同步首轮问题清单，随后进入增长诊断会议与执行路径确认。
              </p>
              <Link to="/" className="btn-primary">
                返回主页
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>{current.title}</h2>
              <div className="form-grid">
                {current.fields.map((field) => (
                  <label key={field.key} className="form-item">
                    <span>{field.label}</span>
                    <textarea
                      rows={3}
                      value={form[field.key]}
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField(field.key, event.target.value)}
                      placeholder={field.hint}
                      required
                    />
                  </label>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" onClick={prevStep} className="btn-ghost" disabled={stepIndex === 0}>
                  上一步
                </button>

                {stepIndex < steps.length - 1 ? (
                  <button type="button" onClick={nextStep} className="btn-primary">
                    下一阶段
                  </button>
                ) : (
                  <button type="submit" className="btn-primary">
                    提交入舱信息
                  </button>
                )}
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
