import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { PlusCircle, Trash2, Upload } from 'lucide-react';

export const CreateContest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [problems, setProblems] = useState([
    {
      title: '',
      statement: '',
      time_limit: 2,
      memory_limit: 256,
      testCases: [{ input: null, output: null }],
    },
  ]);

  const addProblem = () => {
    setProblems([...problems, { title: '', statement: '', time_limit: 2, memory_limit: 256, testCases: [{ input: null, output: null }] }]);
  };

  const removeProblem = (index: number) => {
    const newProblems = [...problems];
    newProblems.splice(index, 1);
    setProblems(newProblems);
  };

  const handleProblemChange = (index: number, field: string, value: any) => {
    const newProblems = [...problems] as any;
    newProblems[index][field] = value;
    setProblems(newProblems);
  };

  const addTestCase = (problemIndex: number) => {
    const newProblems = [...problems] as any;
    newProblems[problemIndex].testCases.push({ input: null, output: null });
    setProblems(newProblems);
  };

  const handleFileChange = (pIndex: number, tIndex: number, type: 'input' | 'output', file: File | null) => {
    const newProblems = [...problems] as any;
    newProblems[pIndex].testCases[tIndex][type] = file;
    setProblems(newProblems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, you would handle file uploads first to a cloud storage or backend temp dir,
      // and get back the URLs (input_url, output_url). For this skeleton, we will mock them.
      
      const payloadProblems = problems.map(p => ({
        ...p,
        test_cases: p.testCases.map((t: any) => ({
           input_url: t.input ? `mock_url/${t.input.name}` : 'default_in.txt',
           output_url: t.output ? `mock_url/${t.output.name}` : 'default_out.txt',
           is_hidden: true
        }))
      }));

      await api.post('/contests', {
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        problems: payloadProblems
      });
      
      alert('Contest Created!');
      navigate('/');
    } catch (error) {
      console.error('Error creating contest', error);
      alert('Failed to create contest.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">Host a New Contest</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Contest Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Start Time</label>
              <input required type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">End Time</label>
              <input required type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3" />
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold mb-4 text-slate-900 flex justify-between items-center">
              Problems
              <button type="button" onClick={addProblem} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100 flex items-center gap-1">
                <PlusCircle size={16} /> Add Problem
              </button>
            </h2>

            <div className="space-y-6">
              {problems.map((problem, pIndex) => (
                <div key={pIndex} className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-lg text-slate-800">Problem {pIndex + 1}</h3>
                    {problems.length > 1 && (
                       <button type="button" onClick={() => removeProblem(pIndex)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={20} />
                       </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="md:col-span-3">
                         <label className="block text-sm font-medium text-slate-700">Title</label>
                         <input required type="text" value={problem.title} onChange={e => handleProblemChange(pIndex, 'title', e.target.value)} className="mt-1 block w-full rounded border-slate-300" />
                       </div>
                       
                       <div className="md:col-span-3">
                         <label className="block text-sm font-medium text-slate-700">Statement</label>
                         <textarea required value={problem.statement} onChange={e => handleProblemChange(pIndex, 'statement', e.target.value)} rows={4} className="mt-1 block w-full rounded border-slate-300" />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-slate-700">Time Limit (s)</label>
                         <input type="number" step="0.1" value={problem.time_limit} onChange={e => handleProblemChange(pIndex, 'time_limit', parseFloat(e.target.value))} className="mt-1 block w-full rounded border-slate-300" />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-slate-700">Memory Limit (MB)</label>
                         <input type="number" value={problem.memory_limit} onChange={e => handleProblemChange(pIndex, 'memory_limit', parseInt(e.target.value))} className="mt-1 block w-full rounded border-slate-300" />
                       </div>
                     </div>

                     <div className="mt-4 border-t pt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Test Cases</label>
                        {problem.testCases.map((tc, tIndex) => (
                           <div key={tIndex} className="flex gap-4 items-center mb-2">
                              <span className="text-slate-500 text-sm">#{tIndex + 1}</span>
                              <div className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white">
                                 <label className="text-xs text-slate-500 block">Input File</label>
                                 <input type="file" className="text-sm w-full" onChange={e => handleFileChange(pIndex, tIndex, 'input', e.target.files ? e.target.files[0] : null)} />
                              </div>
                              <div className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white">
                                 <label className="text-xs text-slate-500 block">Output File</label>
                                 <input type="file" className="text-sm w-full" onChange={e => handleFileChange(pIndex, tIndex, 'output', e.target.files ? e.target.files[0] : null)} />
                              </div>
                           </div>
                        ))}
                        <button type="button" onClick={() => addTestCase(pIndex)} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                           <Upload size={14} /> Add another test case
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t">
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow transition-colors">
                Publish Contest
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
