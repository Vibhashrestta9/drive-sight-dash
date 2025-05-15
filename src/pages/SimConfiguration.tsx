
import SimCardMonitor from "@/components/SimCardMonitor";
import ModemSettingsForm from "@/components/ModemSettingsForm";
import ModemSetupGuide from "@/components/ModemSetupGuide";
import NetworkConfigGuide from "@/components/NetworkConfigGuide";
import ModemPasswordConfig from "@/components/ModemPasswordConfig";
import Neta21Guide from "@/components/Neta21Guide";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const SimConfiguration = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SIM Configuration</h1>
        <Link to="/neta21-manual">
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            NETA-21 Complete Manual
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-8">
        <NetworkConfigGuide />
        <ModemPasswordConfig />
        <Neta21Guide />
        <ModemSetupGuide />
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <SimCardMonitor />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Modem Settings</h2>
            <ModemSettingsForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimConfiguration;
