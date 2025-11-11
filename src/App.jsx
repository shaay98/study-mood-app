import { useState, useEffect} from "react";
import axios from "axios";
import './App.scss'


function App() {
const [moods, setMoods] = useState ([]);
const [emoji, setEmoji] = useState ("😊");
const [note, setNote] = useState("");
const [subject, setSubject] = useState ("");
useEffect (() => {
  axios.get ("http://localhost:5000/api/moods").then (res => setMoods (res.data));
}, []);

const addMood = async () => {
  const newMood = { emoji, note, subject};
  const res = await axios.post("http://localhost:5000/api/moods", newMood);
  setMoods ([res.data, ...moods]);
};

const deleteMood = async (id) => {
  await axios.delete ("http://localhost:5000/api/moods/${id}");
  setMoods (moods.filter(m => m._id !== id));
};
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 to-pink-300 p-6">
<h1 className="text-3xl font-bold text-center text-white mb-6">🎓 Study Mood Tracker</h1>
<div className="flex flex-col items-center gap-3">
  <select value={emoji} onChange={e => setEmoji(e. target.value)} className="p-2 rounded">
    <option>😀</option> <option>😊</option> <option>😎</option> <option>😜</option> <option>😌</option> <option>😒</option> <option>😡</option>
  </select>
<input className="p-2 rounded w-64" placeholder="Subject..." value={subject} onChange={e => setSubject(e.target.value)}/>
<input className="p-2 rounded w-64" placeholder="Notes..." value={note} onChange={e => setNote(e.target.value)}/>
<button onClick={addMood} className="bg-white text-indigo-600 px-4 py-2 rounded shadow-md hover:bg-indigo-100">Add Mood</button>
</div>
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">{moods.map(m => (
  <div key={m._id} className="bg-white p-4 rounded shadow text-center">
    <div className="text-3xl">{m.emoji}</div>
    <p className="text-gray-700">{m.subject}</p>
    <p className="text-sm text-gray-500">{m.note}</p>
    <button onClick={() => deleteMood(m._id)} className="mt-2 text-sm text-red-500 hover:underline">Delete</button>
</div>
))}
</div>
</div>
    </>
  )
}
export default App;
