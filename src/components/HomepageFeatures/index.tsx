import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  img: string;
  description: JSX.Element;
  url: string
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Become a Validator',
    img: 'img/validate.png',
    description: (
      <>
        Produce blocks, maintain consensus, and run dApps. It is not only respected but also well rewarded.
      </>
    ),
    url: '/docs/validate/validator'
  },
  {
    title: 'Become a Nominator',
    img: 'img/nominate.png',
    description: (
      <>
        Help maintain the network by participating as a nominator. Stake your VARA and get reward!
      </>
    ),
    url: '/docs/nominate/'
  },
  {
    title: 'Start to develop',
    img: 'img/develop.png',
    description: (
      <>
        Are you developer? <br />Start building a new generation of web3 applications right now.
      </>
    ),
    url: '/'
  },
];

function Feature({ title, img, description, url }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img} className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md padding-vert--md">
        <h3>{title}</h3>
        <p>{description}</p>

        <Link
          className={styles.btn}
          to={url}>
          Learn more
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
