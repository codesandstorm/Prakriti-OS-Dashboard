import React from 'react';
import { useStore } from '../hooks/useStore';

export const Settings: React.FC = () => {
  const { settings, updateSettings, currentRole } = useStore();

  return (
    <div className="flex-1 bg-surface p-gutter overflow-y-auto">
      <div className="max-w-2xl bg-white border border-outline-variant rounded-lg p-6 space-y-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">System Settings</h2>
          <p className="text-on-surface-variant text-body-md mt-1">Configure workspace localization, units, and cartographic presets.</p>
        </div>

        <div className="space-y-4 divide-y divide-outline-variant/30">
          
          {/* Theme setting */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <label className="text-body-md font-bold text-on-surface">Application Theme</label>
              <p className="text-body-sm text-on-surface-variant">Switch between standard light console and dark monitoring mode.</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as any })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm focus:ring-1 focus:ring-primary cursor-pointer text-on-surface"
            >
              <option value="light">Console Light (Default)</option>
              <option value="dark">Monitor Dark</option>
            </select>
          </div>

          {/* Language setting */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <label className="text-body-md font-bold text-on-surface">Language (भाषा)</label>
              <p className="text-body-sm text-on-surface-variant">Choose system localization options.</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as any })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm focus:ring-1 focus:ring-primary cursor-pointer text-on-surface"
            >
              <option value="en">English (US/IN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Units setting */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <label className="text-body-md font-bold text-on-surface">Measurement Scale</label>
              <p className="text-body-sm text-on-surface-variant">Choose units for telemetry (temperature, wind, depths).</p>
            </div>
            <select
              value={settings.units}
              onChange={(e) => updateSettings({ units: e.target.value as any })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm focus:ring-1 focus:ring-primary cursor-pointer text-on-surface"
            >
              <option value="metric">Metric (Celsius, Meters, Km/h)</option>
              <option value="imperial">Imperial (Fahrenheit, Feet, Mph)</option>
            </select>
          </div>

          {/* Date format setting */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <label className="text-body-md font-bold text-on-surface">Date & Time Formats</label>
              <p className="text-body-sm text-on-surface-variant">Define timestamp structures.</p>
            </div>
            <select
              value={settings.dateFormat}
              onChange={(e) => updateSettings({ dateFormat: e.target.value as any })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm focus:ring-1 focus:ring-primary cursor-pointer text-on-surface"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (Standard)</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            </select>
          </div>

          {/* Map presets setting */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <label className="text-body-md font-bold text-on-surface">GIS Cartographic Style</label>
              <p className="text-body-sm text-on-surface-variant">Select default base map render layout.</p>
            </div>
            <select
              value={settings.mapPreference}
              onChange={(e) => updateSettings({ mapPreference: e.target.value as any })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm focus:ring-1 focus:ring-primary cursor-pointer text-on-surface"
            >
              <option value="satellite">Satellite Imagery</option>
              <option value="terrain">Topographic Terrain</option>
              <option value="vector">Minimalist Vector Map</option>
            </select>
          </div>

          {/* Accessibility font scaling */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <label className="text-body-md font-bold text-on-surface">Font Accessibility Scale</label>
              <p className="text-body-sm text-on-surface-variant">Increase legibility on low-resolution displays.</p>
            </div>
            <select
              value={settings.accessibilityScale}
              onChange={(e) => updateSettings({ accessibilityScale: e.target.value as any })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm focus:ring-1 focus:ring-primary cursor-pointer text-on-surface"
            >
              <option value="normal">Normal (Default)</option>
              <option value="large">Large (+15%)</option>
              <option value="extra-large">Extra Large (+30%)</option>
            </select>
          </div>
        </div>

        {/* Status save logs */}
        <div className="pt-6 border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
          <span>Active context: role {currentRole} session</span>
          <button 
            onClick={() => alert("Settings configuration saved locally.")}
            className="bg-primary text-on-primary font-label-md text-xs font-bold px-4 py-2 rounded hover:bg-primary-container transition-colors"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
