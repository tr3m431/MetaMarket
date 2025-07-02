import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EventsPage from '../../app/events/page'

// Mock data for tournaments
const mockTournaments = [
  {
    id: '1',
    name: 'YCS Las Vegas 2024',
    date: '2024-01-15',
    location: 'Las Vegas, NV',
    format: 'Advanced',
    size: 1024,
    region: 'NA',
    topCut: 32,
    decklists: [],
  },
  {
    id: '2',
    name: 'YCS Chicago 2024',
    date: '2024-01-08',
    location: 'Chicago, IL',
    format: 'Advanced',
    size: 856,
    region: 'NA',
    topCut: 32,
    decklists: [],
  },
]

jest.mock('../../app/events/page', () => {
  const Actual = jest.requireActual('../../app/events/page')
  return {
    __esModule: true,
    default: () => <Actual.default tournaments={mockTournaments} />,
  }
})

describe('EventsPage', () => {
  it('should render a list of tournaments', () => {
    render(<EventsPage />)
    expect(screen.getByText('YCS Las Vegas 2024')).toBeInTheDocument()
    expect(screen.getByText('YCS Chicago 2024')).toBeInTheDocument()
  })

  it('should filter tournaments by format', () => {
    render(<EventsPage />)
    const select = screen.getByLabelText(/format/i)
    fireEvent.change(select, { target: { value: 'Advanced' } })
    expect(screen.getByText('YCS Las Vegas 2024')).toBeInTheDocument()
  })

  it('should have links to tournament detail pages', () => {
    render(<EventsPage />)
    const links = screen.getAllByRole('link', { name: /ycs/i })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href')
  })
}) 