import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

jest.mock('@heroicons/react/24/outline', () => ({
  __esModule: true,
  ...Object.fromEntries(
    [
      'HeartIcon',
      'MagnifyingGlassIcon',
      'UserIcon',
      'Bars3Icon',
      'XMarkIcon',
      'ChevronDownIcon',
      'ArrowRightIcon',
      'ComputerDesktopIcon',
      'CameraIcon',
      'MusicalNoteIcon',
      'BookOpenIcon',
      'PaintBrushIcon',
      'PuzzlePieceIcon',
      'ChartBarIcon',
      'BellIcon',
      'ArrowTrendingUpIcon',
    ].map((name) => [name, () => <svg data-testid={name} />])
  ),
}))
jest.mock('@heroicons/react/24/solid', () => ({
  __esModule: true,
  HeartIcon: () => <svg data-testid="HeartSolidIcon" />,
})) 