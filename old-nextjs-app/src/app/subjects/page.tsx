"use client";

import { useState, useEffect } from "react";
import { Plus, Book, X } from "lucide-react";
import "./page.css";
// Reusing some modal styles from tasks/page.css
import "../tasks/page.css"; 

type Subject = {
  id: string;
  name: string;
  color: string;
};

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color: selectedColor }),
      });
      if (res.ok) {
        fetchSubjects();
        setIsModalOpen(false);
        setName("");
        setSelectedColor(COLORS[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="subjects-page">
      <header className="subjects-header">
        <div>
          <h1 className="subjects-title gradient-text">My Subjects</h1>
          <p className="text-secondary">Manage your academic subjects and colors.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </header>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          Loading subjects...
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div key={subject.id} className="subject-card hover-card">
              <div className="subject-color-badge" style={{ backgroundColor: subject.color }}>
                <Book size={24} />
              </div>
              <h3 className="subject-name">{subject.name}</h3>
              <div className="subject-stats">
                View tasks and progress &rarr;
              </div>
            </div>
          ))}
          {subjects.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              No subjects found. Create one to start organizing your tasks!
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Subject</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g., Data Structures"
                />
              </div>

              <div className="form-group">
                <label>Theme Color</label>
                <div className="color-picker">
                  {COLORS.map(c => (
                    <div 
                      key={c}
                      className={`color-option ${selectedColor === c ? 'selected' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setSelectedColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
