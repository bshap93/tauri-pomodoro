import { Button, Flex, Text, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { sendNotification } from "@tauri-apps/api/notification";
import { ask } from "@tauri-apps/api/dialog";
import { SettingsIcon } from '@chakra-ui/icons'

function App() {
  const [time, setTime] = useState(0);
  const [timerStart, setTimerStart] = useState(false);
  const buttons = [
    {
      value: 900,
      display: "15 minutes",
    },
    {
      value: 1800,
      display: "30 minutes",
    },
    {
      value: 3600,
      display: "60 minutes",
    },
  ];
  const toggleTimer = () => {
    setTimerStart(!timerStart);
  };

  const triggerReset = async () => {
    setTime(900);
    setTimerStart(true);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (timerStart) {
        if (time > 0) {
          setTime(time - 1);
        } else if (time === 0) {
          sendNotification({
            title: `Time's up!`,
            body: `Congrats on completing a session!`,
          });
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStart, time]);
  return (
    <div className="App" style={{ height: "100% "}}>
      <Flex
        background="gray.700"
        height="100%"
        alignItems="center"
        flexDirection="column"
        >
          <Text color="white" fontWeight="bold" marginTop="20" fontSize="35">
            Pomodoro Timer
          </Text>
          
          <IconButton aria-label='Settings' icon={< SettingsIcon />} />
          <Text fontWeight="bold" fontSize="7xl" color="white">
            {`${
              Math.floor(time / 60) < 10
                ? `0${Math.floor(time / 60)}`
                : `${Math.floor(time / 60)}`
            }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}
          </Text>
          <Flex>
            <Button
            width="7rem"
            background="tomato"
            color="white"
            onClick={toggleTimer}
            >
              {!timerStart ? "Start" : "Pause"}
            </Button>
            <Button
              background="blue.300"
              marginX={5}
              onClick={triggerReset}
              >
                Reset
              </Button>

          </Flex>
          <Flex marginTop={10}>
            {buttons.map(({ value, display }) => (
              <Button
                margin={4}
                background="green.300"
                color="white"
                onClick={() => {
                  setTimerStart(false);
                  setTime(value);
                }}
                >
                  {display}
                </Button>
            ))}
          </Flex>
        </Flex>
    </div>
  );
}
export default App;