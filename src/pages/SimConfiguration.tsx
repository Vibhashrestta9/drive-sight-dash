
import SimCardMonitor from "@/components/SimCardMonitor";
import ModemSettingsForm from "@/components/ModemSettingsForm";
import ModemSetupGuide from "@/components/ModemSetupGuide";
import NetworkConfigGuide from "@/components/NetworkConfigGuide";
import ModemPasswordConfig from "@/components/ModemPasswordConfig";
import Neta21Guide from "@/components/Neta21Guide";

const SimConfiguration = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SIM Configuration</h1>
      
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
