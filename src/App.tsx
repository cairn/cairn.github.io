import {useState} from 'react';

import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TopNav} from '@astryxdesign/core/TopNav';
import {Theme} from '@astryxdesign/core/theme';

import {cairnTheme} from './CairnTheme';

function GitHubIcon() {
  return (
    <svg
      className="github-icon"
      width="18"
      height="18"
      viewBox="0 0 19 19"
      aria-hidden="true"
      focusable="false">
      <use href="/icons.svg#github-icon" />
    </svg>
  );
}

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Cairn Software home">
      <img
        className="brand-mark"
        src="/cairn-icon.png"
        alt=""
        width="40"
        height="40"
      />
      Cairn
      <span className="brand-caption">Software studio</span>
    </a>
  );
}

type ProjectFilter = 'all' | 'ai' | 'creative';

const FILTERS: {id: ProjectFilter; label: string; count: number}[] = [
  {id: 'all', label: 'All projects', count: 2},
  {id: 'ai', label: 'AI & agents', count: 1},
  {id: 'creative', label: 'Art & creative', count: 1},
];

const PIPELINE = [
  {
    step: '01',
    title: 'Discover the workspace',
    body: 'Find the structure. Understand the context.',
  },
  {
    step: '02',
    title: 'Read what matters',
    body: 'Gather the source behind the task.',
  },
  {
    step: '03',
    title: 'Make a focused change',
    body: 'Apply precise edits where they belong.',
  },
  {
    step: '04',
    title: 'Verify with real tools',
    body: 'Run builds, linters, and tests locally.',
  },
];

const ARCHITECTURE_NOTES = [
  {
    title: 'Context before action',
    body: 'Explore the project and read the relevant source before deciding what needs to change.',
  },
  {
    title: 'Precision over guesswork',
    body: 'Keep edits focused on the task, with clear boundaries around the files being changed.',
  },
  {
    title: 'Evidence before done',
    body: "Use the project's builds and tests to check the work. A plausible answer is only a beginning.",
  },
];

function AppShell() {
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const showProject = (category: ProjectFilter) =>
    filter === 'all' || filter === category;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopNav
        startContent={<Brand />}
        endContent={
          <nav className="topnav-links" aria-label="Main navigation">
            <a href="#projects">Projects</a>
            <a href="#architecture">How we build</a>
            <a href="#philosophy">Philosophy</a>
            <a className="nav-external" href="https://github.com/cairn">
              <GitHubIcon />
              GitHub
            </a>
          </nav>
        }
      />
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="intro">Independent thinking. Independent software.</p>
            <Heading level={1} type="display-1" id="hero-title">
              Small stones.
              <br />
              New paths.
            </Heading>
            <div className="hero-description">
              <p className="hero-lede">
                We build tools that make complex things feel natural.
                Autonomous agents, thoughtful interfaces, and experiments at
                the edges of code.
              </p>
            </div>
            <div className="hero-actions">
              <Button variant="primary" href="#projects" className="hero-button">
                Explore our projects <span className="hero-button-arrow" aria-hidden="true">↓</span>
              </Button>
              <a className="text-link" href="#philosophy">
                Meet Cairn
              </a>
            </div>
          </div>
          <div className="cairn-art">
            <img
              className="hero-logo"
              src="/cairn-avatar.png"
              alt="Cairn: nine coral dots arranged in a pyramid"
              width="2048"
              height="2048"
              // @ts-expect-error fetchpriority is not yet in React's types
              fetchpriority="high"
            />
            <span className="art-caption">A marker for what comes next.</span>
          </div>
          <div className="hero-foot">
            <span>Built with curiosity. Built in the open.</span>
            <a href="#cairn-code">
              Discover Cairn Code <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="featured" id="cairn-code" aria-labelledby="code-title">
          <div className="wrap featured-layout">
            <div className="feature-copy">
              <p className="section-note">In the workspace</p>
              <Heading level={2} type="display-2" id="code-title">
                Less handoff.
                <br />
                More making.
              </Heading>
              <div className="feature-body">
                <Text color="secondary">
                  Cairn Code brings the agent into your development workflow.
                  It explores your project, makes focused edits, and checks
                  the result with your own tools.
                </Text>
              </div>
              <Button
                variant="secondary"
                href="https://github.com/cairn/cairn"
                icon={<GitHubIcon />}
                label="Explore Cairn Code"
              />
            </div>
            <Card padding={0}>
              <div className="workflow-title">
                <span className="status-dot" aria-hidden="true" />
                Cairn Code
                <span>The agent loop</span>
              </div>
              <ol className="pipeline">
                {PIPELINE.map(item => (
                  <li key={item.step}>
                    <span className="step-number">{item.step}</span>
                    <div>
                      <Heading level={3}>{item.title}</Heading>
                      <Text type="supporting">{item.body}</Text>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="workflow-foot">Context → Action → Verification</p>
            </Card>
          </div>
        </section>

        <section
          className="projects-section wrap"
          id="projects"
          aria-labelledby="projects-title">
          <div className="section-heading">
            <div>
              <p className="section-note">The collection</p>
              <Heading level={2} type="display-2" id="projects-title">
                Different ideas.
                <br />
                Same curiosity.
              </Heading>
            </div>
            <Text color="secondary">
              Practical tools and creative detours.
              <br />
              Explore the things we're building.
            </Text>
          </div>
          <div
            className="filter-labels"
            role="group"
            aria-label="Filter projects by category">
            {FILTERS.map(item => (
              <button
                key={item.id}
                type="button"
                className={
                  filter === item.id ? 'filter-chip is-active' : 'filter-chip'
                }
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}>
                {item.label} <span>{item.count}</span>
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {showProject('ai') && (
              <Card padding={0}>
                <div className="project-visual code-visual" aria-hidden="true">
                  <span className="code-bracket">[</span>
                  <span className="code-prompt">
                    cairn<span className="cursor">_</span>
                  </span>
                  <span className="code-bracket">]</span>
                </div>
                <div className="project-body">
                  <div className="project-heading">
                    <Heading level={3}>
                      <a href="https://github.com/cairn/cairn">
                        Cairn Code
                        <GitHubIcon />
                      </a>
                    </Heading>
                    <span>Developer tools</span>
                  </div>
                  <div className="project-text">
                    <Text color="secondary">
                      An autonomous engineering assistant that works directly
                      in your workspace, from first read to verified change.
                    </Text>
                  </div>
                  <div className="project-tags">
                    <Badge label="CLI" />
                    <Badge label="Agents" />
                    <Badge label="Local-first" />
                  </div>
                </div>
              </Card>
            )}
            {showProject('creative') && (
              <Card padding={0}>
                <div className="project-visual site-visual" aria-hidden="true">
                  <div className="mini-site">
                    <div className="mini-header">
                      Cairn <span>•••</span>
                    </div>
                    <div className="mini-content">
                      Small stones.
                      <br />
                      New paths.
                      <img
                        className="mini-logo"
                        src="/cairn-icon.png"
                        alt=""
                        width="55"
                        height="55"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-heading">
                    <Heading level={3}>
                      <a href="https://github.com/cairn/cairn.github.io">
                        Our little corner
                        <GitHubIcon />
                      </a>
                    </Heading>
                    <span>The studio website</span>
                  </div>
                  <div className="project-text">
                    <Text color="secondary">
                      A home for our work and the ideas behind it. An
                      intentionally simple site, built on the Astryx design
                      system.
                    </Text>
                  </div>
                  <div className="project-tags">
                    <Badge label="Web design" />
                    <Badge label="Astryx" />
                    <Badge label="You're here" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        <section
          className="architecture-section wrap"
          id="architecture"
          aria-labelledby="architecture-title">
          <div className="section-heading">
            <div>
              <p className="section-note">From intent to execution</p>
              <Heading level={2} id="architecture-title">
                Grounded in the workspace.
              </Heading>
            </div>
            <Text color="secondary">
              Model reasoning meets the files, commands, and checks that make
              software work.
            </Text>
          </div>
          <ol className="architecture-flow">
            <li>User prompt</li>
            <li>Agent engine</li>
            <li>Filesystem tools</li>
            <li>Focused edits</li>
            <li>Local verification</li>
            <li>Result</li>
          </ol>
          <div className="architecture-notes">
            {ARCHITECTURE_NOTES.map(note => (
              <Card key={note.title} padding={4}>
                <Heading level={3}>{note.title}</Heading>
                <div className="note-text">
                  <Text color="secondary">{note.body}</Text>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section
          className="philosophy-section"
          id="philosophy"
          aria-labelledby="philosophy-title">
          <div className="wrap philosophy-layout">
            <div>
              <p className="section-note">Why Cairn</p>
              <Heading level={2} type="display-2" id="philosophy-title">
                A little direction.
                <br />
                A lot of possibility.
              </Heading>
            </div>
            <div className="philosophy-copy">
              <Text>
                A cairn is a simple thing: a few stones, carefully placed,
                that help someone find their way. That's how we think about
                software.
              </Text>
              <Text>
                We start with what intelligence makes possible and build
                around the people using it. Sometimes that means an agent
                working alongside you. Sometimes it's a flower and a poem
                that make you pause.
              </Text>
              <p className="philosophy-end">
                Useful by intention. Open to discovery.
              </p>
              <a
                className="text-link github-link"
                href="https://github.com/cairn">
                <GitHubIcon />
                Follow the work on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap">
        <Brand />
        <Text type="supporting">© 2026 Cairn Software</Text>
        <a href="#home">
          Back to the top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}

export function App() {
  return (
    <Theme theme={cairnTheme} mode="dark">
      <AppShell />
    </Theme>
  );
}
