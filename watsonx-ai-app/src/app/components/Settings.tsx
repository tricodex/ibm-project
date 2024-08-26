import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FiMoon, FiSun, FiGlobe, FiBell, FiLock, FiUser, FiSave } from 'react-icons/fi';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSaveSettings = () => {
    // Implement settings save logic here
    console.log('Settings saved');
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 mb-6">
          <TabsTrigger value="general" className="text-sm">General</TabsTrigger>
          <TabsTrigger value="appearance" className="text-sm">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="account" className="text-sm">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiGlobe className="mr-2" /> Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiSave className="mr-2" /> Auto-Save
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>Enable auto-save</span>
              <Switch 
                checked={autoSave} 
                onCheckedChange={setAutoSave}
                className="bg-gray-600"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                {theme === 'dark' ? <FiMoon className="mr-2" /> : <FiSun className="mr-2" />} Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            <CardHeader>
              <CardTitle>Font Size</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider 
                min={12} 
                max={24} 
                step={1} 
                value={[fontSize]} 
                onValueChange={(value) => setFontSize(value[0])}
                className="bg-gray-700"
              />
              <div className="mt-2 text-center">{fontSize}px</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiBell className="mr-2" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>Enable notifications</span>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
                className="bg-gray-600"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiUser className="mr-2" /> Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input 
                type="password" 
                placeholder="New Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
          <FiSave className="mr-2" /> Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;