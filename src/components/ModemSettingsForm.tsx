
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ModemSettings } from "@/types/simTypes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import RoleAwareControl from "./RoleAwareControl";

const formSchema = z.object({
  apn: z.string().min(1, "APN is required"),
  username: z.string(),
  password: z.string(),
  networkType: z.enum(['2g', '3g', '4g', '5g', 'auto']),
  roaming: z.boolean(),
  powerSaveMode: z.boolean(),
});

const ModemSettingsForm = () => {
  const { toast } = useToast();
  const form = useForm<ModemSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apn: "",
      username: "",
      password: "",
      networkType: "auto",
      roaming: false,
      powerSaveMode: true,
    },
  });

  const onSubmit = (data: ModemSettings) => {
    console.log("Modem settings updated:", data);
    toast({
      title: "Settings Updated",
      description: "Modem settings have been successfully updated.",
    });
  };

  return (
    <RoleAwareControl requiresWrite>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="apn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Point Name (APN)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter APN" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter username (optional)" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter password (optional)" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="networkType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="2g">2G</SelectItem>
                    <SelectItem value="3g">3G</SelectItem>
                    <SelectItem value="4g">4G</SelectItem>
                    <SelectItem value="5g">5G</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roaming"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Data Roaming</FormLabel>
                  <FormDescription>
                    Allow data usage when roaming on other networks
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="powerSaveMode"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Power Save Mode</FormLabel>
                  <FormDescription>
                    Enable power saving features when possible
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Settings
          </Button>
        </form>
      </Form>
    </RoleAwareControl>
  );
};

export default ModemSettingsForm;
