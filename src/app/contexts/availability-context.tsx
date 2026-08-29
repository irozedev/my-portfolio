import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface AvailabilityContextType {
  isAvailable: boolean;
  statusColor: string;
  statusText: string;
  statusTextKey: string;
  statusEmoji: string;
  nextAvailable: string;
  detailedStatus: {
    date: string;
    time: string;
    timezone: string;
  };
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [nextAvailable, setNextAvailable] = useState("Next week");
  const [detailedStatus, setDetailedStatus] = useState({
    date: '',
    time: '',
    timezone: ''
  });

  useEffect(() => {
    // Check availability based on current time (CET timezone)
    const checkAvailability = () => {
      const now = new Date();
      const cetTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Brussels" }));
      const cetHour = cetTime.getHours();

      // Available between 6:00 and 12:00 CET
      const available = cetHour >= 6 && cetHour < 12;
      
      setIsAvailable(available);
      
      if (available) {
        // Calculate how much time left in availability window
        const hoursLeft = 11 - cetHour;
        
        if (hoursLeft > 3) {
          setDetailedStatus({
            date: '',
            time: '',
            timezone: ''
          });
        } else if (hoursLeft > 1) {
          setDetailedStatus({
            date: '',
            time: `${hoursLeft}h`,
            timezone: ''
          });
        } else {
          setDetailedStatus({
            date: '',
            time: 'wrapping up soon',
            timezone: ''
          });
        }
        
        setNextAvailable("Now");
      } else {
        // Calculate next available time
        let hoursUntilAvailable;
        if (cetHour < 6) {
          hoursUntilAvailable = 6 - cetHour;
        } else {
          hoursUntilAvailable = 24 - cetHour + 6;
        }
        
        if (hoursUntilAvailable < 12) {
          setNextAvailable(`Available in ${hoursUntilAvailable}h`);
          setDetailedStatus({
            date: '',
            time: '',
            timezone: ''
          });
        } else {
          setNextAvailable("Tomorrow at 06:00 CET");
          setDetailedStatus({
            date: '',
            time: '',
            timezone: ''
          });
        }
      }
      
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const statusColor = isAvailable ? "green" : "orange";
  const statusText = isAvailable ? "Let's build something" : "Deep work time";
  const statusTextKey = isAvailable ? "available" : "busy";
  const statusEmoji = isAvailable ? "" : "";

  return (
    <AvailabilityContext.Provider 
      value={{ 
        isAvailable, 
        statusColor, 
        statusText, 
        statusTextKey,
        statusEmoji,
        nextAvailable, 
        detailedStatus 
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    // Return safe defaults instead of throwing error
    return {
      isAvailable: false,
      statusColor: "orange",
      statusText: "Coffee break",
      statusTextKey: "coffee-break",
      statusEmoji: "",
      nextAvailable: "Check back later",
      detailedStatus: {
        date: '',
        time: '',
        timezone: ''
      }
    };
  }
  return context;
}