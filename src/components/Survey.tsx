import survey from "@/content/survey.json";

export function Survey() {
  return (
    <main id="main-content" className="section">
      <div className="container reading-width">
        <h1>{survey.title}</h1>
        <p className="lead">{survey.description}</p>
        <div className="store-links">
          <a
            className="button"
            href={survey.formUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {survey.button} ↗
          </a>
          <a className="button button-secondary" href="/">
            {survey.more}
          </a>
        </div>
      </div>
    </main>
  );
}

export function SurveyLink() {
  return (
    <aside className="survey-link">
      <a href="/survey/" data-goal="click-banner-survey">
        {survey.title} →
      </a>
    </aside>
  );
}
