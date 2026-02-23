import { getAffiliateConfig } from "@/lib/affiliate";

export default function AffiliateBanner() {
  const config = getAffiliateConfig();

  if (!config.enabled) return null;

  return (
    <section className="affiliate-banner" id="affiliate">
      <div className="container">
        <div className="affiliate-banner__card">
          <div className="affiliate-banner__icon">🎁</div>
          <h2 className="affiliate-banner__title">{config.title}</h2>
          <p className="affiliate-banner__desc">{config.description}</p>
          <a
            href={config.url}
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-banner__btn"
            id="affiliate-cta"
          >
            {config.ctaText} →
          </a>
        </div>
      </div>
    </section>
  );
}
