
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Globe, Play, Save } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const WebDevelopment = () => {
  const [htmlCode, setHtmlCode] = useState('<div class="container">\n  <h1>Hello World</h1>\n  <p>Start coding here...</p>\n</div>');
  const [cssCode, setCssCode] = useState('.container {\n  font-family: Arial, sans-serif;\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}');
  const [jsCode, setJsCode] = useState('// Your JavaScript code here\nconsole.log("Hello from JavaScript!");');
  const [preview, setPreview] = useState('');
  const [projectName, setProjectName] = useState('My Web Project');
  
  const generatePreview = () => {
    const combinedCode = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    setPreview(combinedCode);
    toast({
      title: "Preview Updated",
      description: "Your code changes have been applied to the preview",
    });
  };
  
  const saveProject = () => {
    const project = {
      name: projectName,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      lastEdited: new Date().toISOString()
    };
    
    localStorage.setItem(`webproject_${Date.now()}`, JSON.stringify(project));
    toast({
      title: "Project Saved",
      description: `${projectName} has been saved successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Web Development Tools</h1>
          <p className="text-gray-600">Create and test web projects directly in your dashboard</p>
        </header>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="project-name">Project Name:</Label>
            <Input 
              id="project-name" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              className="w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={saveProject}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button 
              onClick={generatePreview}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" /> Run
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" /> Code Editor
              </CardTitle>
              <CardDescription>Write HTML, CSS and JavaScript</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
                  <TabsTrigger value="js" className="flex-1">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <Textarea 
                    value={htmlCode} 
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className="min-h-[400px] font-mono"
                    placeholder="Enter your HTML code here"
                  />
                </TabsContent>
                <TabsContent value="css">
                  <Textarea 
                    value={cssCode} 
                    onChange={(e) => setCssCode(e.target.value)}
                    className="min-h-[400px] font-mono"
                    placeholder="Enter your CSS code here" 
                  />
                </TabsContent>
                <TabsContent value="js">
                  <Textarea 
                    value={jsCode} 
                    onChange={(e) => setJsCode(e.target.value)}
                    className="min-h-[400px] font-mono"
                    placeholder="Enter your JavaScript code here" 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> Preview
              </CardTitle>
              <CardDescription>Live preview of your code</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] border rounded-md bg-white">
              {preview ? (
                <iframe 
                  srcDoc={preview}
                  title="preview"
                  className="w-full h-[500px] border-0"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="flex items-center justify-center h-[500px] text-gray-400">
                  <p>Click "Run" to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Quick-start with pre-built templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Landing Page', 'Blog Layout', 'Dashboard UI'].map((template) => (
                  <Button key={template} variant="outline" className="h-24">
                    {template}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
