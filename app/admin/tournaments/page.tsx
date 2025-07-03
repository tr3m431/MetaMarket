'use client'

import { useState } from 'react'
import { mockTournaments } from '@/types/mockTournaments'
import { Tournament, Decklist } from '@/types/card'

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Tournament>>({})
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [decklistEditIndex, setDecklistEditIndex] = useState<number | null>(null)
  const [decklists, setDecklists] = useState<Decklist[]>([])
  const [deckForm, setDeckForm] = useState<Partial<Decklist>>({})
  const [showDeckForm, setShowDeckForm] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    setForm({})
    setEditIndex(null)
    setShowForm(true)
  }

  const handleEdit = (idx: number) => {
    setForm(tournaments[idx])
    setEditIndex(idx)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.date || !form.location || !form.format || !form.size) return
    const newTournament: Tournament = {
      id: form.id || (tournaments.length + 1).toString(),
      name: form.name,
      date: form.date,
      location: form.location,
      format: form.format as any,
      size: Number(form.size),
      region: form.region || 'NA',
      topCut: Number(form.topCut) || 32,
      decklists: form.decklists || [],
    }
    if (editIndex !== null) {
      const updated = [...tournaments]
      updated[editIndex] = newTournament
      setTournaments(updated)
    } else {
      setTournaments([...tournaments, newTournament])
    }
    setShowForm(false)
    setForm({})
    setEditIndex(null)
  }

  const handleEditDecklists = (idx: number) => {
    setDecklistEditIndex(idx)
    setDecklists(tournaments[idx].decklists || [])
    setShowDeckForm(false)
  }

  const handleDeckInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeckForm({ ...deckForm, [e.target.name]: e.target.value })
  }

  const handleAddDeck = () => {
    setDeckForm({})
    setShowDeckForm(true)
  }

  const handleSaveDeck = () => {
    if (!deckForm.player || !deckForm.placement || !deckForm.deckType) return
    const newDeck: Decklist = {
      id: deckForm.id || (decklists.length + 1).toString(),
      tournamentId: tournaments[decklistEditIndex!].id,
      player: deckForm.player,
      placement: Number(deckForm.placement),
      deckType: deckForm.deckType,
      mainDeck: [],
      extraDeck: [],
      sideDeck: [],
    }
    setDecklists([...decklists, newDeck])
    setShowDeckForm(false)
    setDeckForm({})
  }

  const handleSaveDecklists = () => {
    if (decklistEditIndex === null) return
    const updated = [...tournaments]
    updated[decklistEditIndex] = { ...updated[decklistEditIndex], decklists }
    setTournaments(updated)
    setDecklistEditIndex(null)
    setDecklists([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin: Tournaments</h1>
        <button
          onClick={handleAdd}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Tournament
        </button>
        <table className="min-w-full bg-white rounded-lg shadow-md mb-8">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Format</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t, idx) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.date}</td>
                <td className="px-4 py-2">{t.location}</td>
                <td className="px-4 py-2">{t.format}</td>
                <td className="px-4 py-2">{t.size}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="text-blue-600 hover:underline mr-2"
                  >Edit</button>
                  <button
                    onClick={() => handleEditDecklists(idx)}
                    className="text-green-600 hover:underline"
                  >Edit Decklists</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit' : 'Add'} Tournament</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={form.name || ''} onChange={handleInput} placeholder="Name" className="border rounded px-3 py-2" />
              <input name="date" value={form.date || ''} onChange={handleInput} placeholder="Date (YYYY-MM-DD)" className="border rounded px-3 py-2" />
              <input name="location" value={form.location || ''} onChange={handleInput} placeholder="Location" className="border rounded px-3 py-2" />
              <input name="format" value={form.format || ''} onChange={handleInput} placeholder="Format" className="border rounded px-3 py-2" />
              <input name="size" value={form.size || ''} onChange={handleInput} placeholder="Size" className="border rounded px-3 py-2" />
              <input name="region" value={form.region || ''} onChange={handleInput} placeholder="Region" className="border rounded px-3 py-2" />
              <input name="topCut" value={form.topCut || ''} onChange={handleInput} placeholder="Top Cut" className="border rounded px-3 py-2" />
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >Save</button>
              <button
                onClick={() => { setShowForm(false); setForm({}); setEditIndex(null); }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >Cancel</button>
            </div>
          </div>
        )}
        {decklistEditIndex !== null && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Decklists for {tournaments[decklistEditIndex].name}</h2>
            <button
              onClick={handleAddDeck}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >Add Deck</button>
            <table className="min-w-full bg-white rounded-lg shadow mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">Player</th>
                  <th className="px-4 py-2">Placement</th>
                  <th className="px-4 py-2">Deck Type</th>
                </tr>
              </thead>
              <tbody>
                {decklists.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="px-4 py-2">{d.player}</td>
                    <td className="px-4 py-2">{d.placement}</td>
                    <td className="px-4 py-2">{d.deckType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showDeckForm && (
              <div className="mb-4">
                <input name="player" value={deckForm.player || ''} onChange={handleDeckInput} placeholder="Player" className="border rounded px-3 py-2 mr-2" />
                <input name="placement" value={deckForm.placement || ''} onChange={handleDeckInput} placeholder="Placement" className="border rounded px-3 py-2 mr-2" />
                <input name="deckType" value={deckForm.deckType || ''} onChange={handleDeckInput} placeholder="Deck Type" className="border rounded px-3 py-2 mr-2" />
                <button onClick={handleSaveDeck} className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700">Save Deck</button>
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={handleSaveDecklists}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >Save Decklists</button>
              <button
                onClick={() => { setDecklistEditIndex(null); setDecklists([]); }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 