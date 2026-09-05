import type { CSSProperties } from "react";

type BrowserPreviewProps = {
  accent?: string;
  variant?: string;
  compact?: boolean;
  title?: string;
};

export function BrowserPreview({ accent = "#c8f36a", variant = "saas", compact = false, title = "Preview" }: BrowserPreviewProps) {
  const style = { "--preview-accent": accent } as CSSProperties;
  const normalized = variant.toLowerCase();

  return (
    <div aria-label={`${title} website preview`} className={`browser-preview ${compact ? "browser-preview-compact" : ""} preview-${normalized}`} role="img" style={style}>
      <div className="browser-chrome">
        <span /><span /><span />
        <div className="browser-address">ennearock.site/{title.toLowerCase().replaceAll(" ", "-")}</div>
      </div>
      <div className="browser-canvas">
        {normalized.includes("commerce") || normalized.includes("store") ? <CommercePreview /> : normalized.includes("portfolio") || normalized.includes("studio") ? <PortfolioPreview /> : normalized.includes("wellness") || normalized.includes("health") ? <WellnessPreview /> : normalized.includes("fin") || normalized.includes("dashboard") ? <FinancePreview /> : <SaasPreview />}
      </div>
    </div>
  );
}

function PreviewNav() {
  return <div className="preview-nav"><span className="preview-logo" /><span /><span /><span /><b /></div>;
}

function SaasPreview() {
  return <><PreviewNav /><div className="preview-saas-hero"><div><i>Intelligence, built in</i><h3>Make every decision count.</h3><p /><p className="short" /><button /></div><div className="preview-orbit"><span className="orbit-core" /><span className="orbit-one" /><span className="orbit-two" /><span className="orbit-three" /></div></div><div className="preview-logo-row"><span /><span /><span /><span /><span /></div></>;
}

function CommercePreview() {
  return <><PreviewNav /><div className="preview-shop-title"><span>New collection · 2026</span><h3>Objects for slow living.</h3></div><div className="preview-products"><div><span /><p /><b /></div><div><span /><p /><b /></div><div><span /><p /><b /></div></div></>;
}

function PortfolioPreview() {
  return <><PreviewNav /><div className="preview-portfolio"><div className="portfolio-copy"><span>Independent creative studio</span><h3>We shape brands people feel.</h3><p /></div><div className="portfolio-art"><span /><span /><span /></div></div><div className="preview-ticker">BRAND · DIGITAL · MOTION · STRATEGY ·</div></>;
}

function WellnessPreview() {
  return <><PreviewNav /><div className="preview-wellness"><div className="wellness-art"><span className="wellness-sun" /><span className="wellness-leaf leaf-one" /><span className="wellness-leaf leaf-two" /></div><div><i>Feel like yourself again</i><h3>Care, designed around you.</h3><p /><button /></div></div></>;
}

function FinancePreview() {
  return <div className="preview-dashboard"><aside><span className="preview-logo" />{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</aside><main><div className="dashboard-mini-top"><div><span /><b /></div><i /></div><div className="dashboard-mini-stats"><span /><span /><span /></div><div className="dashboard-mini-grid"><div className="mini-chart"><i /><i /><i /><i /><i /><i /><i /></div><div className="mini-list">{Array.from({ length: 4 }, (_, index) => <span key={index}><i /><b /></span>)}</div></div></main></div>;
}
