"use client";

import { useEffect, useState } from "react";
import ModeToggle from "@/components/mode-toggle";
import { useHeaderBar } from "@/components/header-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Palette,
  Bell,
  Database,
  Shield,
  Zap,
  RefreshCw,
  Save,
  Download,
  Upload,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface SettingsState {
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  dataRetention: number;
  language: string;
  currency: string;
  timezone: string;
  soundEnabled: boolean;
  compactMode: boolean;
  showPercentage: boolean;
  enableAnimations: boolean;
}

const SettingsPage = () => {
  const { setTitle, setActions } = useHeaderBar();

  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5,
    dataRetention: 30,
    language: "en",
    currency: "USD",
    timezone: "UTC",
    soundEnabled: false,
    compactMode: false,
    showPercentage: true,
    enableAnimations: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold text-gradient-primary">Settings</h1>
        <Badge variant="outline" className="text-xs">
          Preferences
        </Badge>
      </div>
    );
    setActions(
      <div className="flex items-center gap-2">
        {hasChanges && (
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    );
    return () => {
      setTitle(null);
      setActions(null);
    };
  }, [setTitle, setActions, hasChanges]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings({
      notifications: true,
      autoRefresh: true,
      refreshInterval: 5,
      dataRetention: 30,
      language: "en",
      currency: "USD",
      timezone: "UTC",
      soundEnabled: false,
      compactMode: false,
      showPercentage: true,
      enableAnimations: true,
    });
    setHasChanges(false);
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <Toaster />

      {/* Appearance Settings */}
      <Card className="gradient-card shadow-custom-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
            <div className="space-y-1">
              <div className="text-sm font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">Switch between light, dark or system.</div>
            </div>
            <ModeToggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">💵 USD</SelectItem>
                  <SelectItem value="EUR">💶 EUR</SelectItem>
                  <SelectItem value="GBP">💷 GBP</SelectItem>
                  <SelectItem value="JPY">💴 JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
              <div className="space-y-1">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use a more compact layout to show more information
                </p>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
              <div className="space-y-1">
                <Label>Enable Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Show smooth transitions and animations
                </p>
              </div>
              <Switch
                checked={settings.enableAnimations}
                onCheckedChange={(checked) => updateSetting('enableAnimations', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Performance Settings */}
      <Card className="gradient-card shadow-custom-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Data & Performance</CardTitle>
          </div>
          <CardDescription>
            Configure data refresh and storage settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
            <div className="space-y-1">
              <Label>Auto Refresh</Label>
              <p className="text-sm text-muted-foreground">
                Automatically refresh market data
              </p>
            </div>
            <Switch
              checked={settings.autoRefresh}
              onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Refresh Interval (seconds)</Label>
            <Select
              value={settings.refreshInterval.toString()}
              onValueChange={(value) => updateSetting('refreshInterval', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 second</SelectItem>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Retention (days)</Label>
            <Select
              value={settings.dataRetention.toString()}
              onValueChange={(value) => updateSetting('dataRetention', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card className="gradient-card shadow-custom-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Manage alerts and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
            <div className="space-y-1">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts for price changes and updates
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
            <div className="space-y-1">
              <Label>Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Play sound when receiving notifications
              </p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="gradient-card shadow-custom-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Display Options</CardTitle>
          </div>
          <CardDescription>
            Customize how data is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
            <div className="space-y-1">
              <Label>Show Percentage Changes</Label>
              <p className="text-sm text-muted-foreground">
                Display percentage changes alongside price changes
              </p>
            </div>
            <Switch
              checked={settings.showPercentage}
              onCheckedChange={(checked) => updateSetting('showPercentage', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">🌍 UTC</SelectItem>
                <SelectItem value="America/New_York">🇺🇸 Eastern Time</SelectItem>
                <SelectItem value="America/Los_Angeles">🇺🇸 Pacific Time</SelectItem>
                <SelectItem value="Europe/London">🇬🇧 London</SelectItem>
                <SelectItem value="Europe/Berlin">🇩🇪 Berlin</SelectItem>
                <SelectItem value="Asia/Tokyo">🇯🇵 Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="gradient-card shadow-custom-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>
            Import, export, and manage your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
              <Download className="h-5 w-5" />
              <span className="font-medium">Export Data</span>
              <span className="text-xs text-muted-foreground">Download your settings</span>
            </Button>

            <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
              <Upload className="h-5 w-5" />
              <span className="font-medium">Import Data</span>
              <span className="text-xs text-muted-foreground">Upload settings file</span>
            </Button>

            <Button variant="destructive" className="gap-2 h-auto p-4 flex-col">
              <Trash2 className="h-5 w-5" />
              <span className="font-medium">Clear Data</span>
              <span className="text-xs text-muted-foreground">Reset all data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

