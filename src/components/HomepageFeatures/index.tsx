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
    title: 'Start developing',
    img: 'img/develop.png',
    description: (
      <>
        Are you developer? <br/>Start building a new generation of Web3 applications right now.
      </>
    ),
    url: '/docs/build'
  },
  {
    title: 'Become a Validator',
    img: 'img/validate.png',
    description: (
      <>
        Provide computing resources to keep the Vara Network secure, performant and censorship-resistant. It is not only a responsibility, but also a good reward. 
      </>
    ),
    url: '/docs/validate'
  },
  {
    title: 'Become a Nominator',
    img: 'img/nominate.png',
    description: (
      <>
        Help maintain the network security by participating as a nominator. <br/> Stake your VARA and get reward!
      </>
    ),
    url: '/docs/nominate/'
  },
];

function Feature({ title, img, description, url }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img} className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md padding-vert--md">
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{description}</p>

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
