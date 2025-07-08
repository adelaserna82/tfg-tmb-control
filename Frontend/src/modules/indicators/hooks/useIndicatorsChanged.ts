import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/store/useAuthStore";

export const useIndicatorsChanged = () => {
  const [indicatorsAreChanged, setIndicatorsAreChanged] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/hubs/indicators`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to IndicatorsHub"))
      .catch(err => console.error("SignalR Connection Error: ", err));

    connection.on("indicatorsChanged", () => {
      console.log("Evento indicatorsChanged recibido");
      setIndicatorsAreChanged(true);
    });

    return () => {
      connection.stop();
    };
  }, [token]);

  return { indicatorsAreChanged, resetIndicatorsChanged: () => setIndicatorsAreChanged(false) };
};
