import React, { useState } from "react";
import { BookOpen, Calculator, TrendingUp } from "lucide-react";

// Subject data with coefficients
const subjects = {
  ALG3: 3,
  ANA3: 5,
  ARCHI2: 4,
  ECON: 2,
  ANG2: 2,
  ELECF2: 4,
  SFSD: 4,
  PRST1: 4,
};

export default function App() {
  // State to hold the marks for each subject
  const [marks, setMarks] = useState(
    Object.keys(subjects).reduce((acc, subj) => {
      acc[subj] = { td: "", exam: "" };
      return acc;
    }, {})
  );

  // Handle changes in the input fields
  const handleChange = (subj, type, value) => {
    // Ensure the value is a valid number between 0 and 20
    const numericValue = parseFloat(value);
    const sanitizedValue = isNaN(numericValue) || numericValue < 0 || numericValue > 20
      ? ""
      : value;

    setMarks((prev) => ({
      ...prev,
      [subj]: {
        ...prev[subj],
        [type]: sanitizedValue,
      },
    }));
  };

  // Calculate the final mark for a subject
  const calculateFinal = (td, exam) => {
    const tdVal = parseFloat(td) || 0;
    const examVal = parseFloat(exam) || 0;
    return tdVal * (1 / 3) + examVal * (2 / 3);
  };

  // Determine the color class for the final mark based on its value
  const getFinalMarkColorClass = (finalMark) => {
    if (finalMark < 10) {
      return "text-red-500";
    } else if (finalMark < 14) {
      return "text-yellow-500";
    } else {
      return "text-[#3ECF8E]";
    }
  };

  // Calculate the overall weighted average and statistics
  const calculateStats = () => {
    let totalWeighted = 0;
    let totalCoeff = 0;
    let subjectsCompleted = 0;
    let passed = 0;
    let failed = 0;

    Object.entries(subjects).forEach(([subj, coeff]) => {
      const { td, exam } = marks[subj];
      if (td !== "" && exam !== "") {
        subjectsCompleted++;
        const finalMark = calculateFinal(td, exam);
        totalWeighted += finalMark * coeff;
        totalCoeff += coeff;
        if (finalMark >= 10) {
          passed++;
        } else {
          failed++;
        }
      }
    });

    const globalAverage = totalCoeff === 0 ? 0 : (totalWeighted / totalCoeff).toFixed(2);

    return {
      globalAverage,
      passed,
      failed,
      subjectsCompleted,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col items-center p-6 font-sans antialiased">
      {/* Header section with title and icon */}
      <div className="flex items-center gap-4 mb-8">
        <Calculator className="w-10 h-10 text-[#3ECF8E]" />
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          2CP CALC S1
        </h1>
      </div>

      {/* Main content table */}
      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-[#242424] text-center shadow-lg">
          <thead className="bg-[#1A1A1A] text-gray-400 uppercase text-sm tracking-wide">
            <tr>
              <th className="p-4 border border-[#242424]">Subject</th>
              <th className="p-4 border border-[#242424]">Coeff</th>
              <th className="p-4 border border-[#242424]">TD</th>
              <th className="p-4 border border-[#242424]">Exam</th>
              <th className="p-4 border border-[#242424]">Final</th>
              <th className="p-4 border border-[#242424]">Weighted</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(subjects).map(([subj, coeff]) => {
              const td = marks[subj].td;
              const exam = marks[subj].exam;
              const finalMark = calculateFinal(td, exam);
              const weighted = finalMark * coeff;

              return (
                <tr key={subj} className="bg-[#1A1A1A] transition-colors hover:bg-[#242424]">
                  <td className="p-4 border border-[#242424] font-semibold flex items-center justify-center gap-2 text-white">
                    <BookOpen className="w-5 h-5 text-[#3ECF8E]" />
                    {subj}
                  </td>
                  <td className="p-4 border border-[#242424]">{coeff}</td>
                  <td className="p-4 border border-[#242424]">
                    <input
                      type="number"
                      placeholder="TD"
                      value={td}
                      onChange={(e) => handleChange(subj, "td", e.target.value)}
                      className="p-2 w-24 bg-[#242424] text-gray-200 border border-[#333333] focus:outline-none focus:ring-1 focus:ring-[#3ECF8E]"
                    />
                  </td>
                  <td className="p-4 border border-[#242424]">
                    <input
                      type="number"
                      placeholder="Exam"
                      value={exam}
                      onChange={(e) => handleChange(subj, "exam", e.target.value)}
                      className="p-2 w-24 bg-[#242424] text-gray-200 border border-[#333333] focus:outline-none focus:ring-1 focus:ring-[#3ECF8E]"
                    />
                  </td>
                  <td className={`p-4 border border-[#242424] font-bold ${getFinalMarkColorClass(finalMark)}`}>
                    {finalMark.toFixed(2)}
                  </td>
                  <td className="p-4 border border-[#242424] text-[#3ECF8E]">
                    {weighted.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stats section */}
      {stats.subjectsCompleted > 0 && (
        <div className="mt-12 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card for Subjects with Marks */}
          <div className="bg-[#1A1A1A] p-6 border border-[#242424] shadow-xl text-center flex flex-col items-center justify-center">
            <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-2">Subjects Completed</h2>
            <p className="text-4xl font-extrabold text-white">{stats.subjectsCompleted}</p>
          </div>

          {/* Card for Pass/Fail Breakdown */}
          <div className="bg-[#1A1A1A] p-6 border border-[#242424] shadow-xl text-center flex flex-col items-center justify-center">
            <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-2">Status</h2>
            <div className="flex items-center justify-center gap-4 text-xl">
              <div className="flex flex-col items-center">
                <span className="text-[#3ECF8E] font-extrabold">{stats.passed}</span>
                <span className="text-gray-400 text-xs mt-1">Passed ($$\ge 10$$)</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-red-500 font-extrabold">{stats.failed}</span>
                <span className="text-gray-400 text-xs mt-1">Failed ($$ \lt 10$$)</span>
              </div>
            </div>
          </div>

          {/* Card for Global Average */}
          <div className="bg-[#1A1A1A] p-6 border border-[#242424] shadow-xl text-center flex flex-col items-center justify-center">
            <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-2">Global Average</h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-[#3ECF8E]" />
              <p className="text-4xl font-extrabold text-[#3ECF8E]">{stats.globalAverage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
