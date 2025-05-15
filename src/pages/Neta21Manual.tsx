import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, Info, Network, Shield, MonitorSmartphone, Settings, AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const Neta21Manual = () => {
  const [activeTab, setActiveTab] = useState('startup');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex items-center mb-8">
        <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">NETA-21 User Manual</h1>
          <p className="text-gray-600">Comprehensive guide for setup, configuration and operation</p>
        </div>
      </div>
      
      <Tabs defaultValue="startup" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
          <TabsTrigger value="startup">Startup</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* Startup Tab */}
        <TabsContent value="startup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSmartphone className="h-6 w-6" />
                First Access to the User Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">DHCP Server Mode</h3>
                  <p>The NETA-21 can act as a DHCP server for a local PC connected to the PC ETH 1 terminal. When activated, it provides an IP address to the PC for easy connection.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Dynamic IP Addressing</h3>
                  <p>By default, the NETA-21 uses dynamic IP addressing. If no DHCP server is available, it assigns itself a Zero Configuration networking address.</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Connecting a Local PC to the NETA-21 in DHCP Server Mode</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Start the NETA-21.</li>
                  <li><strong>Wait for Setup Completion:</strong> The STAT LED turns green.</li>
                  <li><strong>Activate DHCP Server Mode:</strong> Push the SD RJ45 button for 5 seconds until the PC ETH 1 LED starts flashing green.</li>
                  <li><strong>Connect the PC:</strong> The PC gets a dynamic IP from the NETA-21.</li>
                  <li><strong>Access the User Interface:</strong> Navigate to https://192.168.230.1.</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-medium text-blue-700">Logging on to the NETA-21</h4>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Navigate to the URL: <span className="font-mono bg-gray-100 px-1 rounded">https://192.168.230.1</span></li>
                  <li>Default Login: Use the default username/password (admin/admin)</li>
                  <li>Change Password: Prompted to change the password after the first login</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Basic Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="updating-firmware">
                  <AccordionTrigger>Updating Firmware</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The NETA-21 firmware can be updated via ABB web pages. The process includes:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Navigate to Settings {'->'} Firmware update in the web interface</li>
                      <li>Download the latest firmware from ABB&apos;s website</li>
                      <li>Upload the firmware file through the web interface</li>
                      <li>Follow the on-screen instructions to complete the update</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="changing-password">
                  <AccordionTrigger>Changing Password</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To change your password:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click on your username in the top-right corner</li>
                      <li>Select &quot;My Details&quot;</li>
                      <li>Enter your old password and new password</li>
                      <li>Confirm the new password</li>
                      <li>Click &quot;Save&quot; to apply the changes</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="adding-users">
                  <AccordionTrigger>Adding Users</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To add new users to the system:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Navigate to Settings {'->'} User management</li>
                      <li>Click the &quot;Add&quot; button</li>
                      <li>Fill in the required user details</li>
                      <li>Select the appropriate user role</li>
                      <li>Click &quot;Save&quot; to create the user</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="setting-date-time">
                  <AccordionTrigger>Setting Date and Time</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Options for time synchronization include:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li><strong>Automatic:</strong> Time is obtained from the network</li>
                      <li><strong>NTP:</strong> Time is synchronized with Network Time Protocol servers</li>
                      <li><strong>Manual:</strong> Time is set manually by the user</li>
                      <li><strong>External:</strong> Time is synchronized from an external source</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="setting-language">
                  <AccordionTrigger>Setting Language</AccordionTrigger>
                  <AccordionContent>
                    <p>Currently, only English is available for the NETA-21 interface.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="setting-location">
                  <AccordionTrigger>Setting Location</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To set the location of the NETA-21:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Navigate to Settings {'->'} User interface</li>
                      <li>Enter the location information in the designated field</li>
                      <li>Click &quot;Save&quot; to apply the changes</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ethernet-settings">
                  <AccordionTrigger>Defining Ethernet Network Settings</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To configure network settings:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Navigate to Settings {'->'} Network interfaces</li>
                      <li>Select the appropriate Ethernet tab</li>
                      <li>Choose between automatic (DHCP) or static IP configuration</li>
                      <li>Enter the necessary network parameters if using static IP</li>
                      <li>Configure DHCP server mode if needed</li>
                      <li>Click &quot;Save&quot; to apply the settings</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-6 w-6" />
                Initializing Communication Between NETA-21 and Drives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Safety Warning</AlertTitle>
                <AlertDescription>
                  Follow all safety instructions during installation and configuration of drives.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h3 className="font-medium">Steps to Initialize Communication:</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Set node addresses for each drive according to the documentation</li>
                  <li>Connect drives to the NETA-21 using appropriate cables</li>
                  <li>Verify connections are secure and properly terminated</li>
                  <li>Power on the NETA-21 and wait for the STAT LED to turn green</li>
                  <li>Log in to the NETA-21 web interface</li>
                  <li>Navigate to Devices section to verify that drives are detected</li>
                  <li>Configure any additional parameters required for communication</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                FTP/FTPS Protocol Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">FTP (File Transfer Protocol)</h3>
                  <p>Allows file transfers between local and remote devices. Supports creating, deleting, moving, and renaming files and folders.</p>
                  <Badge variant="outline" className="mt-1">Standard Protocol</Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">FTPS (File Transfer Protocol Secure)</h3>
                  <p>Provides encrypted connections using TLS, working on port 990 by default.</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">Secure Protocol</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6" />
                HTTP/HTTPS Protocol Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">HTTP (Hypertext Transfer Protocol)</h3>
                  <p>Used for serving web pages. Recommended only for direct cable connections.</p>
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      Only use HTTP for direct cable connections due to security concerns.
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">HTTPS (Hypertext Transfer Protocol Secure)</h3>
                  <p>Combines HTTP with SSL/TLS for secure communication. Uses port 443 by default.</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">Recommended for Remote Access</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-6 w-6" />
                Modbus/TCP Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Supports a subset of the Modbus/TCP protocol specification v1.1b. Allows access to drive parameters over a TCP/IP connection.</p>
              
              <h3 className="font-medium">Supported Functions:</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Reading holding registers (function code 3)</li>
                <li>Writing single register (function code 6)</li>
                <li>Writing multiple registers (function code 16)</li>
                <li>Encapsulated interface transport (function code 43)</li>
              </ul>
              
              <h3 className="font-medium mt-4">Exception Codes:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">01</td>
                      <td className="px-6 py-4">ILLEGAL FUNCTION</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">02</td>
                      <td className="px-6 py-4">ILLEGAL DATA ADDRESS</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">03</td>
                      <td className="px-6 py-4">ILLEGAL DATA VALUE</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">04</td>
                      <td className="px-6 py-4">SLAVE DEVICE FAILURE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSmartphone className="h-6 w-6" />
                Ethernet PC Tool Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Allows Drive Composer and DriveWindow PC tools to connect to drives via Ethernet. Requires enabling PC tool friendly mode for Drive Composer.</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-medium text-blue-700">Important Note</h4>
                <p className="mt-1">PC tool friendly mode must be enabled in the settings for proper operation with Drive Composer software.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-6 w-6" />
                TCP and UDP Service Ports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">In-bound Services:</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>FTP</li>
                    <li>SSH</li>
                    <li>HTTP</li>
                    <li>HTTPS</li>
                    <li>Modbus/TCP</li>
                    <li>DHCP</li>
                    <li>And more...</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Out-bound Services:</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>FTP</li>
                    <li>SMTP</li>
                    <li>HTTP</li>
                    <li>HTTPS</li>
                    <li>NTP</li>
                    <li>DNS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Safe Deployment and Cybersecurity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-3">Recommendations for Secure Deployment:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>Disable unwanted services through the web interface</li>
                <li>Use firewalls to restrict access to only necessary services</li>
                <li>Implement VPNs for secure remote connections</li>
                <li>Regularly update firmware to the latest version</li>
                <li>Use strong passwords and change default credentials</li>
              </ul>
              
              <Alert className="mt-4">
                <AlertTitle>Cybersecurity Disclaimer</AlertTitle>
                <AlertDescription>
                  Securing the connection between the NETA-21 and the network is essential to prevent unauthorized access and data breaches. The security of the system depends on proper implementation of security measures.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interface Tab */}
        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSmartphone className="h-6 w-6" />
                Front Page Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>The front page consists of the following parts:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Application-specific toolbar</li>
                  <li>Navigation bar</li>
                  <li>Content area</li>
                </ol>
                
                <h3 className="font-medium mt-4">Front Page Components:</h3>
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>Refresh button:</strong> Updates the contents of the front page</li>
                  <li><strong>Add content button:</strong> Adds new portlets to the front page</li>
                  <li><strong>Save layout button:</strong> Stores the current layout</li>
                  <li><strong>Welcome instructions portlet:</strong> Contains instructions for new users</li>
                  <li><strong>Tool description portlet:</strong> Contains a description of the NETA-21</li>
                  <li><strong>Favorite parameters portlet:</strong> Contains parameters marked as favorites</li>
                  <li><strong>Unconfigured settings portlet:</strong> Shows settings that need configuration</li>
                </ul>
                
                <h3 className="font-medium mt-4">All Devices Portlet:</h3>
                <p>Shows all devices connected to the NETA-21. Double-click a device to navigate to its front page.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6" />
                Version Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">To find out the version information of the NETA-21, click About in the navigation bar or the corresponding icon in the application-specific toolbar.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Features Tab</h4>
                  <p className="text-sm mt-1">Shows the versions of the internal software components</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">License Tab</h4>
                  <p className="text-sm mt-1">Contains the software license agreement</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">3rd Party Licenses</h4>
                  <p className="text-sm mt-1">Lists third-party software licenses in the product</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Application Toolbar and Navigation Bar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The application-specific toolbar is visible in every view (excluding the login page) on the top of the user interface. It provides quick access to frequently used views.</p>
              
              <h3 className="font-medium mb-3">Toolbar Components:</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Tool ID field:</strong> Shows the identifier of the NETA-21</li>
                <li><strong>Time field:</strong> Shows the current time and time zone</li>
                <li><strong>Location field:</strong> Shows the location of the NETA-21</li>
                <li><strong>User name field:</strong> Shows the name of the logged-on user</li>
                <li><strong>Logout link:</strong> Logs out the current user</li>
                <li><strong>Help button:</strong> Opens the help dialog box</li>
                <li><strong>Home button:</strong> Opens the front page</li>
                <li><strong>Reports button:</strong> Opens the reporting view</li>
                <li><strong>Settings button:</strong> Opens the main settings view</li>
                <li><strong>Devices button:</strong> Shows all connected devices</li>
              </ul>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h4 className="font-medium">Navigation Bar</h4>
                <p className="mt-1">The navigation bar contains the above-mentioned navigational items and sub-items for Settings and Devices. It can be hidden/unhidden by clicking the small arrow between the navigation bar and the content area.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6" />
                Status Icons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">In the navigation bar and application toolbar, the statuses of devices are indicated with small icons.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Supported Device Statuses:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Disconnected</li>
                    <li>Busy</li>
                    <li>Warning</li>
                    <li>Fault</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Status Icon Behavior:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Normal functioning: No status icon</li>
                    <li>Multiple statuses: Up to three icons can be shown</li>
                    <li>Missing status: Shown with the busy icon</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium">Content Area:</h4>
                <p>The application-specific tabs are shown in the content area. The view changes immediately upon selecting another application without loading a new HTML file from the server.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSmartphone className="h-6 w-6" />
                Devices Tab Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The Devices tab lists all devices connected to the NETA-21.</p>
              
              <h3 className="font-medium mb-3">Components:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong>All button:</strong> Shows all devices</li>
                <li><strong>Refresh button:</strong> Updates the device list</li>
                <li><strong>Navigate button:</strong> Opens the front page of a selected device</li>
                <li><strong>Device list:</strong> Shows all detected devices with columns for Name, Category, Type, Status, and Connection type</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Device Front Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Each device has a customizable front page with various portlets.</p>
              
              <h3 className="font-medium mb-3">Portlets:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">System Info</h4>
                  <p className="text-sm mt-1">Read-only information about the device</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Device Control</h4>
                  <p className="text-sm mt-1">Control options for the device</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Events</h4>
                  <p className="text-sm mt-1">Latest events for the device</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Favorite Parameters</h4>
                  <p className="text-sm mt-1">Parameters marked as favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Device Control Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Rescan Parameters</h4>
                  <p className="text-sm mt-1">Resynchronizes parameters with the actual device</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Reset Fault</h4>
                  <p className="text-sm mt-1">Resets faults on the device</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Remove</h4>
                  <p className="text-sm mt-1">Deletes the device from the list</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Reset Counters</h4>
                  <p className="text-sm mt-1">Resets frame counter values</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Refresh</h4>
                  <p className="text-sm mt-1">Updates counter values</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Start Blackbox Upload</h4>
                  <p className="text-sm mt-1">Initiates upload of logger data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Parameter Browser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The Parameter Browser lists parameter groups and parameters of the device.</p>
              
              <h3 className="font-medium mb-3">Components:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong>Filter parameters:</strong> Search box for finding parameters</li>
                <li><strong>Parameter status:</strong> Shows or hides the parameter status bar</li>
                <li><strong>Refresh values:</strong> Updates parameter values</li>
                <li><strong>Expand all/Collapse all:</strong> Shows or hides all parameters</li>
                <li><strong>Export/Import:</strong> Exports or imports parameters</li>
              </ul>
              
              <div className="mt-4 space-y-3">
                <h4 className="font-medium">Parameter Properties:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h5 className="font-medium">Modify Panel</h5>
                    <p className="text-sm mt-1">Allows modification of parameter values</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h5 className="font-medium">Logging Panel</h5>
                    <p className="text-sm mt-1">Contains logging-specific settings and lists</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Device Data Logger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The Device Data Logger records data from various signals of the drive.</p>
              
              <h3 className="font-medium mb-3">Components:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong>Control button:</strong> Menu for controlling the data logger</li>
                <li><strong>State:</strong> Defines the current state of the data logger</li>
                <li><strong>Data logger tabs:</strong> Shows all uploaded data logs from the drive</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-6 w-6" />
                Network Interfaces View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This view describes the Ethernet 1 and Ethernet 2 interface tabs.</p>
              
              <h3 className="font-medium mb-3">Options:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>Save, reset, export, import settings</li>
                <li>Test the interface</li>
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Ethernet Panel</h4>
                  <p className="text-sm mt-1">Details the mode for obtaining IP addresses automatically or using static IP addresses</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Network Status Panel</h4>
                  <p className="text-sm mt-1">Shows the current IP address, netmask, and gateway for the interface</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-6 w-6" />
                Network Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Explains the connectivity of the NETA-21 with external networks.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Firewall Settings</h4>
                  <p className="text-sm mt-1">Configure security settings for network access</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Proxy Settings</h4>
                  <p className="text-sm mt-1">Configure proxy server settings for internet access</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Mail Server Configurations</h4>
                  <p className="text-sm mt-1">Set up email notifications and alerts</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Dynamic DNS</h4>
                  <p className="text-sm mt-1">Support for Dynamic DNS services, useful for accessing the NETA-21 with a dynamic IP</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Dial-up Function</h4>
                  <p className="text-sm mt-1">Using a USB modem for establishing an Internet connection</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The Universal Event List shows all events, including past events of the monitored device.</p>
              
              <h3 className="font-medium mb-3">Event List Options:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>Refresh, filter, and export events</li>
                <li>Define the number of events per page</li>
                <li>Show events after/before a specific time</li>
                <li>Sort by various criteria</li>
              </ul>
              
              <h3 className="font-medium mt-4 mb-3">Event Columns:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2 bg-gray-50 rounded-md text-sm">Event ID</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Name</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Local Time</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Relative Time</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Device Time</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Category</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Source</div>
                <div className="p-2 bg-gray-50 rounded-md text-sm">Severity</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The NETA-21 supports different reporting methods.</p>
              
              <h3 className="font-medium mb-3">Reporting Methods:</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Email Reports</h4>
                  <p className="text-sm mt-1">Send reports via email</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">SD Card Reports</h4>
                  <p className="text-sm mt-1">Save reports to SD card</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">FTP Reports</h4>
                  <p className="text-sm mt-1">Upload reports to FTP server</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">SMS Reports</h4>
                  <p className="text-sm mt-1">Send reports via SMS</p>
                </div>
              </div>
              
              <h3 className="font-medium mt-4 mb-3">Report Configuration:</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Specify logging intervals for parameters needed in the report</li>
                <li>Set triggers for report generation</li>
                <li>Define reported data</li>
                <li>Configure output settings</li>
              </ol>
              
              <h3 className="font-medium mt-4 mb-3">Report Formats:</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>CSV format</li>
                <li>SQLite format</li>
                <li>Customized formats using JavaScript</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Backup and Restore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Backup</h3>
                  <p>Types of Backup: Full system backup and settings backup.</p>
                  <p>Creating Backup: Requires an SD/SDHC card with at least 200 MB free space. The backup can be created through the web interface.</p>
                  <p>Tool Settings Report: Generates a report of all configured network settings and other tool settings.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Restore</h3>
                  <p>Restoring Files: Files can be restored from the SD card. The process may require a reboot.</p>
                  <p>Factory Reset: Restores all settings to default values. Can be triggered manually or through the web interface.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Expert Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The expert version allows editing drive parameter values, unlike the normal version.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Identification</h3>
                  <p>Expert version has a red frame around the login button and a red horizontal line in the header.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Switching Versions</h3>
                  <p>There are specific instructions for switching from normal to expert version and vice versa.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium">RADIUS Authentication</h3>
                  <p>Supports Basic/RFC2865 and EAP-TTLS (RFC5281) protocols.</p>
                  <p>Enabling RADIUS: Steps to enable RADIUS authentication and add RADIUS user accounts.</p>
                  <p>User Permissions Mapping: Configuring RADIUS permissions script to modify user permissions based on the RADIUS server response.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Troubleshooting</h3>
                  <p>Common issues and solutions related to RADIUS authentication.</p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                    <p className="text-yellow-700">For detailed troubleshooting information, consult the full user manual.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Memory Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Used for collecting log files, backup files, device manuals, and restore archives.</p>
              
              <h3 className="font-medium mb-3">Tabs:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Memory Card Status</h4>
                  <p className="text-sm mt-1">Shows status, access type, and space status</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">File Browser</h4>
                  <p className="text-sm mt-1">Allows browsing and managing files on the memory card</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">Specialized Tabs</h4>
                  <p className="text-sm mt-1">Autoinst, Backup, Report, Restore tabs for different file types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Neta21Manual;
