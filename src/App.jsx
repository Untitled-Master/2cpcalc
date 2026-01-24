import React, { useState, useMemo } from 'react';
import { Calculator, BookOpen, GraduationCap, Trash2, ChevronRight, Info } from 'lucide-react';

const SEMESTER_DATA = {
  S3: {
    title: "Semestre 3",
    groups: [
      { name: "UE Découverte (UED2)", modules: [{ id: 'econ', name: 'Economie', coef: 2 }] },
      { name: "UE Fondamentale (UEF5)", modules: [
        { id: 'arch2', name: 'Architecture des ordi 2', coef: 4 },
        { id: 'sfsd', name: 'SFSD', coef: 4 }
      ]},
      { name: "UE Fondamentale (UEF6)", modules: [
        { id: 'alg3', name: 'Algèbre 3', coef: 3 },
        { id: 'ana3', name: 'Analyse 3', coef: 5 }
      ]},
      { name: "UE Méthodologique (UEM2)", modules: [
        { id: 'electf2', name: 'Electronique Fond. 2', coef: 4 },
        { id: 'prst1', name: 'Probabilités & Stats 1', coef: 4 }
      ]},
      { name: "UE Transversale (UET3)", modules: [{ id: 'ang2', name: 'Anglais 2', coef: 2 }] },
    ]
  },
  S4: {
    title: "Semestre 4",
    groups: [
      { name: "UE Fondamentale (UEF7)", modules: [
        { id: 'poo', name: 'POO (Prog. Orientée Objet)', coef: 4 },
        { id: 'sinf', name: 'Intro Systèmes Info', coef: 3 }
      ]},
      { name: "UE Fondamentale (UEF8)", modules: [
        { id: 'anal4', name: 'Analyse 4', coef: 5 },
        { id: 'logm', name: 'Logique Mathématique', coef: 4 },
        { id: 'ooe', name: 'Optique & Ondes', coef: 3 }
      ]},
      { name: "UE Méthodologique (UEM3)", modules: [{ id: 'prjp', name: 'Projet Pluridisciplinaire', coef: 4 }] },
      { name: "UE Méthodologique (UEM4)", modules: [{ id: 'prst2', name: 'Probabilités & Stats 2', coef: 4 }] },
      { name: "UE Transversale (UET4)", modules: [{ id: 'ang3', name: 'Anglais 3', coef: 2 }] },
    ]
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('S3');
  const [marks, setMarks] = useState({ S3: {}, S4: {} });

  const handleInputChange = (sem, id, field, value) => {
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 20)) {
      setMarks(prev => ({
        ...prev,
        [sem]: { ...prev[sem], [id]: { ...prev[sem][id], [field]: value } }
      }));
    }
  };

  const calculateSemester = (semId) => {
    let totalPoints = 0;
    let totalCoefs = 0;
    const modules = SEMESTER_DATA[semId].groups.flatMap(g => g.modules);

    modules.forEach(mod => {
      const m = marks[semId][mod.id] || { td: '', exam: '' };
      const td = parseFloat(m.td) || 0;
      const exam = parseFloat(m.exam) || 0;
      const avg = (td * (1 / 3)) + (exam * (2 / 3));
      totalPoints += avg * mod.coef;
      totalCoefs += mod.coef;
    });

    return totalPoints / totalCoefs || 0;
  };

  const s3Avg = calculateSemester('S3');
  const s4Avg = calculateSemester('S4');
  const yearlyAvg = (s3Avg + s4Avg) / 2;

  const resetMarks = () => {
    if(window.confirm("Voulez-vous réinitialiser toutes les notes ?")) {
        setMarks({ S3: {}, S4: {} });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight italic">CP2 Calculator</span>
          </div>
          <button
            onClick={resetMarks}
            className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 size={18} /> Réinitialiser
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Yearly Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard title="Moyenne S3" value={s3Avg} color="blue" />
          <SummaryCard title="Moyenne S4" value={s4Avg} color="blue" />
          <SummaryCard title="Moyenne Annuelle" value={yearlyAvg} color="emerald" highlight />
        </div>

        {/* Semester Tabs */}
        <div className="flex p-1 bg-slate-200 rounded-xl w-fit mb-8">
          {['S3', 'S4'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === tab ? 'bg-white shadow-md text-blue-600' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modules Table */}
        <div className="space-y-6">
          {SEMESTER_DATA[activeTab].groups.map((group, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{group.name}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {group.modules.map(mod => {
                  const m = marks[activeTab][mod.id] || { td: '', exam: '' };
                  const modAvg = ((parseFloat(m.td) || 0) * (1/3)) + ((parseFloat(m.exam) || 0) * (2/3));

                  return (
                    <div key={mod.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50/50 transition-colors">
                      <div className="md:col-span-5">
                        <p className="font-semibold text-slate-800">{mod.name}</p>
                        <p className="text-xs text-slate-400 font-medium">Coefficient: {mod.coef}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Note TD</label>
                        <input
                          type="number"
                          value={m.td}
                          onChange={(e) => handleInputChange(activeTab, mod.id, 'td', e.target.value)}
                          className="w-full bg-slate-100 border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Note Exam</label>
                        <input
                          type="number"
                          value={m.exam}
                          onChange={(e) => handleInputChange(activeTab, mod.id, 'exam', e.target.value)}
                          className="w-full bg-slate-100 border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="md:col-span-3 text-right">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block text-right">Moyenne Module</label>
                        <span className={`text-xl font-black ${modAvg >= 10 ? 'text-emerald-600' : 'text-slate-300'}`}>
                          {modAvg.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-slate-400 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Info size={18} className="text-blue-500" />
          <p className="text-sm italic">
            Note finale = (TD × 0.333) + (Examen × 0.667). La moyenne annuelle est la moyenne arithmétique des deux semestres.
          </p>
        </div>
      </main>
    </div>
  );
};

// Sub-component for the top cards
const SummaryCard = ({ title, value, color, highlight }) => (
  <div className={`p-6 rounded-2xl border transition-all ${
    highlight
      ? 'bg-slate-900 border-slate-800 shadow-xl'
      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
  }`}>
    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>
      {title}
    </p>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-black ${
        highlight
          ? (value >= 10 ? 'text-emerald-400' : 'text-rose-400')
          : (value >= 10 ? 'text-blue-600' : 'text-slate-800')
      }`}>
        {value.toFixed(2)}
      </span>
      <span className={`text-sm font-bold ${highlight ? 'text-slate-500' : 'text-slate-400'}`}>/ 20.00</span>
    </div>
  </div>
);

export default App;
