import { SettingsForm } from "@/features/settings/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences.</p>
      </div>

      <SettingsForm />
    </div>
  )
}
