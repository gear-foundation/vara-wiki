import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.title}><span className={styles.gradient}> Vara Network</span> <br /> Documentation portal</h1>
        <p className={styles.subtitle}>All documentation related to Vara Network</p>
        <div className={styles.buttons}>
          <Link
            className={styles.btn}
            to="/docs/intro">
            Discover Vara
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {

  return (
    <Layout>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
