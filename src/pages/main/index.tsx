import {type NextPage} from "next";
import { useState, useEffect } from "react";
import {useRouter} from "next/router";

const Main: NextPage = () => {
  const [first, setFirst] = useState(true);
  const [access, setAccess] = useState("");
  const [refresh, setRefresh] = useState("");
  const router = useRouter();
  const q = router.query;

  async function getAccessToken(){
    const url = 'https://id.twitch.tv/oauth2/token'
    const headerData = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    const code = q.code;
    const singleData = `client_id=${process.env.NEXT_PUBLIC_CLIENTID}&client_secret=${process.env.NEXT_PUBLIC_CLIENTSECRET}&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:5001/main/content`
    fetch(url, {
      method: 'POST',
      headers: headerData,
      body: singleData,
    }).then(resp => resp.json())
    .then((res) => {
      setAccess(res.access_token);
      setRefresh(res.refresh_token);
      window.location.href = `/main/tok/Token?token=${res.access_token}&refresh=${res.refresh_token}`;
    })
  }

  useEffect(() => {
      if(q != undefined && q.code != undefined && first == true)
      {
        getAccessToken();
        setFirst(false);
      }
  })
    return(
        <>
          {q.code ?? "nothing"}
        </>
    );
}

export default Main;

