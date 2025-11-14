import { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss";

function App() {
  const [moods, setMoods] = useState([]);
  const [emoji, setEmoji] = useState("😊");
  const [note, setNote] = useState("");
  const [subject, setSubject] = useState("");

  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  
  const BASE_URL = "http://localhost:5000"; 

  
  useEffect(() => {
    axios.get(`${BASE_URL}/api/moods`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setMoods(res.data))
      .catch(err => console.error("Error fetching moods:", err));
  }, []);

  const addMood = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/moods`,
        { emoji, note, subject },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMoods([res.data, ...moods]);
      setNote(""); setSubject(""); setEmoji("😊");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/moods/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMoods(moods.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  
  useEffect(() => {
    axios.get(`${BASE_URL}/api/journals`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setJournals(res.data))
      .catch(err => console.error("Error fetching journals:", err));
  }, []);

  const addJournal = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/journals`,
        { title, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setJournals([res.data, ...journals]);
      setTitle(""); setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJournal = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setJournals(journals.filter(j => j._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-pink-300 p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8 shadow-lg">
        🎓 Study Mood & Journal Tracker
      </h1>

      <section className="bg-white bg-opacity-80 rounded-xl p-6 mb-8 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Track Your Mood</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <select value={emoji} onChange={e => setEmoji(e.target.value)} className="p-2 rounded shadow-sm text-xl">
            <option>😀</option>
            <option>😊</option>
            <option>😎</option>
            <option>😜</option>
            <option>😌</option>
            <option>😒</option>
            <option>😡</option>
          </select>
          <input className="p-2 rounded flex-1" placeholder="Subject..." value={subject} onChange={e => setSubject(e.target.value)} />
          <input className="p-2 rounded flex-1" placeholder="Notes..." value={note} onChange={e => setNote(e.target.value)} />
          <button onClick={addMood} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow-md">
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moods.map(m => (
            <div key={m._id} className="bg-indigo-50 p-4 rounded shadow text-center hover:scale-105 transition">
              <div className="text-4xl mb-2">{m.emoji}</div>
              <p className="font-semibold text-indigo-700">{m.subject}</p>
              <p className="text-gray-700 text-sm">{m.note}</p>
              <button onClick={() => deleteMood(m._id)} className="mt-2 text-red-500 hover:underline text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white bg-opacity-80 rounded-xl p-6 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-pink-700">Journal / Feedback</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <input className="p-2 rounded flex-1" placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} />
          <input className="p-2 rounded flex-1" placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} />
          <button onClick={addJournal} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 shadow-md">Add</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journals.map(j => (
            <div key={j._id} className="bg-pink-50 p-4 rounded shadow hover:scale-105 transition">
              <p className="font-semibold text-pink-700">{j.title}</p>
              <p className="text-gray-700 text-sm">{j.content}</p>
              <button onClick={() => deleteJournal(j._id)} className="mt-2 text-red-500 hover:underline text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;