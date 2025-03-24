
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Building, 
  Globe, 
  Bell, 
  CreditCard, 
  Shield, 
  Download, 
  Upload, 
  Users,
  Clock,
  Calendar,
  Database,
  Save
} from 'lucide-react';

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'StationManager',
    logoUrl: '',
    timezone: 'Africa/Casablanca',
    language: 'fr',
  });
  
  const [billingSettings, setBillingSettings] = useState({
    currency: 'MAD',
    vatRate: '20',
    paymentMethods: {
      cash: true,
      card: true,
      transfer: true,
    },
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    lowStockAlerts: true,
    saleAlerts: true,
  });
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    lastBackup: new Date().toLocaleDateString('fr-FR'),
  });
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveSettings = (settingType: string) => {
    // Simulation de sauvegarde
    toast.success(`Paramètres ${settingType} mis à jour avec succès`);
  };
  
  const handleBackupNow = () => {
    // Simulation de sauvegarde
    toast.success('Sauvegarde lancée');
    setTimeout(() => {
      toast.success('Sauvegarde terminée avec succès');
      setBackupSettings(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleDateString('fr-FR'),
      }));
    }, 2000);
  };
  
  const handleRestoreBackup = () => {
    // Simulation de restauration
    toast.success('Restauration en cours...');
    setTimeout(() => {
      toast.success('Système restauré avec succès');
    }, 2000);
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres du système</h1>
          <p className="text-muted-foreground">
            Configuration et personnalisation de votre application
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Facturation
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sauvegarde
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Personnalisez les informations de base de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                    className="pl-10"
                  />
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUpload">Logo de l'entreprise</Label>
                <Input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue placeholder="Sélectionnez un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Casablanca">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>(GMT+1) Casablanca</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Europe/Paris">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>(GMT+1/2) Paris</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Français</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>English</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ar">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>العربية</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => handleSaveSettings('généraux')}
                >
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
              <CardDescription>
                Configurez vos paramètres de facturation et taxes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={billingSettings.currency}
                  onValueChange={(value) => setBillingSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAD">MAD - Dirham marocain</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="USD">USD - Dollar américain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vatRate">Taux de TVA (%)</Label>
                <Input
                  id="vatRate"
                  name="vatRate"
                  type="number"
                  value={billingSettings.vatRate}
                  onChange={(e) => setBillingSettings(prev => ({ ...prev, vatRate: e.target.value }))}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label>Modes de paiement acceptés</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cash"
                      checked={billingSettings.paymentMethods.cash}
                      onCheckedChange={(checked) => setBillingSettings(prev => ({
                        ...prev,
                        paymentMethods: { ...prev.paymentMethods, cash: checked }
                      }))}
                    />
                    <Label htmlFor="cash">Espèces</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="card"
                      checked={billingSettings.paymentMethods.card}
                      onCheckedChange={(checked) => setBillingSettings(prev => ({
                        ...prev,
                        paymentMethods: { ...prev.paymentMethods, card: checked }
                      }))}
                    />
                    <Label htmlFor="card">Carte bancaire</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="transfer"
                      checked={billingSettings.paymentMethods.transfer}
                      onCheckedChange={(checked) => setBillingSettings(prev => ({
                        ...prev,
                        paymentMethods: { ...prev.paymentMethods, transfer: checked }
                      }))}
                    />
                    <Label htmlFor="transfer">Virement</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => handleSaveSettings('de facturation')}
                >
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurer comment et quand vous recevez des notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      emailNotifications: checked
                    }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">Notifications par SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des alertes urgentes par SMS
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      smsNotifications: checked
                    }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inAppNotifications">Notifications dans l'application</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications dans l'application
                    </p>
                  </div>
                  <Switch
                    id="inAppNotifications"
                    checked={notificationSettings.inAppNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      inAppNotifications: checked
                    }))}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Alertes spécifiques</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lowStockAlerts"
                        checked={notificationSettings.lowStockAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          lowStockAlerts: checked
                        }))}
                      />
                      <Label htmlFor="lowStockAlerts">Alertes de stock bas</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="saleAlerts"
                        checked={notificationSettings.saleAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          saleAlerts: checked
                        }))}
                      />
                      <Label htmlFor="saleAlerts">Alertes de ventes</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => handleSaveSettings('de notification')}
                >
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sauvegarde et restauration</CardTitle>
              <CardDescription>
                Gérez la sauvegarde et la restauration de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoBackup">Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegardez automatiquement vos données
                  </p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => setBackupSettings(prev => ({
                    ...prev,
                    autoBackup: checked
                  }))}
                />
              </div>
              
              {backupSettings.autoBackup && (
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                  <Select
                    value={backupSettings.backupFrequency}
                    onValueChange={(value) => setBackupSettings(prev => ({ ...prev, backupFrequency: value }))}
                  >
                    <SelectTrigger id="backupFrequency" className="w-full">
                      <SelectValue placeholder="Sélectionner une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Quotidienne</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="weekly">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Hebdomadaire</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="monthly">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Mensuelle</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dernière sauvegarde</p>
                    <p className="text-sm text-muted-foreground">{backupSettings.lastBackup}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Réussie
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-between">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleBackupNow}>
                  <Download className="h-4 w-4" />
                  Sauvegarder maintenant
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" onClick={handleRestoreBackup}>
                  <Upload className="h-4 w-4" />
                  Restaurer une sauvegarde
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
