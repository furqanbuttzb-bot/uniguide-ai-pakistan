import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PredictorView } from './components/PredictorView';
import { CounselorView } from './components/CounselorView';
import { AboutView } from './components/AboutView';
import { UniversityDetailView } from './components/UniversityDetailView';
import { EntranceTestsView } from './components/EntranceTestsView';
import { AdmissionCalendarView } from './components/AdmissionCalendarView';
import { ScholarshipsModal } from './components/ScholarshipsModal';
import { TestPrepModal } from './components/TestPrepModal';
import { University } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about'>('home');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const [predictorProgramName, setPredictorProgramName] = useState<string | undefined>(undefined);

  const [scholarshipsOpen, setScholarshipsOpen] = useState<boolean>(false);
  const [testPrepOpen, setTestPrepOpen] = useState<boolean>(false);

  const handleSelectUniversity = (uni: University, programId?: string) => {
    setSelectedUniversity(uni);
    setSelectedProgramId(programId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredictProgram = (uni: University, program: { name: string }) => {
    setSelectedUniversity(null);
    setPredictorProgramName(program.name);
    setActiveTab('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setSelectedUniversity(null);
    setSelectedProgramId(undefined);
  };

  const handleTabChange = (tab: 'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about') => {
    setSelectedUniversity(null);
    setSelectedProgramId(undefined);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {selectedUniversity ? (
          <UniversityDetailView
            university={selectedUniversity}
            initialProgramId={selectedProgramId}
            onBack={handleBackToSearch}
            setActiveTab={handleTabChange}
            onPredictProgram={handlePredictProgram}
          />
        ) : activeTab === 'home' ? (
          <HomeView
            setActiveTab={handleTabChange}
            onSelectUniversity={handleSelectUniversity}
            onOpenScholarships={() => setScholarshipsOpen(true)}
            onOpenTestPrep={() => setTestPrepOpen(true)}
          />
        ) : activeTab === 'search' ? (
          <SearchView onSelectUniversity={handleSelectUniversity} />
        ) : activeTab === 'tests' ? (
          <EntranceTestsView
            onOpenTestPrepModal={() => setTestPrepOpen(true)}
          />
        ) : activeTab === 'calendar' ? (
          <AdmissionCalendarView
            onSelectUniversity={handleSelectUniversity}
            setActiveTab={handleTabChange}
          />
        ) : activeTab === 'predictor' ? (
          <PredictorView
            onSelectUniversity={handleSelectUniversity}
            setActiveTab={handleTabChange}
            initialProgramName={predictorProgramName}
          />
        ) : activeTab === 'counselor' ? (
          <CounselorView setActiveTab={handleTabChange} />
        ) : (
          <AboutView setActiveTab={handleTabChange} />
        )}
      </main>

      {/* Modals */}
      <ScholarshipsModal
        isOpen={scholarshipsOpen}
        onClose={() => setScholarshipsOpen(false)}
      />
      <TestPrepModal
        isOpen={testPrepOpen}
        onClose={() => setTestPrepOpen(false)}
      />

      {/* Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenScholarships={() => setScholarshipsOpen(true)}
        onOpenTestPrep={() => setTestPrepOpen(true)}
      />
    </div>
  );
}
