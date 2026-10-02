import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import "./styles.css";

const asset = (name: string) => `/assets/${name}`;
const race = { prizePool: 50_000, participants: 6_092, currency: "USDT" };
const prizes = ["5,000", "2,000", "1,000", "500", "200", "100", "50", "50", "50", null];
const playerEntries = [
  { id: "5829473", bets: "$42,875" },
  { id: "7190362", bets: "$38,640" },
  { id: "4601285", bets: "$35,210" },
  { id: "8935741", bets: "$31,985" },
  { id: "2376109", bets: "$28,450" },
  { id: "6458920", bets: "$25,730" },
  { id: "1084637", bets: "$22,165" },
  { id: "9562074", bets: "$19,840" },
  { id: "3729856", bets: "$17,320" },
  { id: "8241503", bets: "$14,975" },
];
const players = playerEntries.map((player, index) => ({
  rank: index + 1,
  name: `Id ${player.id}`,
  detail: player.bets,
  prize: prizes[index],
  avatar:
    index === 0
      ? "imgImage20260415T1918587302.png"
      : index === 1
        ? "imgImage20260415T1933163651.png"
        : "avatar-beer-216.png",
  tint: `imgGroup213614048${Math.min(index + 4, 7)}.svg`,
}));
const tabs = ["Leaderboard", "Events & Games"] as const;
type Tab = (typeof tabs)[number];
const tabId = (tab: Tab) => tab.toLowerCase().replace(/[^a-z]+/g, "-");
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <img className={className} src={asset(name)} alt="" aria-hidden="true" />
  );
}

function Usdt() {
  return <span className="usdt-icon" role="img" aria-label="USDT"><Icon name="usdt.svg" /></span>;
}

function TermsSection({ title, items }: {
  title: string;
  items: { label: string; values: string[] }[];
}) {
  return (
    <section className="terms-section" aria-label={title}>
      <h3>{title}</h3>
      <dl className="terms-card">
        {items.map((item, index) => (
          <div className="terms-item" key={item.label}>
            {index > 0 && <div className="terms-divider"><Icon name="terms-divider.svg" /></div>}
            <div className="terms-row">
              <dt>{item.label}</dt>
              <dd>{item.values.map((value) => <span key={value}>{value}</span>)}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Countdown() {
  const [deadline] = useState(
    () => Date.now() + (29 * 86400 + 23 * 3600 + 56 * 60 + 57) * 1000,
  );
  const [remaining, setRemaining] = useState(() =>
    Math.ceil((deadline - Date.now()) / 1000),
  );
  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [deadline]);
  const days = Math.floor(remaining / 86400);
  const time = [
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  return (
    <div className="countdown">
      <span>Ends in</span>
      <div
        className="timer"
        role="timer"
        aria-label={`${days} days, ${time[0]} hours, ${time[1]} minutes, ${time[2]} seconds remaining`}
      >
        <Icon name="imgRectangle2087336626.svg" className="timer-pill" />
        <Icon name="imgFrame.svg" className="timer-icon" />
        <span className="timer-digits">
          <b className="timer-days">{days}d</b>
          <Icon name="imgDots.svg" className="timer-slash" />
          {time.map((value, i) => (
            <span className="timer-unit" key={i}>
              {i > 0 && (
                <span className="colon">
                  <Icon name="imgGroup2087327803.svg" />
                </span>
              )}
              <b>{String(value).padStart(2, "0")}</b>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function HeroArtwork({ offset }: { offset: { x: number; y: number } }) {
  return (
    <>
    <img src={asset("hero-rays.png")} className="hero-rays" alt="" aria-hidden="true" />
    <div
      className="artwork"
      aria-hidden="true"
      style={
        {
          "--motion-x": `${offset.x}px`,
          "--motion-y": `${offset.y}px`,
        } as CSSProperties
      }
    >
      <div className="artwork-motion">
        <div className="pig">
          <img src={asset("pig-body.png")} className="pig-body" alt="" />
          <Icon name="imgGroup2147239552.svg" className="pig-light pig-snout" />
          <Icon name="imgGroup2147239554.svg" className="pig-light pig-snout pig-additive" />
          <Icon name="imgEllipse3.svg" className="pig-light pig-glow" />
          <Icon name="imgEllipse4.svg" className="pig-light pig-outline" />
          <Icon name="imgEllipse5.svg" className="pig-light pig-highlight pig-additive" />
          <Icon name="imgEllipse6.svg" className="pig-light pig-reflection pig-additive" />
          <Icon name="imgVector234265420.svg" className="pig-light pig-ear-left pig-additive" />
          <Icon name="imgVector234265419.svg" className="pig-light pig-ear-right pig-additive" />
        </div>
      </div>
    </div>
    </>
  );
}

function Leaderboard() {
  return (
    <>
      <div className="section-heading">
        <h2>Players</h2>
      </div>
      <div
        className="leaderboard"
        role="table"
        aria-label="Lucky Race leaderboard"
      >
        <div className="table-heading" role="row">
          <span role="columnheader">#</span>
          <span role="columnheader">Player ID / Total bets</span>
          <span role="columnheader">Prize</span>
        </div>
        <div className="player-list" role="rowgroup">
          {players.map((player, i) => (
            <div
              className={`player-row rank-${player.rank}`}
              role="row"
              key={i}
            >
              <Icon name={player.tint} className="rank-tint" />
              <span className="rank" role="cell">
                #{player.rank}
              </span>
              <div className="player" role="cell">
                <div className="avatar">
                  <img src={asset(player.avatar)} alt="" />
                </div>
                <div className="player-details">
                  <span>{player.name}</span>
                  <span>{player.detail}</span>
                </div>
              </div>
              <span className="prize" role="cell" aria-label={player.prize ? `${player.prize} USDT` : 'Prize not specified'}>
                {player.prize && <>{player.prize}<Usdt /></>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Leaderboard");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const termsDialog = useRef<HTMLDialogElement>(null);
  const hero = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reopenButton = useRef<HTMLButtonElement>(null);
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const element = termsDialog.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (element.clientWidth > 0) element.style.setProperty("--divider-scale", String((element.clientWidth - 56) / 304));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const resize = () => {
      const scale = Math.min(
        1.25,
        element.clientWidth / 360,
        element.clientHeight / 309,
      );
      element.style.setProperty("--art-scale", String(scale));
      element.style.setProperty(
        "--art-offset-y",
        `${Math.min(0, (element.clientHeight - 309) * 0.25)}px`,
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isOpen) reopenButton.current?.focus();
  }, [isOpen]);
  function moveArtwork(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 6,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 4,
    });
  }
  function changeTab(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(tabs[next]);
    tabButtons.current[next]?.focus();
  }
  function showDialog(kind: 'participation' | 'terms') {
    const target = kind === 'terms' ? termsDialog.current : dialog.current;
    target?.showModal();
    if (kind === 'terms') target?.querySelector('.terms-content')?.scrollTo(0, 0);
  }
  return (
    <main className="phone" aria-label="Lucky Race">
      {!isOpen && (
        <div className="race-launcher">
          <h1>Lucky race</h1>
          <button
            className="primary-button"
            ref={reopenButton}
            onClick={() => {
              setIsOpen(true);
              requestAnimationFrame(() => closeButton.current?.focus());
            }}
          >
            Открыть турнир
          </button>
        </div>
      )}
      <div className="race-sheet" hidden={!isOpen}>
        <section
          ref={hero}
          className="hero"
          aria-labelledby="race-title"
          onPointerMove={moveArtwork}
          onPointerLeave={() => setOffset({ x: 0, y: 0 })}
        >
          <div className="drag-handle" aria-hidden="true" />
          <HeroArtwork offset={offset} />
          <div className="hero-heading">
            <h1 id="race-title">Lucky race</h1>
            <Countdown />
          </div>
          <button
            className="close-button"
            ref={closeButton}
            aria-label="Close Lucky Race"
            onClick={() => setIsOpen(false)}
          >
            <Icon name="imgCrossLarge.svg" />
          </button>
          <div className="race-stats" aria-label="Race prizes and participants">
            <div className="stat-card prize-pool">
              <span>Prize pool</span>
              <div className="stat-value"><strong><span>{race.prizePool.toLocaleString("en-US").replace(/,/g, " ")}</span><Usdt /></strong></div>
            </div>
            <Icon name="imgLine158.svg" className="stats-divider" />
            <div className="stat-card participants">
              <span>Participants</span>
              <div className="stat-value"><strong><span>{race.participants.toLocaleString("en-US")}</span><Icon name="imgUser.svg" className="participants-icon" /></strong></div>
            </div>
          </div>
          <button className="terms-link" onClick={() => showDialog('terms')}>Terms of participation<span className="info-icon"><Icon name="imgCircleInfo.svg" /></span></button>
        </section>
        <section
          className="race-panel"
          id="race-panel"
          aria-label="Race details"
        >
          <div className="tabs" role="tablist" aria-label="Race sections">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                ref={(el) => {
                  tabButtons.current[index] = el;
                }}
                id={`tab-${tabId(tab)}`}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tabId(tab)}`}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => changeTab(e, index)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            className="tab-content"
            role="tabpanel"
            id={`panel-${tabId(activeTab)}`}
            aria-labelledby={`tab-${tabId(activeTab)}`}
            tabIndex={0}
          >
            {activeTab === "Leaderboard" && <Leaderboard />}
            {activeTab === "Events & Games" && (
              <div className="info-panel">
                <h2>Events &amp; Games</h2>
                <p>
                  Participating events and games will appear here when the race is
                  connected to the casino.
                </p>
                <button
                  className="secondary-button"
                  onClick={() => setActiveTab("Leaderboard")}
                >
                  View leaderboard
                </button>
              </div>
            )}
          </div>
          <div className="join-area">
            <button
              className="primary-button"
              lang="ru"
              onClick={() => showDialog('participation')}
            >
              Участвовать
            </button>
          </div>
        </section>
      </div>
      <dialog
        ref={dialog}
        className="join-dialog"
        aria-labelledby="race-dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <h2 id="race-dialog-title">Lucky race</h2>
        <p>
          This is a design preview. Joining the race requires a connected CHEXXY
          account and the participation rules.
        </p>
        <form method="dialog">
          <button className="primary-button">Got it</button>
        </form>
      </dialog>
      <dialog
        ref={termsDialog}
        className="terms-dialog"
        aria-labelledby="terms-title"
        aria-describedby="terms-subtitle"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) termsDialog.current?.close();
          }
        }}
      >
        <div className="terms-handle-area"><div className="drag-handle" aria-hidden="true" /></div>
        <header className="terms-header">
          <div>
            <h2 id="terms-title">Lucky Race</h2>
            <p id="terms-subtitle">{race.prizePool.toLocaleString("en-US")} {race.currency} prize pool</p>
          </div>
          <button className="terms-close" aria-label="Close terms" autoFocus onClick={() => termsDialog.current?.close()}>
            <Icon name="imgCrossLarge.svg" />
          </button>
        </header>
        <div className="terms-content">
          <TermsSection title="Parameters" items={[
            { label: "Prize pool", values: [`${race.prizePool.toLocaleString("en-US")} ${race.currency}`] },
            { label: "Top prize", values: [`${players[0].prize} ${race.currency}`] },
            { label: "Reward currency", values: [race.currency] },
            { label: "Top 3 rewards", values: players.slice(0, 3).map((player) => `#${player.rank} · ${player.prize} ${race.currency}`) },
          ]} />
          <TermsSection title="Leaderboard" items={[
            { label: "Ranking metric", values: ["Total bets"] },
            { label: "Participants", values: [race.participants.toLocaleString("en-US")] },
            { label: "Current leader", values: [players[0].name] },
            { label: "Leading total bets", values: [players[0].detail, "1st place"] },
          ]} />
        </div>
        <footer className="terms-footer">
          <button onClick={() => {
            setActiveTab("Leaderboard");
            termsDialog.current?.close();
            requestAnimationFrame(() => tabButtons.current[0]?.focus());
          }}>
            View Lucky Race leaderboard<Icon name="terms-chevron.svg" />
          </button>
        </footer>
      </dialog>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
