import {type NextPage} from "next";
import {useRouter} from "next/router";
import { useEffect, useState} from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import {useSound} from "use-sound";

const Token: NextPage = () => {
    const soundOptions = {
        volume: 0.25
    }
    const [playSound] = useSound("/assets/sounds/YAHOO.mp3", soundOptions);
    const router = useRouter();
    const token = router.query.token;
    const refresh = router.query.refresh;
    const [uToken, setUToken] = useState(token);
    const [uRefresh, setURefresh] = useState(refresh);
    const [currFollower, setCurrFollower] = useState("fellow npc")
    const [displayNoti, setDisplayNoti] = useState(false)

    const sockUrl = 'wss://eventsub-beta.wss.twitch.tv/ws'
    const {lastJsonMessage} = useWebSocket(sockUrl, {
        onOpen: () => console.log("Connection Opened"),
        shouldReconnect: (closeEvent) => true,
    });
    async function doSubs(id: string) {
        const url = 'https://api.twitch.tv/helix/eventsub/subscriptions'
        const headerData = {
            "Authorization": `Bearer ${token}`,
            "Client-Id": `${process.env.NEXT_PUBLIC_CLIENTID}`,
            "Content-Type": "application/json",
        }
        const bodyData = {
            "type": "channel.follow",
            "version": "1",
            "condition": {
                "broadcaster_user_id": `${process.env.NEXT_PUBLIC_USERID}`
            },
            "transport": {
                "method": "websocket",
                "session_id": `${id}`
            }
        }
        fetch(url, {
            method: 'POST',
            headers: headerData,
            body: JSON.stringify(bodyData)
        })
        .then(resp => {
            if(resp.status == 401) {
              console.log(process.env.NEXT_PUBLIC_USERID)
              console.log(resp.json())
              console.log(token)
                const refreshUrl = "https://id.twitch.tv/oauth2/token"
                const refreshHeader = {
                  "Content-Type": "application/x-www-form-urlencoded",
                }
                fetch(refreshUrl, {
                  method: 'POST',
                  headers: refreshHeader,
                  body: `grant_type=refresh_token&refresh_token=${uRefresh}&client_id=${process.env.NEXT_PUBLIC_CLIENTID}&client_secret=${process.env.NEXT_PUBLIC_CLIENTSECRET}`
                })
                .then(resp => resp.json())
                .then(res => {
                    // assume correct req -> if refresh is invalid, restart is required anyways
                    setUToken(res.access_token)
                    setURefresh(res.refresh_token)
                })
            }
        })
    }

    async function delay(ms: any){
        return (new Promise(res => setTimeout(res, ms)));
    }


    async function display(){
        setDisplayNoti(true);
        await delay(7500);
        setDisplayNoti(false);
    }

    function doAnimation ()
    {
      display()
      playSound()
    }

    useEffect(() => {
        if(lastJsonMessage !== null && token != undefined){
            const msg: any = lastJsonMessage;
            const messageType = msg['metadata']['message_type'];
            const session = msg["payload"]["session"]
            if(messageType == "session_welcome"){
                setUToken(token);
                doSubs(session["id"]);
            }
            else if(messageType == "notification"){
                console.log("Animation")
                doAnimation()
                setCurrFollower(msg["payload"]["event"]["user_name"])
            }
        }
    }, [lastJsonMessage])

    return(
        <>
            <div className={"relative flex flex-col float-right gap-2"}>
              { false && (
                <button className={"absolute bg-blue-800 w-1/5"} onClick={doAnimation}>Test Animation</button>
              )}
              { displayNoti &&
                (<div className={"absolute bottom-0 right-3 m-auto mb-80 w-full rounded-lg h-24 bg-red-600 bg-opacity-90 duration-150 flex flex-col justify-center items-center font-bold text-2xl"} id="notification">
                Thanks for following, {currFollower}!
                </div>)
              }
                <FollowerComp />
                <div className={"webcam-border"} />
            </div>
        </>
    );
}

const FollowerComp: React.FC = () => {
  const soundOptions = {
    volume: 0.25
  }

  const [playSound] = useSound("/assets/sounds/YAHOO.mp3", soundOptions);
  function doAnimation() {
    playSound();
  }

  const [followerCount, setFollowerCount] = useState(0)
  const followerGoal = 100;

  const [testMode, setTestMode] = useState(false)

  const userId = process.env.NEXT_PUBLIC_USERID
  const client_id = process.env.NEXT_PUBLIC_TWITCHID
  const access_token = process.env.NEXT_PUBLIC_APPTOKEN
  const url = `https://api.twitch.tv/helix/users/follows?to_id=${userId}&first=1`
  async function getData() {
    await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Client-Id': `${client_id}`,
      }
    })
    .then((res)=> res.json())
    .then((data) => {
      setFollowerCount(data.total)
    })
  }
  
  useEffect(() => {
    getData();
  })

  return(
    <>
      <div className={"followers-panel"}>
      { testMode && (<button className={"absolute left-0 duration-100 hover:text-black hover:rounded-lg hover:bg-red-800 m-auto bg-red-500 p-4"} onClick={doAnimation}>TEST</button>)}
        {`Followers: ${followerCount} / ${followerGoal}`}
      </div>
    </>
  );
}
export default Token;
