import { type NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    // const codeUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=xqmhye9mbvbyaevo4e73nmiwmpc2xs&redirect_uri=http://localhost:5001/main&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`
    //
    const codeUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENTID}&redirect_uri=http://localhost:5001/main&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`
    window.location.href = codeUrl;
  }, [])
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="overlay" />
      </Head>
    </>
  );
};

export default Home;
