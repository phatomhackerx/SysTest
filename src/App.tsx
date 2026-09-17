import React, { useState } from 'react';
import { WatsonProvider, useWatson } from './context/WatsonContext';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderToolbar } from './components/layout/HeaderToolbar';
import { StatusBar } from './components/layout/StatusBar';
import { BottomDock } from './components/layout/BottomDock';
import { DashboardView } from './components/views/DashboardView';
import { FileBuilderView } from './components/views/FileBuilderView';
import { TemplateBuilderView } from './components/views/TemplateBuilderView';
import { WorkflowView } from './components/views/WorkflowView';
import { TerminalView } from './components/views/TerminalView';
import { LabTargetsView } from './components/views/LabTargetsView';
import { AnalyzerView } from './components/views/AnalyzerView';
import { SessionsView } from './components/views/SessionsView';
import { ProjectsView } from './components/views/ProjectsView';
import { SettingsView } from './components/views/SettingsView';
import { CorporateSearchView } from './components/views/CorporateSearchView';
import { PreviewModal } from './components/modals/PreviewModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { ToastNotifications } from './components/common/ToastNotifications';
import { ProPlansModal } from './components/modals/ProPlansModal';
import { AuthModal } from './components/modals/AuthModal';

const MainLayout: React.FC = () => {
  const { activeView } = useWatson();
  const [proModalOpen, setProModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (activeView === 'corporate-search') {
    return (
      <>
        <CorporateSearchView />
        <PreviewModal />
        <CommandPalette />
        <NewProjectModal />
        <ToastNotifications />
        <ProPlansModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onOpenPro={() => setProModalOpen(true)} />;
      case 'file-builder':
        return <FileBuilderView />;
      case 'template-builder':
        return <TemplateBuilderView />;
      case 'workflow':
        return <WorkflowView />;
      case 'terminal':
        return <TerminalView />;
      case 'lab-targets':
        return <LabTargetsView />;
      case 'analyzer':
        return <AnalyzerView />;
      case 'sessions':
        return <SessionsView />;
      case 'projects':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenPro={() => setProModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen watson-grid-bg bg-black text-[#cbd5e1] overflow-hidden select-none font-sans">
      {/* Left Application Sidebar */}
      <Sidebar onOpenPro={() => setProModalOpen(true)} />

      {/* Center & Right Main Operating Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header & Pipeline Toolbar */}
        <HeaderToolbar onOpenPro={() => setProModalOpen(true)} />

        {/* View Surface Content */}
        <main className="flex-1 flex min-h-0 overflow-hidden relative">
          {renderCurrentView()}
        </main>

        {/* Collapsible Workstation Dock: Terminal / Build Output / Events */}
        <BottomDock />

        {/* Bottom Technical Status Bar */}
        <StatusBar />
      </div>

      {/* Global Modals & Notifications */}
      <PreviewModal />
      <CommandPalette />
      <NewProjectModal />
      <ToastNotifications />
      <ProPlansModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <WatsonProvider>
      <MainLayout />
    </WatsonProvider>
  );
}

