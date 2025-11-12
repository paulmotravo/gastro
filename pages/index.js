import Head from 'next/head';
import EventAngebotApp from '../components/EventAngebotApp';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Event-Angebot Generator</title>
        <meta name="description" content="Generiere professionelle Angebote für Events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <EventAngebotApp />
    </div>
  );
}